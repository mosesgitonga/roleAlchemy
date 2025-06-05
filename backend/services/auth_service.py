from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import insert, select, update
from sqlalchemy.orm import Session
from uuid import uuid4
import re
import redis.asyncio as redis
import random
import os
import logging
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi.concurrency import run_in_threadpool
from email.message import EmailMessage
from aiosmtplib import SMTP
from sqlalchemy.ext.asyncio import create_async_engine

from utils.helper import Helper
from utils.logger import logger
from schema.schema import users, engine
import resend

load_dotenv()

# Initialize services
resend.api_key = os.getenv("RESEND_API_KEY")
redis_client = redis.Redis(host="localhost", port=6379, decode_responses=True)

class AuthService:
    def __init__(self, helper: Helper, engine):
        self.helper = helper
        self.engine = engine

    @staticmethod
    def is_valid_email(email: str) -> bool:
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(email_pattern, email) is not None

    @staticmethod
    def is_strong_password(password: str) -> tuple[bool, str]:
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        if not re.search(r"[A-Z]", password):
            return False, "Password must contain at least one uppercase letter"
        if not re.search(r"[a-z]", password):
            return False, "Password must contain at least one lowercase letter"
        if not re.search(r"\d", password):
            return False, "Password must contain at least one digit"
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            return False, "Password must contain at least one special character"
        return True, "Password is strong"

    def user_exists_by_email(self, session: Session, email: str) -> dict | None:
        try:
            result = session.execute(select(users).where(users.c.email == email)).first()
            return dict(result._mapping) if result else None
        except Exception as e:
            logger.warning(f"Unable to check if user exists: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")

    def create_user(self, session: Session, email: str, hashed_password: str, role: str = "jobSeeker") -> str:
        user_id = str(uuid4())
        session.execute(
            insert(users).values(
                id=user_id,
                email=email,
                password_hash=hashed_password,
                is_active=True,
                role=role,
            )
        )
        session.commit()
        return user_id

    def register(self, data: dict[str, str]) -> dict[str, str]:
        email, password = data.get("email"), data.get("password")

        if not email or not password:
            raise HTTPException(status_code=400, detail="Email and Password are required")
        if not self.is_valid_email(email):
            raise HTTPException(status_code=400, detail="Invalid email format")

        is_valid, message = self.is_strong_password(password)
        if not is_valid:
            raise HTTPException(status_code=400, detail=message)

        hashed_password = self.helper.hash_data(password)
        with Session(self.engine) as session:
            if self.user_exists_by_email(session, email):
                raise HTTPException(status_code=400, detail="User already exists")
            user_id = self.create_user(session, email, hashed_password)
            user = session.execute(select(users).where(users.c.id == user_id)).fetchone()

            access_token = self.helper.generate_jwt_token(user_id, "jobSeeker", user.is_email_verified)
            return {"access_token": access_token}

    def login(self, data: dict[str, str]) -> dict[str, str]:
        email, password = data.get('email'), data.get('password')

        if not email or not password:
            raise HTTPException(status_code=400, detail="Email or Password is missing")
        if not self.is_valid_email(email):
            raise HTTPException(status_code=400, detail="Invalid email format")

        with Session(self.engine) as session:

            user = self.user_exists_by_email(session, email)

            if not user or not self.helper.is_correct_password(user['password_hash'], password):
                raise HTTPException(status_code=404, detail="Invalid Email or Password")

            access_token = self.helper.generate_jwt_token(user['id'], user['role'], user['is_email_verified'])
            if not access_token:
                raise HTTPException(status_code=500, detail="Token generation failed")

            return {"access_token": access_token}

    def token(self, form_data: OAuth2PasswordRequestForm = Depends()) -> dict[str, str]:
        return self.login({"email": form_data.username, "password": form_data.password}) | {"token_type": "bearer"}

    async def generate_and_store_otp(self, email: str) -> dict:
        otp = ''.join(str(random.randint(0, 9)) for _ in range(6))
        try:
            await redis_client.set(email, otp, ex=900)
            return otp
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail="Internal Server Error")

    async def is_valid_otp(self, email: str, otp: str) -> bool:
        try:
            stored_otp = await redis_client.get(email)

            if stored_otp is None:
                return False

            return stored_otp == otp

        except Exception as e:
            logger.error(f"Unable to verify OTP: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")


    async def verify_email(self, user_id: str, otp: str) -> dict:
        try:
            with engine.begin() as conn:
                stmt = select(users).where(users.c.id == user_id)
                result = conn.execute(stmt)
                user = result.mappings().fetchone()
                
                if not user:
                    raise HTTPException(status_code=404, detail="User not found")
                
                email = user['email']
                
                if not await self.is_valid_otp(email, otp):
                    raise HTTPException(status_code=400, detail="Invalid or expired OTP")
                
                update_stmt = update(users).where(users.c.email == email).values(is_email_verified=True)
                conn.execute(update_stmt)
            
            await redis_client.delete(email)
            return {"status": "success", "message": "Email is varied"}

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Email verification failed: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Internal Server Error")

    @staticmethod
    async def send_email(email: str, otp_code: str) -> dict:
        message = EmailMessage()
        message["From"] = os.getenv("SMTP_FROM_EMAIL")
        message["To"] = email
        message["Subject"] = "Your OTP Code"
        message.set_content(f"Your OTP code is: {otp_code}")

        try:
            smtp = SMTP(hostname="smtp.gmail.com", port=587, start_tls=True)
            await smtp.connect()
            await smtp.login(os.getenv("SMTP_USERNAME"), os.getenv("SMTP_PASSWORD"))
            await smtp.send_message(message)
            await smtp.quit()
            return {"status": "success", "details": "Email sent via SMTP"}
        except Exception as e:
            return {"status": "failed", "error": str(e)}

    async def update_password(self, email: str, otp: str, new_password: str):
        is_valid, message = self.is_strong_password(new_password)
        if not is_valid:
            raise HTTPException(status_code=400, detail=message)

        saved_otp = await redis_client.get(email)  
        if saved_otp is None or saved_otp != otp:
            raise HTTPException(status_code=400, detail="Invalid or expired OTP")


        hashed_password = self.helper.hash_data(new_password)

        with engine.begin() as conn: 
            result = conn.execute(select(users).where(users.c.email == email))
            user = result.mappings().fetchone()

            if not user:
                raise HTTPException(status_code=404, detail="User not found")

            conn.execute(
                update(users).where(users.c.email == email).values(password_hash=hashed_password)
            )

        await redis_client.delete(email)

        return {"message": "Password updated successfully"}