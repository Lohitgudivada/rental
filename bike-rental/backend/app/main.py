from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

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


def apply_schema_updates():
    with engine.begin() as conn:
        conn.execute(
            text(
                "ALTER TABLE bikes ADD COLUMN IF NOT EXISTS image_url VARCHAR(255) NOT NULL DEFAULT '';"
            )
        )
        conn.execute(
            text(
                "ALTER TABLE bikes ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;"
            )
        )
        conn.execute(
            text(
                "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS from_date DATE;"
            )
        )
        conn.execute(
            text(
                "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS to_date DATE;"
            )
        )
        conn.execute(
            text(
                "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS pickup_slot VARCHAR(50);"
            )
        )
        conn.execute(
            text(
                "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;"
            )
        )
        conn.execute(
            text(
                "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS rental_days INTEGER;"
            )
        )


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    apply_schema_updates()
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
