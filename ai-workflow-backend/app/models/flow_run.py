"""Flow run model for storing execution history."""
from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.models.database import Base


class RunStatus(str, enum.Enum):
    """Execution status enum."""
    PENDING = "pending"
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"


class FlowRun(Base):
    """Model for storing flow execution history."""
    
    __tablename__ = "flow_runs"
    
    id = Column(Integer, primary_key=True, index=True)
    flow_id = Column(Integer, ForeignKey("flows.id", ondelete="CASCADE"), nullable=True)
    input_message = Column(Text, nullable=False)
    output_result = Column(Text, nullable=True)
    execution_logs = Column(JSON, nullable=True)  # Stores step-by-step logs
    status = Column(Enum(RunStatus), default=RunStatus.PENDING)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationship
    flow = relationship("Flow", backref="runs")
    
    def __repr__(self):
        return f"<FlowRun(id={self.id}, status={self.status})>"
