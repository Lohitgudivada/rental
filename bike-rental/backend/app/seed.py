import hashlib
import hmac
from sqlalchemy.orm import Session

from app.models import Bike, User

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(password: str, password_hash: str) -> bool:
    return hmac.compare_digest(hash_password(password), password_hash)


def seed_initial_data(db: Session):
    admin = db.query(User).filter(User.email == "admin@bike.com").first()
    owner = db.query(User).filter(User.email == "owner@bike.com").first()
    customer = db.query(User).filter(User.email == "customer@bike.com").first()

    if not admin:
        admin = User(
            name="Admin User",
            email="admin@bike.com",
            password_hash=hash_password("admin123"),
            role="admin",
        )
        db.add(admin)

    if not owner:
        owner = User(
            name="Owner User",
            email="owner@bike.com",
            password_hash=hash_password("owner123"),
            role="owner",
        )
        db.add(owner)

    if not customer:
        customer = User(
            name="Customer User",
            email="customer@bike.com",
            password_hash=hash_password("customer123"),
            role="customer",
        )
        db.add(customer)

    db.commit()
    db.refresh(owner)

    if db.query(Bike).count() == 0:
        bikes = [
            Bike(name="City Cruiser", description="Comfortable bike for city rides.", price_per_day=12.0, is_available=True, image_url="https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80", quantity=5, owner_id=owner.id),
            Bike(name="Mountain Pro", description="Built for rough mountain terrain.", price_per_day=18.5, is_available=True, image_url="https://images.unsplash.com/photo-1571333250630-f0230c320b6d?auto=format&fit=crop&w=900&q=80", quantity=4, owner_id=owner.id),
            Bike(name="Road Sprint", description="Lightweight bike for fast road rides.", price_per_day=16.0, is_available=True, image_url="https://images.unsplash.com/photo-1486530555807-11f3b0f9cd5d?auto=format&fit=crop&w=900&q=80", quantity=6, owner_id=owner.id),
            Bike(name="Weekend Hybrid", description="Hybrid bike for city and trail riding.", price_per_day=14.0, is_available=True, image_url="https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=900&q=80", quantity=5, owner_id=owner.id),
            Bike(name="Eco Commuter", description="Simple daily commuter bicycle.", price_per_day=10.0, is_available=True, image_url="https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=900&q=80", quantity=8, owner_id=owner.id),
            Bike(name="Trail Master", description="Strong frame for off-road trails.", price_per_day=19.0, is_available=True, image_url="https://images.unsplash.com/photo-1519583272095-6433daf26b6e?auto=format&fit=crop&w=900&q=80", quantity=3, owner_id=owner.id),
            Bike(name="Urban Fold", description="Foldable bike for easy storage.", price_per_day=13.5, is_available=True, image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80", quantity=4, owner_id=owner.id),
            Bike(name="Touring XL", description="Long distance touring bike.", price_per_day=17.0, is_available=True, image_url="https://images.unsplash.com/photo-1559348349-86f1f65817fe?auto=format&fit=crop&w=900&q=80", quantity=4, owner_id=owner.id),
            Bike(name="Sunset Rider", description="Smooth casual ride for evenings.", price_per_day=11.5, is_available=True, image_url="https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=900&q=80", quantity=7, owner_id=owner.id),
            Bike(name="Speedster 500", description="Fast road bike with modern geometry.", price_per_day=20.0, is_available=True, image_url="https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?auto=format&fit=crop&w=900&q=80", quantity=2, owner_id=owner.id),
        ]
        db.add_all(bikes)
        db.commit()
