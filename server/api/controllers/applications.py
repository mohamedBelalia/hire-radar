from flask import request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from sqlalchemy.orm import Session
from config.db import SessionLocal
from core.models import Application, Job, User
from typing import Optional
import os
from datetime import datetime


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_all_applications():
    """Get all applications (for employers)"""
    db: Session = next(get_db())

    try:
        job_id = request.args.get("job_id")

        query = db.query(Application)

        if job_id:
            query = query.filter(Application.job_id == job_id)

        applications = query.order_by(Application.applied_at.desc()).all()

        applications_data = []
        for app in applications:
            job = app.job
            user = app.user

            applications_data.append(
                {
                    "id": app.id,
                    "job_id": app.job_id,
                    "candidate_id": app.user_id,
                    "user_id": app.user_id,
                    "cover_letter": app.cover_letter,
                    "cv_file_path": app.cv_file_path,
                    "resume_url": app.cv_file_path,
                    "status": app.status,
                    "applied_at": (
                        app.applied_at.isoformat() if app.applied_at else None
                    ),
                    "job": (
                        {
                            "id": job.id,
                            "title": job.title,
                            "company_name": job.company_name,
                        }
                        if job
                        else None
                    ),
                    "candidate": (
                        {
                            "id": user.id,
                            "full_name": user.full_name,
                            "email": user.email,
                        }
                        if user
                        else None
                    ),
                }
            )

        return jsonify(applications_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def get_application(application_id: int):
    """Get a single application by ID"""
    db: Session = next(get_db())

    try:
        app = db.query(Application).filter(Application.id == application_id).first()

        if not app:
            return jsonify({"error": "Application not found"}), 404

        job = app.job
        user = app.user

        return (
            jsonify(
                {
                    "id": app.id,
                    "job_id": app.job_id,
                    "candidate_id": app.user_id,
                    "user_id": app.user_id,
                    "cover_letter": app.cover_letter,
                    "cv_file_path": app.cv_file_path,
                    "resume_url": app.cv_file_path,
                    "status": app.status,
                    "applied_at": (
                        app.applied_at.isoformat() if app.applied_at else None
                    ),
                    "job": (
                        {
                            "id": job.id,
                            "title": job.title,
                            "company_name": job.company_name,
                        }
                        if job
                        else None
                    ),
                    "candidate": (
                        {
                            "id": user.id,
                            "full_name": user.full_name,
                            "email": user.email,
                        }
                        if user
                        else None
                    ),
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def update_application(application_id: int):
    """Update application status"""
    db: Session = next(get_db())

    try:
        app = db.query(Application).filter(Application.id == application_id).first()

        if not app:
            return jsonify({"error": "Application not found"}), 404

        data = request.get_json()

        if "status" in data:
            valid_statuses = ["pending", "reviewed", "accepted", "rejected"]
            if data["status"] in valid_statuses:
                app.status = data["status"]
            else:
                return (
                    jsonify(
                        {"error": f"Invalid status. Must be one of: {valid_statuses}"}
                    ),
                    400,
                )

        db.commit()
        db.refresh(app)

        return (
            jsonify(
                {
                    "id": app.id,
                    "job_id": app.job_id,
                    "candidate_id": app.user_id,
                    "user_id": app.user_id,
                    "cover_letter": app.cover_letter,
                    "cv_file_path": app.cv_file_path,
                    "status": app.status,
                    "applied_at": (
                        app.applied_at.isoformat() if app.applied_at else None
                    ),
                }
            ),
            200,
        )

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
