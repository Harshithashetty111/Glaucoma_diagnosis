from fastapi import APIRouter

router = APIRouter()

@router.get("/ping", summary="Ping patients router")
def ping_patients():
    return {"msg": "patients router ok"}
