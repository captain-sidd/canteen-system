from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


OrderStatus = Literal["pending", "preparing", "ready", "completed"]
OrderType = Literal["dine_in", "takeaway"]
PaymentStatus = Literal["pending", "paid", "failed", "refunded"]


class OrderItemCreate(BaseModel):
    menu_item_id: str
    quantity: int = Field(gt=0)


class OrderItemResponse(BaseModel):
    menu_item_id: str
    name: str
    price: float = Field(gt=0)
    quantity: int


class OrderCreate(BaseModel):
    items: list[OrderItemCreate] = Field(min_length=1)
    order_type: OrderType = "dine_in"
    payment_status: PaymentStatus = "pending"


class OrderUpdateStatus(BaseModel):
    status: OrderStatus


class OrderResponse(BaseModel):
    id: str
    user_id: str
    items: list[OrderItemResponse]
    total_amount: float
    status: OrderStatus
    order_type: OrderType
    qr_code: str | None = None
    payment_status: PaymentStatus
    created_at: datetime
    updated_at: datetime


class QRCodeResponse(BaseModel):
    data: str
    qr_code_base64: str


class QRVerifyRequest(BaseModel):
    data: str = Field(min_length=1)


class QRVerifyResponse(BaseModel):
    order: OrderResponse
    message: str = "Order marked as completed"
