from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class Ticket(Base):
    __tablename__ = "tickets"

    id          = Column(Integer, primary_key=True, index=True)
    subject     = Column(String, nullable=False)
    channel     = Column(String, nullable=False)   # email | whatsapp | voice | ...
    status      = Column(String, default="open")   # open | pending | resolved
    priority    = Column(String, default="medium") # low | medium | high
    tags        = Column(String, default="")       # comma-separated tags

    # Shipment context (pulled from TMS/WMS)
    shipment_id     = Column(String, nullable=True)
    shipment_origin = Column(String, nullable=True)
    shipment_dest   = Column(String, nullable=True)
    shipment_status = Column(String, nullable=True)
    shipment_eta    = Column(String, nullable=True)

    # Foreign keys
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    agent_id    = Column(Integer, ForeignKey("users.id"),     nullable=True)

    created_at  = Column(DateTime, default=datetime.utcnow)
    updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    customer = relationship("Customer", back_populates="tickets")
    agent    = relationship("User",     back_populates="tickets")
    messages = relationship("Message",  back_populates="ticket", cascade="all, delete-orphan")
