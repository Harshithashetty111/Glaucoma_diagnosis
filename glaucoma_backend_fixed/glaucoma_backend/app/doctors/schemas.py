from pydantic import BaseModel, EmailStr

class DoctorRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    hospital: str
    specialization: str
    experience_years: int

class DoctorLogin(BaseModel):
    email: EmailStr
    password: str

class DoctorResponse(BaseModel):
    id: int
    name: str
    email: str
    hospital: str
    specialization: str
    experience_years: int

    class Config:
        orm_mode = True
