# Bike Rental (Full Stack)

Beginner-friendly full stack app using:
- Frontend: React + Vite + Material UI
- Backend: FastAPI + SQLAlchemy + Pydantic
- Database: PostgreSQL (with local SQLite fallback if PostgreSQL auth fails)

## Project Structure

- `frontend` - React UI
- `backend` - FastAPI REST API

## 1) PostgreSQL Setup (Recommended)

Open your PostgreSQL shell (`psql`) and run:

```sql
CREATE DATABASE bike_rental_db;
```

Then set your real password in `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/bike_rental_db
```

You can copy from `backend/.env.example`.

## 2) Run Backend

From `backend`:

```powershell
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

Backend URL: `http://127.0.0.1:8000`

## 3) Run Frontend

From `frontend`:

```powershell
npm run dev
```

Frontend URL: `http://localhost:5173`

## Seeded Login Users

- Admin: `admin@bike.com` / `admin123`
- Owner: `owner@bike.com` / `owner123`
- Customer: `customer@bike.com` / `customer123`

## API Routes

- `POST /auth/login`
- `POST /bikes`
- `GET /bikes`
- `POST /bookings`
- `GET /admin/overview`

## Notes

- If PostgreSQL login fails, backend automatically falls back to `SQLite` (`backend/bike_rental.db`) so you can still run locally.
- To force PostgreSQL only, set valid `DATABASE_URL` and keep PostgreSQL running.
