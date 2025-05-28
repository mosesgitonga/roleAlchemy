from fastapi import APIRouter, Depends, HTTPException
from fastapi.requests import Request
from starlette.status import HTTP_200_OK, HTTP_201_CREATED
from utils.helper import Helper
from schema.schema import engine
from services.auth_service import AuthService
from schema.auth import RegisterRequest, LoginRequest

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

def get_auth_service():
    helper = Helper()
    return AuthService(helper, engine)

@router.post("/register")
def register_user(data: RegisterRequest, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.register(data.dict())

@router.post("/login")
def login_user(data: LoginRequest, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.login(data.dict())

