from pydantic import BaseModel, Field


class ComboBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    items: list[str] = Field(min_length=1)
    combo_price: float = Field(gt=0)
    is_available: bool = True


class ComboCreate(ComboBase):
    pass


class ComboUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    items: list[str] | None = Field(default=None, min_length=1)
    combo_price: float | None = Field(default=None, gt=0)
    is_available: bool | None = None


class ComboResponse(ComboBase):
    id: str
