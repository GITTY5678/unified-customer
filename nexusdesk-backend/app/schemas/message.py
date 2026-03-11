from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MessageCreate(BaseModel):
    text:      str
    from_role: str = "agent"  # "agent" | "customer"

class MessageOut(BaseModel):
    id:        int
    text:      str
    from_role: str
    ticket_id: int
    sender_id: Optional[int]
    sent_at:   datetime

    class Config:
        from_attributes = True
