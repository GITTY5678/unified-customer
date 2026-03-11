from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.customer import Customer
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.core.security import hash_password, verify_password, create_access_token

def register_user(req: RegisterRequest, db: Session) -> TokenResponse:
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(
        name=req.name,
        email=req.email,
        hashed_password=hash_password(req.password),
        company=req.company,
        role=req.role or "agent",
    )
    db.add(user)
    db.flush()  # get user.id without committing yet

    # If customer, also create a row in the customers table
    if req.role == "customer":
        existing_customer = db.query(Customer).filter(Customer.email == req.email).first()
        if not existing_customer:
            customer = Customer(
                name=req.name,
                email=req.email,
                company=req.company,
            )
            db.add(customer)
            db.flush()  # get customer.id

    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token, user_id=user.id, name=user.name, role=user.role)

def login_user(req: LoginRequest, db: Session) -> TokenResponse:
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    # Get customer_id if role is customer
    customer_id = None
    if user.role == "customer":
        customer = db.query(Customer).filter(Customer.email == user.email).first()
        customer_id = customer.id if customer else None

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        name=user.name,
        role=user.role,
        customer_id=customer_id,
    )