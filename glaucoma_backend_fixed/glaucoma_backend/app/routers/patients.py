# app/routers/patients.py

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session

from app.database import get_db
from app import schemas
from app.models import Patient

# 👇 NEW IMPORTS FOR PDF
from io import BytesIO
from fastapi.responses import StreamingResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from datetime import datetime

router = APIRouter(prefix="/api", tags=["patients"])


# -------------------- CREATE PATIENT --------------------
@router.post(
    "/patients",
    response_model=schemas.PatientOut,
    status_code=status.HTTP_201_CREATED,
)
def create_patient(
    patient: schemas.PatientCreate,
    db: Session = Depends(get_db),
):
    db_patient = Patient(
        full_name=patient.full_name,
        age=patient.age,
        gender=patient.gender,
        medical_history=patient.medical_history,
        risk_factors=patient.risk_factors,
        mrn=patient.mrn,
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


# -------------------- LIST ALL PATIENTS --------------------
@router.get(
    "/patients",
    response_model=List[schemas.PatientOut],
    status_code=status.HTTP_200_OK,
)
def list_patients(db: Session = Depends(get_db)):
    patients = db.query(Patient).order_by(Patient.id).all()
    return patients


# -------------------- GET SINGLE PATIENT --------------------
@router.get(
    "/patients/{patient_id}",
    response_model=schemas.PatientOut,
    status_code=status.HTTP_200_OK,
)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )
    return patient


# -------------------- UPDATE PATIENT --------------------
@router.put(
    "/patients/{patient_id}",
    response_model=schemas.PatientOut,
    status_code=status.HTTP_200_OK,
)
def update_patient(
    patient_id: int,
    updated: schemas.PatientCreate,
    db: Session = Depends(get_db),
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    patient.full_name = updated.full_name
    patient.age = updated.age
    patient.gender = updated.gender
    patient.medical_history = updated.medical_history
    patient.risk_factors = updated.risk_factors
    patient.mrn = updated.mrn

    db.commit()
    db.refresh(patient)
    return patient


# -------------------- DOWNLOAD PATIENT REPORT (PDF) --------------------
@router.get(
    "/patients/{patient_id}/report",
    summary="Download patient report as PDF",
)
def download_patient_report(patient_id: int, db: Session = Depends(get_db)):
    # 1. Fetch patient
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    # 2. Create PDF in memory
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    y = height - 50

    # Header
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "Glaucoma XAI – Patient Report")
    y -= 25

    c.setFont("Helvetica", 10)
    c.drawString(50, y, f"Report Date: {datetime.utcnow().strftime('%d-%b-%Y %H:%M UTC')}")
    y -= 30

    # Patient info
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Patient Information")
    y -= 18
    c.setFont("Helvetica", 10)

    c.drawString(60, y, f"Name: {patient.full_name}")
    y -= 15
    c.drawString(60, y, f"Age: {patient.age if patient.age is not None else 'N/A'}")
    y -= 15
    c.drawString(60, y, f"Gender: {patient.gender or 'N/A'}")
    y -= 15
    c.drawString(60, y, f"MRN: {patient.mrn or 'N/A'}")
    y -= 25

    # Medical history
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Medical History")
    y -= 18
    c.setFont("Helvetica", 10)
    c.drawString(60, y, (patient.medical_history or "Not provided"))
    y -= 25

    # Risk factors
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Risk Factors")
    y -= 18
    c.setFont("Helvetica", 10)
    c.drawString(60, y, (patient.risk_factors or "Not provided"))
    y -= 25

    # Comments
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Comments")
    y -= 18
    c.setFont("Helvetica", 9)
    lines = [
      "This report is generated from the Glaucoma XAI decision support system.",
      "Clinical correlation is recommended before making any treatment decisions.",
      "In case of inconsistent or unexpected results, review OCT quality and",
      "consider additional investigations (visual fields, optic nerve exam, etc.).",
    ]
    for line in lines:
        c.drawString(60, y, line)
        y -= 12

    c.showPage()
    c.save()

    buffer.seek(0)
    filename = f"patient_{patient_id}_report.pdf"
    headers = {"Content-Disposition": f'attachment; filename="{filename}"'}
    return StreamingResponse(buffer, media_type="application/pdf", headers=headers)
