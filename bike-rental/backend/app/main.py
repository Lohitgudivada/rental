from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, SessionLocal, engine
from app.routers import admin, auth, bikes, bookings
from app.seed import seed_initial_data

app = FastAPI(title="Bike Rental API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_initial_data(db)
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Bike Rental API is running."}


app.include_router(auth.router)
app.include_router(bikes.router)
app.include_router(bookings.router)
app.include_router(admin.router)
