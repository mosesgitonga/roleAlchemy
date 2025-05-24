import requests 
from fastapi import HTTPException
from utils.helper import Helper



class AuthService:
    def __init__(self, helper: Helper):
        self.helper = helper

    def register(self, data: dict[str, str]) -> dict[str, str]:
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            raise HTTPException(status_code = 400, detail="Email and Password is required")
    
        hashed_password = self.helper.hash_data(password)

        

