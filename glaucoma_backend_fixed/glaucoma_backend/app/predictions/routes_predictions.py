from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
import os
from .model import predict_glaucoma  # <-- we will create this

router = APIRouter(prefix="/api/predict", tags=["Predictions"])


@router.post("/", summary="Run OCT glaucoma prediction")
async def predict_image(file: UploadFile = File(...)):
    # Save uploaded image temporarily
    upload_path = f"temp_{file.filename}"
    with open(upload_path, "wb") as buffer:
        buffer.write(await file.read())

    # Run prediction
    result = predict_glaucoma(upload_path)

    # Delete temp file if needed
    os.remove(upload_path)

    return JSONResponse(result)
