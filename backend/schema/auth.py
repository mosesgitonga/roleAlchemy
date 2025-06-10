from pydantic import BaseModel, EmailStr, Field, constr

class RegisterRequest(BaseModel):
    email: EmailStr = Field(..., description="User's email address")
    password: constr(min_length=8)

class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description="User's email address")
    password: constr(min_length=8)

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