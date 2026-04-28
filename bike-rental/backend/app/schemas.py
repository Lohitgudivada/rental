from datetime import date, datetime

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=4)


class LoginResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    is_active: bool

    class Config:
        from_attributes = True


class BikeCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    description: str = Field(min_length=5, max_length=500)
    price_per_day: float = Field(gt=0)
    image_url: str = Field(min_length=5, max_length=255)
    quantity: int = Field(ge=1, le=100)
    is_available: bool = True


class BikeOut(BaseModel):
    id: int
    name: str
    description: str
    price_per_day: float
    is_available: bool
    image_url: str
    quantity: int
    owner_id: int

    class Config:
        from_attributes = True


class BookingCreate(BaseModel):
    bike_id: int
    from_date: date
    to_date: date
    pickup_slot: str = Field(min_length=3, max_length=50)
    quantity: int = Field(ge=1, le=10)


class BookingOut(BaseModel):
    id: int
    bike_id: int
    bike_name: str
    bike_image_url: str
    customer_id: int
    customer_name: str
    from_date: date
    to_date: date
    pickup_slot: str
    quantity: int
    rental_days: int
    total_price: float
    created_at: datetime

    class Config:
        from_attributes = True


class AdminOverview(BaseModel):
    users: list[UserOut]
    bikes: list[BikeOut]
    bookings: list[BookingOut]
