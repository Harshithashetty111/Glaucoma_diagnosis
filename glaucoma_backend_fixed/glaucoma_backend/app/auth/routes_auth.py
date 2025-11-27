from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from .. import schemas
from ..database import SessionLocal
from ..crud import create_user, get_user_by_email
from .hashing import verify_password
from .jwt_handler import create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/ping")
def ping():
    return {"msg": "auth ok"}

@router.post("/register", response_model=schemas.UserResponse, status_code=201)
def register(user: schemas.UserCreate = Body(...), db: Session = Depends(get_db)):
    try:
        created = create_user(db, user)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        print("Unhandled in register:", repr(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Server error")
    return created

@router.post("/login", response_model=schemas.Token)
def login(form_data: dict = Body(...), db: Session = Depends(get_db)):
    email = form_data.get("email")
    password = form_data.get("password")
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}
