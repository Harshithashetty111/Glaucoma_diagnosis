import os
import shutil
import tempfile
from pathlib import Path
from typing import Optional

from fastapi import (
    APIRouter,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)

from app.schemas import PredictionResponse
from .model import predict_glaucoma

router = APIRouter(prefix="/api/predict", tags=["Predictions"])

ACCEPTED_CONTENT_TYPES = {"image/png", "image/jpeg", "image/jpg"}


@router.post(
    "/",
    summary="Run OCT glaucoma prediction",
    response_model=PredictionResponse,
)
async def predict_image(
    image: Optional[UploadFile] = File(default=None),
    file: Optional[UploadFile] = File(default=None, description="Backward compatible"),
    patient_id: Optional[str] = Form(default=None),
):
    """
    Accepts an OCT scan upload, runs it through the ML model, and returns the
    predicted glaucoma stage plus per-class probabilities.
    """

    upload = image or file
    if upload is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No OCT image was provided.",
        )

    if upload.content_type not in ACCEPTED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only PNG and JPEG images are supported.",
        )

    temp_path = None
    suffix = Path(upload.filename or "").suffix or ".png"

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            shutil.copyfileobj(upload.file, temp_file)
            temp_path = temp_file.name

        prediction = predict_glaucoma(temp_path)
        # TODO: Use patient_id for auditing / storage once prediction history is implemented.
        return prediction
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {exc}",
        ) from exc
    finally:
        upload.file.close()
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
