from fastapi import FastAPI
from routes.v1 import auth 


app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to cvForge"}

app.include_router(auth.router)
