from typing import Any

from app.models.base import now_utc


ORDER_STATUSES = {"pending", "preparing", "ready", "completed"}


def create_order_document(
    user_id: str,
    items: list[dict[str, Any]],
    total_amount: float,
    order_type: str,
    qr_code: str | None = None,
    payment_status: str = "pending",
) -> dict[str, Any]:
    return {
        "user_id": user_id,
        "items": items,
        "total_amount": total_amount,
        "status": "pending",
        "order_type": order_type,
        "qr_code": qr_code,
        "payment_status": payment_status,
        "created_at": now_utc(),
        "updated_at": now_utc(),
    }
