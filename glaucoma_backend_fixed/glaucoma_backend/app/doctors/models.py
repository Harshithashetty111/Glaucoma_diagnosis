from sqlalchemy import Column, Integer, String
from app.database import Base

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    hospital = Column(String, nullable=True)
    specialization = Column(String, nullable=True)
    experience_years = Column(Integer, default=0)
