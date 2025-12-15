from flask import request, jsonify
from sqlalchemy import or_, and_
from sqlalchemy.orm import Session
from api.config.db import SessionLocal
from api.core.models import Job, User
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
                Job.company.ilike(f"%{search}%"),
            )
            query = query.filter(search_filter)

        # Apply location filter
        if location:
            query = query.filter(Job.location.ilike(f"%{location}%"))

        # Apply salary filter (salary_range is a string, so filtering is limited)
        # Skip salary filtering for now as salary_range is stored as string in model
        if salary_min:
            pass

        # Apply skill filter
        if skill:
            query = query.filter(Job.skills.contains([skill]))

        # Get total count before pagination
        total = query.count()

        # Apply pagination
        offset = (page - 1) * limit
        jobs = query.order_by(Job.created_at.desc()).offset(offset).limit(limit).all()

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
        required_fields = ["title", "description", "company", "employer_id"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Create new job
        job = Job(
            title=data["title"],
            description=data["description"],
            company=data["company"],
            employer_id=data["employer_id"],
            location=data.get("location"),
            salary_range=data.get("salary_range"),
            emp_type=data.get("emp_type"),
            category_id=data.get("category_id"),
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
        if "company" in data:
            job.company = data["company"]
        if "location" in data:
            job.location = data["location"]
        if "salary_range" in data:
            job.salary_range = data["salary_range"]
        if "emp_type" in data:
            job.emp_type = data["emp_type"]
        if "category_id" in data:
            job.category_id = data["category_id"]

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
    """Convert Job model to dictionary"""
    return {
        "id": str(job.id),
        "title": job.title,
        "description": job.description,
        "company": job.company,
        "employer_id": str(job.employer_id),
        "category_id": job.category_id,
        "location": job.location,
        "salary_range": job.salary_range,
        "emp_type": job.emp_type,
        "created_at": job.created_at.isoformat() if job.created_at else None,
        "updated_at": job.updated_at.isoformat() if job.updated_at else None,
    }
