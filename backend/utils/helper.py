import bcrypt
import os
from datetime import datetime, timedelta
import jwt

class Helper:
    @staticmethod
    def hash_data(data: str) -> str:
        """
        hashes strings.
        """
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
        """
        Generate a JWT token with user_id and role, expiring in `expires_in` seconds (default  4 hour).
        """
        secret_key = os.getenv("JWT_SECRET", "super-secret-key")  
        payload = {
            "sub": user_id,
            "role": role,
            "exp": datetime.utcnow() + timedelta(seconds=expires_in)
        }

        token = jwt.encode(payload, secret_key, algorithm="HS256")
        return token

