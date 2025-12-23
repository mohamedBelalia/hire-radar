from flask import request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from sqlalchemy import or_, and_
from sqlalchemy.orm import Session
from config.db import SessionLocal
from core.models import (
    Job,
    User,
    SavedJob,
    Application,
    Skill,
    job_skills,
    Notification,
    Report,
)
from controllers.utils import get_user_id_from_token
from typing import Optional, List
from decimal import Decimal
from datetime import datetime
import os
from middlewares.auth import is_auth
from sqlalchemy.orm import Session
from sqlalchemy import desc

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()




@is_auth
def get_jobs_for_user():
    db: Session = next(get_db())

    try:
        user_id = request.user_id
        page = int(request.args.get("page", 1))
        page_size = 10

        # Fetch user
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        user_skill_ids = [skill.id for skill in user.skills]

        
        print(user_skill_ids)
        user_location = user.location or ""

        jobs_query = db.query(Job)

        # if user_location:
        #     jobs_query = jobs_query.filter(Job.location.ilike(f"%{user_location}%"))

        if user_skill_ids:
            jobs_query = jobs_query.join(Job.skills).filter(Job.skills.any(Skill.id.in_(user_skill_ids)))

        

        jobs_query = jobs_query.order_by(desc(Job.created_at))

        total_jobs = jobs_query.count()
        total_pages = (total_jobs + page_size - 1) // page_size
        
        jobs = jobs_query.offset((page - 1) * page_size).limit(page_size).all()

        results = []
        for job in jobs:
            results.append({
                "id": job.id,
                "title": job.title,
                "company": job.company,
                "category": job.category.name if job.category else None,
                "location": job.location,
                "salary_range": job.salary_range,
                "emp_type": job.emp_type,
                "description": job.description,
                "responsibilities": job.responsibilities or [],
                "skills": [skill.name for skill in job.skills],
                "created_at": job.created_at.isoformat() if job.created_at else None,
                "employer": {
                    "id": job.employer.id,
                    "full_name": job.employer.full_name,
                    "image": job.employer.image,
                    "headline": getattr(job.employer, "headLine", ""),
                },
                "applicants": len(job.applicants),
            })

        
        return jsonify({
            "jobs": results,
            "total": total_jobs,
            "total_pages": total_pages,
            "page": page
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def search_jobs():
    """Search and filter jobs"""
    db: Session = next(get_db())

    try:
        search = request.args.get("search", "").strip()
        location = request.args.get("location", "").strip()
        salary_min = request.args.get("salary_min")
        skill = request.args.get("skill", "").strip()
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))

        query = db.query(Job)

        if search:
            search_filter = or_(
                Job.title.ilike(f"%{search}%"),
                Job.description.ilike(f"%{search}%"),
                Job.company_name.ilike(f"%{search}%"),
            )
            query = query.filter(search_filter)

        if location:
            query = query.filter(Job.location.ilike(f"%{location}%"))

        if salary_min:
            try:
                min_salary = Decimal(salary_min)
                query = query.filter(Job.salary_min >= min_salary)
            except (ValueError, TypeError):
                pass

        if skill:
            query = query.filter(Job.skills.contains([skill]))

        total = query.count()

        offset = (page - 1) * limit
        jobs = query.order_by(Job.posted_at.desc()).offset(offset).limit(limit).all()

        total_pages = (total + limit - 1) // limit

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
        # Authenticate user from JWT token
        try:
            user_id = get_user_id_from_token()
        except ValueError as e:
            return jsonify({"error": str(e)}), 401

        # Get user details
        employer = db.query(User).filter(User.id == user_id).first()
        if not employer:
            return jsonify({"error": "User not found"}), 404

        # Verify user is an employer
        if employer.role != "employer":
            return (
                jsonify(
                    {
                        "error": "Only employers can post jobs",
                        "current_role": employer.role,
                    }
                ),
                403,
            )

        data = request.get_json()

        # Validate required fields
        required_fields = ["title", "description", "location"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Validate and retrieve skills from database by IDs
        skill_ids = data.get("skill_ids", [])
        skill_names = data.get("skill_names", [])
        job_skills = []

        # Handle skill_ids (existing skills by ID)
        if skill_ids:
            # Validate skill_ids are integers
            try:
                skill_ids = [int(id) for id in skill_ids]
            except (ValueError, TypeError):
                return (
                    jsonify(
                        {
                            "error": "Invalid skill_ids format. Expected array of integers",
                            "example": "skill_ids: [1, 2, 3]",
                        }
                    ),
                    400,
                )

            # Query existing skills
            existing_skills = db.query(Skill).filter(Skill.id.in_(skill_ids)).all()
            existing_skill_ids = {s.id for s in existing_skills}

            # Check for missing skill IDs
            missing_skill_ids = set(skill_ids) - existing_skill_ids
            if missing_skill_ids:
                return (
                    jsonify(
                        {
                            "error": "Some skill IDs don't exist in the database",
                            "missing_skill_ids": list(missing_skill_ids),
                            "hint": "Use only valid skill IDs. Available endpoint: GET /api/skills",
                        }
                    ),
                    400,
                )

            job_skills.extend(existing_skills)

        # Handle skill_names (create new skills if they don't exist)
        if skill_names:
            for skill_name in skill_names:
                if skill_name.strip():
                    skill = create_skill_if_not_exists(skill_name, db)
                    if skill not in job_skills:
                        job_skills.append(skill)

        # Create new job
        job = Job(
            title=data["title"],
            description=data["description"],
            company=data.get("company", employer.companyName or ""),
            employer_id=employer.id,
            location=data.get("location"),
            salary_range=data.get("salary_range"),
            emp_type=data.get("employment_type"),
            responsibilities=data.get("responsibilities"),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        # Set the relationship with employer
        job.employer = employer

        # Set the many-to-many relationship with skills
        if job_skills:
            job.skills = job_skills

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
        # Authenticate user from JWT token
        try:
            user_id = get_user_id_from_token()
        except ValueError as e:
            return jsonify({"error": str(e)}), 401

        job = db.query(Job).filter(Job.id == job_id).first()

        if not job:
            return jsonify({"error": "Job not found"}), 404

        # Verify user is the employer who posted the job
        if job.employer_id != user_id:
            return jsonify({"error": "You can only update jobs you posted"}), 403

        data = request.get_json()

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
        if "responsibilities" in data:
            job.responsibilities = data["responsibilities"]

        # Handle skills update with validation
        if "skill_ids" in data:
            skill_ids = data.get("skill_ids", [])
            job_skills = []

            # Validate skill_ids are integers
            try:
                skill_ids = [int(id) for id in skill_ids]
            except (ValueError, TypeError):
                return (
                    jsonify(
                        {
                            "error": "Invalid skill_ids format. Expected array of integers",
                            "example": "skill_ids: [1, 2, 3]",
                        }
                    ),
                    400,
                )

            if skill_ids:
                # Query existing skills
                existing_skills = db.query(Skill).filter(Skill.id.in_(skill_ids)).all()
                existing_skill_ids = {s.id for s in existing_skills}

                # Check for missing skill IDs
                missing_skill_ids = set(skill_ids) - existing_skill_ids
                if missing_skill_ids:
                    return (
                        jsonify(
                            {
                                "error": "Some skill IDs don't exist in the database",
                                "missing_skill_ids": list(missing_skill_ids),
                                "hint": "Use only valid skill IDs. Available endpoint: GET /api/skills",
                            }
                        ),
                        400,
                    )

                job_skills = existing_skills

            job.skills = job_skills

        job.updated_at = datetime.utcnow()
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
        # Authenticate user from JWT token
        try:
            user_id = get_user_id_from_token()
        except ValueError as e:
            return jsonify({"error": str(e)}), 401

        job = db.query(Job).filter(Job.id == job_id).first()

        if not job:
            return jsonify({"error": "Job not found"}), 404

        # Verify user is the employer who posted the job
        if job.employer_id != user_id:
            return jsonify({"error": "You can only delete jobs you posted"}), 403

        db.delete(job)
        db.commit()

        return jsonify({"message": "Job deleted successfully"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def save_job(job_id: int):
    """Save a job for a user"""
    db: Session = next(get_db())

    try:
        try:
            user_id = get_user_id_from_token()
        except ValueError as e:
            return jsonify({"error": str(e)}), 401

        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            return jsonify({"error": "Job not found"}), 404
        existing = (
            db.query(SavedJob)
            .filter(SavedJob.user_id == user_id, SavedJob.job_id == job_id)
            .first()
        )

        if existing:
            return jsonify({"message": "Job already saved"}), 200

        saved_job = SavedJob(user_id=user_id, job_id=job_id)
        db.add(saved_job)
        db.commit()

        return jsonify({"message": "Job saved successfully"}), 201

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def unsave_job(job_id: int):
    """Unsave a job for a user"""
    db: Session = next(get_db())

    try:
        try:
            user_id = get_user_id_from_token()
        except ValueError as e:
            return jsonify({"error": str(e)}), 401

        saved_job = (
            db.query(SavedJob)
            .filter(SavedJob.user_id == user_id, SavedJob.job_id == job_id)
            .first()
        )

        if not saved_job:
            return jsonify({"error": "Job not found in saved jobs"}), 404

        db.delete(saved_job)
        db.commit()

        return jsonify({"message": "Job unsaved successfully"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def apply_to_job(job_id: int):
    """Apply to a job"""
    db: Session = next(get_db())

    try:
        try:
            user_id = get_user_id_from_token()
        except ValueError as e:
            return jsonify({"error": str(e)}), 401

        cover_letter = None
        if request.form:
            cover_letter = request.form.get("cover_letter")
        elif request.is_json:
            data = request.get_json()
            cover_letter = data.get("cover_letter")

        job = (
            db.query(Job)
            .options()
            .filter(Job.id == job_id)
            .first()
        )
        if not job:
            return jsonify({"error": "Job not found"}), 404
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        existing = (
            db.query(Application)
            .filter(Application.user_id == user_id, Application.job_id == job_id)
            .first()
        )

        if existing:
            return jsonify({"error": "You have already applied to this job"}), 400

        cv_file_path = None
        if "cv_file" in request.files or "cv" in request.files:
            file = request.files.get("cv_file") or request.files.get("cv")

            if file and file.filename:
                allowed_extensions = {"pdf", "doc", "docx"}
                file_ext = (
                    file.filename.rsplit(".", 1)[1].lower()
                    if "." in file.filename
                    else ""
                )

                if file_ext not in allowed_extensions:
                    return (
                        jsonify(
                            {"error": "Invalid file type. Only PDF, DOC, DOCX allowed."}
                        ),
                        400,
                    )

                upload_dir = "uploads/applications"
                os.makedirs(upload_dir, exist_ok=True)

                filename = f"cv_{user_id}_job_{job_id}.{file_ext}"
                filepath = os.path.join(upload_dir, filename)

                file.save(filepath)
                cv_file_path = f"/uploads/applications/{filename}"

        application = Application(
            job_id=job_id,
            user_id=user_id,
            cover_letter=cover_letter,
            resume_url=cv_file_path,
            status="pending",
        )

        db.add(application)

        # Track applicants relationship
        if user not in job.applicants:
            job.applicants.append(user)

        # Notify employer (avoid self-notify)
        if job.employer_id and job.employer_id != user_id:
            notification = Notification(
                sender_id=user_id,
                receiver_id=job.employer_id,
                type="job_application",
                title=f"New application for {job.title}",
                message=f"{user.full_name} applied to your job \"{job.title}\"",
            )
            db.add(notification)

        db.commit()
        db.refresh(application)

        return (
            jsonify(
                {
                    "message": "Application submitted successfully",
                    "application_id": application.id,
                }
            ),
            201,
        )

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def report_job(job_id: int):
    """Report a job with a reason"""
    db: Session = next(get_db())

    try:
        try:
            user_id = get_user_id_from_token()
        except ValueError as e:
            return jsonify({"error": str(e)}), 401

        data = request.get_json() or {}
        reason = (data.get("reason") or "").strip()
        if not reason:
            return jsonify({"error": "Reason is required"}), 400

        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            return jsonify({"error": "Job not found"}), 404

        # Prevent duplicate reports by same user for same job
        existing = (
            db.query(Report)
            .filter(Report.user_id == user_id, Report.job_id == job_id)
            .first()
        )
        if existing:
            return jsonify({"error": "You already reported this job"}), 400

        report = Report(user_id=user_id, job_id=job_id, reason=reason)
        db.add(report)
        db.commit()

        return jsonify({"message": "Report submitted"}), 201

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def get_employer_jobs():
    """Get all jobs created by the authenticated employer"""
    db: Session = next(get_db())

    try:
        # Authenticate user from JWT token
        try:
            user_id = get_user_id_from_token()
        except ValueError as e:
            return jsonify({"error": str(e)}), 401

        # Get user and verify is employer
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        if user.role != "employer":
            return (
                jsonify({"error": "Only employers can access their job listings"}),
                403,
            )

        # Get pagination parameters
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        sort = request.args.get("sort", "created_at")  # created_at or title
        order = request.args.get("order", "desc")  # asc or desc

        # Build query for jobs by this employer
        query = db.query(Job).filter(Job.employer_id == user_id)

        # Apply sorting
        if sort == "title":
            sort_column = Job.title
        else:
            sort_column = Job.created_at

        if order.lower() == "asc":
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        # Get total count
        total = query.count()

        # Apply pagination
        offset = (page - 1) * limit
        jobs = query.offset(offset).limit(limit).all()

        # Calculate total pages
        total_pages = (total + limit - 1) // limit

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


def job_to_dict(job: Job) -> dict:
    """Convert Job model to dictionary"""
    employer = getattr(job, "employer", None)
    category = getattr(job, "category", None)
    return {
        "id": job.id,
        "title": job.title,
        "description": job.description,
        "company": job.company,
        "employer_id": job.employer_id,
        "employer": {
            "id": employer.id if employer else None,
            "full_name": getattr(employer, "full_name", None) if employer else None,
            "email": getattr(employer, "email", None) if employer else None,
            "role": getattr(employer, "role", None) if employer else None,
            "headLine": getattr(employer, "headLine", None) if employer else None,
            "image": getattr(employer, "image", None) if employer else None,
        }
        if employer
        else None,
        "location": job.location,
        "category": category.name if category else None,
        "salary_range": job.salary_range,
        "emp_type": job.emp_type,
        "responsibilities": job.responsibilities,
        "skills": [
            {"id": skill.id, "name": skill.name} for skill in (job.skills or [])
        ],
        "created_at": job.created_at.isoformat() if job.created_at else None,
        "updated_at": job.updated_at.isoformat() if job.updated_at else None,
        "applicants_count": len(job.applicants) if job.applicants else 0,
    }


def get_skills():
    """Get all available skills (public endpoint)"""
    db: Session = next(get_db())

    try:
        skills = db.query(Skill).order_by(Skill.name).all()

        return jsonify({"skills": [{"id": s.id, "name": s.name} for s in skills]}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def create_skill_if_not_exists(skill_name: str, db: Session) -> Skill:
    """Create a skill if it doesn't exist, return the existing or new skill"""
    # Check if skill exists (case-insensitive)
    existing_skill = (
        db.query(Skill).filter(Skill.name.ilike(skill_name.strip())).first()
    )

    if existing_skill:
        return existing_skill

    # Create new skill
    new_skill = Skill(name=skill_name.strip())
    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)

    return new_skill


def create_or_get_skill():
    """Create a new skill or get existing one (public endpoint)"""
    db: Session = next(get_db())

    try:
        data = request.get_json()
        skill_name = data.get("name", "").strip()

        if not skill_name:
            return jsonify({"error": "Skill name is required"}), 400

        skill = create_skill_if_not_exists(skill_name, db)

        return (
            jsonify(
                {
                    "id": skill.id,
                    "name": skill.name,
                    "message": "Skill created" if skill.id else "Skill already exists",
                }
            ),
            201,
        )

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
