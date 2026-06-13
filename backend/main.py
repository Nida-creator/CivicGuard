from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analyze

app = FastAPI(title="CivicGuard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "CivicGuard API"}

@app.get("/")
def root():
    return {"message": "CivicGuard API is running", "docs": "/docs"}
