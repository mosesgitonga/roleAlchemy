from sqlalchemy import (
    create_engine, MetaData, Table, Column,
    Integer, String, Text, DateTime, ForeignKey, Boolean, Float
)
from datetime import datetime
from dotenv import load_dotenv
import os
from utils.logger import logger

load_dotenv()

DATABASE_URL = os.environ.get('DATABASE_URL')
SCHEMA_NAME = 'public'  

logger.debug(f"Database URL: {DATABASE_URL}")
logger.debug(f"Using schema: {SCHEMA_NAME}")

# Create metadata with schema set explicitly
metadata = MetaData(schema=SCHEMA_NAME)

# Create the engine WITHOUT SQLite-specific connect_args
engine = create_engine(DATABASE_URL)

# Define tables with no schema specified here (handled by MetaData)
users = Table(
    "users",
    metadata,
    Column("id", String, primary_key=True),
    Column("email", String, unique=True, nullable=False),
    Column("password_hash", String, nullable=False),
    Column("is_active", Boolean, default=False),
    Column("plan", String, default="free"),
    Column("created_at", DateTime, default=datetime.utcnow),
    Column("role", String, default="jobSeeker")
)

profiles = Table(
    "profiles",
    metadata,
    Column("id", String, primary_key=True),
    Column("user_id", String, ForeignKey(f"{SCHEMA_NAME}.users.id")),
    Column("full_name", String),
    Column("linkedin", String),
    Column("github", String),
    Column("phone", String),
    Column("skills", Text),
    Column("experience", Text),
    Column("education", Text),
    Column("achievements", Text),
    Column("certifications", Text),
    Column("country", Text),
    Column("city", Text),
    Column("updated_at", DateTime, default=datetime.utcnow)
)

payments = Table(
    "payments",
    metadata,
    Column("id", String, primary_key=True),
    Column("user_id", String, ForeignKey(f"{SCHEMA_NAME}.users.id")),
    Column("amount", Float),
    Column("currency", String, default="Kes"),
    Column("plan_type", String),
    Column("payment_date", DateTime, default=datetime.utcnow),
    Column("expires_at", DateTime)
)

# Create tables in the specified schema
metadata.create_all(engine)
