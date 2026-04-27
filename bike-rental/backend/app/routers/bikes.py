from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_roles
from app.models import Bike, User
from app.schemas import BikeCreate, BikeOut

router = APIRouter(prefix="/bikes", tags=["Bikes"])


@router.post("", response_model=BikeOut)
def add_bike(
    payload: BikeCreate,
    db: Session = Depends(get_db),
    owner: User = Depends(require_roles("owner", "admin")),
):
    bike = Bike(
        name=payload.name,
        description=payload.description,
        price_per_day=payload.price_per_day,
        is_available=payload.is_available,
        owner_id=owner.id,
    )
    db.add(bike)
    db.commit()
    db.refresh(bike)
    return bike


@router.get("", response_model=list[BikeOut])
def list_bikes(available_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(Bike)
    if available_only:
        query = query.filter(Bike.is_available.is_(True))
    return query.order_by(Bike.id.asc()).all()


@router.delete("/{bike_id}")
def delete_bike(
    bike_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("owner", "admin")),
):
    bike = db.query(Bike).filter(Bike.id == bike_id).first()
    if not bike:
        raise HTTPException(status_code=404, detail="Bike not found.")

    if current_user.role == "owner" and bike.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can delete only your own bikes.")

    db.delete(bike)
    db.commit()
    return {"message": "Bike deleted."}
