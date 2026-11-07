from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from text_splitter import text_chunks

embeddings = HuggingFaceEmbeddings(model_name = "sentence-transformers/all-MiniLM-L6-v2")
chunks = text_chunks(size=1000, lap=200)

db = Chroma.from_documents(
    documents= chunks,
    embedding=embeddings,
    persist_directory="./chroma"
)

db_data = db.get()
data_len = len(db_data["ids"])
print("Database Created Successfully!!")
print(f"Length of documents/vector is: {data_len}")