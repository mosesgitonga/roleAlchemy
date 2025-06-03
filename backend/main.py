from fastapi import FastAPI
from routes.v1 import auth 
from routes.v1 import profile
from routes.v1 import payment


app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to role Alchemy."}

app.include_router(auth.router)
app.include_router(profile.profileRouter)
app.include_router(payment.paymentRoute)
