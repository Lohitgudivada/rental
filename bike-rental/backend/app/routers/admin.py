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
        bookings=[
            BookingOut(
                id=booking.id,
                bike_id=booking.bike_id,
                bike_name=booking.bike.name if booking.bike else "Unknown Bike",
                bike_image_url=booking.bike.image_url if booking.bike else "",
                customer_id=booking.customer_id,
                customer_name=booking.customer.name if booking.customer else "Unknown Customer",
                from_date=booking.from_date,
                to_date=booking.to_date,
                pickup_slot=booking.pickup_slot,
                quantity=booking.quantity,
                rental_days=booking.rental_days,
                total_price=booking.total_price,
                created_at=booking.created_at,
            )
            for booking in bookings
        ],
    )
