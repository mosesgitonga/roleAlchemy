from fastapi import APIRouter, Depends, HTTPException
from fastapi.requests import Request 
from fastapi.responses import JSONResponse
from starlette.status import HTTP_200_OK, HTTP_201_CREATED
from utils.helper import Helper, email_verified_required
from schema.schema import engine
from services.auth_service import AuthService
from schema.auth import RegisterRequest, LoginRequest, SendOtpRequest, verifyEmailRequest, forgotPasswordRequest
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)
helper = Helper()

def get_auth_service():
    return AuthService(helper, engine)

@router.post("/register")
def register_user(data: RegisterRequest, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.register(data.dict())

@router.post("/login")
def login_user(data: LoginRequest, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.login(data.dict())

@router.post("/token")
def token(auth_service: AuthService = Depends(get_auth_service), form_data: OAuth2PasswordRequestForm = Depends()):
    return auth_service.token(form_data)

@router.post("/send-otp")
async def send_otp(data: SendOtpRequest, auth_service: AuthService = Depends(get_auth_service)):
    try:
        otp = await auth_service.generate_and_store_otp(data.email)
        result = await auth_service.send_email(email=data.email, otp_code=otp)
        print("res: ", result)

        if result.get("status") == "success":
            return JSONResponse(content={"message": "OTP sent successfully"}, status_code=HTTP_200_OK)
        else:
            raise HTTPException(status_code=500, detail="Failed to send OTP")
    except Exception as e:
        print("unable to send otp: ", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post('/verify-otp')
async def email_verification(data: verifyEmailRequest, auth_service: AuthService = Depends(get_auth_service), user_id: str = Depends(Helper().get_current_user_id)):
    token = await auth_service.verify_email(user_id, data.otp)
    return token

@router.post('/update-password')
async def updatePassword(data: forgotPasswordRequest, auth_service: AuthService = Depends(get_auth_service)):
    result = await auth_service.update_password(data.email, data.otp, data.new_password)
    return result 