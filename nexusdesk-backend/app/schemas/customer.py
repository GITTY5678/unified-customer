from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class CustomerCreate(BaseModel):
    name:    str
    email:   EmailStr
    phone:   Optional[str] = None
    company: Optional[str] = None
    ltv:     Optional[float] = 0.0

class CustomerOut(BaseModel):
    id:            int
    name:          str
    email:         str
    phone:         Optional[str]
    company:       Optional[str]
    ltv:           float
    total_tickets: int
    created_at:    datetime

    class Config:
        from_attributes = True
