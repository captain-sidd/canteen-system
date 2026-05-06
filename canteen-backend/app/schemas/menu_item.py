from datetime import datetime

from pydantic import BaseModel, Field, HttpUrl


class MenuItemBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=500)
    price: float = Field(gt=0)
    category: str = Field(min_length=1, max_length=80)
    image_url: HttpUrl | None = None
    is_available: bool = True


class MenuItemCreate(MenuItemBase):
    pass


class MenuItemUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=500)
    price: float | None = Field(default=None, gt=0)
    category: str | None = Field(default=None, min_length=1, max_length=80)
    image_url: HttpUrl | None = None
    is_available: bool | None = None


class MenuItemResponse(MenuItemBase):
    id: str
    created_at: datetime
    updated_at: datetime
