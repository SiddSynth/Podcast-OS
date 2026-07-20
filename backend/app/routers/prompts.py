from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app import models, schemas

router = APIRouter(prefix="/prompts", tags=["Prompt Library"])

@router.get("", response_model=List[schemas.PromptResponse])
def get_prompts(
    category: Optional[str] = None, 
    favorite_only: Optional[bool] = False, 
    db: Session = Depends(get_db)
):
    query = db.query(models.Prompt)
    if category:
        query = query.filter(models.Prompt.category == category)
    if favorite_only:
        query = query.filter(models.Prompt.is_favorite == True)
    return query.order_by(models.Prompt.title.asc()).all()

@router.post("", response_model=schemas.PromptResponse)
def create_prompt(payload: schemas.PromptCreate, db: Session = Depends(get_db)):
    prompt = models.Prompt(
        title=payload.title,
        prompt_text=payload.prompt_text,
        category=payload.category,
        tags=payload.tags,
        is_favorite=payload.is_favorite
    )
    db.add(prompt)
    db.commit()
    db.refresh(prompt)
    return prompt

@router.put("/{prompt_id}/favorite", response_model=schemas.PromptResponse)
def toggle_favorite_prompt(prompt_id: int, db: Session = Depends(get_db)):
    prompt = db.query(models.Prompt).filter(models.Prompt.id == prompt_id).first()
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    prompt.is_favorite = not prompt.is_favorite
    db.commit()
    db.refresh(prompt)
    return prompt

@router.delete("/{prompt_id}")
def delete_prompt(prompt_id: int, db: Session = Depends(get_db)):
    prompt = db.query(models.Prompt).filter(models.Prompt.id == prompt_id).first()
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    db.delete(prompt)
    db.commit()
    return {"status": "success", "message": "Prompt deleted successfully"}
