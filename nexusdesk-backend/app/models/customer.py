from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class Customer(Base):
    __tablename__ = "customers"

    id            = Column(Integer, primary_key=True, index=True)
    name          = Column(String, nullable=False)
    email         = Column(String, unique=True, index=True, nullable=False)
    phone         = Column(String, nullable=True)
    company       = Column(String, nullable=True)
    ltv           = Column(Float, default=0.0)       # Lifetime value in ₹
    total_tickets = Column(Integer, default=0)
    created_at    = Column(DateTime, default=datetime.utcnow)

    tickets = relationship("Ticket", back_populates="customer")
