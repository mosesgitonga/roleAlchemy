from fastapi import HTTPException
from sqlalchemy import insert, select, update, delete
from sqlalchemy.orm import Session
from uuid import uuid4
import re
from datetime import datetime
from utils.helper import Helper
from utils.logger import logger
from schema.schema import profiles, users, skills, experience, education, certifications, achievements, engine

class Profile:
    def __init__(self, helper: Helper, engine):
        self.helper = helper
        self.engine = engine

    def create(self, data):
        """Create a new profile for a user."""
        full_name = data.get('full_name')
        linkedin = data.get('linkedin')
        github = data.get('github')
        website = data.get('website')
        phone = data.get('phone')
        country = data.get('country')
        city = data.get('city')
        user_id = data.get('user_id')  # Required foreign key
        skills_list = data.get('skills', [])
        experiences = data.get('experience', [])
        educations = data.get('education', [])
        certs = data.get('certifications', [])
        achievements_list = data.get('achievements', [])

        # Validate required fields
        if not user_id:
            logger.error("user_id is required")
            raise HTTPException(status_code=400, detail="user_id is required")

        # Validate user_id exists in users table
        with self.engine.connect() as conn:
            user_exists = conn.execute(
                select(users.c.id).where(users.c.id == user_id)
            ).fetchone()
            if not user_exists:
                logger.error(f"User with id {user_id} not found")
                raise HTTPException(status_code=404, detail="User not found")

        # Validate optional fields
        if linkedin and not self._is_valid_url(linkedin):
            logger.error("Invalid LinkedIn URL")
            raise HTTPException(status_code=400, detail="Invalid LinkedIn URL")
        if github and not self._is_valid_url(github):
            logger.error("Invalid GitHub URL")
            raise HTTPException(status_code=400, detail="Invalid GitHub URL")
        if website and not self._is_valid_url(website):
            logger.error("Invalid website URL")
            raise HTTPException(status_code=400, detail="Invalid website URL")
        if phone and not self._is_valid_phone(phone):
            logger.error("Invalid phone number")
            raise HTTPException(status_code=400, detail="Invalid phone number format")

        # Generate unique ID for profile
        profile_id = str(uuid4())

        # Insert profile
        try:
            with self.engine.connect() as conn:
                conn.execute(
                    insert(profiles).values(
                        id=profile_id,
                        user_id=user_id,
                        full_name=full_name,
                        linkedin=linkedin,
                        github=github,
                        website=website,
                        phone=phone,
                        country=country,
                        city=city,
                        updated_at=datetime.utcnow()
                    )
                )
                # Insert related data
                for skill in skills_list:
                    if skill:
                        conn.execute(
                            insert(skills).values(
                                profile_id=profile_id,
                                skill_name=skill
                            )
                        )
                for exp in experiences:
                    if exp:
                        conn.execute(
                            insert(experience).values(
                                profile_id=profile_id,
                                title=exp.get('title'),
                                Position=exp.get('Position'),
                                company=exp.get('company'),
                                start_date=exp.get('start_date'),
                                end_date=exp.get('end_date'),
                                description=exp.get('description')
                            )
                        )
                for edu in educations:
                    if edu:
                        conn.execute(
                            insert(education).values(
                                profile_id=profile_id,
                                institution=edu.get('institution'),
                                certificate_level=edu.get('certificate_level'),
                                start_year=edu.get('start_year'),
                                end_year=edu.get('end_year')
                            )
                        )
                for cert in certs:
                    if cert:
                        conn.execute(
                            insert(certifications).values(
                                profile_id=profile_id,
                                title=cert.get('title'),
                                issuer=cert.get('issuer'),
                                issue_date=cert.get('issue_date'),
                                expiration_date=cert.get('expiration_date')
                            )
                        )
                for ach in achievements_list:
                    if ach:
                        conn.execute(
                            insert(achievements).values(
                                profile_id=profile_id,
                                title=ach.get('title'),
                                description=ach.get('description'),
                                achieved_at=ach.get('achieved_at')
                            )
                        )
                conn.commit()
                logger.info(f"Profile created with id {profile_id}")
                return {"id": profile_id, "message": "Profile created successfully"}
        except Exception as e:
            logger.error(f"Error creating profile: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to create profile")

    def read(self, profile_id: str):
        """Retrieve a profile by ID."""
        try:
            with self.engine.connect() as conn:
                result = conn.execute(
                    select(profiles).where(profiles.c.id == profile_id)
                ).fetchone()
                if not result:
                    logger.error(f"Profile with id {profile_id} not found")
                    raise HTTPException(status_code=404, detail="Profile not found")
                profile = dict(result._mapping)
                logger.info(f"Profile {profile_id} retrieved")
                return profile
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error retrieving profile {profile_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to retrieve profile")

    def get_by_user_id(self, user_id: str):
        """Retrieve a profile by user_id with related data."""
        try:
            with self.engine.connect() as conn:
                # Get profile
                profile_result = conn.execute(
                    select(profiles).where(profiles.c.user_id == user_id)
                ).fetchone()
                if not profile_result:
                    logger.error(f"Profile for user {user_id} not found")
                    raise HTTPException(status_code=404, detail="Profile not found")

                profile = dict(profile_result._mapping)
                profile_id = profile['id']

                # Get related data
                skills_result = conn.execute(
                    select(skills).where(skills.c.profile_id == profile_id)
                ).fetchall()
                experience_result = conn.execute(
                    select(experience).where(experience.c.profile_id == profile_id)
                ).fetchall()
                education_result = conn.execute(
                    select(education).where(education.c.profile_id == profile_id)
                ).fetchall()
                certifications_result = conn.execute(
                    select(certifications).where(certifications.c.profile_id == profile_id)
                ).fetchall()
                achievements_result = conn.execute(
                    select(achievements).where(achievements.c.profile_id == profile_id)
                ).fetchall()

                # Convert to lists of dicts
                profile['skills'] = [dict(row._mapping) for row in skills_result]
                profile['experience'] = [dict(row._mapping) for row in experience_result]
                profile['education'] = [dict(row._mapping) for row in education_result]
                profile['certifications'] = [dict(row._mapping) for row in certifications_result]
                profile['achievements'] = [dict(row._mapping) for row in achievements_result]

                logger.info(f"Profile for user {user_id} retrieved with related data")
                return profile
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error retrieving profile for user {user_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to retrieve profile")

    def update(self, profile_id: str, data):
        """Update an existing profile."""
        with self.engine.connect() as conn:
            profile_exists = conn.execute(
                select(profiles.c.id).where(profiles.c.id == profile_id)
            ).fetchone()
            if not profile_exists:
                logger.error(f"Profile with id {profile_id} not found")
                raise HTTPException(status_code=404, detail="Profile not found")

        update_data = {}
        if 'full_name' in data and data['full_name'] is not None:
            update_data['full_name'] = data['full_name']
        if 'linkedin' in data and data['linkedin'] is not None:
            if not self._is_valid_url(data['linkedin']):
                logger.error("Invalid LinkedIn URL")
                raise HTTPException(status_code=400, detail="Invalid LinkedIn URL")
            update_data['linkedin'] = data['linkedin']
        if 'github' in data and data['github'] is not None:
            if not self._is_valid_url(data['github']):
                logger.error("Invalid GitHub URL")
                raise HTTPException(status_code=400, detail="Invalid GitHub URL")
            update_data['github'] = data['github']
        if 'website' in data and data['website'] is not None:
            if not self._is_valid_url(data['website']):
                logger.error("Invalid website URL")
                raise HTTPException(status_code=400, detail="Invalid website URL")
            update_data['website'] = data['website']
        if 'phone' in data and data['phone'] is not None:
            if not self._is_valid_phone(data['phone']):
                logger.error("Invalid phone number")
                raise HTTPException(status_code=400, detail="Invalid phone number format")
            update_data['phone'] = data['phone']
        if 'country' in data and data['country'] is not None:
            update_data['country'] = data['country']
        if 'city' in data and data['city'] is not None:
            update_data['city'] = data['city']

        update_data['updated_at'] = datetime.utcnow()

        try:
            with self.engine.connect() as conn:
                conn.execute(
                    update(profiles).where(profiles.c.id == profile_id).values(**update_data)
                )
                conn.commit()
                logger.info(f"Profile {profile_id} updated")
                return {"id": profile_id, "message": "Profile updated successfully"}
        except Exception as e:
            logger.error(f"Error updating profile {profile_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to update profile")

    def delete(self, profile_id: str):
        """Delete a profile by ID and associated data."""
        try:
            with self.engine.connect() as conn:
                # Check if profile exists
                profile_exists = conn.execute(
                    select(profiles.c.id).where(profiles.c.id == profile_id)
                ).fetchone()
                if not profile_exists:
                    logger.error(f"Profile with id {profile_id} not found")
                    raise HTTPException(status_code=404, detail="Profile not found")

                # Delete related data first due to foreign key constraints
                conn.execute(delete(skills).where(skills.c.profile_id == profile_id))
                conn.execute(delete(experience).where(experience.c.profile_id == profile_id))
                conn.execute(delete(education).where(education.c.profile_id == profile_id))
                conn.execute(delete(certifications).where(certifications.c.profile_id == profile_id))
                conn.execute(delete(achievements).where(achievements.c.profile_id == profile_id))
                
                # Delete profile
                result = conn.execute(
                    delete(profiles).where(profiles.c.id == profile_id)
                )
                conn.commit()
                if result.rowcount == 0:
                    logger.error(f"Profile with id {profile_id} not found")
                    raise HTTPException(status_code=404, detail="Profile not found")
                logger.info(f"Profile {profile_id} and associated data deleted")
                return {"message": "Profile deleted successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting profile {profile_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to delete profile")

    def update_skill(self, skill_id: int, profile_id: str, skill_name: str):
        """Update a specific skill by ID."""
        try:
            with self.engine.connect() as conn:
                # Verify skill belongs to profile
                skill = conn.execute(
                    select(skills).where(skills.c.id == skill_id, skills.c.profile_id == profile_id)
                ).fetchone()
                if not skill:
                    logger.error(f"Skill {skill_id} not found for profile {profile_id}")
                    raise HTTPException(status_code=404, detail="Skill not found")

                if not skill_name:
                    logger.error("skill_name is required")
                    raise HTTPException(status_code=400, detail="skill_name is required")

                conn.execute(
                    update(skills).where(skills.c.id == skill_id).values(skill_name=skill_name)
                )
                conn.commit()
                logger.info(f"Skill {skill_id} updated for profile {profile_id}")
                return {"message": "Skill updated successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating skill {skill_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to update skill")

    def delete_skill(self, skill_id: int, profile_id: str):
        """Delete a specific skill by ID."""
        try:
            with self.engine.connect() as conn:
                result = conn.execute(
                    delete(skills).where(skills.c.id == skill_id, skills.c.profile_id == profile_id)
                )
                conn.commit()
                if result.rowcount == 0:
                    logger.error(f"Skill {skill_id} not found for profile {profile_id}")
                    raise HTTPException(status_code=404, detail="Skill not found")
                logger.info(f"Skill {skill_id} deleted for profile {profile_id}")
                return {"message": "Skill deleted successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting skill {skill_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to delete skill")

    def update_experience(self, experience_id: int, profile_id: str, data):
        """Update a specific experience by ID."""
        try:
            with self.engine.connect() as conn:
                # Verify experience belongs to profile
                exp = conn.execute(
                    select(experience).where(experience.c.id == experience_id, experience.c.profile_id == profile_id)
                ).fetchone()
                if not exp:
                    logger.error(f"Experience {experience_id} not found for profile {profile_id}")
                    raise HTTPException(status_code=404, detail="Experience not found")

                update_data = {}
                if 'title' in data and data['title'] is not None:
                    update_data['title'] = data['title']
                if 'Position' in data and data['Position'] is not None:
                    update_data['Position'] = data['Position']
                if 'company' in data and data['company'] is not None:
                    update_data['company'] = data['company']
                if 'start_date' in data and data['start_date'] is not None:
                    update_data['start_date'] = data['start_date']
                if 'end_date' in data and data['end_date'] is not None:
                    update_data['end_date'] = data['end_date']
                if 'description' in data and data['description'] is not None:
                    update_data['description'] = data['description']

                if not update_data:
                    logger.error("No valid fields provided for experience update")
                    raise HTTPException(status_code=400, detail="No valid fields provided")

                conn.execute(
                    update(experience).where(experience.c.id == experience_id).values(**update_data)
                )
                conn.commit()
                logger.info(f"Experience {experience_id} updated for profile {profile_id}")
                return {"message": "Experience updated successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating experience {experience_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to update experience")

    def delete_experience(self, experience_id: int, profile_id: str):
        """Delete a specific experience by ID."""
        try:
            with self.engine.connect() as conn:
                result = conn.execute(
                    delete(experience).where(experience.c.id == experience_id, experience.c.profile_id == profile_id)
                )
                conn.commit()
                if result.rowcount == 0:
                    logger.error(f"Experience {experience_id} not found for profile {profile_id}")
                    raise HTTPException(status_code=404, detail="Experience not found")
                logger.info(f"Experience {experience_id} deleted for profile {profile_id}")
                return {"message": "Experience deleted successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting experience {experience_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to delete experience")

    def update_education(self, education_id: int, profile_id: str, data):
        """Update a specific education by ID."""
        try:
            with self.engine.connect() as conn:
                # Verify education belongs to profile
                edu = conn.execute(
                    select(education).where(education.c.id == education_id, education.c.profile_id == profile_id)
                ).fetchone()
                if not edu:
                    logger.error(f"Education {education_id} not found for profile {profile_id}")
                    raise HTTPException(status_code=404, detail="Education not found")

                update_data = {}
                if 'institution' in data and data['institution'] is not None:
                    update_data['institution'] = data['institution']
                if 'certificate_level' in data and data['certificate_level'] is not None:
                    update_data['certificate_level'] = data['certificate_level']
                if 'start_year' in data and data['start_year'] is not None:
                    update_data['start_year'] = data['start_year']
                if 'end_year' in data and data['end_year'] is not None:
                    update_data['end_year'] = data['end_year']

                if not update_data:
                    logger.error("No valid fields provided for education update")
                    raise HTTPException(status_code=400, detail="No valid fields provided")

                conn.execute(
                    update(education).where(education.c.id == education_id).values(**update_data)
                )
                conn.commit()
                logger.info(f"Education {education_id} updated for profile {profile_id}")
                return {"message": "Education updated successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating education {education_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to update education")

    def delete_education(self, education_id: int, profile_id: str):
        """Delete a specific education by ID."""
        try:
            with self.engine.connect() as conn:
                result = conn.execute(
                    delete(education).where(education.c.id == education_id, education.c.profile_id == profile_id)
                )
                conn.commit()
                if result.rowcount == 0:
                    logger.error(f"Education {education_id} not found for profile {profile_id}")
                    raise HTTPException(status_code=404, detail="Education not found")
                logger.info(f"Education {education_id} deleted for profile {profile_id}")
                return {"message": "Education deleted successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting education {education_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to delete education")

    def update_certification(self, certification_id: int, profile_id: str, data):
        """Update a specific certification by ID."""
        try:
            with self.engine.connect() as conn:
                # Verify certification belongs to profile
                cert = conn.execute(
                    select(certifications).where(certifications.c.id == certification_id, certifications.c.profile_id == profile_id)
                ).fetchone()
                if not cert:
                    logger.error(f"Certification {certification_id} not found for profile {profile_id}")
                    raise HTTPException(status_code=404, detail="Certification not found")

                update_data = {}
                if 'title' in data and data['title'] is not None:
                    update_data['title'] = data['title']
                if 'issuer' in data and data['issuer'] is not None:
                    update_data['issuer'] = data['issuer']
                if 'issue_date' in data and data['issue_date'] is not None:
                    update_data['issue_date'] = data['issue_date']
                if 'expiration_date' in data and data['expiration_date'] is not None:
                    update_data['expiration_date'] = data['expiration_date']

                if not update_data:
                    logger.error("No valid fields provided for certification update")
                    raise HTTPException(status_code=400, detail="No valid fields provided")

                conn.execute(
                    update(certifications).where(certifications.c.id == certification_id).values(**update_data)
                )
                conn.commit()
                logger.info(f"Certification {certification_id} updated for profile {profile_id}")
                return {"message": "Certification updated successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating certification {certification_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to update certification")

    def delete_certification(self, certification_id: int, profile_id: str):
        """Delete a specific certification by ID."""
        try:
            with self.engine.connect() as conn:
                result = conn.execute(
                    delete(certifications).where(certifications.c.id == certification_id, certifications.c.profile_id == profile_id)
                )
                conn.commit()
                if result.rowcount == 0:
                    logger.error(f"Certification {certification_id} not found for profile {profile_id}")
                    raise HTTPException(status_code=404, detail="Certification not found")
                logger.info(f"Certification {certification_id} deleted for profile {profile_id}")
                return {"message": "Certification deleted successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting certification {certification_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to delete certification")

    def update_achievement(self, achievement_id: int, profile_id: str, data):
        """Update a specific achievement by ID."""
        try:
            with self.engine.connect() as conn:
                # Verify achievement belongs to profile
                ach = conn.execute(
                    select(achievements).where(achievements.c.id == achievement_id, achievements.c.profile_id == profile_id)
                ).fetchone()
                if not ach:
                    logger.error(f"Achievement {achievement_id} not found for profile {profile_id}")
                    raise HTTPException(status_code=404, detail="Achievement not found")

                update_data = {}
                if 'title' in data and data['title'] is not None:
                    update_data['title'] = data['title']
                if 'description' in data and data['description'] is not None:
                    update_data['description'] = data['description']
                if 'achieved_at' in data and data['achieved_at'] is not None:
                    update_data['achieved_at'] = data['achieved_at']

                if not update_data:
                    logger.error("No valid fields provided for achievement update")
                    raise HTTPException(status_code=400, detail="No valid fields provided")

                conn.execute(
                    update(achievements).where(achievements.c.id == achievement_id).values(**update_data)
                )
                conn.commit()
                logger.info(f"Achievement {achievement_id} updated for profile {profile_id}")
                return {"message": "Achievement updated successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating achievement {achievement_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to update achievement")

    def delete_achievement(self, achievement_id: int, profile_id: str):
        """Delete a specific achievement by ID."""
        try:
            with self.engine.connect() as conn:
                result = conn.execute(
                    delete(achievements).where(achievements.c.id == achievement_id, achievements.c.profile_id == profile_id)
                )
                conn.commit()
                if result.rowcount == 0:
                    logger.error(f"Achievement {achievement_id} not found for profile {profile_id}")
                    raise HTTPException(status_code=404, detail="Achievement not found")
                logger.info(f"Achievement {achievement_id} deleted for profile {profile_id}")
                return {"message": "Achievement deleted successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting achievement {achievement_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to delete achievement")

    def _is_valid_url(self, url: str) -> bool:
        """Validate URL format."""
        url_pattern = re.compile(
            r'^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$'
        )
        return bool(url_pattern.match(url))

    def _is_valid_phone(self, phone: str) -> bool:
        """Validate phone number format (e.g., +1234567890 or 123-456-7890)."""
        phone_pattern = re.compile(r'^\+?1?\d{9,15}$|^(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})$')
        return bool(phone_pattern.match(phone))