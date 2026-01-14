from api.config.db import SessionLocal
from api.core.models import User
import os


UPLOAD_FOLDER = "uploads"


def get_all_candidates():
    """
    Retrieve simplified profiles for all users with the role "candidate".
    
    Each returned item is a dictionary containing the candidate's id, full name, email, phone, location, bio, headline, resume URL, and a list of skill names.
    
    Returns:
        list[dict]: A list of candidate dictionaries with keys:
            - id (int)
            - full_name (str)
            - email (str)
            - phone (str | None)
            - location (str | None)
            - bio (str | None)
            - headline (str | None)
            - resume_url (str | None)
            - skills (list[str])
    """
    session = SessionLocal()
    try:
        candidates = session.query(User).filter(User.role == "candidate").all()
        result = []
        for c in candidates:
            result.append(
                {
                    "id": c.id,
                    "full_name": c.full_name,
                    "email": c.email,
                    "phone": c.phone,
                    "location": c.location,
                    "bio": c.bio,
                    "headline": c.headLine,
                    "resume_url": c.resume_url,
                    "skills": [skill.name for skill in c.skills],
                }
            )
        return result
    finally:
        session.close()


def get_candidate_by_id(candidate_id: int):
    """
    Retrieve a candidate's profile by id.
    
    Parameters:
        candidate_id (int): The user's id to look up (must be a candidate).
    
    Returns:
        dict: Candidate data with keys:
            - id, full_name, email, phone, location, bio, headline, resume_url
            - skills: list of skill name strings
            - educations: list of dicts with keys `school_name`, `degree`, `field_of_study`, `start_date`, `end_date`, `description`
            - experiences: list of dicts with keys `job_title`, `company`, `start_date`, `end_date`, `description`
        None: If no candidate with the given id exists.
    """
    session = SessionLocal()
    try:
        candidate = (
            session.query(User)
            .filter(User.id == candidate_id, User.role == "candidate")
            .first()
        )
        if not candidate:
            return None

        return {
            "id": candidate.id,
            "full_name": candidate.full_name,
            "email": candidate.email,
            "phone": candidate.phone,
            "location": candidate.location,
            "bio": candidate.bio,
            "headline": candidate.headLine,
            "resume_url": candidate.resume_url,
            "skills": [skill.name for skill in candidate.skills],
            "educations": [
                {
                    "school_name": edu.school_name,
                    "degree": edu.degree,
                    "field_of_study": edu.field_of_study,
                    "start_date": edu.start_date,
                    "end_date": edu.end_date,
                    "description": edu.description,
                }
                for edu in candidate.educations
            ],
            "experiences": [
                {
                    "job_title": exp.job_title,
                    "company": exp.company,
                    "start_date": exp.start_date,
                    "end_date": exp.end_date,
                    "description": exp.description,
                }
                for exp in candidate.experiences
            ],
        }
    finally:
        session.close()


def update_candidate_info(candidate_id: int, update_data: dict):
    """
    Update allowed fields of a candidate and return the updated basic profile.
    
    Parameters:
        candidate_id (int): ID of the candidate to update.
        update_data (dict): Mapping of fields to update. Allowed keys: "full_name", "phone", "location", "bio", "headLine", "resume_url".
            Note: the "headLine" key on the model is returned as "headline" in the result.
    
    Returns:
        dict: Updated candidate summary with keys "id", "full_name", "phone", "location", "bio", "headline", and "resume_url" if the candidate exists.
        None: If no candidate with the given `candidate_id` and role "candidate" is found.
    """
    session = SessionLocal()
    try:
        candidate = (
            session.query(User)
            .filter(User.id == candidate_id, User.role == "candidate")
            .first()
        )
        if not candidate:
            return None

        allowed_fields = [
            "full_name",
            "phone",
            "location",
            "bio",
            "headLine",
            "resume_url", 
        ]
        for field in allowed_fields:
            if field in update_data:
                setattr(candidate, field, update_data[field])

        session.commit()

        return {
            "id": candidate.id,
            "full_name": candidate.full_name,
            "phone": candidate.phone,
            "location": candidate.location,
            "bio": candidate.bio,
            "headline": candidate.headLine,
            "resume_url": candidate.resume_url,
        }
    finally:
        session.close()


def save_candidate_cv(candidate_id: int, resume_url: str):
    """
    Update a candidate's stored resume URL.
    
    Parameters:
        candidate_id (int): ID of the candidate whose resume URL will be updated.
        resume_url (str): Publicly accessible URL or path of the candidate's uploaded CV.
    
    Returns:
        dict: Dictionary with `id` and updated `resume_url` for the candidate if found.
        None: If no candidate with the given ID and role "candidate" exists.
    """
    session = SessionLocal()
    try:
        candidate = (
            session.query(User)
            .filter(User.id == candidate_id, User.role == "candidate")
            .first()
        )
        if not candidate:
            return None

        candidate.resume_url = resume_url
        session.commit()
        return {"id": candidate.id, "resume_url": candidate.resume_url}
    finally:
        session.close()


def get_candidate_cv_path(candidate_id: int):
    """
    Find the candidate's CV filename in the uploads folder.
    
    Returns:
        str: Matching filename (e.g., "cv_123.pdf") if a supported CV file exists in UPLOAD_FOLDER, `None` otherwise.
    """
    for ext in ["pdf", "doc", "docx"]:
        filename = f"cv_{candidate_id}.{ext}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(file_path):
            return (
                filename  # just return filename, controller handles send_from_directory
            )
    return None