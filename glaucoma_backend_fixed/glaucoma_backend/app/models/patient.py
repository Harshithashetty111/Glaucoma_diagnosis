# app/models/patient.py

from sqlalchemy import Column, Integer, String, Text
from app.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(10), nullable=False)

    medical_history = Column(Text, nullable=True)
    risk_factors = Column(Text, nullable=True)
    mrn = Column(String(100), nullable=True)
