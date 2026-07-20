import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.config import settings

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("")
def get_all_settings(db: Session = Depends(get_db)):
    db_settings = db.query(models.Setting).all()
    response = {}
    
    # Return masked value of sensitive variables
    for s in db_settings:
        val = s.value
        if "key" in s.key.lower() and len(val) > 6:
            val = val[:3] + "..." + val[-3:]
        response[s.key] = val
        
    # Inject current environmental defaults if not in DB
    for key in ["GEMINI_API_KEY", "TAVILY_API_KEY", "CLERK_API_KEY"]:
        if key not in response:
            val = os.environ.get(key, "")
            if val and len(val) > 6:
                val = val[:3] + "..." + val[-3:]
            response[key] = val
            
    # Include current mode
    response["is_demo_mode"] = settings.is_demo_mode
    return response

@router.post("")
def save_setting(payload: schemas.SettingCreate, db: Session = Depends(get_db)):
    # 1. Update DB Setting
    db_setting = db.query(models.Setting).filter(models.Setting.key == payload.key).first()
    if not db_setting:
        db_setting = models.Setting(key=payload.key, value=payload.value)
        db.add(db_setting)
    else:
        db_setting.value = payload.value
    db.commit()
    
    # 2. Update memory settings / os env
    os.environ[payload.key] = payload.value
    if payload.key == "GEMINI_API_KEY":
        settings.GEMINI_API_KEY = payload.value
        
    return {"status": "success", "message": f"Setting for {payload.key} saved successfully."}
