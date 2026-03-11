from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.services.ai_service import get_ai_suggestions

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/suggest/{ticket_id}")
def suggest(ticket_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    suggestions = get_ai_suggestions(ticket_id, db)
    return {"ticket_id": ticket_id, "suggestions": suggestions}
