from fastapi import APIRouter

router = APIRouter()

@router.get("/ping", summary="Ping feedback router")
def ping_feedback():
    return {"msg": "feedback router ok"}
