from fastapi import APIRouter, Depends, HTTPException, status
from starlette.status import HTTP_201_CREATED
from utils.helper import Helper
from schema.schema import engine
from services.profile_service import Profile
from schema.profile import ProfileCreate, ProfileUpdate, SkillCreate, SkillUpdate, EducationCreate, EducationUpdate, ExperienceCreate, ExperienceUpdate, CertificationCreate, CertificationUpdate, AchievementCreate, AchievementUpdate
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_404_NOT_FOUND, HTTP_400_BAD_REQUEST


profileRouter = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)

def get_helper():
    return Helper()

def get_profile_service(helper: Helper = Depends(get_helper)):
    return Profile(helper, engine)

@profileRouter.post("/", response_model=dict, status_code=HTTP_201_CREATED)
async def create_profile(data: ProfileCreate, profile_service: Profile = Depends(get_profile_service),user_id: str = Depends(Helper().get_current_user_id)):
    """Create a new profile with optional related data."""
    return profile_service.create(data.dict(), user_id)
@profileRouter.get("/{profile_id}", response_model=dict, status_code=200)
async def get_profile(profile_id: str, profile_service: Profile = Depends(get_profile_service)):
    """Retrieve a profile by profile_id."""
    return profile_service.read(profile_id)

@profileRouter.get("/user/{user_id}", response_model=dict, status_code=200)
async def get_profile_by_user(user_id: str, profile_service: Profile = Depends(get_profile_service)):
    """Retrieve a profile by user_id with related data."""
    return profile_service.get_by_user_id(user_id)

@profileRouter.put("/{profile_id}", response_model=dict, status_code=200)
async def update_profile(profile_id: str, data: ProfileUpdate, profile_service: Profile = Depends(get_profile_service)):
    """Update an existing profile."""
    return profile_service.update(profile_id, data.dict(exclude_unset=True))

@profileRouter.delete("/{profile_id}", response_model=dict, status_code=200)
async def delete_profile(profile_id: str, profile_service: Profile = Depends(get_profile_service)):
    """Delete a profile and its associated data."""
    return profile_service.delete(profile_id)

# Skill Endpoints
@profileRouter.post("/{profile_id}/skills", response_model=dict, status_code=HTTP_201_CREATED)
async def create_skill(profile_id: str, data: SkillCreate, profile_service: Profile = Depends(get_profile_service)):
    """Create a new skill for a profile."""
    return profile_service.create_skill(profile_id, data.skill_name)

@profileRouter.put("/{profile_id}/skills/{skill_id}", response_model=dict, status_code=HTTP_200_OK)
async def update_skill(profile_id: str, skill_id: int, data: SkillUpdate, profile_service: Profile = Depends(get_profile_service)):
    """Update a specific skill by skill_id."""
    return profile_service.update_skill(skill_id, profile_id, data.skill_name)

@profileRouter.delete("/{profile_id}/skills/{skill_id}", response_model=dict, status_code=HTTP_200_OK)
async def delete_skill(profile_id: str, skill_id: int, profile_service: Profile = Depends(get_profile_service)):
    """Delete a specific skill by skill_id."""
    return profile_service.delete_skill(skill_id, profile_id)

# Experience Endpoints
@profileRouter.post("/{profile_id}/experience", response_model=dict, status_code=HTTP_201_CREATED)
async def create_experience(profile_id: str, data: ExperienceCreate, profile_service: Profile = Depends(get_profile_service)):
    """Create a new experience for a profile."""
    return profile_service.create_experience(profile_id, data.dict(exclude_unset=True))

@profileRouter.put("/{profile_id}/experience/{experience_id}", response_model=dict, status_code=HTTP_200_OK)
async def update_experience(profile_id: str, experience_id: int, data: ExperienceUpdate, profile_service: Profile = Depends(get_profile_service)):
    """Update a specific experience by experience_id."""
    return profile_service.update_experience(experience_id, profile_id, data.dict(exclude_unset=True))

@profileRouter.delete("/{profile_id}/experience/{experience_id}", response_model=dict, status_code=HTTP_200_OK)
async def delete_experience(profile_id: str, experience_id: int, profile_service: Profile = Depends(get_profile_service)):
    """Delete a specific experience by experience_id."""
    return profile_service.delete_experience(experience_id, profile_id)

# Education Endpoints
@profileRouter.post("/{profile_id}/education", response_model=dict, status_code=HTTP_201_CREATED)
async def create_education(profile_id: str, data: EducationCreate, profile_service: Profile = Depends(get_profile_service)):
    """Create a new education for a profile."""
    return profile_service.create_education(profile_id, data.dict(exclude_unset=True))

@profileRouter.put("/{profile_id}/education/{education_id}", response_model=dict, status_code=HTTP_200_OK)
async def update_education(profile_id: str, education_id: int, data: EducationUpdate, profile_service: Profile = Depends(get_profile_service)):
    """Update a specific education by education_id."""
    return profile_service.update_education(education_id, profile_id, data.dict(exclude_unset=True))

@profileRouter.delete("/{profile_id}/education/{education_id}", response_model=dict, status_code=HTTP_200_OK)
async def delete_education(profile_id: str, education_id: int, profile_service: Profile = Depends(get_profile_service)):
    """Delete a specific education by education_id."""
    return profile_service.delete_education(education_id, profile_id)

# Certification Endpoints
@profileRouter.post("/{profile_id}/certifications", response_model=dict, status_code=HTTP_201_CREATED)
async def create_certification(profile_id: str, data: CertificationCreate, profile_service: Profile = Depends(get_profile_service)):
    """Create a new certification for a profile."""
    return profile_service.create_certification(profile_id, data.dict(exclude_unset=True))

@profileRouter.put("/{profile_id}/certifications/{certification_id}", response_model=dict, status_code=HTTP_200_OK)
async def update_certification(profile_id: str, certification_id: int, data: CertificationUpdate, profile_service: Profile = Depends(get_profile_service)):
    """Update a specific certification by certification_id."""
    return profile_service.update_certification(certification_id, profile_id, data.dict(exclude_unset=True))

@profileRouter.delete("/{profile_id}/certifications/{certification_id}", response_model=dict, status_code=HTTP_200_OK)
async def delete_certification(profile_id: str, certification_id: int, profile_service: Profile = Depends(get_profile_service)):
    """Delete a specific certification by certification_id."""
    return profile_service.delete_certification(certification_id, profile_id)

# Achievement Endpoints
@profileRouter.post("/{profile_id}/achievements", response_model=dict, status_code=HTTP_201_CREATED)
async def create_achievement(profile_id: str, data: AchievementCreate, profile_service: Profile = Depends(get_profile_service)):
    """Create a new achievement for a profile."""
    return profile_service.create_achievement(profile_id, data.dict(exclude_unset=True))

@profileRouter.put("/{profile_id}/achievements/{achievement_id}", response_model=dict, status_code=HTTP_200_OK)
async def update_achievement(profile_id: str, achievement_id: int, data: AchievementUpdate, profile_service: Profile = Depends(get_profile_service)):
    """Update a specific achievement by achievement_id."""
    return profile_service.update_achievement(achievement_id, profile_id, data.dict(exclude_unset=True))

@profileRouter.delete("/{profile_id}/achievements/{achievement_id}", response_model=dict, status_code=HTTP_200_OK)
async def delete_achievement(profile_id: str, achievement_id: int, profile_service: Profile = Depends(get_profile_service)):
    """Delete a specific achievement by achievement_id."""
    return profile_service.delete_achievement(achievement_id, profile_id)