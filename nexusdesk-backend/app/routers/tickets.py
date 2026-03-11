from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas.ticket import TicketCreate, TicketUpdate, TicketOut
from app.services.ticket_service import create_ticket, get_tickets, get_ticket, update_ticket, delete_ticket
from app.core.dependencies import get_db, get_current_user
from app.models.user import User

router = APIRouter(prefix="/tickets", tags=["Tickets"])

@router.get("/", response_model=List[TicketOut])
def list_tickets(
    channel:  Optional[str] = Query(None),
    status:   Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    agent_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return get_tickets(db, channel, status, priority, agent_id)

@router.post("/", response_model=TicketOut)
def create(req: TicketCreate, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return create_ticket(req, db)

@router.get("/{ticket_id}", response_model=TicketOut)
def retrieve(ticket_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return get_ticket(ticket_id, db)

@router.patch("/{ticket_id}", response_model=TicketOut)
def update(ticket_id: int, req: TicketUpdate, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return update_ticket(ticket_id, req, db)

@router.delete("/{ticket_id}")
def delete(ticket_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return delete_ticket(ticket_id, db)
