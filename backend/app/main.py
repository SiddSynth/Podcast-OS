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
    allow_origins=["*"],
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
        if db.query(models.Prompt).count() < 5:
            default_prompts = [
                models.Prompt(
                    title="Expert Bio & Tactical Dossier",
                    prompt_text="Extract a comprehensive 3-paragraph executive summary of the guest's career timeline, highlight their critical pivot points, major controversies, and 3 contrarian stances they hold against industry consensus.",
                    category="Research",
                    tags="Research,Bio,Summary,Preparation",
                    is_favorite=True
                ),
                models.Prompt(
                    title="50 Categorized Interview Questions",
                    prompt_text="Generate 50 categorized, deep, probing interview questions across Ice Breakers, Career, Business, Leadership, Tech/AI, Future Trends, Rapid Fire, Deep Philosophy, and Contrarian Takes.",
                    category="Podcast",
                    tags="Podcast,Questions,Interview,50Questions",
                    is_favorite=True
                ),
                models.Prompt(
                    title="High-Retention 3-Second Hooks",
                    prompt_text="Identify the top 3 most contrarian, shocking, or value-dense statements in the transcript and write 3-second opening video hooks with bold text overlays.",
                    category="Marketing",
                    tags="Social Media,Shorts,TikTok,Reels,Hooks",
                    is_favorite=True
                ),
                models.Prompt(
                    title="LinkedIn Thought-Leadership Story",
                    prompt_text="Transform a raw transcript segment into a 250-word masterclass post formatted with punchy one-sentence lines, whitespace gaps, actionable bullet points, and an engagement CTA.",
                    category="Marketing",
                    tags="LinkedIn,Viral,ThoughtLeadership,Repurposing",
                    is_favorite=False
                ),
                models.Prompt(
                    title="Brand Sponsor Value Deck & Cold Email",
                    prompt_text="Write a high-converting cold email addressed to the brand's CMO citing verified episode reach (1.2M+), demographic overlap, custom host-read script concepts, and guaranteed CPM metrics.",
                    category="Sponsor Outreach",
                    tags="Sales,Outreach,Sponsors,Revenue",
                    is_favorite=True
                ),
                models.Prompt(
                    title="Executive Newsletter Edition",
                    prompt_text="Summarize the core philosophical thesis of the podcast episode into a 400-word VIP newsletter edition with a curiosity-driven subject line, 3 tactical takeaways, and quote of the week.",
                    category="Marketing",
                    tags="Newsletter,Substack,Editorial,Email",
                    is_favorite=False
                ),
                models.Prompt(
                    title="Audio Master Track Cleanup Checklist",
                    prompt_text="Generate an automated audio engineering pre-flight checklist for multi-mic Shure SM7B setups, verifying gain staging (-12dB to -6dB peak), room tone de-bleed, compressor threshold, and LUFS target (-14 LUFS for Spotify/YouTube).",
                    category="Podcast",
                    tags="Audio,Production,Engineering,LUFS,Quality",
                    is_favorite=True
                ),
                models.Prompt(
                    title="Rapid-Fire Contrarian Probe",
                    prompt_text="Create 10 quick-fire questions that force the guest to choose between two uncomfortable truths, revealing their authentic decision-making heuristics under pressure.",
                    category="Podcast",
                    tags="Interview,RapidFire,Psychology,Contrarian",
                    is_favorite=False
                )
            ]
            for p in default_prompts:
                existing = db.query(models.Prompt).filter(models.Prompt.title == p.title).first()
                if not existing:
                    db.add(p)
            db.commit()
            print("Pre-seeded default prompts database.")
            
        # 2. Preseed Knowledge Base Container
        if db.query(models.KnowledgeBase).count() == 0:
            kb_obj = models.KnowledgeBase(
                name="Master Episode Transcripts",
                description="Collection of production transcripts and guest dossiers for real-time semantic intelligence."
            )
            db.add(kb_obj)
            db.commit()
            db.refresh(kb_obj)
            print("Initialized default Knowledge Base container.")
            
        # 3. Create Sample Transcript file on disk if not exists
        os.makedirs("./sample_data", exist_ok=True)
        sample_path = "./sample_data/sample_transcript_1.txt"
        if not os.path.exists(sample_path):
            with open(sample_path, "w", encoding="utf-8") as f:
                f.write(
                    "Host: Welcome back to the podcast. Today we have Nikhil Kamath, co-founder of Zerodha. Nikhil, welcome.\n"
                    "Nikhil Kamath: Thanks for having me, glad to be here.\n"
                    "Host: Let's talk about startups. Most founders fail. Why do you think bootstrapping Zerodha worked when so many funded brokerages died?\n"
                    "Nikhil Kamath: Startups fail because founders focus on building product in a vacuum without talking to clients. You need to validate product-market fit on day one. When we co-founded Zerodha, we spent the first years just interacting with customers, solving their support issues, and building trust. That's why we bootstrapped successfully. Profits give you leverage, whereas venture capital forces you onto a hamster wheel of vanity metrics.\n"
                    "Host: What's your view on buying a house in India?\n"
                    "Nikhil Kamath: I became a billionaire and the first thing I did was sign another rental lease. Real estate in India is leverage-heavy, yields only 2-3%, and is illiquid. Renting gives you flexibility to deploy capital in high-growth equities, angel investments, or compounding startups where returns far outpace property appreciation."
                )
            print("Created sample transcript file on disk.")

        # Ensure vector store is initialized
        try:
            from backend.app.agents.podcast_gpt import PodcastGPTAgent
            agent = PodcastGPTAgent()
            print("PodcastGPT agent initialized successfully.")
        except Exception as vector_err:
            print(f"PodcastGPT initialization note: {vector_err}")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

@app.get("/")
def read_root():
    return {
        "platform": "PodcastOS Media Studio Suite",
        "version": "2.0.0",
        "status": "online",
        "mode": "Live" if os.environ.get("GEMINI_API_KEY") else "Studio Engine (Local Offline Embeddings + High-Fidelity Synthesis)",
        "features": [
            "Guest Research Dossiers (50 Questions)",
            "PodcastGPT Semantic Vector Search (ChromaDB)",
            "Viral Shorts Finder (Hook & Retention Predictor)",
            "Multi-Tone Content Repurposer",
            "Sponsor Outreach & ROAS Calculator",
            "Knowledge Base Manager",
            "Prompt Library",
            "Studio Telemetry & Analytics"
        ]
    }
