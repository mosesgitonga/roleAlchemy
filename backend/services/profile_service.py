from fastapi import HTTPException
from sqlalchemy import insert, select
from sqlalchemy.orm import Session
from uuid import uuid4
import re
from utils.helper import Helper
from utils.logger import logger
from schema.schema import users, engine

class Profile:
    def __init__(self, helper: Helper, engine):
        self.helper = helper 
        self.engine = engine 

    def create(self, data):
        full_name = data.get('full_name')
        linkedin = data.get('linkedin')
        github = data.get('github')
        phone = data.get('phone')
        skills = data.get("skills")
        experience = data.get("experience")
        education = data.get("achievements")
        certifications = data.get("certifications")
        country = data.get("country")
        city = data.get("city")

        if 