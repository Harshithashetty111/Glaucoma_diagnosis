# For now a dummy prediction output
# Later replace with your real Deep Learning model.

def predict_glaucoma(image_path: str):
    return {
        "stage": "early",  
        "probabilities": {
            "normal": 0.10,
            "early": 0.70,
            "advanced": 0.20,
        },
        "heatmap_url": None  # Later we will return Grad-CAM or saliency map
    }
