# logger.py
import logging
import os
from dotenv import load_dotenv

load_dotenv()

ENV = os.getenv("ENVIRONMENT", "production").lower()

# Create logger
logger = logging.getLogger("loveefy")
logger.setLevel(logging.DEBUG if ENV == "development" else logging.INFO)

# Formatter
formatter = logging.Formatter(
    "[%(asctime)s] [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

# Stream handler (console)
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# Optional: File handler (for prod)
if ENV != "development":
    file_handler = logging.FileHandler("logs/app.log")
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

# Avoid duplicate logs
logger.propagate = False