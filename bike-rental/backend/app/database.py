import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/bike_rental_db",
)

SQLITE_FALLBACK_URL = "sqlite:///./bike_rental.db"


def _build_engine():
    primary_engine = create_engine(DATABASE_URL)
    try:
        with primary_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return primary_engine
    except OperationalError:
        # Local development fallback when PostgreSQL credentials are not valid.
        return create_engine(
            SQLITE_FALLBACK_URL,
            connect_args={"check_same_thread": False},
        )


engine = _build_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
