# app/doctors/routes_doctors.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi import status

router = APIRouter()

@router.get("/ping", summary="Ping doctors router")
def ping_doctors():
    return {"msg": "doctors router ok"}
