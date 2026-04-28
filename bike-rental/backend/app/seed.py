import hashlib
import hmac
from sqlalchemy.orm import Session

from app.models import Bike, User

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(password: str, password_hash: str) -> bool:
    return hmac.compare_digest(hash_password(password), password_hash)


def seed_initial_data(db: Session):
    def upsert_user(name: str, email: str, password: str, role: str) -> User:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(
                name=name,
                email=email,
                password_hash=hash_password(password),
                role=role,
            )
            db.add(user)
            return user

        # Keep demo credentials reliable for QA/testing environments.
        user.name = name
        user.password_hash = hash_password(password)
        user.role = role
        user.is_active = True
        return user

    admin = upsert_user("Admin User", "admin@bike.com", "admin123", "admin")
    owner = upsert_user("Owner User", "owner@bike.com", "owner123", "owner")
    customer = upsert_user("Customer User", "customer@bike.com", "customer123", "customer")

    db.commit()
    db.refresh(owner)

    if db.query(Bike).count() == 0:
        bikes = [
            Bike(name="City Cruiser", description="Comfortable bike for city rides.", price_per_day=12.0, is_available=True, owner_id=owner.id),
            Bike(name="Mountain Pro", description="Built for rough mountain terrain.", price_per_day=18.5, is_available=True, owner_id=owner.id),
            Bike(name="Road Sprint", description="Lightweight bike for fast road rides.", price_per_day=16.0, is_available=True, owner_id=owner.id),
            Bike(name="Weekend Hybrid", description="Hybrid bike for city and trail riding.", price_per_day=14.0, is_available=True, owner_id=owner.id),
            Bike(name="Eco Commuter", description="Simple daily commuter bicycle.", price_per_day=10.0, is_available=True, owner_id=owner.id),
            Bike(name="Trail Master", description="Strong frame for off-road trails.", price_per_day=19.0, is_available=True, owner_id=owner.id),
            Bike(name="Urban Fold", description="Foldable bike for easy storage.", price_per_day=13.5, is_available=True, owner_id=owner.id),
            Bike(name="Touring XL", description="Long distance touring bike.", price_per_day=17.0, is_available=True, owner_id=owner.id),
            Bike(name="Sunset Rider", description="Smooth casual ride for evenings.", price_per_day=11.5, is_available=True, owner_id=owner.id),
            Bike(name="Speedster 500", description="Fast road bike with modern geometry.", price_per_day=20.0, is_available=True, owner_id=owner.id),
        ]
        db.add_all(bikes)
        db.commit()
