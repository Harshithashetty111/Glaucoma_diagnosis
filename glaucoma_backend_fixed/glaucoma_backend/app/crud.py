from sqlalchemy.orm import Session
from . import models, schemas
from .auth.hashing import hash_password

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    if get_user_by_email(db, user.email):
        raise ValueError("Email already registered")
    hashed = hash_password(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        password=hashed,
        hospital=user.hospital,
        specialization=user.specialization,
        experience_years=user.experience_years
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
