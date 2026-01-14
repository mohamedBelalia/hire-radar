from flask import request, jsonify
from sqlalchemy import or_, and_
from sqlalchemy.orm import Session
from api.config.db import SessionLocal
from config.db import SessionLocal
from core.models import Job, User
from typing import Optional, List
from decimal import Decimal
from datetime import datetime


def get_db():
    """
    Provide a SQLAlchemy database session for use by callers and ensure the session is closed when finished.
    
    Yields:
        Session: A SQLAlchemy `Session` object for database operations; the session is closed when the generator exits.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def search_jobs():
    """
    Search for jobs using optional filters and return paginated results.
    
    Supports query parameters:
    - search: full-text-like match against title, description, and company_name.
    - location: case-insensitive substring match against job location.
    - salary_min: numeric minimum salary filter (ignored if not parseable).
    - skill: required skill contained in the job's skills list.
    - page: 1-based page number (defaults to 1).
    - limit: number of items per page (defaults to 10).
    
    Returns:
    A JSON response with keys:
    - `jobs`: list of job dictionaries (serialized via job_to_dict).
    - `total`: total number of matching jobs before pagination.
    - `page`: current page number.
    - `limit`: items per page.
    - `total_pages`: total number of pages.
    
    On error returns a JSON object `{"error": "<message>"}` with HTTP 500.
    """
    db: Session = next(get_db())

    try:
        # Get query parameters
        search = request.args.get("search", "").strip()
        location = request.args.get("location", "").strip()
        salary_min = request.args.get("salary_min")
        skill = request.args.get("skill", "").strip()
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))

        # Start with base query
        query = db.query(Job)

        # Apply search filter
        if search:
            search_filter = or_(
                Job.title.ilike(f"%{search}%"),
                Job.description.ilike(f"%{search}%"),
                Job.company_name.ilike(f"%{search}%"),
            )
            query = query.filter(search_filter)

        # Apply location filter
        if location:
            query = query.filter(Job.location.ilike(f"%{location}%"))

        # Apply salary filter
        if salary_min:
            try:
                min_salary = Decimal(salary_min)
                query = query.filter(Job.salary_min >= min_salary)
            except (ValueError, TypeError):
                pass

        # Apply skill filter
        if skill:
            query = query.filter(Job.skills.contains([skill]))

        # Get total count before pagination
        total = query.count()

        # Apply pagination
        offset = (page - 1) * limit
        jobs = query.order_by(Job.posted_at.desc()).offset(offset).limit(limit).all()

        # Calculate total pages
        total_pages = (total + limit - 1) // limit

        # Convert to JSON format
        jobs_data = [job_to_dict(job) for job in jobs]

        return (
            jsonify(
                {
                    "jobs": jobs_data,
                    "total": total,
                    "page": page,
                    "limit": limit,
                    "total_pages": total_pages,
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def get_job_by_id(job_id: int):
    """
    Fetch a Job by its integer ID and return its serialized representation.
    
    Returns a JSON response containing the job data when found, a JSON error message with HTTP 404 if the job does not exist, or a JSON error message with HTTP 500 on unexpected errors.
    
    Parameters:
        job_id (int): Primary key of the Job to retrieve.
    
    Returns:
        flask.Response: JSON response with either the job dictionary or an error message and the corresponding HTTP status code.
    """
    db: Session = next(get_db())

    try:
        job = db.query(Job).filter(Job.id == job_id).first()

        if not job:
            return jsonify({"error": "Job not found"}), 404

        return jsonify(job_to_dict(job)), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def create_job():
    """
    Create a new job posting from JSON payload and persist it to the database.
    
    Expects a JSON request body with the following fields:
    	title (str): Required. Job title.
    	description (str): Required. Job description.
    	company_name (str): Required. Employer or company name.
    	employer_id (int or str): Required. Identifier of the employer.
    	location (str): Optional. Job location.
    	salary_min (number or str): Optional. Minimum salary; will be converted to Decimal.
    	salary_max (number or str): Optional. Maximum salary; will be converted to Decimal.
    	salary_currency (str): Optional. Currency code for salary; defaults to "USD".
    	employment_type (str): Optional. Employment type (e.g., "full-time").
    	experience_level (str): Optional. Required experience level.
    	skills (list): Optional. List of required skills; defaults to empty list.
    	requirements (str): Optional. Additional requirements.
    	benefits (str): Optional. Benefits information.
    	application_deadline (str): Optional. ISO 8601 timestamp (UTC or with "Z"); parsed to datetime.
    
    Returns:
    	On success: JSON representation of the created job (as produced by `job_to_dict`) and HTTP 201.
    	On client error (missing required field): JSON `{"error": "..."} ` and HTTP 400.
    	On server error: JSON `{"error": "<error message>"}` and HTTP 500.
    """
    db: Session = next(get_db())

    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ["title", "description", "company_name", "employer_id"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Create new job
        job = Job(
            title=data["title"],
            description=data["description"],
            company_name=data["company_name"],
            employer_id=data["employer_id"],
            location=data.get("location"),
            salary_min=(
                Decimal(str(data["salary_min"])) if data.get("salary_min") else None
            ),
            salary_max=(
                Decimal(str(data["salary_max"])) if data.get("salary_max") else None
            ),
            salary_currency=data.get("salary_currency", "USD"),
            employment_type=data.get("employment_type"),
            experience_level=data.get("experience_level"),
            skills=data.get("skills", []),
            requirements=data.get("requirements"),
            benefits=data.get("benefits"),
            application_deadline=(
                datetime.fromisoformat(
                    data["application_deadline"].replace("Z", "+00:00")
                )
                if data.get("application_deadline")
                else None
            ),
        )

        db.add(job)
        db.commit()
        db.refresh(job)

        return jsonify(job_to_dict(job)), 201

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def update_job(job_id: int):
    """
    Update fields of an existing Job identified by job_id.
    
    Only fields present in the request JSON are changed. Salary fields are converted to Decimal when provided; `application_deadline` is parsed from ISO 8601 (accepts trailing "Z" as UTC) or cleared to None when an empty value is supplied.
    
    Parameters:
        job_id (int): ID of the Job to update.
    
    Returns:
        response (flask.Response): On success returns the updated job as a JSON-compatible dictionary with HTTP 200.
            If the job does not exist, returns `{"error": "Job not found"}` with HTTP 404.
            If an unexpected error occurs, returns `{"error": <message>}` with HTTP 500.
    """
    db: Session = next(get_db())

    try:
        job = db.query(Job).filter(Job.id == job_id).first()

        if not job:
            return jsonify({"error": "Job not found"}), 404

        data = request.get_json()

        # Update fields
        if "title" in data:
            job.title = data["title"]
        if "description" in data:
            job.description = data["description"]
        if "company_name" in data:
            job.company_name = data["company_name"]
        if "location" in data:
            job.location = data["location"]
        if "salary_min" in data:
            job.salary_min = (
                Decimal(str(data["salary_min"])) if data["salary_min"] else None
            )
        if "salary_max" in data:
            job.salary_max = (
                Decimal(str(data["salary_max"])) if data["salary_max"] else None
            )
        if "salary_currency" in data:
            job.salary_currency = data["salary_currency"]
        if "employment_type" in data:
            job.employment_type = data["employment_type"]
        if "experience_level" in data:
            job.experience_level = data["experience_level"]
        if "skills" in data:
            job.skills = data["skills"]
        if "requirements" in data:
            job.requirements = data["requirements"]
        if "benefits" in data:
            job.benefits = data["benefits"]
        if "application_deadline" in data:
            job.application_deadline = (
                datetime.fromisoformat(
                    data["application_deadline"].replace("Z", "+00:00")
                )
                if data["application_deadline"]
                else None
            )

        db.commit()
        db.refresh(job)

        return jsonify(job_to_dict(job)), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def delete_job(job_id: int):
    """
    Delete a Job record identified by job_id.
    
    Parameters:
        job_id (int): The unique identifier of the Job to delete.
    
    Returns:
        tuple: A JSON response and HTTP status code. On success returns `{"message": "Job deleted successfully"}` with status `200`. If the job does not exist returns `{"error": "Job not found"}` with status `404`. On unexpected errors returns `{"error": "<error message>"}` with status `500`.
    """
    db: Session = next(get_db())

    try:
        job = db.query(Job).filter(Job.id == job_id).first()

        if not job:
            return jsonify({"error": "Job not found"}), 404

        db.delete(job)
        db.commit()

        return jsonify({"message": "Job deleted successfully"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def job_to_dict(job: Job) -> dict:
    """
    Convert a Job model instance into a JSON-serializable dictionary for frontend consumption.
    
    Parameters:
        job (Job): Job model instance to serialize.
    
    Returns:
        dict: Serialized job with these observable transformations:
            - id and employer_id as strings
            - salary_min and salary_max as floats or None
            - skills as a list (empty list if unset)
            - application_deadline, posted_at, and updated_at as ISO 8601 strings or None
    """
    return {
        "id": str(job.id),
        "title": job.title,
        "description": job.description,
        "company_name": job.company_name,
        "employer_id": str(job.employer_id),
        "location": job.location,
        "salary_min": float(job.salary_min) if job.salary_min else None,
        "salary_max": float(job.salary_max) if job.salary_max else None,
        "salary_currency": job.salary_currency,
        "employment_type": job.employment_type,
        "experience_level": job.experience_level,
        "skills": job.skills or [],
        "requirements": job.requirements,
        "benefits": job.benefits,
        "application_deadline": (
            job.application_deadline.isoformat() if job.application_deadline else None
        ),
        "posted_at": job.posted_at.isoformat() if job.posted_at else None,
        "updated_at": job.updated_at.isoformat() if job.updated_at else None,
    }