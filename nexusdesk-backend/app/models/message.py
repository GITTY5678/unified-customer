from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class Message(Base):
    __tablename__ = "messages"

    id        = Column(Integer, primary_key=True, index=True)
    text      = Column(Text, nullable=False)
    from_role = Column(String, nullable=False)  # "customer" | "agent"
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"),   nullable=True)  # null if customer
    sent_at   = Column(DateTime, default=datetime.utcnow)

    ticket = relationship("Ticket", back_populates="messages")
    sender = relationship("User",   back_populates="messages")
