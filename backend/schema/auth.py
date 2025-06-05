from pydantic import BaseModel, EmailStr, Field

class RegisterRequest(BaseModel):
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., min_length=8, description="User's password")

class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., min_length=8, description="User's password")

class AuthResponse(BaseModel):
    access_token: str 
class SendOtpRequest(BaseModel):
    email: EmailStr

class verifyEmailRequest(BaseModel):
    otp: str

class forgotPasswordRequest(BaseModel):
    otp: str
    email: EmailStr
    new_password: str