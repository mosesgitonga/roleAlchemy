from fastapi import (
    APIRouter, HTTPException, status, Request,
    Header, Depends
)
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
from services.payment_service import Paystack
from utils.helper import Helper
from schema.schema import engine, users, payments
from sqlalchemy import insert
from datetime import datetime
import os, hmac, hashlib, uuid, logging

CALLBACK_URL = os.getenv("PAYSTACK_CALLBACK_URL")
SECRET_KEY = os.getenv("PAYSTACK_SECRET_KEY", "").encode()
VALID_PLANS = {"daily", "weekly", "monthly"}  

paystack = Paystack()
helper = Helper()
logger = logging.getLogger(__name__)

class PaymentRequest(BaseModel):
    plan: str
    currency: str

paymentRoute = APIRouter(
    prefix="/paystack",
    tags=["Payment"]
)

@paymentRoute.post("/initiate", status_code=status.HTTP_200_OK)
async def initiate_payment(
    data: PaymentRequest,
    user_id: str = Depends(helper.get_current_user_id)
):
    """
    Initiates a Paystack transaction with the user's email, plan, and currency.
    """
    if data.plan.lower() not in VALID_PLANS:
        raise HTTPException(status_code=400, detail="Invalid data plan")

    try:
        with engine.connect() as conn:
            user = conn.execute(
                users.select().where(users.c.id == user_id)
            ).mappings().fetchone()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        email = user["email"]

        # Initialize payment
        response = await paystack.initialize_transaction(
            email=email,
            plan=data.plan,
            currency=data.currency,
            callback_url=CALLBACK_URL
        )
        tx_data = response["data"]
        reference = tx_data["reference"]

        with engine.begin() as conn:
            conn.execute(
                insert(payments).values(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    transaction_ref=reference,
                    amount=paystack.get_amount(data.plan, data.currency) / 100,
                    payment_date=datetime.utcnow(),
                    method=tx_data.get("channel", "paystack"),
                    plan=data.plan
                )
            )

        return {
            "status": "success",
            "message": f"Initialized {data.plan} plan",
            "authorization_url": tx_data["authorization_url"]
        }

    except Exception as e:
        logger.exception("Failed to initiate payment")
        raise HTTPException(status_code=500, detail="Payment initialization failed")
@paymentRoute.get("/callback")
async def payment_callback(request: Request):
    """
    This is for front-end redirection post-payment. Not reliable for activation.
    """
    reference = request.query_params.get("reference")
    if not reference:
        return HTMLResponse("Reference not provided", status_code=400)

    result = await paystack.verify_transaction(reference)

    if result.get("data", {}).get("status") == "success":
        logger.info(f"[Callback] Payment successful | Ref: {reference}")
        return HTMLResponse("Payment successful. Welcome!")
    else:
        return HTMLResponse("Payment failed or incomplete.")

@paymentRoute.post("/webhook")
async def paystack_webhook(request: Request, x_paystack_signature: str = Header(None)):
    """
    Secure webhook to handle Paystack events server-to-server.
    """
    body = await request.body()
    secret_key = os.getenv("PAYSTACK_SECRET_KEY", "").encode()
    computed_signature = hmac.new(secret_key, body, hashlib.sha512).hexdigest()

    if computed_signature != x_paystack_signature:
        return JSONResponse(content={"status": "unauthorized"}, status_code=401)

    payload = await request.json()
    event = payload.get("event")

    if event == "charge.success":
        data = payload["data"]
        email = data["customer"]["email"]
        reference = data["reference"]
        amount = data["amount"] / 100

        with engine.connect() as conn:
            user_result = conn.execute(users.select().where(users.c.email == email)).mappings().fetchone()
            if not user_result:
                print(f"User with email {email} not found.")
                return {"status": "user not found"}

            user_id = user_result["id"]

            payment_result = conn.execute(payments.select().where(payments.c.transaction_ref == reference)).mappings().fetchone()
            print(payment_result)
            if not payment_result:
                print(f"Payment with ref {reference} not found.")
                return {"status": "payment not found"}

            payment_id = payment_result["id"]
            plan_type = payment_result["plan"]

        try:
            helper.activate_subscription(user_id, plan_type, payment_id)
            print(f"[Webhook] Subscription activated for {email} - {plan_type}")
        except Exception as e:
            print(f"[Webhook] Activation error: {e}")
            return {"status": "activation failed"}

    return {"status": "success"}