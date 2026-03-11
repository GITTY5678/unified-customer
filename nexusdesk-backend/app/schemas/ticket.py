from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class ShipmentInfo(BaseModel):
    id:     Optional[str] = None
    origin: Optional[str] = None
    dest:   Optional[str] = None
    status: Optional[str] = None
    eta:    Optional[str] = None

class TicketCreate(BaseModel):
    subject:      str
    channel:      str
    priority:     str = "medium"
    customer_id:  int
    tags:         Optional[str] = ""
    shipment_id:      Optional[str] = None
    shipment_origin:  Optional[str] = None
    shipment_dest:    Optional[str] = None
    shipment_status:  Optional[str] = None
    shipment_eta:     Optional[str] = None

class TicketUpdate(BaseModel):
    status:   Optional[str] = None
    priority: Optional[str] = None
    agent_id: Optional[int] = None
    tags:     Optional[str] = None
    shipment_status: Optional[str] = None
    shipment_eta:    Optional[str] = None

class TicketOut(BaseModel):
    id:          int
    subject:     str
    channel:     str
    status:      str
    priority:    str
    tags:        Optional[str]
    customer_id: int
    agent_id:    Optional[int]
    sla:         Optional[str]
    shipment:    Optional[ShipmentInfo]
    created_at:  datetime
    updated_at:  datetime

    class Config:
        from_attributes = True
