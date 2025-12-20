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

        if "full_name" in data:
            user.full_name = data["full_name"]
        if "email" in data:
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

        if "skills" in data:
            skill_ids = [
                s.get("id") if isinstance(s, dict) else s for s in data["skills"]
            ]
            skills = db.query(Skill).filter(Skill.id.in_(skill_ids)).all()
            user.skills = skills

        if "educations" in data:
            db.query(Education).filter(Education.user_id == candidate_id).delete()
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

        if "experiences" in data:
            db.query(Experience).filter(Experience.user_id == candidate_id).delete()
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

        allowed_extensions = {"pdf", "doc", "docx"}
        file_ext = (
            file.filename.rsplit(".", 1)[1].lower() if "." in file.filename else ""
        )

        if file_ext not in allowed_extensions:
            return (
                jsonify({"error": "Invalid file type. Only PDF, DOC, DOCX allowed."}),
                400,
            )

        upload_dir = "uploads/cvs"
        os.makedirs(upload_dir, exist_ok=True)
        filename = f"cv_{candidate_id}.{file_ext}"
        filepath = os.path.join(upload_dir, filename)

        file.save(filepath)

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
        return (
            jsonify(
                {
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
                    },
                }
            ),
            200,
        )

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

        return (
            jsonify(
                {
                    "message": "Experience added successfully",
                    "experience": {
                        "id": experience.id,
                        "user_id": experience.user_id,
                        "job_title": experience.job_title,
                        "company": experience.company,
                        "start_date": str(experience.start_date),
                        "end_date": str(experience.end_date),
                        "description": experience.description,
                    },
                }
            ),
            200,
        )

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

        skill = db.query(Skill).filter(Skill.name.ilike(skill_name)).first()

        if not skill:
            skill = Skill(name=skill_name)
            db.add(skill)
            db.commit()
            db.refresh(skill)

        user = db.query(User).filter(User.id == user_id).first()

        if skill in user.skills:
            return jsonify({"message": "Skill already added to user"}), 400

        user.skills.append(skill)
        db.commit()

        return (
            jsonify(
                {
                    "message": "Skill added successfully",
                    "skill": {"id": skill.id, "name": skill.name},
                }
            ),
            200,
        )

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


def get_random_candidates():
    """Get 5 random candidates who are not the current user and not already connected"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing or invalid Authorization header"}), 401

    import jwt
    import os
    from sqlalchemy.sql import func
    from core.models import ConnectionRequest

    token = auth_header.split(" ")[1]
    JWT_SECRET = os.getenv("JWT_SECRET", "secret123")

    db: Session = next(get_db())

    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        current_user_id = decoded["id"]

        subquery = (
            db.query(ConnectionRequest.receiver_id)
            .filter(ConnectionRequest.sender_id == current_user_id)
            .union(
                db.query(ConnectionRequest.sender_id).filter(
                    ConnectionRequest.receiver_id == current_user_id
                )
            )
        )

        candidates = (
            db.query(User)
            .filter(
                User.role == "candidate",
                User.id != current_user_id,
                ~User.id.in_(subquery),
            )
            .order_by(func.random())
            .limit(5)
            .all()
        )

        return (
            jsonify(
                [
                    {
                        "id": cand.id,
                        "full_name": cand.full_name,
                        "headline": cand.headLine,
                        "image": cand.image,
                        "role": cand.role,
                    }
                    for cand in candidates
                ]
            ),
            200,
        )

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
