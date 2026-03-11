from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from app.services.ws_manager import manager
from app.services.message_service import add_message
from app.schemas.message import MessageCreate
from app.core.dependencies import get_db
import json

router = APIRouter(tags=["WebSocket"])

@router.websocket("/ws/{ticket_id}")
async def websocket_endpoint(ticket_id: int, ws: WebSocket, db: Session = Depends(get_db)):
    await manager.connect(ticket_id, ws)
    try:
        while True:
            data = await ws.receive_text()
            payload = json.loads(data)

            # Save message to DB
            msg = add_message(
                ticket_id=ticket_id,
                req=MessageCreate(text=payload["text"], from_role=payload.get("from_role", "agent")),
                sender_id=payload.get("sender_id"),
                db=db,
            )

            # Broadcast to all connections on this ticket
            await manager.broadcast(ticket_id, {
                "id":        msg.id,
                "text":      msg.text,
                "from_role": msg.from_role,
                "sender_id": msg.sender_id,
                "sent_at":   msg.sent_at.isoformat(),
            })
    except WebSocketDisconnect:
        manager.disconnect(ticket_id, ws)
