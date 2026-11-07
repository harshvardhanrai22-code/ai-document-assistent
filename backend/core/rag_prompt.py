from langchain_core.prompts import ChatPromptTemplate
from core.retrieval import retrieved_doc

def prompt_generator(query: str, collection_name: str = "langchain"):
    docs = retrieved_doc(query=query, collection_name=collection_name)
    
    raw_docs = []
    sources = []
    
    for doc in docs:
        raw_docs.append(doc.page_content)
        sources.append({
            "content": doc.page_content[:300],  # truncate for UI
            "page": int(doc.metadata.get("page", 0)) + 1,
            "source": doc.metadata.get("source", "unknown")
        })
    
    context_doc = "\n\n".join(raw_docs)
    
    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            "You are answering questions about the provided document. Use the supplied context to answer the question. "
            "If the answer isn't present in the context, say that the information isn't available in the document."
            "Context:\n{context}"
        ),
        (
            "user",
            "{question}"
        ),
    ])
    
    final_prompt = prompt.format_messages(
        context=context_doc,
        question=query
    )
    
    return final_prompt, sources
