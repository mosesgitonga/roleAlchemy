from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.v1 import auth 
from routes.v1 import profile
from routes.v1 import payment

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:5173",  
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           
    allow_credentials=True,           # Cookies/Authorization headers
    allow_methods=["*"],              # Allow all HTTP methods
    allow_headers=["*"],              # Allow all headers
)

@app.get("/")
def read_root():
    return {"message": "Welcome to role Alchemy."}

app.include_router(auth.router)
app.include_router(profile.profileRouter)
app.include_router(payment.paymentRoute)
