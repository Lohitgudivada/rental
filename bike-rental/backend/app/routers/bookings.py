from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_roles
from app.models import Bike, Booking, User
from app.schemas import BookingCreate, BookingOut

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("", response_model=BookingOut)
def book_bike(
    payload: BookingCreate,
    db: Session = Depends(get_db),
    customer: User = Depends(require_roles("customer", "admin")),
):
    bike = db.query(Bike).filter(Bike.id == payload.bike_id).first()
    if not bike:
        raise HTTPException(status_code=404, detail="Bike not found.")
    if not bike.is_available:
        raise HTTPException(status_code=400, detail="Bike is not available.")

    total = payload.days * bike.price_per_day
    booking = Booking(
        bike_id=bike.id, customer_id=customer.id, days=payload.days, total_price=total
    )
    bike.is_available = False
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("", response_model=list[BookingOut])
def list_my_bookings(
    db: Session = Depends(get_db), current_user: User = Depends(require_roles("customer", "admin"))
):
    if current_user.role == "admin":
        return db.query(Booking).order_by(Booking.created_at.desc()).all()

    return (
        db.query(Booking)
        .filter(Booking.customer_id == current_user.id)
        .order_by(Booking.created_at.desc())
        .all()
    )


@router.delete("/{booking_id}")
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("customer", "admin")),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")

    if current_user.role == "customer" and booking.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can cancel only your own bookings.")

    bike = db.query(Bike).filter(Bike.id == booking.bike_id).first()
    if bike:
        bike.is_available = True

    db.delete(booking)
    db.commit()
    return {"message": "Booking cancelled."}
