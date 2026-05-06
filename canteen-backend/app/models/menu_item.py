from typing import Any

from app.models.base import now_utc


def create_menu_item_document(
    name: str,
    description: str | None,
    price: float,
    category: str,
    image_url: str | None = None,
    is_available: bool = True,
) -> dict[str, Any]:
    return {
        "name": name,
        "description": description,
        "price": price,
        "category": category,
        "image_url": image_url,
        "is_available": is_available,
        "created_at": now_utc(),
        "updated_at": now_utc(),
    }
