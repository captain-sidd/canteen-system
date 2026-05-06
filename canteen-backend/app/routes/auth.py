from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.database.mongodb import get_database
from app.models.user import user_public_fields
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserResponse
from app.services.auth_service import authenticate_user, register_user


router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(payload: RegisterRequest) -> TokenResponse:
    return await register_user(get_database(), payload)


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest) -> TokenResponse:
    return await authenticate_user(get_database(), payload)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)) -> dict:
    return user_public_fields(current_user)
