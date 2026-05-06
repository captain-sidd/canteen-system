from typing import Any


def create_combo_document(
    name: str,
    items: list[str],
    combo_price: float,
    is_available: bool = True,
) -> dict[str, Any]:
    return {
        "name": name,
        "items": items,
        "combo_price": combo_price,
        "is_available": is_available,
    }
