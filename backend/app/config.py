import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv, find_dotenv

# Load env file if it exists
dotenv_path = find_dotenv()
if dotenv_path:
    load_dotenv(dotenv_path)

class Settings(BaseSettings):
    APP_ENV: str = "development"
    LOG_LEVEL: str = "info"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/ai_shorts_agent"
    GEMINI_API_KEY: str = ""
    CORS_ORIGINS: str = "http://localhost:3000"
    GEMINI_MODEL: str = "gemini-3.1-flash-lite"
    MAX_INPUT_LENGTH: int = 2000
    MAX_REQUESTS_PER_MINUTE: int = 20

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
