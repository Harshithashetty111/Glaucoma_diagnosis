# app/schemas/patient.py

from pydantic import BaseModel
from typing import Optional


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
