from api.config.db import SessionLocal
from api.core.models import Application, Job, User
from datetime import datetime


def candidate_apply_for_job(
    job_id: int, user_id: int, cover_letter: str = None, resume_url: str = None
):
    """
    Candidate applies for a job
    """
    session = SessionLocal()
    try:
        # Check if job exists
        job = session.query(Job).filter(Job.id == job_id).first()
        if not job:
            return None, "Job not found"

        # Check if user exists and is a candidate
        user = (
            session.query(User)
            .filter(User.id == user_id, User.role == "candidate")
            .first()
        )
        if not user:
            return None, "Candidate not found"

        # Check if already applied
        existing_application = (
            session.query(Application)
            .filter(Application.job_id == job_id, Application.user_id == user_id)
            .first()
        )
        if existing_application:
            return None, "Already applied to this job"

        # Create application
        application = Application(
            job_id=job_id,
            user_id=user_id,
            cover_letter=cover_letter,
            resume_url=resume_url or user.resume_url,
            status="pending",
        )

        session.add(application)
        session.commit()

        return application_to_dict(application), None
    except Exception as e:
        session.rollback()
        return None, str(e)
    finally:
        session.close()


def get_all_applications():
    """
    Get all applications (admin/employer view)
    """
    session = SessionLocal()
    try:
        applications = session.query(Application).all()
        result = []
        for app in applications:
            result.append(application_to_dict(app))
        return result
    finally:
        session.close()


def get_candidate_applications(candidate_id: int):
    """
    Get all applications for a specific candidate
    """
    session = SessionLocal()
    try:
        # Verify candidate exists
        candidate = (
            session.query(User)
            .filter(User.id == candidate_id, User.role == "candidate")
            .first()
        )
        if not candidate:
            return None, "Candidate not found"

        applications = (
            session.query(Application).filter(Application.user_id == candidate_id).all()
        )

        result = []
        for app in applications:
            result.append(application_to_dict(app))
        return result, None
    finally:
        session.close()


def get_job_applicants(job_id: int):
    """
    Get all applicants for a specific job
    """
    session = SessionLocal()
    try:
        # Verify job exists
        job = session.query(Job).filter(Job.id == job_id).first()
        if not job:
            return None, "Job not found"

        applications = (
            session.query(Application).filter(Application.job_id == job_id).all()
        )

        result = []
        for app in applications:
            result.append(application_to_dict(app))
        return result, None
    finally:
        session.close()


def update_application_status(application_id: int, status: str):
    """
    Update application status (pending, reviewed, accepted, rejected)
    """
    session = SessionLocal()
    try:
        valid_statuses = ["pending", "reviewed", "accepted", "rejected"]
        if status not in valid_statuses:
            return None, f"Invalid status. Must be one of: {', '.join(valid_statuses)}"

        application = (
            session.query(Application).filter(Application.id == application_id).first()
        )
        if not application:
            return None, "Application not found"

        application.status = status
        session.commit()

        return application_to_dict(application), None
    except Exception as e:
        session.rollback()
        return None, str(e)
    finally:
        session.close()


def get_application_by_id(application_id: int):
    """
    Get a specific application by ID
    """
    session = SessionLocal()
    try:
        application = (
            session.query(Application).filter(Application.id == application_id).first()
        )
        if not application:
            return None, "Application not found"
        return application_to_dict(application), None
    finally:
        session.close()


def delete_application(application_id: int):
    """
    Delete an application
    """
    session = SessionLocal()
    try:
        application = (
            session.query(Application).filter(Application.id == application_id).first()
        )
        if not application:
            return None, "Application not found"

        session.delete(application)
        session.commit()
        return True, None
    except Exception as e:
        session.rollback()
        return None, str(e)
    finally:
        session.close()


def application_to_dict(application: Application) -> dict:
    """
    Convert Application model to dictionary
    """
    return {
        "id": application.id,
        "job_id": application.job_id,
        "user_id": application.user_id,
        "resume_url": application.resume_url,
        "cover_letter": application.cover_letter,
        "status": application.status,
        "applied_at": (
            application.applied_at.isoformat() if application.applied_at else None
        ),
        "job": (
            {
                "id": application.job.id if application.job else None,
                "title": application.job.title if application.job else None,
                "company": application.job.company if application.job else None,
            }
            if application.job
            else None
        ),
        "candidate": (
            {
                "id": application.user.id if application.user else None,
                "full_name": application.user.full_name if application.user else None,
                "email": application.user.email if application.user else None,
            }
            if application.user
            else None
        ),
    }
