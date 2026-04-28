import os
from urllib.parse import quote

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
    if not DATABASE_URL.startswith("postgresql"):
        raise RuntimeError("DATABASE_URL must use a PostgreSQL connection string.")
    normalized_url = DATABASE_URL
    # Accept passwords containing "@" in local .env by safely encoding it.
    if normalized_url.count("@") > 1:
        scheme, remainder = normalized_url.split("://", maxsplit=1)
        authority, *path_parts = remainder.split("/", maxsplit=1)
        userinfo, hostinfo = authority.rsplit("@", maxsplit=1)
        if ":" in userinfo:
            username, raw_password = userinfo.split(":", maxsplit=1)
            encoded_password = quote(raw_password, safe="")
            authority = f"{username}:{encoded_password}@{hostinfo}"
            path = f"/{path_parts[0]}" if path_parts else ""
            normalized_url = f"{scheme}://{authority}{path}"
    engine = create_engine(normalized_url)
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return engine


def build_fallback_engine():
    return create_engine(
        SQLITE_FALLBACK_URL,
        connect_args={"check_same_thread": False},
    )


engine = build_fallback_engine() if ENABLE_SQLITE_FALLBACK else _build_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
