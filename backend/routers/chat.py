import os
import json
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from core.rag_prompt import prompt_generator

load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"))

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class ChatRequest(BaseModel):
    question: str
    collection_name: str = "langchain"

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        messages, sources = prompt_generator(
            query=request.question,
            collection_name=request.collection_name
        )
    except Exception as e:
        async def error_gen():
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
        return StreamingResponse(error_gen(), media_type="text/event-stream")

    # Convert LangChain messages to Groq format
    groq_messages = []
    for msg in messages:
        role = "system" if msg.type == "system" else "user"
        groq_messages.append({"role": role, "content": msg.content})

    def generate():
        # Send sources first
        yield f"data: {json.dumps({'type': 'sources', 'sources': sources})}\n\n"

        try:
            stream = client.chat.completions.create(
                messages=groq_messages,
                model="openai/gpt-oss-120b",
                stream=True,
            )
            for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    yield f"data: {json.dumps({'type': 'content', 'content': delta})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )
