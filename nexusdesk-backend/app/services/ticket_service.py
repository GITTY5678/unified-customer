from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.ticket import Ticket
from app.schemas.ticket import TicketCreate, TicketUpdate, TicketOut, ShipmentInfo
from app.utils.sla import get_sla_label
from app.utils.enums import PriorityEnum
from typing import List, Optional

def _build_out(ticket: Ticket) -> TicketOut:
    sla = get_sla_label(
        priority=PriorityEnum(ticket.priority),
        created_at=ticket.created_at,
        status=ticket.status,
    )
    shipment = None
    if ticket.shipment_id:
        shipment = ShipmentInfo(
            id=ticket.shipment_id,
            origin=ticket.shipment_origin,
            dest=ticket.shipment_dest,
            status=ticket.shipment_status,
            eta=ticket.shipment_eta,
        )
    return TicketOut(
        id=ticket.id, subject=ticket.subject, channel=ticket.channel,
        status=ticket.status, priority=ticket.priority, tags=ticket.tags,
        customer_id=ticket.customer_id, agent_id=ticket.agent_id,
        sla=sla, shipment=shipment,
        created_at=ticket.created_at, updated_at=ticket.updated_at,
    )

def create_ticket(req: TicketCreate, db: Session) -> TicketOut:
    ticket = Ticket(**req.model_dump())
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return _build_out(ticket)

def get_tickets(
    db: Session,
    channel: Optional[str] = None,
    status:  Optional[str] = None,
    priority: Optional[str] = None,
    agent_id: Optional[int] = None,
) -> List[TicketOut]:
    q = db.query(Ticket)
    if channel:  q = q.filter(Ticket.channel  == channel)
    if status:   q = q.filter(Ticket.status   == status)
    if priority: q = q.filter(Ticket.priority == priority)
    if agent_id: q = q.filter(Ticket.agent_id == agent_id)
    return [_build_out(t) for t in q.order_by(Ticket.created_at.desc()).all()]

def get_ticket(ticket_id: int, db: Session) -> TicketOut:
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return _build_out(ticket)

def update_ticket(ticket_id: int, req: TicketUpdate, db: Session) -> TicketOut:
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    for field, value in req.model_dump(exclude_none=True).items():
        setattr(ticket, field, value)
    db.commit()
    db.refresh(ticket)
    return _build_out(ticket)

def delete_ticket(ticket_id: int, db: Session):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    db.delete(ticket)
    db.commit()
    return {"message": f"Ticket {ticket_id} deleted"}
