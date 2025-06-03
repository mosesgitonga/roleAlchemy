from fastapi import APIRouter, HTTPException, status, Request
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, EmailStr
from services.payment_service import Paystack
import os

class PaymentRequest(BaseModel):
    email: EmailStr
    plan: str
    currency: str

paymentRoute = APIRouter(
    prefix="/paystack",
    tags=["Payment"]
)

paystack = Paystack()

CALLBACK_URL = os.getenv("PAYSTACK_CALLBACK_URL")

@paymentRoute.post("/paystack/initiate", status_code=status.HTTP_200_OK)
async def initiate_payment(data: PaymentRequest):
    try:
        response = await paystack.initialize_transaction(
            email=data.email,
            plan=data.plan,
            currency=data.currency,
            callback_url=CALLBACK_URL
        )
        return {
            "status": "success",
            "message": f"Initialized {data.plan} plan",
            "authorization_url": response['data']['authorization_url']
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Payment initialization failed: {str(e)}")


@paymentRoute.get("/paystack/callback")
async def payment_callback(request: Request):
    reference = request.query_params.get("reference")

    if not reference:
        return HTMLResponse("Reference not provided", status_code=400)

    paystack = Paystack()
    result = await paystack.verify_transaction(reference)

    if result["data"]["status"] == "success":
        # Activate plan, store in DB, etc
        print(result["data"])
        return HTMLResponse("Payment successful. Welcome!")
    else:
        return HTMLResponse("Payment failed or incomplete.")