# NexusDesk Backend API

Omni-channel logistics complaint management platform — TN-IMPACT 2026 (#TN126083)

## Stack
- **FastAPI** — Python async web framework
- **PostgreSQL** — Primary database
- **SQLAlchemy** — ORM
- **Alembic** — DB migrations
- **Claude API** — AI reply suggestions
- **WebSockets** — Real-time live chat

## Quick Start

### 1. Clone & setup environment
```bash
cd nexusdesk-backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your PostgreSQL URL and Claude API key
```

### 3. Create PostgreSQL database
```bash
psql -U postgres -c "CREATE DATABASE nexusdesk;"
```

### 4. Run the server
```bash
uvicorn app.main:app --reload
```

### 5. Open API docs
Visit: http://localhost:8000/docs

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new agent |
| POST | /auth/login | Login + get JWT token |
| GET | /tickets/ | List all tickets (filterable) |
| POST | /tickets/ | Create new ticket |
| GET | /tickets/{id} | Get ticket details |
| PATCH | /tickets/{id} | Update ticket (status/agent/priority) |
| DELETE | /tickets/{id} | Delete ticket |
| GET | /tickets/{id}/messages | Get message history |
| POST | /tickets/{id}/messages | Send a message |
| GET | /agents/ | List all agents + workload |
| GET | /agents/{id}/workload | Agent ticket breakdown |
| POST | /ai/suggest/{ticket_id} | Get AI reply suggestions |
| WS | /ws/{ticket_id} | Real-time WebSocket chat |

## WebSocket Usage
```javascript
const ws = new WebSocket("ws://localhost:8000/ws/1");
ws.send(JSON.stringify({
  text: "Your message here",
  from_role: "agent",
  sender_id: 1
}));
ws.onmessage = (e) => console.log(JSON.parse(e.data));
```

## Default Admin Credentials
```
Email: admin@nexusdesk.in
Password: nexusdesk123
```
