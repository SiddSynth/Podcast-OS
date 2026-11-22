from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from backend.app.database import get_db
from backend.app import models, schemas

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("", response_model=schemas.AnalyticsSummary)
def get_analytics_dashboard_summary(db: Session = Depends(get_db)):
    # 1. Total reports
    total_research = db.query(models.ResearchReport).count()
    # 2. Total question sets
    total_questions = db.query(models.QuestionSet).count()
    # 3. Total files in KB
    total_documents = db.query(models.Document).count()
    # 4. Total indexed transcripts (docs that have 'Transcript' in the name or similar)
    total_indexed_podcasts = db.query(models.Document).filter(models.Document.name.like("%Transcript%")).count()
    
    # 5. Average latency, token usage, cost
    avg_latency = db.query(func.avg(models.AnalyticsEntry.latency_ms)).scalar() or 0.0
    total_tokens = db.query(func.sum(models.AnalyticsEntry.token_count)).scalar() or 0
    total_cost = db.query(func.sum(models.AnalyticsEntry.api_cost)).scalar() or 0.0
    
    # 6. Most searched guests
    # We query the Guest table or pull from research reports
    guests = db.query(models.Guest.name, func.count(models.ResearchReport.id).label("cnt")) \
        .join(models.ResearchReport, models.ResearchReport.guest_id == models.Guest.id) \
        .group_by(models.Guest.name) \
        .order_by(desc("cnt")) \
        .limit(5).all()
        
    most_searched_guests = [{"name": g[0], "count": g[1]} for g in guests]
        
    # 7. Top queries (from semantic search logs in analytics metadata)
    top_queries_db = db.query(models.AnalyticsEntry.meta_data) \
        .filter(models.AnalyticsEntry.module_name == "PodcastGPT") \
        .filter(models.AnalyticsEntry.action == "Semantic Chat") \
        .limit(5).all()
        
    top_queries = []
    for item in top_queries_db:
        if item[0] and "query" in item[0]:
            top_queries.append({"query": item[0]["query"], "count": 1})
        
    return schemas.AnalyticsSummary(
        total_research=total_research,
        total_questions=total_questions,
        total_documents=total_documents,
        total_indexed_podcasts=total_indexed_podcasts,
        token_usage=int(total_tokens),
        estimated_api_cost=round(float(total_cost), 4),
        avg_latency_ms=round(float(avg_latency), 2),
        most_searched_guests=most_searched_guests,
        top_queries=top_queries
    )
