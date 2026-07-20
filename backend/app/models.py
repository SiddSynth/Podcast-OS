import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from backend.app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    clerk_id = Column(String, unique=True, index=True, nullable=True)
    email = Column(String, unique=True, index=True)
    name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Guest(Base):
    __tablename__ = "guests"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    company = Column(String, nullable=True)
    website = Column(String, nullable=True)
    linkedin = Column(String, nullable=True)
    twitter = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    reports = relationship("ResearchReport", back_populates="guest", cascade="all, delete-orphan")
    question_sets = relationship("QuestionSet", back_populates="guest", cascade="all, delete-orphan")

class ResearchReport(Base):
    __tablename__ = "research_reports"
    id = Column(Integer, primary_key=True, index=True)
    guest_id = Column(Integer, ForeignKey("guests.id"), nullable=False)
    summary = Column(Text, nullable=True)
    career_timeline = Column(JSON, nullable=True)
    funding_investments = Column(JSON, nullable=True)
    analysis_raw = Column(JSON, nullable=True)  # all segments: bio, controversy, competitive landscape, etc.
    questions_generated = Column(JSON, nullable=True) # 50 categorized questions
    status = Column(String, default="completed")  # pending, running, completed, failed
    path = Column(String, nullable=True)  # output markdown path if saved
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    guest = relationship("Guest", back_populates="reports")

class QuestionSet(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    guest_id = Column(Integer, ForeignKey("guests.id"), nullable=True)
    guest_name = Column(String, nullable=True)
    theme = Column(String, nullable=True)
    audience = Column(String, nullable=True)
    length = Column(String, nullable=True)
    style = Column(String, nullable=True)
    questions = Column(JSON, nullable=True) # 100 questions array structured from warm-up to ending
    follow_ups = Column(JSON, nullable=True) # key conditional answers/followups
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    guest = relationship("Guest", back_populates="question_sets")

class KnowledgeBase(Base):
    __tablename__ = "knowledge_bases"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    documents = relationship("Document", back_populates="kb", cascade="all, delete-orphan")

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    kb_id = Column(Integer, ForeignKey("knowledge_bases.id"), nullable=False)
    name = Column(String)
    file_type = Column(String)
    file_size = Column(Integer)
    chunk_count = Column(Integer, default=0)
    path = Column(String)
    status = Column(String, default="processed")  # processing, processed, error
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    kb = relationship("KnowledgeBase", back_populates="documents")

class Prompt(Base):
    __tablename__ = "prompts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    prompt_text = Column(Text)
    category = Column(String, index=True)  # Podcast, Research, Marketing, Sales, etc.
    is_favorite = Column(Boolean, default=False)
    tags = Column(String, nullable=True)  # comma separated
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AnalyticsEntry(Base):
    __tablename__ = "analytics"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    module_name = Column(String, index=True)
    action = Column(String)
    latency_ms = Column(Float, default=0.0)
    token_count = Column(Integer, default=0)
    api_cost = Column(Float, default=0.0)
    meta_data = Column(JSON, nullable=True)

class Setting(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    value = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
