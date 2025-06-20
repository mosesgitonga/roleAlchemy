from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Union, Dict, Any
from datetime import datetime
from uuid import UUID



class ExperienceCreate(BaseModel):
    title: Optional[str] = None
    Position: Optional[str] = None
    company: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    description: Optional[str] = None


class EducationCreate(BaseModel):
    institution: Optional[str] = None
    certificate_level: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None

class CertificationCreate(BaseModel):
    title: Optional[str] = None
    issuer: Optional[str] = None
    issue_date: Optional[datetime] = None
    expiration_date: Optional[datetime] = None

class AchievementCreate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    achieved_at: Optional[datetime] = None
    
class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None


class SkillCreate(BaseModel):
    skill_name: str

class SkillUpdate(BaseModel):
    skill_name: str

class ExperienceUpdate(BaseModel):
    title: Optional[str] = None
    Position: Optional[str] = None
    company: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    description: Optional[str] = None

class EducationUpdate(BaseModel):
    institution: Optional[str] = None
    certificate_level: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None

class CertificationUpdate(BaseModel):
    title: Optional[str] = None
    issuer: Optional[str] = None
    issue_date: Optional[datetime] = None
    expiration_date: Optional[datetime] = None

class AchievementUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    achieved_at: Optional[datetime] = None 
class ProfileCreate(BaseModel):
    full_name: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None 
    phone: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    projects: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    skills: Optional[List[str]] = Field(default_factory=list)
    experience: Optional[List[ExperienceCreate]] = Field(default_factory=list)
    education: Optional[List[EducationCreate]] = Field(default_factory=list)
    certifications: Optional[List[CertificationCreate]] = Field(default_factory=list)
    achievements: Optional[List[AchievementCreate]] = Field(default_factory=list)