from fastapi import HTTPException
from sqlalchemy import insert, select, update, delete
from uuid import uuid4
import re
from datetime import datetime
from utils.helper import Helper
from utils.logger import logger
from schema.schema import profiles, users, skills, experience, education, certifications, achievements, projects

class Profile:
    def __init__(self, helper: Helper, engine):
        self.helper = helper
        self.engine = engine
        self.tables = {
            "profiles": profiles,
            "skills": skills,
            "experience": experience,
            "education": education,
            "certifications": certifications,
            "achievements": achievements,
            "projects": projects
        }
        self.insert_map = {
            "skills": lambda item: {"skill_name": item},
            "experience": lambda item: {
                "title": item.get("title"), "position": item.get("position"),
                "company": item.get("company"), "start_date": item.get("start_date"),
                "end_date": item.get("end_date"), "description": item.get("description")
            },
            "education": lambda item: {
                "institution": item.get("institution"), "certificate_level": item.get("certificate_level"),
                "start_year": item.get("start_year"), "end_year": item.get("end_year")
            },
            "certifications": lambda item: {
                "title": item.get("title"), "issuer": item.get("issuer"),
                "issue_date": item.get("issue_date"), "expiration_date": item.get("expiration_date")
            },
            "achievements": lambda item: {
                "title": item.get("title"), "description": item.get("description"),
                "achieved_at": item.get("achieved_at")
            },
            "projects": lambda item: {
                "title": item.get("title"), "description": item.get("description"),
                "link": item.get("link")
            }
        }
        self.valid_fields = {
            "profiles": {"full_name", "linkedin", "github", "website", "phone", "country", "city"},
            "skills": {"skill_name"},
            "experience": {"title", "position", "company", "start_date", "end_date", "description"},
            "education": {"institution", "certificate_level", "start_year", "end_year"},
            "certifications": {"title", "issuer", "issue_date", "expiration_date"},
            "achievements": {"title", "description", "achieved_at"},
            "projects": {"title", "description", "link"}
        }

    def create(self, data: dict, user_id: str):
        if not user_id:
            raise HTTPException(400, "user_id is required")

        if not data.get("full_name"):
            raise HTTPException(400, "Full name is required")

        self._validate_user(user_id)
        self._validate_unique_profile(user_id)

        # Validate only if value is present (None-safe)
        self._validate_urls(
            data.get("linkedin") or "", 
            data.get("github") or "", 
            data.get("website") or ""
        )
        self._validate_phone(data.get("phone") or "")

        profile_id = str(uuid4())
        
        try:
            with self.engine.begin() as conn:
                # Safely insert profile with fallbacks for optional fields
                conn.execute(insert(profiles).values(
                    id=profile_id,
                    user_id=user_id,
                    full_name=data["full_name"],
                    linkedin=data.get("linkedin"),
                    github=data.get("github"),
                    website=data.get("website"),
                    phone=data.get("phone"),
                    country=data.get("country"),
                    city=data.get("city"),
                    updated_at=datetime.utcnow()
                ))

                # Safely insert nested data only if list is non-empty
                for field, parser in self.insert_map.items():
                    items = data.get(field) or []
                    for item in items:
                        if item:  # Skip empty dicts or nulls
                            parsed = parser(item)
                            conn.execute(
                                insert(self.tables[field]).values(
                                    id=str(uuid4()),
                                    profile_id=profile_id,
                                    **parsed
                                )
                            )
                logger.info(f"Profile created: {profile_id}")
                return {"id": profile_id, "message": "Profile created"}
        
        except Exception as e:
            logger.error(f"Profile creation failed: {str(e)}")
            raise HTTPException(500, "Failed to create profile")


    def read(self, profile_id: str):
        try:
            with self.engine.connect() as conn:
                result = conn.execute(select(profiles).where(profiles.c.id == profile_id)).fetchone()
                if not result:
                    raise HTTPException(404, "Profile not found")
                logger.info(f"Profile retrieved: {profile_id}")
                return dict(result._mapping)
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Profile retrieval failed: {str(e)}")
            raise HTTPException(500, "Failed to retrieve profile")

    def get_by_user_id(self, user_id: str):
        try:
            with self.engine.connect() as conn:
                profile_result = conn.execute(select(profiles).where(profiles.c.user_id == user_id)).fetchone()
                if not profile_result:
                    raise HTTPException(404, "Profile not found")
                profile = dict(profile_result._mapping)
                profile_id = profile['id']

                for field in self.insert_map:
                    results = conn.execute(select(self.tables[field]).where(self.tables[field].c.profile_id == profile_id)).fetchall()
                    profile[field] = [dict(row._mapping) for row in results]

                logger.info(f"Profile retrieved for user: {user_id}")
                return profile 
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Profile retrieval failed for user {user_id}: {str(e)}")
            raise HTTPException(500, "Failed to retrieve profile")


    def add_skill(self, user_id: str, data: dict) -> dict[str, str]:
        try:                
            with self.engine.connect() as conn:
                conn.execute()
        except Exception as e:
            logger.error("Error in adding skill: ", e)
            raise HTTPException()

    def update(self, entity: str, item_id: str, profile_id: str, data: dict):
        if entity not in self.tables:
            raise HTTPException(400, f"Invalid entity: {entity}")

        update_data = {k: v for k, v in data.items() if k in self.valid_fields[entity] and v is not None}
        if not update_data:
            raise HTTPException(400, "No valid fields provided")

        if entity == "profiles":
            if update_data.get("linkedin") and not self._is_valid_url(update_data["linkedin"]):
                raise HTTPException(400, "Invalid LinkedIn URL")
            if update_data.get("github") and not self._is_valid_url(update_data["github"]):
                raise HTTPException(400, "Invalid GitHub URL")
            if update_data.get("website") and not self._is_valid_url(update_data["website"]):
                raise HTTPException(400, "Invalid website URL")
            if update_data.get("phone") and not self._is_valid_phone(update_data["phone"]):
                raise HTTPException(400, "Invalid phone number")
            update_data["updated_at"] = datetime.utcnow()

        try:
            with self.engine.connect() as conn:
                table = self.tables[entity]
                query = select(table.c.id).where(table.c.id == item_id, table.c.profile_id == profile_id)
                if entity == "profiles":
                    query = select(table.c.id).where(table.c.id == profile_id)
                
                if not conn.execute(query).fetchone():
                    raise HTTPException(404, f"{entity.capitalize()} not found")

                conn.execute(update(table).where(table.c.id == item_id).values(**update_data))
                conn.commit()
                logger.info(f"{entity.capitalize()} {item_id} updated for profile {profile_id}")
                return {"message": f"{entity.capitalize()} updated"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to update {entity} {item_id}: {str(e)}")
            raise HTTPException(500, f"Failed to update {entity}")

    def delete(self, entity: str, item_id: str, profile_id: str):
        if entity not in self.tables:
            raise HTTPException(400, f"Invalid entity: {entity}")

        try:
            with self.engine.connect() as conn:
                table = self.tables[entity]
                query = delete(table).where(table.c.id == item_id, table.c.profile_id == profile_id)
                if entity == "profiles":
                    for field in self.insert_map:
                        conn.execute(delete(self.tables[field]).where(self.tables[field].c.profile_id == profile_id))
                    query = delete(table).where(table.c.id == profile_id)
                
                result = conn.execute(query)
                conn.commit()
                if result.rowcount == 0:
                    raise HTTPException(404, f"{entity.capitalize()} not found")
                logger.info(f"{entity.capitalize()} {item_id} deleted for profile {profile_id}")
                return {"message": f"{entity.capitalize()} deleted"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to delete {entity} {item_id}: {str(e)}")
            raise HTTPException(500, f"Failed to delete {entity}")

    def _validate_user(self, user_id):
        with self.engine.connect() as conn:
            if not conn.execute(select(users.c.id).where(users.c.id == user_id)).fetchone():
                raise HTTPException(404, f"User {user_id} not found")

    def _validate_unique_profile(self, user_id):
        with self.engine.connect() as conn:
            if conn.execute(select(profiles.c.id).where(profiles.c.user_id == user_id)).fetchone():
                raise HTTPException(409, "Profile already exists")

    def _validate_urls(self, *urls):
        for url in urls:
            if url and not self._is_valid_url(url):
                raise HTTPException(400, f"Invalid URL: {url}")

    def _validate_phone(self, phone):
        if phone and not self._is_valid_phone(phone):
            raise HTTPException(400, "Invalid phone number")

    def _is_valid_url(self, url: str) -> bool:
        return bool(re.match(r'https?://[\w.-]+(?:\.[\w\.-]+)+[\w\-._~:/?#@!$&\'()*+,;=]+', url))

    def _is_valid_phone(self, phone: str) -> bool:
        return bool(re.match(r'^\+?[0-9\s\-]{7,15}$', phone))