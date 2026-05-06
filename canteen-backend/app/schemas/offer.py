from datetime import datetime

from pydantic import BaseModel, Field


class OfferBase(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    discount_percentage: float = Field(gt=0, le=100)
    valid_till: datetime
    is_active: bool = True


class OfferCreate(OfferBase):
    pass


class OfferUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=120)
    discount_percentage: float | None = Field(default=None, gt=0, le=100)
    valid_till: datetime | None = None
    is_active: bool | None = None


class OfferResponse(OfferBase):
    id: str
