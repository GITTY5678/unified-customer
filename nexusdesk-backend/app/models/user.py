from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id              = Column(Integer, primary_key=True, index=True)
    name            = Column(String, nullable=False)
    email           = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    company         = Column(String, nullable=True)
    role            = Column(String, default="agent")  # agent | lead | manager | admin
    status          = Column(String, default="online") # online | away | offline
    created_at      = Column(DateTime, default=datetime.utcnow)

    # Tickets assigned to this agent
    tickets  = relationship("Ticket",  back_populates="agent")
    messages = relationship("Message", back_populates="sender")
