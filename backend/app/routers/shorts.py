import time
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.agents.shorts_finder import ShortsFinderAgent

router = APIRouter(prefix="/shorts", tags=["Shorts Finder"])

@router.post("/find")
def find_viral_shorts(payload: schemas.ShortsFinderInput, db: Session = Depends(get_db)):
    start_time = time.time()
    agent = ShortsFinderAgent()
    try:
        shorts_data = agent.run(
            transcript_text=payload.transcript_text,
            youtube_url=payload.youtube_url
        )
        
        # Log Analytics
        latency = (time.time() - start_time) * 1000
        analytics = models.AnalyticsEntry(
            module_name="Shorts Finder",
            action="Find Shorts",
            latency_ms=latency,
            token_count=1000 if agent.is_mock else 5000,
            api_cost=0.0 if agent.is_mock else 0.008
        )
        db.add(analytics)
        db.commit()
        
        return shorts_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
