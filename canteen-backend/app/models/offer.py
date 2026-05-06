from datetime import datetime
from typing import Any


def create_offer_document(
    title: str,
    discount_percentage: float,
    valid_till: datetime,
    is_active: bool = True,
) -> dict[str, Any]:
    return {
        "title": title,
        "discount_percentage": discount_percentage,
        "valid_till": valid_till,
        "is_active": is_active,
    }
