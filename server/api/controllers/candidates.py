from flask import request, jsonify
from werkzeug.utils import secure_filename
from sqlalchemy.orm import Session
from config.db import SessionLocal
from core.models import User, SavedJob, Education, Experience, Skill, user_skills
import os
from datetime import datetime
from middlewares.auth import is_auth 
from sqlalchemy import select

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



# Unified public user endpoint (read‑only, no auth)
def get_public_user(user_id: int):
    """Return public profile for any user (candidate or employer)."""
    db = next(get_db())
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        # Base fields common to all users
        response = {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "image": user.image,
            "location": user.location,
            "bio": user.bio,
            "headline": user.headLine,
            "website": user.webSite,
            "github_url": user.github_url,
            "resume_url": user.resume_url,
            "created_at": user.created_at.isoformat() if getattr(user, "created_at", None) else None,
        }
        # Candidate‑specific data
        if user.role == "candidate":
            response["skills"] = [{"id": s.id, "name": s.name} for s in user.skills]
            response["educations"] = [
                {
                    "id": e.id,
                    "school_name": e.school_name,
                    "degree": e.degree,
                    "field_of_study": e.field_of_study,
                    "start_date": e.start_date.isoformat() if e.start_date else None,
                    "end_date": e.end_date.isoformat() if e.end_date else None,
                    "description": e.description,
                }
                for e in user.educations
            ]
            response["experiences"] = [
                {
                    "id": ex.id,
                    "job_title": ex.job_title,
                    "company": ex.company,
                    "start_date": ex.start_date.isoformat() if ex.start_date else None,
                    "end_date": ex.end_date.isoformat() if ex.end_date else None,
                    "description": ex.description,
                }
                for ex in user.experiences
            ]
        # Employer‑specific data
        elif user.role == "employer":
            response["companyName"] = getattr(user, "companyName", None)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


@is_auth
def get_candidate_career():
    db = next(get_db())

    try:
        user = (
            db.query(User)
            .filter(User.id == request.user_id, User.role == "candidate")
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
                    "skills": skills,
                    "educations": educations,
                    "experiences": experiences,
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


@is_auth
def update_candidate():
    """Update candidate profile"""
    db: Session = next(get_db())

    try:
        user = (
            db.query(User)
            .filter(User.id == request.user_id, User.role == "candidate")
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
                .filter(User.email == data["email"], User.id != request.user_id)
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
        if "github_url" in data:
            user.github_url = data.get("github_url")
        if "website" in data:
            user.webSite = data.get("website") 
        if "companyName" in data:
            user.companyName = data.get("companyName")        
        
        print(data.get("github_url"))


        db.commit()
        db.refresh(user)

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




# career tab
@is_auth
def add_education():
    db: Session = next(get_db())

    try:
        user_id = request.user_id
        data = request.get_json()

        education = Education(
            user_id=user_id,
            school_name=data.get("school_name"),
            degree=data.get("degree"),
            field_of_study=data.get("field_of_study"),
            start_date=data.get("start_date"),
            end_date=data.get("end_date"),
            description=data.get("description"),
        )

        db.add(education)
        db.commit()
        db.refresh(education)

        # Return the newly added education
        return jsonify({
            "message": "Education added successfully",
            "education": {
                "id": education.id,
                "user_id": education.user_id,
                "school_name": education.school_name,
                "degree": education.degree,
                "field_of_study": education.field_of_study,
                "start_date": education.start_date,
                "end_date": education.end_date,
                "description": education.description,
            }
        }), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()




@is_auth
def update_education(education_id):
    db: Session = next(get_db())

    try:
        user_id = request.user_id
        data = request.get_json()

        education = (
            db.query(Education)
            .filter(Education.id == education_id, Education.user_id == user_id)
            .first()
        )

        if not education:
            return jsonify({"error": "Education not found"}), 404

        if "school_name" in data:
            education.school_name = data["school_name"]
        if "degree" in data:
            education.degree = data["degree"]
        if "field_of_study" in data:
            education.field_of_study = data["field_of_study"]
        if "start_date" in data:
            education.start_date = data["start_date"]
        if "end_date" in data:
            education.end_date = data["end_date"]
        if "description" in data:
            education.description = data["description"]

        db.commit()
        db.refresh(education)

        return jsonify({"message": "Education updated successfully"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()



@is_auth
def delete_education(education_id):
    db: Session = next(get_db())

    try:
        user_id = request.user_id

        education = (
            db.query(Education)
            .filter(Education.id == education_id, Education.user_id == user_id)
            .first()
        )

        if not education:
            return jsonify({"error": "Education not found"}), 404

        db.delete(education)
        db.commit()

        return jsonify({"message": "Education deleted successfully"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()





@is_auth
def add_experience():
    db: Session = next(get_db())

    try:
        user_id = request.user_id
        data = request.get_json()

        experience = Experience(
            user_id=user_id,
            job_title=data["job_title"],
            company=data.get("company"),
            start_date=data.get("start_date"),
            end_date=data.get("end_date"),
            description=data.get("description"),
        )

        db.add(experience)
        db.commit()
        db.refresh(experience)

        return jsonify({
            "message": "Experience added successfully",
            "experience": {
                "id": experience.id,
                "user_id": experience.user_id,
                "job_title": experience.job_title,
                "company": experience.company,
                "start_date": str(experience.start_date),
                "end_date": str(experience.end_date),
                "description": experience.description
            }
        }), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()




@is_auth
def update_experience(experience_id):
    db: Session = next(get_db())

    try:
        user_id = request.user_id
        data = request.get_json()

        experience = (
            db.query(Experience)
            .filter(Experience.id == experience_id, Experience.user_id == user_id)
            .first()
        )

        if not experience:
            return jsonify({"error": "Experience not found"}), 404

        if "job_title" in data:
            experience.job_title = data["job_title"]
        if "company" in data:
            experience.company = data["company"]
        if "start_date" in data:
            experience.start_date = data["start_date"]
        if "end_date" in data:
            experience.end_date = data["end_date"]
        if "description" in data:
            experience.description = data["description"]

        db.commit()
        db.refresh(experience)

        return jsonify({"message": "Experience updated successfully"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()




@is_auth
def delete_experience(experience_id):
    db: Session = next(get_db())

    try:
        user_id = request.user_id

        experience = (
            db.query(Experience)
            .filter(Experience.id == experience_id, Experience.user_id == user_id)
            .first()
        )

        if not experience:
            return jsonify({"error": "Experience not found"}), 404

        db.delete(experience)
        db.commit()

        return jsonify({"message": "Experience deleted successfully"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()



@is_auth
def get_skills():
    db: Session = next(get_db())

    try:
        # Get query param, e.g., /api/skills?query=python
        query = request.args.get("query", "").strip()

        skills_query = db.query(Skill)

        if query:
            skills_query = skills_query.filter(Skill.name.ilike(f"%{query}%"))

        skills = skills_query.order_by(Skill.name.asc()).all()

        skills_list = [{"id": skill.id, "name": skill.name} for skill in skills]

        return jsonify({"skills": skills_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


@is_auth
def add_skill():
    db: Session = next(get_db())

    try:
        user_id = request.user_id
        data = request.get_json()
        skill_name = data.get("name", "").strip()

        if not skill_name:
            return jsonify({"message": "Skill name is required"}), 400

        skill = (
            db.query(Skill)
            .filter(Skill.name.ilike(skill_name))
            .first()
        )

        if not skill:
            skill = Skill(name=skill_name)
            db.add(skill)
            db.commit()
            db.refresh(skill)

        user = db.query(User).filter(User.id == user_id).first()

        if skill in user.skills:
            return jsonify({
                "message": "Skill already added to user"
            }), 400

        user.skills.append(skill)
        db.commit()

        return jsonify({
            "message": "Skill added successfully",
            "skill": {
                "id": skill.id,
                "name": skill.name
            }
        }), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()



@is_auth
def delete_skill(skill_id):
    db: Session = next(get_db())

    try:
        user_id = request.user_id
        user = db.query(User).filter(User.id == user_id).first()

        skill = db.query(Skill).filter(Skill.id == skill_id).first()
        if not skill:
            return jsonify({"error": "Skill not found"}), 404

        # Remove skill from user's skills if exists
        if skill in user.skills:
            user.skills.remove(skill)
            db.commit()

        # Check if any other users have this skill
        stmt = select(user_skills).where(user_skills.c.skill_id == skill.id)
        result = db.execute(stmt).all()
        if len(result) == 0:
            db.delete(skill)
            db.commit()

        return jsonify({"message": "Skill removed successfully"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()