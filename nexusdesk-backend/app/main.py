from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, tickets, messages, agents, ai, websocket
from app.db.init_db import init_db

app = FastAPI(
    title="NexusDesk API",
    description="Omni-channel logistics complaint management platform — TN-IMPACT 2026",
    version="1.0.0",
)

# CORS — allow your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(tickets.router)
app.include_router(messages.router)
app.include_router(agents.router)
app.include_router(ai.router)
app.include_router(websocket.router)

@app.on_event("startup")
def startup():
    init_db()
    print("🚀 NexusDesk API is running!")

@app.get("/")
def root():
    return {"message": "NexusDesk API v1.0", "docs": "/docs"}
