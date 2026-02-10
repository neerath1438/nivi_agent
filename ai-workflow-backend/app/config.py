"""Application configuration using Pydantic settings."""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # OpenAI Configuration
    openai_api_key: str
    openai_model: str = "gpt-4o-mini"
    
    # Gemini Configuration
    gemini_api_key: str = ""
    
    # Anthropic Claude Configuration
    claude_api_key: str = ""
    
    # Local Model Configuration
    load_local_model: bool = False
    
    # Database Configuration
    database_url: str
    
    # Elasticsearch Configuration
    elasticsearch_host: str = "localhost"
    elasticsearch_port: int = 9200
    elasticsearch_scheme: str = "https"
    elasticsearch_username: str = "elastic"
    elasticsearch_password: str = ""
    elasticsearch_verify_certs: bool = False  # Set to False for self-signed certs
    elasticsearch_index: str = "xperty-properties"
    
    # Legacy support - build URL from components
    @property
    def elasticsearch_url(self) -> str:
        """Construct Elasticsearch URL from components."""
        return f"{self.elasticsearch_scheme}://{self.elasticsearch_host}:{self.elasticsearch_port}"
    
    # Application Configuration
    cors_origins: str = "http://localhost:5173"
    debug: bool = True
    
    # SMTP Configuration
    smtp_server: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    
    # Encryption Configuration
    encryption_key: str  # Fernet encryption key for credentials
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"  # Ignore extra fields from .env (for backward compatibility)
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    @property
    def gemini_api_keys(self) -> List[str]:
        """Parse Gemini API keys from comma-separated string."""
        if not self.gemini_api_key:
            return []
        return [key.strip() for key in self.gemini_api_key.split(",") if key.strip()]


# Global settings instance
settings = Settings()
