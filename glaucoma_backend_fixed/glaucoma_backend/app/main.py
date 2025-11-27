from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import patients
from app.predictions import routes_predictions as pred_routes
from app.auth import routes_auth as auth_routes
from app.routers import support as support_routes

from app.database import Base, engine
from app import models


app = FastAPI(title="Glaucoma XAI Backend")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# ------------ ROUTES REGISTERED HERE ------------
app.include_router(auth_routes.router)               # /api/auth/...
app.include_router(pred_routes.router)               # /api/predictions/...
app.include_router(patients.router)                  # /api/patients/...
app.include_router(support_routes.router, prefix="/api")  # /api/support-tickets
# ------------------------------------------------


@app.get("/ping")
def ping():
    return {"status": "ok", "msg": "Backend running successfully"}
