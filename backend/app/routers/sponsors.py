import time
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.agents.sponsor_outreach import SponsorOutreachAgent

router = APIRouter(prefix="/sponsors", tags=["Sponsor Outreach"])

@router.post("/outreach")
def generate_sponsor_outreach(payload: schemas.SponsorOutreachInput, db: Session = Depends(get_db)):
    start_time = time.time()
    agent = SponsorOutreachAgent()
    try:
        outreach_data = agent.run(
            brand_name=payload.brand_name,
            brand_website=payload.brand_website,
            campaign_goal=payload.campaign_goal,
            target_guest=payload.target_guest
        )
        
        # Log Analytics
        latency = (time.time() - start_time) * 1000
        analytics = models.AnalyticsEntry(
            module_name="Sponsor Outreach",
            action="Generate Outreach",
            latency_ms=latency,
            token_count=1000 if agent.is_mock else 4000,
            api_cost=0.0 if agent.is_mock else 0.006
        )
        db.add(analytics)
        db.commit()
        
        return outreach_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
