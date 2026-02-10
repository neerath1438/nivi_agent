"""Flow model for storing workflow definitions."""
from sqlalchemy import Column, Integer, String, JSON, DateTime
from sqlalchemy.sql import func
from app.models.database import Base


class Flow(Base):
    """Model for storing AI workflow flows."""
    
    __tablename__ = "flows"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    flow_data = Column(JSON, nullable=False)  # Stores nodes and edges
    share_token = Column(String, unique=True, nullable=True) # Unique token for sharing
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Flow(id={self.id}, name='{self.name}')>"
