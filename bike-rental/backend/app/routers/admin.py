from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_roles
from app.models import Bike, Booking, User
from app.schemas import AdminOverview, BikeOut, BookingOut, UserOut

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/overview", response_model=AdminOverview)
def admin_overview(
    db: Session = Depends(get_db), _: User = Depends(require_roles("admin"))
):
    users = db.query(User).order_by(User.id.asc()).all()
    bikes = db.query(Bike).order_by(Bike.id.asc()).all()
    bookings = db.query(Booking).order_by(Booking.created_at.desc()).all()
    return AdminOverview(
        users=[UserOut.model_validate(user) for user in users],
        bikes=[BikeOut.model_validate(bike) for bike in bikes],
        bookings=[BookingOut.model_validate(booking) for booking in bookings],
    )
