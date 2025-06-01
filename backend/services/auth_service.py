from fastapi import HTTPException, Depends 
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import insert, select
from sqlalchemy.orm import Session
from uuid import uuid4
import uuid
import re

from utils.helper import Helper
from utils.logger import logger
from schema.schema import users, engine


class AuthService:
    def __init__(self, helper: Helper, engine):
        self.helper = helper
        self.engine = engine

    def user_exists_by_email(self, session: Session, email: str) -> dict | None:
        try:
            query = select(users).where(users.c.email == email)
            result = session.execute(query).first()
            return dict(result._mapping) if result else None
        except Exception as e:
            logger.warning(f"Unable to check if user exists: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")

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

    @staticmethod
    def is_valid_email(email: str) -> bool:
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(email_pattern, email))

    def register(self, data: dict[str, str]) -> dict[str, str]:
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            logger.warning("Email and password are required")
            raise HTTPException(status_code=400, detail="Email and Password are required")

        if not self.is_valid_email(email):
            logger.warning("Invalid email format")
            raise HTTPException(status_code=400, detail="Invalid email format")

        is_valid, message = self.is_strong_password(password)
        if not is_valid:
            logger.warning(f"Password validation failed: {message}")
            raise HTTPException(status_code=400, detail=message)

        hashed_password = self.helper.hash_data(password)
        user_id = str(uuid4())
        user_role = "jobSeeker"

        try:
            with Session(self.engine) as session:
                if self.user_exists_by_email(session, email):
                    logger.warning("Failure: Attempt to register an existing email")
                    raise HTTPException(status_code=400, detail="User already exists")

                session.execute(
                    insert(users).values(
                        id=user_id,
                        email=email,
                        password_hash=hashed_password,
                        is_active=True,
                        role=user_role,
                    )
                )
                session.commit()

                access_token = self.helper.generate_jwt_token(user_id, user_role)
                logger.info(f"User {email} registered successfully with id {user_id}")

                return {"access_token": access_token}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error during Registration: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Internal Server Error")

    def login(self, data: dict[str, str]) -> dict[str, str]:
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            logger.warning("Email or password is missing")
            raise HTTPException(status_code=400, detail="Email or Password is missing")

        if not self.is_valid_email(email):
            logger.warning("Invalid email format")
            raise HTTPException(status_code=400, detail="Invalid email format")

        try:
            with Session(self.engine) as session:
                existing_user = self.user_exists_by_email(session, email)
                if not existing_user:
                    logger.debug("Invalid Email")
                    raise HTTPException(status_code=404, detail="Invalid Email or Password")

                hashed_password = existing_user['password_hash']
                if not self.helper.is_correct_password(hashed_password, password):
                    logger.info("Invalid password")
                    raise HTTPException(status_code=404, detail="Invalid Email or Password")

                access_token = self.helper.generate_jwt_token(existing_user['id'], existing_user['role'])
                if not access_token:
                    logger.error("Access token was not generated")
                    raise HTTPException(status_code=500, detail="Token generation failed")

                return {"access_token": access_token}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error Logging in: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Internal Server Error")

    def token(self, form_data: OAuth2PasswordRequestForm = Depends()) -> dict[str, str]:
        email = form_data.username
        password = form_data.password

        if not email or not password:
            logger.warning("Email or password is missing")
            raise HTTPException(status_code=400, detail="Email or Password is missing")

        if not self.is_valid_email(email):
            logger.warning("Invalid email format")
            raise HTTPException(status_code=400, detail="Invalid email format")

        try:
            with Session(self.engine) as session:
                existing_user = self.user_exists_by_email(session, email)
                if not existing_user:
                    logger.debug("Invalid Email")
                    raise HTTPException(status_code=404, detail="Invalid Email or Password")

                hashed_password = existing_user['password_hash']
                if not self.helper.is_correct_password(hashed_password, password):
                    logger.info("Invalid password")
                    raise HTTPException(status_code=404, detail="Invalid Email or Password")

                access_token = self.helper.generate_jwt_token(existing_user['id'], existing_user['role'])
                if not access_token:
                    logger.error("Access token was not generated")
                    raise HTTPException(status_code=500, detail="Token generation failed")

                return {
                    "access_token": access_token,
                    "token_type": "bearer"  
                }
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error Logging in: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Internal Server Error")
