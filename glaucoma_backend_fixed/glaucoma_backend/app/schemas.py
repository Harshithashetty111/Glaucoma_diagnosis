# app/schemas.py
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, Dict


# -------------------------------------------
# AUTH / USER SCHEMAS
# -------------------------------------------

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    hospital: Optional[str] = None
    specialization: Optional[str] = None
    experience_years: Optional[int] = None

    @validator("password")
    def password_length(cls, v: str) -> str:
        # allow large passwords (Argon2 supports long passwords)
        if len(v.encode("utf-8")) > 4096:
            raise ValueError("password too long")
        return v


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    hospital: Optional[str] = None
    specialization: Optional[str] = None
    experience_years: Optional[int] = None

    class Config:
        orm_mode = True  # pydantic v2 will warn; it's okay for now


# Token models used by auth routes
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# -------------------------------------------
# PREDICTION SCHEMAS
# -------------------------------------------

class PredictionRequest(BaseModel):
    # Adjust keys to match your ML model input
    features: Dict[str, float]


class PredictionResponse(BaseModel):
    prediction: str
    probabilities: Dict[str, float]
    explainability: Optional[Dict] = None


# -------------------------------------------
# PATIENT SCHEMAS
# -------------------------------------------

class PatientBase(BaseModel):
    full_name: str
    age: int
    gender: str
    medical_history: Optional[str] = None
    risk_factors: Optional[str] = None
    mrn: Optional[str] = None


class PatientCreate(PatientBase):
    pass


class PatientOut(PatientBase):
    id: int

    class Config:
        orm_mode = True  # pydantic v2 warns but still works
        # If you want to be fully v2-style, you can replace this with:
        # model_config = ConfigDict(from_attributes=True)


# app/schemas.py
from pydantic import BaseModel, EmailStr

# ... existing schemas (UserCreate, PatientCreate, etc.) ...

class SupportTicketBase(BaseModel):
    name: str
    email: EmailStr
    issue_type: str
    message: str


class SupportTicketCreate(SupportTicketBase):
    pass


class SupportTicketOut(SupportTicketBase):
    id: int

    class Config:
        orm_mode = True  # so FastAPI can read from SQLAlchemy model
