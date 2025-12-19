from config.db import SessionLocal
from core.models import User
import os


UPLOAD_FOLDER = "uploads"


def get_all_candidates():
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
    Returns the CV file path for a candidate if exists
    """
    for ext in ["pdf", "doc", "docx"]:
        filename = f"cv_{candidate_id}.{ext}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(file_path):
            return (
                filename  # just return filename, controller handles send_from_directory
            )
    return None
