from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register():
    res = client.post("/auth/register", json={
        "name": "Test Agent",
        "email": "test@nexusdesk.in",
        "password": "test1234",
        "company": "TestCo",
    })
    assert res.status_code == 200
    assert "access_token" in res.json()

def test_login():
    res = client.post("/auth/login", json={
        "email": "test@nexusdesk.in",
        "password": "test1234",
    })
    assert res.status_code == 200
    assert "access_token" in res.json()

def test_login_wrong_password():
    res = client.post("/auth/login", json={
        "email": "test@nexusdesk.in",
        "password": "wrongpassword",
    })
    assert res.status_code == 401
