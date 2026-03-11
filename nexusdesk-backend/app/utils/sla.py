from datetime import datetime, timedelta
from app.utils.enums import PriorityEnum

# SLA windows in hours per priority
SLA_HOURS = {
    PriorityEnum.high:   2,
    PriorityEnum.medium: 6,
    PriorityEnum.low:    24,
}

def get_sla_deadline(priority: PriorityEnum, created_at: datetime) -> datetime:
    hours = SLA_HOURS.get(priority, 6)
    return created_at + timedelta(hours=hours)

def is_sla_breached(priority: PriorityEnum, created_at: datetime) -> bool:
    deadline = get_sla_deadline(priority, created_at)
    return datetime.utcnow() > deadline

def get_sla_label(priority: PriorityEnum, created_at: datetime, status: str) -> str:
    if status == "resolved":
        return "Resolved"
    if is_sla_breached(priority, created_at):
        return "Breached"
    deadline = get_sla_deadline(priority, created_at)
    remaining = deadline - datetime.utcnow()
    hours = int(remaining.total_seconds() // 3600)
    return f"{hours}h left"
