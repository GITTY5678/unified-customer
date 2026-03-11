import enum

class ChannelEnum(str, enum.Enum):
    email     = "email"
    whatsapp  = "whatsapp"
    twitter   = "twitter"
    instagram = "instagram"
    livechat  = "livechat"
    voice     = "voice"

class StatusEnum(str, enum.Enum):
    open     = "open"
    pending  = "pending"
    resolved = "resolved"

class PriorityEnum(str, enum.Enum):
    low    = "low"
    medium = "medium"
    high   = "high"

class SLAEnum(str, enum.Enum):
    ok       = "ok"
    breached = "Breached"
    resolved = "Resolved"

class RoleEnum(str, enum.Enum):
    agent   = "agent"
    lead    = "lead"
    manager = "manager"
    admin   = "admin"
