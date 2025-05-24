import bcrypt

class Helper:
    _SALT_ROUNDS = 13
    @staticmethod
    def hash_data(data: str) -> str:
        """
        hashes strings.
        """
        if not data:
            raise ValueError("Nothing to hash")

        salt = bcrypt.gensalt(_SALT_ROUNDS)
        hashed = bcrypt.hashpw(data.encode('utf-8'), salt)
        return hashed.decode('utf-8')

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

