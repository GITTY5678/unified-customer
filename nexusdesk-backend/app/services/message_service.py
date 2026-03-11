from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.message import Message
from app.models.ticket import Ticket
from app.schemas.message import MessageCreate, MessageOut
from typing import List

def get_messages(ticket_id: int, db: Session) -> List[MessageOut]:
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    messages = db.query(Message).filter(Message.ticket_id == ticket_id).order_by(Message.sent_at).all()
    return [MessageOut.model_validate(m) for m in messages]

def add_message(ticket_id: int, req: MessageCreate, sender_id: int, db: Session) -> MessageOut:
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    msg = Message(
        text=req.text,
        from_role=req.from_role,
        ticket_id=ticket_id,
        sender_id=sender_id if req.from_role == "agent" else None,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return MessageOut.model_validate(msg)
