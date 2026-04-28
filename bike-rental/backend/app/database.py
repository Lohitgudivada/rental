import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/bike_rental_db",
)

SQLITE_FALLBACK_URL = "sqlite:///./bike_rental.db"
ENABLE_SQLITE_FALLBACK = os.getenv("ENABLE_SQLITE_FALLBACK", "false").lower() == "true"


def _build_engine():
    primary_engine = create_engine(DATABASE_URL)
    with primary_engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return primary_engine


def build_fallback_engine():
    return create_engine(
        SQLITE_FALLBACK_URL,
        connect_args={"check_same_thread": False},
    )


engine = build_fallback_engine() if ENABLE_SQLITE_FALLBACK else _build_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
