import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.database import engine, Base, SessionLocal
from backend.app import models
from backend.app.routers import guests, podcastgpt, shorts, content, sponsors, kb, prompts, analytics, settings

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PodcastOS API",
    description="The AI Operating System backend for modern podcast teams, inspired by portfolio production workflows.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend running on port 3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all module routers
app.include_router(guests.router)
app.include_router(podcastgpt.router)
app.include_router(shorts.router)
app.include_router(content.router)
app.include_router(sponsors.router)
app.include_router(kb.router)
app.include_router(prompts.router)
app.include_router(analytics.router)
app.include_router(settings.router)

# Pre-seeding database on startup
@app.on_event("startup")
def preseed_database():
    db = SessionLocal()
    try:
        # 1. Preseed Prompts
        if db.query(models.Prompt).count() == 0:
            default_prompts = [
                models.Prompt(
                    title="Expert Bio Summarizer",
                    prompt_text="Extract a 3-paragraph summary of the guest's career timeline, highlight their failures, and identify 3 contrarian stances they take relative to their industry peers.",
                    category="Research",
                    tags="Research,Bio,Summary",
                    is_favorite=True
                ),
                models.Prompt(
                    title="Icebreaker Generator",
                    prompt_text="Generate 5 icebreaker questions that connect the guest's chess background or childhood hobby directly to their current corporate investment philosophy.",
                    category="Podcast",
                    tags="Podcast,Icebreaker,Questions",
                    is_favorite=True
                ),
                models.Prompt(
                    title="LinkedIn Thread Hook",
                    prompt_text="Write a high-retention hook for a LinkedIn post based on the guest's contrarian views on real estate vs renting, matching Justin Welsh's minimal professional style.",
                    category="Marketing",
                    tags="Social Media,LinkedIn,Justin Welsh",
                    is_favorite=False
                ),
                models.Prompt(
                    title="Sponsor Pitch email",
                    prompt_text="Create a cold sales partnership proposal for brand partners showing direct ROI metrics matching a 1 million view reach on the next tech founder episode.",
                    category="Sponsor Outreach",
                    tags="Sales,Outreach,Sponsors",
                    is_favorite=True
                )
            ]
            db.bulk_save_objects(default_prompts)
            db.commit()
            print("Pre-seeded default prompts database.")
            
        # 2. Preseed Knowledge Base
        if db.query(models.KnowledgeBase).count() == 0:
            kb = models.KnowledgeBase(
                name="General Transcripts",
                description="Collection of mock transcripts and research docs for immediate semantic testing."
            )
            db.add(kb)
            db.commit()
            db.refresh(kb)
            
            # Preseed a Document reference
            doc = models.Document(
                kb_id=kb.id,
                name="Sample Transcript - Startup Scaling",
                file_type="txt",
                file_size=2450,
                chunk_count=3,
                path="sample_data/sample_transcript_1.txt",
                status="processed"
            )
            db.add(doc)
            db.commit()
            print("Pre-seeded default Knowledge Base and document reference.")
            
        # 3. Create Sample Transcript file on disk if not exists
        os.makedirs("./sample_data", exist_ok=True)
        sample_path = "./sample_data/sample_transcript_1.txt"
        if not os.path.exists(sample_path):
            with open(sample_path, "w", encoding="utf-8") as f:
                f.write(
                    "Host: Welcome back to another episode. Today we have Nikhil Kamath, co-founder of Zerodha. Nikhil, welcome.\n"
                    "Nikhil Kamath: Thanks for having me, glad to be here.\n"
                    "Host: Let's talk about startups. Most founders fail. Why do you think bootstrapping Zerodha worked when so many funded brokerages died?\n"
                    "Nikhil Kamath: Startups fail because founders focus on building product in a vacuum without talking to clients. You need to validate product-market fit on day one. When we co-founded Zerodha, we spent the first years just interacting with customers, solving their support issues, and building trust. That's why we bootstrapped successfully. Profits give you leverage, whereas venture capital forces you onto a hamster wheel of vanity metrics.\n"
                    "Host: What's your view on buying a house in India?\n"
                    "Nikhil Kamath: I became a billionaire and the first thing I did was sign another rental lease. Real estate is leverage-heavy and illiquid. Renting gives you flexibility to deploy capital in high-growth equities or startups."
                )
            print("Created sample transcript file on disk.")
            
            # Index sample transcript into vector store if Chroma DB is empty
            try:
                from backend.app.agents.podcast_gpt import PodcastGPTAgent
                agent = PodcastGPTAgent()
                # Check if collection is empty
                if agent.collection.count() == 0:
                    with open(sample_path, "r", encoding="utf-8") as f:
                        text = f.read()
                    agent.add_transcript(
                        name="Sample_Transcript_-_Startup_Scaling",
                        transcript_text=text,
                        guest="Nikhil Kamath",
                        episode_name="Bootstrapping Zerodha"
                    )
                    print("Pre-seeded sample transcript into ChromaDB vector store.")
            except Exception as vector_err:
                print(f"Skipped pre-seeding ChromaDB on build startup check: {vector_err}")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "PodcastOS API is running successfully.", "mode": "Live" if os.environ.get("GEMINI_API_KEY") else "Demo"}
