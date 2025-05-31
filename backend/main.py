from fastapi import FastAPI
from routes.v1 import auth 
from routes.v1 import profile


app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to  root endpoint."}

app.include_router(auth.router)
app.include_router(profile.profileRouter)
