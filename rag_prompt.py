from langchain_core.prompts import ChatPromptTemplate
from retrieval import retrieved_doc

def prompt_generator(query):

# query = "What is Gradient Descent"
    docs = retrieved_doc(query=query)

    raw_docs = []

    for doc in docs:
        raw_docs.append(doc.page_content)

    context_doc = "\n\n".join(raw_docs)

    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            "You are answering questions about the provided document. Use the supplied context to answer the question. If the answer isn't present in the context, say that the information isn't available in the document."
            "Context:\n{context}"
        ),
        (
            "user",
            "{question}"
        ),
    ])

    final_prompt = prompt.format_messages(
        context = context_doc,
        question = query
    )
    return final_prompt

# print("--- Formatted Prompt Messages ---")
# for message in final_prompt:
#     print(f"Role: {message.type.upper()}")
#     print(f"Content:\n{message.content}")
#     print("-" * 30)