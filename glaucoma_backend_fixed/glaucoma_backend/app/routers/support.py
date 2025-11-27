from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import SupportTicket

# All routes here will be under /api/support-tickets
router = APIRouter(
    prefix="/support-tickets",
    tags=["Support Tickets"],
)


# ---------- Pydantic models ----------

class SupportTicketCreate(BaseModel):
    name: str
    email: str
    issue_type: str
    message: str


# ---------- Create new ticket (called from Contact page) ----------

@router.post("")
def create_ticket(payload: SupportTicketCreate, db: Session = Depends(get_db)):
    try:
        new_ticket = SupportTicket(
            name=payload.name,
            email=payload.email,
            issue_type=payload.issue_type,
            message=payload.message,
            created_at=datetime.utcnow(),
        )
        db.add(new_ticket)
        db.commit()
        db.refresh(new_ticket)

        return {
            "msg": "Ticket submitted successfully",
            "ticket_id": new_ticket.id,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------- Get all tickets (used by SupportTickets.tsx) ----------

@router.get("", response_model=List[dict])
def get_tickets(db: Session = Depends(get_db)) -> List[dict]:
    tickets = db.query(SupportTicket).order_by(SupportTicket.id.desc()).all()

    return [
        {
            "id": t.id,
            "subject": f"[{t.issue_type}] {t.name}",
            "description": t.message,
            "status": "OPEN",          # default for now
            "patient_name": t.name,
            "doctor_name": None,
            "priority": "MEDIUM",
            "created_at": t.created_at,
            "updated_at": t.created_at,
        }
        for t in tickets
    ]


# ---------- Admin/developer can update status via docs ----------

class TicketStatusUpdate(BaseModel):
    status: str


@router.patch("/{ticket_id}")
def update_ticket_status(
    ticket_id: int,
    payload: TicketStatusUpdate,
    db: Session = Depends(get_db),
):
    allowed = {"OPEN", "IN_PROGRESS", "RESOLVED"}
    if payload.status not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{payload.status}'. Allowed: {', '.join(allowed)}",
        )

    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    # we don't persist status in DB schema yet, so this is demo-only
    return {
        "id": ticket_id,
        "status": payload.status,
        "detail": "Status updated (demo only, not stored in DB).",
    }
