"""Credential model for storing encrypted API keys and credentials."""
from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from app.models.database import Base


class Credential(Base):
    """Model for storing encrypted credentials (API keys, passwords, etc.)."""
    
    __tablename__ = "credentials"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # User-friendly name (e.g., "OpenAI Production Key")
    provider = Column(String, nullable=False)  # Provider type: openai, gemini, claude, smtp
    encrypted_value = Column(Text, nullable=False)  # Encrypted API key/password
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Credential(id={self.id}, name='{self.name}', provider='{self.provider}')>"
