import time
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.agents.podcast_gpt import PodcastGPTAgent

router = APIRouter(prefix="/podcastgpt", tags=["PodcastGPT Search"])

# Lazy initialize agent to avoid starting ChromaDB during build checks if database path changes
_agent_instance = None
def get_podcastgpt_agent():
    global _agent_instance
    if _agent_instance is None:
        _agent_instance = PodcastGPTAgent()
    return _agent_instance

@router.post("/chat")
def podcastgpt_chat(payload: schemas.PodcastGPTInput, agent: PodcastGPTAgent = Depends(get_podcastgpt_agent), db: Session = Depends(get_db)):
    start_time = time.time()
    try:
        response = agent.search_and_chat(payload.query)
        
        # Log Analytics
        latency = (time.time() - start_time) * 1000
        analytics = models.AnalyticsEntry(
            module_name="PodcastGPT",
            action="Semantic Chat",
            latency_ms=latency,
            token_count=1500 if agent.is_mock else 3500,
            api_cost=0.0 if agent.is_mock else 0.005,
            meta_data={"query": payload.query}
        )
        db.add(analytics)
        db.commit()
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/index")
def index_transcript(episode_name: str, guest_name: str, transcript_text: str, agent: PodcastGPTAgent = Depends(get_podcastgpt_agent), db: Session = Depends(get_db)):
    start_time = time.time()
    try:
        agent.add_transcript(
            name=episode_name.replace(" ", "_"),
            transcript_text=transcript_text,
            guest=guest_name,
            episode_name=episode_name
        )
        
        # Save a reference doc inside general database if needed or update Knowledge Base
        kb = db.query(models.KnowledgeBase).filter(models.KnowledgeBase.name == "Podcast Transcripts").first()
        if not kb:
            kb = models.KnowledgeBase(name="Podcast Transcripts", description="Automatically indexed podcast transcripts")
            db.add(kb)
            db.commit()
            db.refresh(kb)
            
        doc = models.Document(
            kb_id=kb.id,
            name=f"Transcript - {episode_name}",
            file_type="txt",
            file_size=len(transcript_text),
            chunk_count=len(transcript_text) // 500,
            path="chroma_indexed",
            status="processed"
        )
        db.add(doc)
        db.commit()
        
        # Log Analytics
        latency = (time.time() - start_time) * 1000
        analytics = models.AnalyticsEntry(
            module_name="PodcastGPT",
            action="Index Episode",
            latency_ms=latency,
            token_count=len(transcript_text) // 4,
            api_cost=0.0
        )
        db.add(analytics)
        db.commit()
        
        return {"status": "success", "message": f"Successfully indexed episode '{episode_name}' into vector database."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
