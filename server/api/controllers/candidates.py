<<<<<<< HEAD
from flask import jsonify, request, send_from_directory
from services.candidates_service import (
    get_all_candidates,
    get_candidate_by_id,
    update_candidate_info,
    save_candidate_cv,
    get_candidate_cv_path,
)

# from werkzeug.utils import secure_filename
import os


def list_candidates():
    candidates = get_all_candidates()
    return jsonify({"candidates": candidates, "count": len(candidates)})


def get_candidate(id):
    candidate = get_candidate_by_id(id)
    if not candidate:
        return jsonify({"error": "Candidate not found"}), 404
    return jsonify({"candidate": candidate})


def update_candidate(id):
    update_data = request.json
    updated_candidate = update_candidate_info(id, update_data)
    if not updated_candidate:
        return jsonify({"error": "Candidate not found"}), 404
    return jsonify({"message": "Candidate updated", "candidate": updated_candidate})


# UPLOAD CV

ALLOWED_EXTENSIONS = {"pdf", "doc", "docx"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_cv(id):
    if "file" not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return (
            jsonify({"error": "Invalid file type. Only PDF, DOC, DOCX allowed."}),
            400,
        )

    filename = f"cv_{id}.pdf"
    file_path = os.path.join("uploads/cvs", f"{filename}")

    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    file.save(file_path)

    resume_url = f"/uploads/cvs/{filename}"
    updated_candidate = save_candidate_cv(id, resume_url)

    if not updated_candidate:
        return jsonify({"error": "Candidate not found"}), 404

    return jsonify({"message": "CV uploaded successfully", "resume_url": resume_url})


def get_candidate_cv(id):
    filename = get_candidate_cv_path(id)
    if filename:
        return send_from_directory("uploads", filename, as_attachment=False)
    return jsonify({"error": "CV not found"}), 404
=======
from flask import request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from sqlalchemy.orm import Session
from config.db import SessionLocal
from core.models import User, SavedJob, Job, Skill, Education, Experience, user_skills
from typing import Optional
import os
from datetime import datetime


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_candidate(candidate_id: int):
    """Get candidate profile with skills, education, and experience"""
    db: Session = next(get_db())

    try:
        user = (
            db.query(User)
            .filter(User.id == candidate_id, User.role == "candidate")
            .first()
        )

        if not user:
            return jsonify({"error": "Candidate not found"}), 404

        # Get skills
        skills = [{"id": skill.id, "name": skill.name} for skill in user.skills]

        # Get education
        educations = [
            {
                "id": edu.id,
                "school_name": edu.school_name,
                "degree": edu.degree,
                "field_of_study": edu.field_of_study,
                "start_date": edu.start_date.isoformat() if edu.start_date else None,
                "end_date": edu.end_date.isoformat() if edu.end_date else None,
                "description": edu.description,
            }
            for edu in user.educations
        ]

        # Get experience
        experiences = [
            {
                "id": exp.id,
                "job_title": exp.job_title,
                "company": exp.company,
                "start_date": exp.start_date.isoformat() if exp.start_date else None,
                "end_date": exp.end_date.isoformat() if exp.end_date else None,
                "description": exp.description,
            }
            for exp in user.experiences
        ]

        return (
            jsonify(
                {
                    "id": user.id,
                    "user_id": user.id,
                    "full_name": user.full_name,
                    "email": user.email,
                    "phone": user.phone,
                    "location": user.location,
                    "bio": user.bio,
                    "headline": user.headLine,
                    "resume_url": user.resume_url,
                    "cv_file_path": user.resume_url,
                    "skills": skills,
                    "educations": educations,
                    "experiences": experiences,
                    "user": {
                        "id": user.id,
                        "full_name": user.full_name,
                        "email": user.email,
                        "role": user.role,
                        "image": user.image,
                    },
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def update_candidate(candidate_id: int):
    """Update candidate profile"""
    db: Session = next(get_db())

    try:
        user = (
            db.query(User)
            .filter(User.id == candidate_id, User.role == "candidate")
            .first()
        )

        if not user:
            return jsonify({"error": "Candidate not found"}), 404

        data = request.get_json()

        # Update basic fields
        if "full_name" in data:
            user.full_name = data["full_name"]
        if "email" in data:
            # Check if email is already taken by another user
            existing_user = (
                db.query(User)
                .filter(User.email == data["email"], User.id != candidate_id)
                .first()
            )
            if existing_user:
                return jsonify({"error": "Email already taken"}), 400
            user.email = data["email"]
        if "phone" in data:
            user.phone = data.get("phone")
        if "location" in data:
            user.location = data.get("location")
        if "bio" in data:
            user.bio = data.get("bio")
        if "headLine" in data or "headline" in data:
            user.headLine = data.get("headLine") or data.get("headline")

        # Update skills if provided
        if "skills" in data:
            skill_ids = [
                s.get("id") if isinstance(s, dict) else s for s in data["skills"]
            ]
            skills = db.query(Skill).filter(Skill.id.in_(skill_ids)).all()
            user.skills = skills

        # Update education if provided
        if "educations" in data:
            # Delete existing educations
            db.query(Education).filter(Education.user_id == candidate_id).delete()
            # Add new educations
            for edu_data in data["educations"]:
                education = Education(
                    user_id=candidate_id,
                    school_name=edu_data.get("school_name"),
                    degree=edu_data.get("degree"),
                    field_of_study=edu_data.get("field_of_study"),
                    start_date=(
                        datetime.fromisoformat(
                            edu_data["start_date"].replace("Z", "+00:00")
                        )
                        if edu_data.get("start_date")
                        else None
                    ),
                    end_date=(
                        datetime.fromisoformat(
                            edu_data["end_date"].replace("Z", "+00:00")
                        )
                        if edu_data.get("end_date")
                        else None
                    ),
                    description=edu_data.get("description"),
                )
                db.add(education)

        # Update experience if provided
        if "experiences" in data:
            # Delete existing experiences
            db.query(Experience).filter(Experience.user_id == candidate_id).delete()
            # Add new experiences
            for exp_data in data["experiences"]:
                experience = Experience(
                    user_id=candidate_id,
                    job_title=exp_data.get("job_title"),
                    company=exp_data.get("company"),
                    start_date=(
                        datetime.fromisoformat(
                            exp_data["start_date"].replace("Z", "+00:00")
                        )
                        if exp_data.get("start_date")
                        else None
                    ),
                    end_date=(
                        datetime.fromisoformat(
                            exp_data["end_date"].replace("Z", "+00:00")
                        )
                        if exp_data.get("end_date")
                        else None
                    ),
                    description=exp_data.get("description"),
                )
                db.add(experience)

        db.commit()
        db.refresh(user)

        # Return updated profile
        skills = [{"id": skill.id, "name": skill.name} for skill in user.skills]
        educations = [
            {
                "id": edu.id,
                "school_name": edu.school_name,
                "degree": edu.degree,
                "field_of_study": edu.field_of_study,
                "start_date": edu.start_date.isoformat() if edu.start_date else None,
                "end_date": edu.end_date.isoformat() if edu.end_date else None,
                "description": edu.description,
            }
            for edu in user.educations
        ]
        experiences = [
            {
                "id": exp.id,
                "job_title": exp.job_title,
                "company": exp.company,
                "start_date": exp.start_date.isoformat() if exp.start_date else None,
                "end_date": exp.end_date.isoformat() if exp.end_date else None,
                "description": exp.description,
            }
            for exp in user.experiences
        ]

        return (
            jsonify(
                {
                    "id": user.id,
                    "user_id": user.id,
                    "full_name": user.full_name,
                    "email": user.email,
                    "phone": user.phone,
                    "location": user.location,
                    "bio": user.bio,
                    "headline": user.headLine,
                    "resume_url": user.resume_url,
                    "cv_file_path": user.resume_url,
                    "skills": skills,
                    "educations": educations,
                    "experiences": experiences,
                }
            ),
            200,
        )

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def upload_cv(candidate_id: int):
    """Upload CV file for candidate"""
    db: Session = next(get_db())

    try:
        user = (
            db.query(User)
            .filter(User.id == candidate_id, User.role == "candidate")
            .first()
        )

        if not user:
            return jsonify({"error": "Candidate not found"}), 404

        if "cv" not in request.files and "cv_file" not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files.get("cv") or request.files.get("cv_file")

        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        # Check file extension
        allowed_extensions = {"pdf", "doc", "docx"}
        file_ext = (
            file.filename.rsplit(".", 1)[1].lower() if "." in file.filename else ""
        )

        if file_ext not in allowed_extensions:
            return (
                jsonify({"error": "Invalid file type. Only PDF, DOC, DOCX allowed."}),
                400,
            )

        # Create uploads directory if it doesn't exist
        upload_dir = "uploads/cvs"
        os.makedirs(upload_dir, exist_ok=True)

        # Generate filename
        filename = f"cv_{candidate_id}.{file_ext}"
        filepath = os.path.join(upload_dir, filename)

        # Save file
        file.save(filepath)

        # Update user's resume_url
        resume_url = f"/uploads/cvs/{filename}"
        user.resume_url = resume_url
        db.commit()

        return (
            jsonify(
                {
                    "message": "CV uploaded successfully",
                    "cv_file_path": resume_url,
                    "resume_url": resume_url,
                }
            ),
            200,
        )

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def upload_profile_image(candidate_id: int):
    """Upload profile image for candidate"""
    db: Session = next(get_db())

    try:
        user = (
            db.query(User)
            .filter(User.id == candidate_id, User.role == "candidate")
            .first()
        )

        if not user:
            return jsonify({"error": "Candidate not found"}), 404

        if "image" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["image"]
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        filename = secure_filename(file.filename)
        ext = filename.rsplit(".", 1)[-1].lower()
        if ext not in ["png", "jpg", "jpeg", "webp"]:
            return jsonify({"error": "Invalid file type"}), 400

        upload_dir = os.path.join(os.getcwd(), "uploads", "profile")
        os.makedirs(upload_dir, exist_ok=True)

        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
        saved_name = f"user_{candidate_id}_{timestamp}.{ext}"
        save_path = os.path.join(upload_dir, saved_name)
        file.save(save_path)

        image_url = f"/uploads/profile/{saved_name}"
        user.image = image_url
        db.commit()
        db.refresh(user)

        return jsonify({"image": image_url}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def get_saved_jobs(candidate_id: int):
    """Get all saved jobs for a candidate"""
    db: Session = next(get_db())

    try:
        user = (
            db.query(User)
            .filter(User.id == candidate_id, User.role == "candidate")
            .first()
        )

        if not user:
            return jsonify({"error": "Candidate not found"}), 404

        saved_jobs = db.query(SavedJob).filter(SavedJob.user_id == candidate_id).all()

        jobs_data = []
        for saved_job in saved_jobs:
            job = saved_job.job
            if job:
                jobs_data.append(
                    {
                        "id": job.id,
                        "title": job.title,
                        "description": job.description,
                        "company_name": job.company_name,
                        "employer_id": job.employer_id,
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
                            job.application_deadline.isoformat()
                            if job.application_deadline
                            else None
                        ),
                        "posted_at": (
                            job.posted_at.isoformat() if job.posted_at else None
                        ),
                        "updated_at": (
                            job.updated_at.isoformat() if job.updated_at else None
                        ),
                        "saved_at": (
                            saved_job.saved_at.isoformat()
                            if saved_job.saved_at
                            else None
                        ),
                    }
                )

        return jsonify(jobs_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def add_skill(candidate_id: int):
    """Add skill to candidate"""
    db: Session = next(get_db())

    try:
        user = (
            db.query(User)
            .filter(User.id == candidate_id, User.role == "candidate")
            .first()
        )

        if not user:
            return jsonify({"error": "Candidate not found"}), 404

        data = request.get_json()
        skill_id = data.get("skill_id") or data.get("id")

        if not skill_id:
            return jsonify({"error": "skill_id is required"}), 400

        skill = db.query(Skill).filter(Skill.id == skill_id).first()
        if not skill:
            return jsonify({"error": "Skill not found"}), 404

        if skill not in user.skills:
            user.skills.append(skill)
            db.commit()

        return jsonify({"message": "Skill added successfully"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def remove_skill(candidate_id: int, skill_id: int):
    """Remove skill from candidate"""
    db: Session = next(get_db())

    try:
        user = (
            db.query(User)
            .filter(User.id == candidate_id, User.role == "candidate")
            .first()
        )

        if not user:
            return jsonify({"error": "Candidate not found"}), 404

        skill = db.query(Skill).filter(Skill.id == skill_id).first()
        if not skill:
            return jsonify({"error": "Skill not found"}), 404

        if skill in user.skills:
            user.skills.remove(skill)
            db.commit()

        return jsonify({"message": "Skill removed successfully"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
>>>>>>> fbca91c5564ea8cf54d4f8aba82220e1422906ee
