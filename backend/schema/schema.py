from sqlalchemy import (
    create_engine, MetaData, Table, Column,
    Integer, String, Text, DateTime, ForeignKey, Boolean, Float
)
from datetime import datetime
from dotenv import load_dotenv 

load_dotenv()

DATABASE_URL = os.environ.get('DATABASE_URL')
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
metadata = MetaData()


users = Table(
    "users",
    metadata,
    Column("id", String, primary_key=True),
    Column("email", String, unique=True, nullable=False),
    Column("password_hash", String, nullable=False),
    Column("is_active", Boolean, default=False),
    Column("plan", String, default="free"),
    Column("created_at", DateTime, default=datetime.utcnow)
    Column("role", String, default="jobSeeker")
)


profiles = Table(
    "profiles",
    metadata,
    Column("id", String, primary_key=True),
    Column("user_id", String, ForeignKey("users.id")),
    Column("full_name", String),
    Column("linkedin", String),
    Column("github", String),
    Column("phone", String),
    Column("skills", Text),  #  list of strings
    Column("experience", Text),  # JSON stringified list of dicts
    Column("education", Text),   # JSON stringified list of dicts
    Column("achievements", Text), # json
    Column("certifications", Text),
    Column("country", Text),
    Column("city", Text),
    Column("updated_at", DateTime, default=datetime.utcnow)
)


payments = Table(
    "payments",
    metadata,
    Column("id", String, primary_key=True),
    Column("user_id", String, ForeignKey("users.id")),
    Column("amount", Float),
    Column("currency", String, default="Kes"),
    Column("plan_type", String),
    Column("payment_date", DateTime, default=datetime.utcnow),
    Column("expires_at", DateTime)
)

metadata.create_all(engine)
