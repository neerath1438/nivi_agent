import os
import shutil
import uuid
from typing import List, Dict, Any
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/knowledge", tags=["knowledge"])

STORAGE_DIR = "storage/knowledge"
os.makedirs(STORAGE_DIR, exist_ok=True)

class KnowledgeFile(BaseModel):
    id: str
    name: str
    size: int
    type: str
    path: str

@router.post("/upload")
async def upload_knowledge_file(file: UploadFile = File(...)):
    """Upload a file to the knowledge base."""
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    filename = f"{file_id}{ext}"
    file_path = os.path.join(STORAGE_DIR, filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return {
            "id": file_id,
            "name": file.filename,
            "path": file_path,
            "message": "File uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/files", response_model=List[KnowledgeFile])
async def list_knowledge_files():
    """List all files in the knowledge base."""
    files = []
    # In a real app, we'd use a database. 
    # For now, we'll list from folder and use names to simulate metadata.
    if not os.path.exists(STORAGE_DIR):
        return []
        
    for filename in os.listdir(STORAGE_DIR):
        file_path = os.path.join(STORAGE_DIR, filename)
        stats = os.stat(file_path)
        files.append(
            KnowledgeFile(
                id=os.path.splitext(filename)[0],
                name=filename, # In real app, store original name in DB
                size=stats.st_size,
                type=os.path.splitext(filename)[1],
                path=file_path
            )
        )
    return files

@router.delete("/files/{file_id}")
async def delete_knowledge_file(file_id: str):
    """Delete a file from the knowledge base."""
    # Find file with this prefix
    found = False
    for filename in os.listdir(STORAGE_DIR):
        if filename.startswith(file_id):
            os.remove(os.path.join(STORAGE_DIR, filename))
            found = True
            break
            
    if not found:
        raise HTTPException(status_code=404, detail="File not found")
        
    return {"message": "File deleted successfully"}
