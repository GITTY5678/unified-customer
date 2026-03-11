from fastapi import WebSocket
from typing import Dict, List
import json

class ConnectionManager:
    def __init__(self):
        # ticket_id -> list of active WebSocket connections
        self.active: Dict[int, List[WebSocket]] = {}

    async def connect(self, ticket_id: int, ws: WebSocket):
        await ws.accept()
        if ticket_id not in self.active:
            self.active[ticket_id] = []
        self.active[ticket_id].append(ws)

    def disconnect(self, ticket_id: int, ws: WebSocket):
        if ticket_id in self.active:
            self.active[ticket_id].remove(ws)
            if not self.active[ticket_id]:
                del self.active[ticket_id]

    async def broadcast(self, ticket_id: int, data: dict):
        """Send a message to all agents watching this ticket."""
        if ticket_id in self.active:
            payload = json.dumps(data)
            for ws in self.active[ticket_id]:
                try:
                    await ws.send_text(payload)
                except Exception:
                    pass  # Connection dropped — will be cleaned up on disconnect

manager = ConnectionManager()
