from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


UserRole = Literal["student", "staff", "admin"]


class UserBase(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    email: EmailStr
    role: UserRole = "student"


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    email: EmailStr | None = None
    password: str | None = Field(default=None, min_length=8, max_length=128)
    role: UserRole | None = None


class UserInDB(UserBase):
    id: str
    password: str
    created_at: datetime


class UserResponse(BaseModel):
    id: str
    name: str | None = None
    email: EmailStr
    role: UserRole = "student"
    is_active: bool = True
    created_at: datetime
