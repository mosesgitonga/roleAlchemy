from fastapi import Depends, HTTPException, status, Request 
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt  
import bcrypt
import os
from datetime import datetime, timedelta
from sqlalchemy import insert, select
import uuid
from functools import wraps
from schema.schema import engine, users, payments, subscriptions
from starlette.status import HTTP_403_FORBIDDEN 
from sqlalchemy.orm import Session



class Helper:
    def __init__(self):
        self.oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
        self.engine = engine

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
    def generate_jwt_token(user, expires_in: int = 3600 * 4) -> str:
        secret_key = os.getenv("JWT_SECRET", "super-secret-key")
        payload = {
            "user": user,
            "exp": datetime.utcnow() + timedelta(seconds=expires_in)
        }
        return jwt.encode(payload, secret_key, algorithm="HS256")

    def get_current_user_id(self, token: str = Depends(OAuth2PasswordBearer(tokenUrl="auth/token"))) -> str:
        try:
            secret_key = os.getenv("JWT_SECRET", "super-secret-key")
            payload = jwt.decode(token, secret_key, algorithms=["HS256"])
            user = payload.get("user")
            user_id = user.get("user_id") if user else None
            if user_id is None:
                raise ValueError("Missing user id in token")
            return user_id
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )

    def activate_subscription(self, user_id: str, plan_type: str, payments_id: str):
        """
        Activates a user's subscription by inserting a record into the subscriptions table.
        """
        # Set duration based on plan
        start_date = datetime.utcnow()

        if plan_type == "daily":
            expiry_date = start_date + timedelta(days=1)
        elif plan_type == "weekly":
            expiry_date = start_date + timedelta(weeks=1)
        elif plan_type == "monthly":
            expiry_date = start_date + timedelta(days=30)
        else:
            raise ValueError("Invalid plan type for activation")

        with engine.begin() as conn:
            conn.execute(
                insert(subscriptions),
                {
                    "id": str(uuid.uuid4()),
                    "user_id": user_id,
                    "payments_id": payments_id,
                    "plan_type": plan_type,
                    "start_date": start_date,
                    "expiry_date": expiry_date
                }
            )

    def is_email_verified(self, session: Session, email: str) -> bool:
        user = session.execute(select(users).where(users.c.email == email)).fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="Email not found")
        return user.is_email_verified is True

def email_verified_required(helper_instance: Helper):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            request: Request = kwargs.get("request") or next(
                (arg for arg in args if isinstance(arg, Request)), None
            )

            if not request:
                raise RuntimeError("Request object not found")

            user_id = helper_instance.get_current_user_id(request)

            with helper_instance.engine.connect() as conn:
                result = conn.execute(select(users).where(users.c.id == user_id)).fetchone()

                if not result:
                    raise HTTPException(status_code=404, detail="User not found")

                if not result["is_email_verified"]:
                    raise HTTPException(
                        status_code=HTTP_403_FORBIDDEN,
                        detail="Email not verified. Please verify your email to continue."
                    )

            return await func(*args, **kwargs)
        return wrapper
    return decorator
