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
    def generate_jwt_token(role, ):

