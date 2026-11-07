from langchain_text_splitters import RecursiveCharacterTextSplitter
from core.doc_loader import pdf_loader

def text_chunks(file_path: str, size: int = 1000, lap: int = 200):
    pages = pdf_loader(filePath=file_path)
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=size,
        chunk_overlap=lap
    )
    chunks = splitter.split_documents(pages)
    return chunks
