from datetime import datetime
from typing import Any

from app.models.base import now_utc


def create_user_document(
    email: str,
    password: str,
    name: str | None = None,
    role: str = "student",
) -> dict[str, Any]:
    return {
        "name": name,
        "email": email.lower(),
        "password": password,
        "role": role,
        "is_active": True,
        "created_at": now_utc(),
        "updated_at": now_utc(),
    }


def user_public_fields(user: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": user["id"],
        "name": user.get("name") or user.get("full_name"),
        "email": user["email"],
        "role": user.get("role", "student"),
        "is_active": user.get("is_active", True),
        "created_at": user.get("created_at", datetime.utcnow()),
    }
