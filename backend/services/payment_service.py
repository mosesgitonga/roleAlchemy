import httpx
import os

PRICING = {
    "KES": {"daily": 100, "weekly": 500, "monthly": 1500},   
    "NGN": {"daily": 200, "weekly": 1000, "monthly": 2000},  
    "GHS": {"daily": 2, "weekly": 10, "monthly": 20},      
    "ZAR": {"daily": 5, "weekly": 25, "monthly": 50},       
    "USD": {"daily": 1, "weekly": 4, "monthly": 8}           
}
CURRENCIES_NO_MULTIPLY = {"JPY", "KRW", "CLP"}


class Paystack:
    def __init__(self):
        self.PAYSTACK_SECRET_KEY = os.getenv("PAYSTACK_SECRET_KEY")
        self.headers = {
            "Authorization": f"Bearer {self.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        self.base_url = "https://api.paystack.co"

    def get_amount(self, plan: str, currency: str) -> int:
        currency = currency.upper()
        plan = plan.lower()

        if currency not in PRICING or plan not in PRICING[currency]:
            raise ValueError("Invalid plan or unsupported currency")

        amount = PRICING[currency][plan]
        return amount if currency in CURRENCIES_NO_MULTIPLY else amount * 100

    async def initialize_transaction(self, email: str, plan: str, currency: str, callback_url: str):
        url = f"{self.base_url}/transaction/initialize"
        amount = self.get_amount(plan, currency)

        data = {
            "email": email,
            "amount": amount,
            "callback_url": callback_url,
            "channels": ["card", "mobile_money"],
            "currency": currency.upper()
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data, headers=self.headers)
            response.raise_for_status()
            print(response.json())
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
