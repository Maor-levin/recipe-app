from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str
    
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    
    # Debug mode (enables SQL query logging)
    DEBUG: bool = False
    
    # CORS origins
    # Example: ["http://localhost:5173"]  # Vite dev
    # Example: ["https://your-frontend.com", "https://www.your-frontend.com"]  # prod
    CORS_ORIGINS_LIST: List[str] = ["http://localhost:5173"]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
