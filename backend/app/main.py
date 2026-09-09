from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base

import time
from sqlalchemy.exc import OperationalError

# Retry connecting to DB
max_retries = 5
for i in range(max_retries):
    try:
        Base.metadata.create_all(bind=engine)
        print("Database connected and tables created.")
        break
    except OperationalError as e:
        if i < max_retries - 1:
            print(f"Database not ready, retrying in 3 seconds... ({i+1}/{max_retries})")
            time.sleep(3)
        else:
            raise e

app = FastAPI(title="PMS API", description="Planning & Reporting System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.endpoints import router as api_router

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to PMS API"}
