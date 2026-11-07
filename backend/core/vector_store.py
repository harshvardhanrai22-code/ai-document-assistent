from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from core.text_splitter import text_chunks
from config import CHROMA_DIR

def ingest_pdf(file_path: str, collection_name: str = "langchain") -> int:
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    chunks = text_chunks(file_path=file_path)
    
    db = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_DIR,
        collection_name=collection_name
    )
    
    return len(chunks)
