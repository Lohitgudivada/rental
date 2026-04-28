from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_roles
from app.models import Bike, Booking, User
from app.schemas import BookingCreate, BookingOut

router = APIRouter(prefix="/bookings", tags=["Bookings"])


def _serialize_booking(booking: Booking) -> BookingOut:
    return BookingOut(
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


@router.post("", response_model=BookingOut)
def book_bike(
    payload: BookingCreate,
    db: Session = Depends(get_db),
    customer: User = Depends(require_roles("customer", "admin")),
):
    bike = db.query(Bike).filter(Bike.id == payload.bike_id).first()
    if not bike:
        raise HTTPException(status_code=404, detail="Bike not found.")
    if payload.to_date < payload.from_date:
        raise HTTPException(status_code=400, detail="'to_date' must be on or after 'from_date'.")
    if payload.quantity > bike.quantity:
        raise HTTPException(status_code=400, detail="Requested quantity exceeds available stock.")
    if not bike.is_available or bike.quantity < 1:
        raise HTTPException(status_code=400, detail="Bike is not available.")

    rental_days = (payload.to_date - payload.from_date).days + 1
    total = rental_days * payload.quantity * bike.price_per_day
    booking = Booking(
        bike_id=bike.id,
        customer_id=customer.id,
        from_date=payload.from_date,
        to_date=payload.to_date,
        pickup_slot=payload.pickup_slot,
        quantity=payload.quantity,
        rental_days=rental_days,
        total_price=total,
    )
    bike.quantity -= payload.quantity
    bike.is_available = bike.quantity > 0
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return _serialize_booking(booking)


@router.get("", response_model=list[BookingOut])
def list_my_bookings(
    db: Session = Depends(get_db), current_user: User = Depends(require_roles("customer", "admin"))
):
    if current_user.role == "admin":
        bookings = db.query(Booking).order_by(Booking.created_at.desc()).all()
        return [_serialize_booking(booking) for booking in bookings]

    bookings = (
        db.query(Booking)
        .filter(Booking.customer_id == current_user.id)
        .order_by(Booking.created_at.desc())
        .all()
    )
    return [_serialize_booking(booking) for booking in bookings]


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
        bike.quantity += booking.quantity
        bike.is_available = bike.quantity > 0

    db.delete(booking)
    db.commit()
    return {"message": "Booking cancelled."}
