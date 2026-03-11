from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.ticket import Ticket

router = APIRouter(prefix="/agents", tags=["Agents"])

@router.get("/")
def list_agents(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    agents = db.query(User).all()
    return [
        {
            "id": a.id, "name": a.name, "email": a.email,
            "role": a.role, "status": a.status,
            "load": db.query(Ticket).filter(Ticket.agent_id == a.id, Ticket.status != "resolved").count(),
        }
        for a in agents
    ]

@router.get("/{agent_id}/workload")
def agent_workload(agent_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    agent = db.query(User).filter(User.id == agent_id).first()
    if not agent:
        return {"error": "Agent not found"}
    tickets = db.query(Ticket).filter(Ticket.agent_id == agent_id).all()
    return {
        "agent": {"id": agent.id, "name": agent.name, "status": agent.status},
        "total":    len(tickets),
        "open":     sum(1 for t in tickets if t.status == "open"),
        "pending":  sum(1 for t in tickets if t.status == "pending"),
        "resolved": sum(1 for t in tickets if t.status == "resolved"),
    }
