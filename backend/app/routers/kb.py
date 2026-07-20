import os
import shutil
import time
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.tools.document_reader import DocumentReaderTool
from backend.app.routers.podcastgpt import get_podcastgpt_agent

router = APIRouter(prefix="/kb", tags=["Knowledge Base"])
reader_tool = DocumentReaderTool()

@router.get("", response_model=List[schemas.KnowledgeBaseResponse])
def list_knowledge_bases(db: Session = Depends(get_db)):
    return db.query(models.KnowledgeBase).all()

@router.post("", response_model=schemas.KnowledgeBaseResponse)
def create_knowledge_base(payload: schemas.KnowledgeBaseCreate, db: Session = Depends(get_db)):
    kb = models.KnowledgeBase(name=payload.name, description=payload.description)
    db.add(kb)
    db.commit()
    db.refresh(kb)
    return kb

@router.post("/{kb_id}/upload", response_model=schemas.DocumentResponse)
def upload_document(
    kb_id: int, 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db),
    agent = Depends(get_podcastgpt_agent)
):
    start_time = time.time()
    kb = db.query(models.KnowledgeBase).filter(models.KnowledgeBase.id == kb_id).first()
    if not kb:
        raise HTTPException(status_code=404, detail="Knowledge base not found")
        
    # Save file to uploads folder
    upload_dir = "./uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Read file content based on extension
    file_ext = file.filename.split(".")[-1].lower()
    content = ""
    if file_ext == "pdf":
        content = reader_tool.read_pdf(file_path)
    elif file_ext in ["docx", "doc"]:
        content = reader_tool.read_docx(file_path)
    elif file_ext == "csv":
        content = reader_tool.read_csv(file_path)
    elif file_ext in ["txt", "md", "markdown"]:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
        except Exception as e:
            content = f"Error reading text: {str(e)}"
    else:
        # Default read as text
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
        except Exception:
            content = "Unsupported binary format"
            
    # Add to ChromaDB vector index
    chunk_count = 0
    if content and len(content.strip()) > 0 and "Error reading" not in content and content != "Unsupported binary format":
        try:
            agent.add_transcript(
                name=file.filename.replace(" ", "_").replace(".", "_"),
                transcript_text=content,
                guest="Uploaded Doc",
                episode_name=file.filename
            )
            # Rough estimation of chunks
            chunk_count = len(content.split()) // 200 + 1
        except Exception as e:
            print(f"Error embedding uploaded doc: {e}")
            
    # Save document database details
    doc = models.Document(
        kb_id=kb.id,
        name=file.filename,
        file_type=file_ext,
        file_size=os.path.getsize(file_path),
        chunk_count=chunk_count,
        path=file_path,
        status="processed" if chunk_count > 0 else "error"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    
    # Log Analytics
    latency = (time.time() - start_time) * 1000
    analytics = models.AnalyticsEntry(
        module_name="Knowledge Base",
        action="Upload Document",
        latency_ms=latency,
        token_count=len(content) // 4,
        api_cost=0.0
    )
    db.add(analytics)
    db.commit()
    
    return doc

@router.delete("/document/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Delete local file if it exists
    if os.path.exists(doc.path):
        try:
            os.remove(doc.path)
        except Exception:
            pass
            
    db.delete(doc)
    db.commit()
    return {"status": "success", "message": "Document deleted successfully"}
