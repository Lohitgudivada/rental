from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=4)


class LoginResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str


class SignupRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)
    role: str = Field(pattern="^(owner|customer)$")


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
    is_available: bool = True


class BikeOut(BaseModel):
    id: int
    name: str
    description: str
    price_per_day: float
    is_available: bool
    owner_id: int

    class Config:
        from_attributes = True


class BookingCreate(BaseModel):
    bike_id: int
    days: int = Field(ge=1, le=30)


class BookingOut(BaseModel):
    id: int
    bike_id: int
    customer_id: int
    days: int
    total_price: float
    created_at: datetime

    class Config:
        from_attributes = True


class AdminOverview(BaseModel):
    users: list[UserOut]
    bikes: list[BikeOut]
    bookings: list[BookingOut]
