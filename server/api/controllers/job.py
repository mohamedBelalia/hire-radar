from flask import request, jsonify
from sqlalchemy import or_, and_
from sqlalchemy.orm import Session
from config.db import SessionLocal
from core.models import Job, User
from typing import Optional, List
from decimal import Decimal
from datetime import datetime


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def search_jobs():
    """Search and filter jobs"""
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
    """Get a single job by ID"""
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
    """Create a new job posting"""
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
    """Update an existing job"""
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
    """Delete a job"""
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
    """Convert Job model to dictionary matching frontend Job type"""
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
