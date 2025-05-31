from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt  # ✅ Use only this
import bcrypt
import os
from datetime import datetime, timedelta

class Helper:
    def __init__(self):
        self.oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

    @staticmethod
    def hash_data(data: str) -> str:
        if not data:
            raise ValueError("Nothing to hash")
        salt = bcrypt.gensalt(13)
        hashed = bcrypt.hashpw(data.encode('utf-8'), salt)
        return hashed.decode('utf-8')

    @staticmethod
    def is_correct_password(hashed_password: str, plain_password: str) -> bool:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

    @staticmethod
    def generate_jwt_token(user_id: str, role: str, expires_in: int = 3600 * 4) -> str:
        secret_key = os.getenv("JWT_SECRET", "super-secret-key")
        payload = {
            "user_id": user_id,
            "role": role,
            "exp": datetime.utcnow() + timedelta(seconds=expires_in)
        }
        return jwt.encode(payload, secret_key, algorithm="HS256")

    def get_current_user_id(self, token: str = Depends(OAuth2PasswordBearer(tokenUrl="auth/token"))) -> str:
        try:
            secret_key = os.getenv("JWT_SECRET", "super-secret-key")
            payload = jwt.decode(token, secret_key, algorithms=["HS256"])
            user_id: str = payload.get("user_id")  
            if user_id is None:
                raise ValueError("Missing user id in token")
            return user_id
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
