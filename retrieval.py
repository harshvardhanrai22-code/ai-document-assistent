from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

def retrieved_doc(query):


    embeddings = HuggingFaceEmbeddings(model_name = "sentence-transformers/all-MiniLM-L6-v2")

    db = Chroma(
        persist_directory="./chroma",
        embedding_function=embeddings
    )

    retriever = db.as_retriever(
        search_type ="similarity",
        search_kwargs = {"k": 3}
    )

    # query = "What is Gradient Descent"

    data = retriever.invoke(query)
    return data


# print("Result 1: -------------------")
# print(data[0].page_content)
# print(data[0].metadata)
# print("\n")
# print("--------------------------")

# print("Result 2: -------------------")
# print(data[1].page_content)
# print(data[1].metadata)
# print("\n")
# print("--------------------------")

# print("Result 3: -------------------")
# print(data[2].page_content)
# print(data[2].metadata)