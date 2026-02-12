from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str
    
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    
    # Debug mode (enables SQL query logging)
    DEBUG: bool = False
    
    # CORS origins 
    CORS_ORIGINS_LIST: List[str]
    
    # Cloudinary credentials for image uploads
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    
    # OpenRouter API
    OPENROUTER_API_KEY: str
    OPENROUTER_MODEL: str

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
