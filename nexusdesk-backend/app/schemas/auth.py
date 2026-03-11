from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    name:     str
    email:    EmailStr
    password: str
    company:  str | None = None
    role:     str | None = "agent"

class LoginRequest(BaseModel):
    email:    EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    user_id:      int
    name:         str
    role:         str
    customer_id:  int | None = None  # add this line
