import os
from dotenv import load_dotenv
from groq import Groq
from rag_prompt import prompt_generator

load_dotenv()

groq_api_key = os.environ.get("GROQ_API_KEY")
 
client = Groq(api_key = groq_api_key);

userQuestion = input("User: ")
print("-------------------------------------------")

generatedPrompt = prompt_generator(query=userQuestion)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": f"{generatedPrompt}",
        }
    ],
    model="openai/gpt-oss-120b",
)

print(chat_completion.choices[0].message.content)
