import time
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.agents.repurposer import ContentRepurposerAgent

router = APIRouter(prefix="/content", tags=["Content Repurposer"])

@router.post("/repurpose")
def repurpose_content(payload: schemas.ContentRepurposerInput, db: Session = Depends(get_db)):
    start_time = time.time()
    agent = ContentRepurposerAgent()
    try:
        repurposed_data = agent.run(
            transcript_text=payload.transcript_text,
            tone=payload.tone,
            cta=payload.cta
        )
        
        # Log Analytics
        latency = (time.time() - start_time) * 1000
        analytics = models.AnalyticsEntry(
            module_name="Content Repurposer",
            action="Repurpose Content",
            latency_ms=latency,
            token_count=1200 if agent.is_mock else 6000,
            api_cost=0.0 if agent.is_mock else 0.009
        )
        db.add(analytics)
        db.commit()
        
        return repurposed_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
