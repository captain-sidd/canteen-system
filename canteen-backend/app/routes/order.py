from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import get_current_admin, get_current_user
from app.database.mongodb import get_database
from app.schemas.order import OrderCreate, OrderResponse, OrderUpdateStatus
from app.services.order_service import create_order, get_order, list_user_orders, update_order_status


router = APIRouter()


@router.post("", response_model=OrderResponse, status_code=201)
async def place_order(
    payload: OrderCreate,
    current_user: dict = Depends(get_current_user),
) -> dict:
    return await create_order(get_database(), current_user["id"], payload)


@router.get("", response_model=list[OrderResponse])
async def my_orders(current_user: dict = Depends(get_current_user)) -> list[dict]:
    return await list_user_orders(get_database(), current_user["id"])


@router.get("/{order_id}", response_model=OrderResponse)
async def order_detail(
    order_id: str,
    current_user: dict = Depends(get_current_user),
) -> dict:
    order = await get_order(get_database(), order_id, current_user["id"])
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


@router.patch("/{order_id}/status", response_model=OrderResponse)
async def change_order_status(
    order_id: str,
    payload: OrderUpdateStatus,
    _: dict = Depends(get_current_admin),
) -> dict:
    return await update_order_status(get_database(), order_id, payload)
