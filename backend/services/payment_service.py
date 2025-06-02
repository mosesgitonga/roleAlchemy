import httpx
import os

class Paystack:
    def __init__(self):
        self.PAYSTACK_SECRET_KEY = os.getenv("PAYSTACK_SECRET_KEY")
        self.headers = {
            "Authorization": f"Bearer {self.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        self.base_url = "https://api.paystack.co"

    async def initialize_transaction(self, email: str, amount: int, callback_url: str):
        """
        Initialize a Paystack transaction for Card and Mobile Money (Mpesa)
        amount should be in the smallest currency unit (kobo for KES).
        """
        url = f"{self.base_url}/transaction/initialize"
        data = {
            "email": email,
            "amount": amount,
            "callback_url": callback_url,
            "channels": ["card", "mobile_money"]
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data, headers=self.headers)
            response.raise_for_status()  
            return response.json()

    async def verify_transaction(self, reference: str):
        """
        Verify the transaction status by reference
        """
        url = f"{self.base_url}/transaction/verify/{reference}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
