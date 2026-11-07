import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from core.vector_store import ingest_pdf
from config import DATA_DIR

router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Save file to data directory
    file_path = os.path.join(DATA_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Derive collection name from filename (safe string)
    collection_name = os.path.splitext(file.filename)[0].replace(" ", "_").lower()[:63]
    
    try:
        num_chunks = ingest_pdf(file_path=file_path, collection_name=collection_name)
        return {
            "filename": file.filename,
            "collection_name": collection_name,
            "num_chunks": num_chunks,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
