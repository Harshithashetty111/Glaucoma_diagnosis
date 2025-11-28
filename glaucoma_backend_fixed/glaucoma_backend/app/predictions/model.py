from __future__ import annotations

import logging
import os
from functools import lru_cache
from pathlib import Path
from typing import Dict, List

import numpy as np
from PIL import Image, ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = True  # helps with slightly corrupted OCT exports

# The model was exported with standalone Keras 3, so we ensure the same loader here.
os.environ.setdefault("KERAS_BACKEND", "tensorflow")
try:
    import keras  # type: ignore
except Exception as exc:  # pragma: no cover - surfaces missing dependency early
    raise RuntimeError(
        "Keras 3 with a TensorFlow backend is required for glaucoma predictions. "
        "Install via `pip install tensorflow keras`."
    ) from exc


CLASS_NAMES: List[str] = ["normal", "early", "advanced"]
TARGET_SIZE = (320, 320)
MODEL_FILENAME = "glaucoma_best_model_ft2.keras"

logger = logging.getLogger(__name__)


def _model_path() -> Path:
    """
    Resolve the path to the glaucoma model.

    Expected location for your setup:
    <project_root>/Models/glaucoma_best_model_ft2.keras
    i.e. C:\\Users\\Jeevan bn\\Glaucoma_diagnosis\\Models\\glaucoma_best_model_ft2.keras
    """
    # project_root = .../Glaucoma_diagnosis
    project_root = Path(__file__).resolve().parents[4]

    # First choice: Models/ folder at project root
    candidate = project_root / "Models" / MODEL_FILENAME
    if candidate.exists():
        return candidate

    # Fallback: old location (same folder as glaucoma_backend)
    base_dir = Path(__file__).resolve().parents[2]
    legacy_candidate = base_dir / MODEL_FILENAME
    if legacy_candidate.exists():
        return legacy_candidate

    raise FileNotFoundError(
        f"Model file '{MODEL_FILENAME}' was not found.\n"
        f"Tried:\n - {candidate}\n - {legacy_candidate}\n"
        "Make sure the .keras file is present in a valid location."
    )



@lru_cache(maxsize=1)
def _load_model():
    logger.info("Loading glaucoma staging model from disk...")
    return keras.models.load_model(str(_model_path()))


def _prepare_image(image_path: str) -> np.ndarray:
    with Image.open(image_path) as img:
        image = img.convert("RGB").resize(TARGET_SIZE)

    array = np.asarray(image, dtype=np.float32)
    array /= 255.0
    return np.expand_dims(array, axis=0)


def predict_glaucoma(image_path: str) -> Dict[str, Dict[str, float] | str | None]:
    """
    Run the OCT scan through the CNN and return the predicted stage.
    """
    model = _load_model()
    input_tensor = _prepare_image(image_path)
    prediction = model.predict(input_tensor, verbose=0)[0]

    probabilities = {
        label: float(prediction[idx]) for idx, label in enumerate(CLASS_NAMES)
    }
    predicted_stage = CLASS_NAMES[int(np.argmax(prediction))]

    return {
        "prediction": predicted_stage,
        "probabilities": probabilities,
        "explainability": None,  # Placeholder for Grad-CAM / saliency maps
    }
