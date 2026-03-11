import anthropic
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.ticket import Ticket
from app.models.message import Message
from app.core.config import settings

client = anthropic.Anthropic(api_key=settings.CLAUDE_API_KEY)

def build_prompt(ticket: Ticket, messages: list[Message]) -> str:
    history = "\n".join([f"{m.from_role.upper()}: {m.text}" for m in messages[-5:]])
    return f"""You are a professional logistics customer support agent for NexusDesk.

Ticket Details:
- Subject: {ticket.subject}
- Channel: {ticket.channel}
- Priority: {ticket.priority}
- Shipment ID: {ticket.shipment_id or 'N/A'}
- Shipment Status: {ticket.shipment_status or 'N/A'}
- ETA: {ticket.shipment_eta or 'N/A'}

Recent Conversation:
{history}

Generate exactly 2 short, professional reply suggestions for the agent to send.
Format your response as:
REPLY 1: <reply text>
REPLY 2: <reply text>

Keep each reply under 3 sentences. Be empathetic, specific, and solution-focused."""

def get_ai_suggestions(ticket_id: int, db: Session) -> list[str]:
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    messages = db.query(Message).filter(Message.ticket_id == ticket_id).order_by(Message.sent_at).all()

    prompt = build_prompt(ticket, messages)

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=400,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = response.content[0].text
    suggestions = []
    for line in raw.split("\n"):
        if line.startswith("REPLY 1:"):
            suggestions.append(line.replace("REPLY 1:", "").strip())
        elif line.startswith("REPLY 2:"):
            suggestions.append(line.replace("REPLY 2:", "").strip())

    if not suggestions:
        suggestions = [raw.strip()]

    return suggestions
