from app.db.session import SessionLocal, engine
from app.db.base import Base

# import ALL models so SQLAlchemy registers them
from app.models.user import User
from app.models.ticket import Ticket
from app.models.customer import Customer
from app.models.message import Message

from app.core.security import hash_password


def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == "admin@nexusdesk.in").first()

        if not existing:
            admin = User(
                name="Admin Agent",
                email="admin@nexusdesk.in",
                hashed_password=hash_password("nexusdesk123"),
                company="NexusDesk",
                role="admin",
            )
            db.add(admin)
            db.commit()
            print("Seeded default admin: admin@nexusdesk.in / nexusdesk123")

    finally:
        db.close()