import chromadb
from fastapi import APIRouter
from config import CHROMA_DIR

router = APIRouter()

@router.get("/documents")
def list_documents():
    try:
        client = chromadb.PersistentClient(path=CHROMA_DIR)
        collections = client.list_collections()
        docs = []
        for col in collections:
            # Map the default LangChain collection name to its PDF name
            display_name = "deeplearning.pdf" if col.name == "langchain" else f"{col.name}.pdf"
            count = col.count()
            docs.append({
                "filename": display_name,
                "collection_name": col.name,
                "num_chunks": count
            })
        return {"documents": docs}
    except Exception as e:
        return {"documents": [], "error": str(e)}
