from langchain_community.document_loaders import PyPDFLoader

def pdf_loader(filePath: str):
    loader = PyPDFLoader(filePath)
    pages = loader.load()
    return pages
