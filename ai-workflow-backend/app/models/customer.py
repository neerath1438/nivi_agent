"""Customer tracking model for WhatsApp bot."""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.models.database import Base


class WhatsAppCustomer(Base):
    """Model for tracking WhatsApp customers and link delivery status."""
    
    __tablename__ = "whatsapp_customers"
    
    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String(20), unique=True, nullable=False, index=True)
    first_message = Column(Text, nullable=True)
    link_sent = Column(Boolean, default=False, nullable=False)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    source = Column(String(50), default='direct', nullable=False)  # 'instagram', 'direct', etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<WhatsAppCustomer(phone={self.phone_number}, link_sent={self.link_sent})>"
