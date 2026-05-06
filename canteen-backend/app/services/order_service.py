from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo import ReturnDocument

from app.models.base import ensure_object_id, now_utc, object_id_to_str
from app.models.order import ORDER_STATUSES, create_order_document
from app.schemas.order import OrderCreate, OrderUpdateStatus
from app.services.qr_service import build_order_qr_data, generate_qr_code_base64


def normalize_order_document(order: dict | None) -> dict | None:
    if order is None:
        return None

    order = object_id_to_str(order)
    order.setdefault("order_type", "dine_in")
    order.setdefault("payment_status", "pending")
    order.setdefault("qr_code", None)

    for item in order.get("items", []):
        if "price" not in item and "unit_price" in item:
            item["price"] = item["unit_price"]

    return order


async def build_order_items(db: AsyncIOMotorDatabase, payload: OrderCreate) -> tuple[list[dict], float]:
    order_items: list[dict] = []
    total_amount = 0.0

    for item in payload.items:
        try:
            menu_item_id = ensure_object_id(item.menu_item_id)
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid menu item id: {item.menu_item_id}",
            ) from exc

        menu_item = await db.menu_items.find_one({"_id": menu_item_id, "is_available": True})
        if menu_item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Menu item not found or unavailable: {item.menu_item_id}",
            )

        subtotal = float(menu_item["price"]) * item.quantity
        total_amount += subtotal
        order_items.append(
            {
                "menu_item_id": item.menu_item_id,
                "name": menu_item["name"],
                "price": float(menu_item["price"]),
                "quantity": item.quantity,
            }
        )

    return order_items, round(total_amount, 2)


async def create_order(db: AsyncIOMotorDatabase, user_id: str, payload: OrderCreate) -> dict:
    order_items, total_amount = await build_order_items(db, payload)
    document = create_order_document(
        user_id=user_id,
        items=order_items,
        total_amount=total_amount,
        order_type=payload.order_type,
        payment_status=payload.payment_status,
    )
    result = await db.orders.insert_one(document)
    created_order = object_id_to_str({**document, "_id": result.inserted_id})
    qr_data = build_order_qr_data(created_order["id"], user_id)
    created_order["qr_code"] = generate_qr_code_base64(qr_data)
    await db.orders.update_one({"_id": result.inserted_id}, {"$set": {"qr_code": created_order["qr_code"]}})
    return created_order


async def list_user_orders(db: AsyncIOMotorDatabase, user_id: str) -> list[dict]:
    cursor = db.orders.find({"user_id": user_id}).sort("created_at", -1)
    return [normalize_order_document(order) async for order in cursor]


async def get_order(db: AsyncIOMotorDatabase, order_id: str, user_id: str) -> dict | None:
    try:
        object_id = ensure_object_id(order_id)
    except ValueError:
        return None
    order = await db.orders.find_one({"_id": object_id, "user_id": user_id})
    return normalize_order_document(order)


async def update_order_status(db: AsyncIOMotorDatabase, order_id: str, payload: OrderUpdateStatus) -> dict:
    if payload.status not in ORDER_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid order status",
        )

    try:
        object_id = ensure_object_id(order_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid order id",
        ) from exc

    updated = await db.orders.find_one_and_update(
        {"_id": object_id},
        {"$set": {"status": payload.status, "updated_at": now_utc()}},
        return_document=ReturnDocument.AFTER,
    )
    if updated is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return normalize_order_document(updated)
