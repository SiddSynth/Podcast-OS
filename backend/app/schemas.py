from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime

# User
class UserBase(BaseModel):
    email: str
    name: Optional[str] = None

class UserCreate(UserBase):
    clerk_id: Optional[str] = None

class UserResponse(UserBase):
    id: int
    clerk_id: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

# Guest
class GuestBase(BaseModel):
    name: str
    company: Optional[str] = None
    website: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None

class GuestCreate(GuestBase):
    pass

class GuestResponse(GuestBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Research Report
class ResearchReportResponse(BaseModel):
    id: int
    guest_id: int
    summary: Optional[str] = None
    career_timeline: Optional[List[Dict[str, Any]]] = None
    funding_investments: Optional[List[Dict[str, Any]]] = None
    analysis_raw: Optional[Dict[str, Any]] = None
    questions_generated: Optional[List[Dict[str, Any]]] = None
    status: str
    path: Optional[str] = None
    created_at: datetime
    guest: Optional[GuestResponse] = None
    class Config:
        from_attributes = True

# Questions
class QuestionSetCreate(BaseModel):
    guest_name: str
    theme: Optional[str] = "General"
    audience: Optional[str] = "General Listening"
    length: Optional[str] = "60 minutes"
    style: Optional[str] = "Serious"

class QuestionSetResponse(BaseModel):
    id: int
    guest_id: Optional[int] = None
    guest_name: Optional[str] = None
    theme: Optional[str] = None
    audience: Optional[str] = None
    length: Optional[str] = None
    style: Optional[str] = None
    questions: Optional[List[Dict[str, Any]]] = None
    follow_ups: Optional[List[Dict[str, Any]]] = None
    created_at: datetime
    class Config:
        from_attributes = True

# Knowledge Base
class KnowledgeBaseCreate(BaseModel):
    name: str
    description: Optional[str] = None

class DocumentResponse(BaseModel):
    id: int
    kb_id: int
    name: str
    file_type: str
    file_size: int
    chunk_count: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class KnowledgeBaseResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_at: datetime
    documents: List[DocumentResponse] = []
    class Config:
        from_attributes = True

# Prompt
class PromptCreate(BaseModel):
    title: str
    prompt_text: str
    category: str
    tags: Optional[str] = ""
    is_favorite: Optional[bool] = False

class PromptResponse(PromptCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Analytics
class AnalyticsResponse(BaseModel):
    id: int
    timestamp: datetime
    module_name: str
    action: str
    latency_ms: float
    token_count: int
    api_cost: float
    meta_data: Optional[Dict[str, Any]] = None
    class Config:
        from_attributes = True

class AnalyticsSummary(BaseModel):
    total_research: int
    total_questions: int
    total_documents: int
    total_indexed_podcasts: int
    token_usage: int
    estimated_api_cost: float
    avg_latency_ms: float
    most_searched_guests: List[Dict[str, Any]]
    top_queries: List[Dict[str, Any]]

# Setting
class SettingCreate(BaseModel):
    key: str
    value: str

class SettingResponse(SettingCreate):
    id: int
    class Config:
        from_attributes = True

# AI Agent Specific Inputs
class GuestResearchInput(BaseModel):
    name: str
    company: Optional[str] = None
    website: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None

class PodcastGPTInput(BaseModel):
    query: str
    kb_id: Optional[int] = None

class ShortsFinderInput(BaseModel):
    transcript_text: Optional[str] = None
    youtube_url: Optional[str] = None

class ContentRepurposerInput(BaseModel):
    transcript_text: str
    tone: str  # Raj Shamani, Alex Hormozi, Naval, Justin Welsh, Professional, Funny, Storytelling
    cta: Optional[str] = None

class SponsorOutreachInput(BaseModel):
    brand_name: str
    brand_website: Optional[str] = None
    campaign_goal: Optional[str] = None
    target_guest: Optional[str] = None
