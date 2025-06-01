from sqlalchemy import (
    create_engine, MetaData, Table, Column,
    Integer, String, Text, DateTime, ForeignKey, Boolean, Float,JSON
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

metadata = MetaData(schema=SCHEMA_NAME)
engine = create_engine(DATABASE_URL)

# Users Table
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
    Column("website", String),
    Column("phone", String),
    Column("country", String),
    Column("city", String),
    Column("updated_at", DateTime, default=datetime.utcnow)
)

projects = Table(
    "projects", metadata,
    Column("id", String, primary_key=True),
    Column("profile_id", String, ForeignKey(f"{SCHEMA_NAME}.profiles.id", ondelete="CASCADE"), nullable=False),    Column("title",String, nullable=False),
    Column("description", String, nullable=True),
    Column("link", String, nullable=True),

)

skills = Table(
    "skills",
    metadata,
    Column("id", String, primary_key=True),
    Column("profile_id", String, ForeignKey(f"{SCHEMA_NAME}.profiles.id")),
    Column("skill_name", String, nullable=False),
)

experience = Table(
    "experience",
    metadata,
    Column("id", String, primary_key=True),
    Column("profile_id", String, ForeignKey(f"{SCHEMA_NAME}.profiles.id")),
    Column("title", String),
    Column("position", String),
    Column("company", String),
    Column("start_date", DateTime),
    Column("end_date", DateTime),
    Column("description", Text)
)


education = Table(
    "education",
    metadata,
    Column("id", String, primary_key=True),
    Column("profile_id", String, ForeignKey(f"{SCHEMA_NAME}.profiles.id")),
    Column("institution", String),
    Column("certificate_level", String), # certificate, diploma, degree, masters, phd
    Column("start_year", Integer),
    Column("end_year", Integer)
)

certifications = Table(
    "certifications",
    metadata,
    Column("id", String, primary_key=True),
    Column("profile_id", String, ForeignKey(f"{SCHEMA_NAME}.profiles.id")),
    Column("title", String),
    Column("issuer", String),
    Column("issue_date", DateTime),
    Column("expiration_date", DateTime)
)

achievements = Table(
    "achievements",
    metadata,
    Column("id", String, primary_key=True),
    Column("profile_id", String, ForeignKey(f"{SCHEMA_NAME}.profiles.id")),
    Column("title", String),
    Column("description", Text),
    Column("achieved_at", DateTime)
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

metadata.create_all(engine)
