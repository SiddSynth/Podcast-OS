import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./database/podcast_os.db"
    CHROMA_PERSIST_DIRECTORY: str = "./chroma"
    UPLOADS_DIRECTORY: str = "./uploads"
    GEMINI_API_KEY: str = ""
    CLERK_API_KEY: str = ""
    CLERK_FRONTEND_API: str = ""
    
    # Mode determination
    @property
    def is_demo_mode(self) -> bool:
        return not bool(self.GEMINI_API_KEY)

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()

# Make sure directories exist
os.makedirs(os.path.dirname(settings.DATABASE_URL.replace("sqlite:///", "")), exist_ok=True)
os.makedirs(settings.CHROMA_PERSIST_DIRECTORY, exist_ok=True)
os.makedirs(settings.UPLOADS_DIRECTORY, exist_ok=True)
