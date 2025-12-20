from flask import request, jsonify
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from sqlalchemy.orm import Session
from config.db import SessionLocal
from core.models import User
from middlewares.auth import is_auth


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_employer(employer_id: int):
    """Get employer profile"""
    db: Session = next(get_db())

    try:
        user = (
            db.query(User)
            .filter(User.id == employer_id, User.role == "employer")
            .first()
        )

        if not user:
            return jsonify({"error": "Employer not found"}), 404

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
                    "company_name": user.companyName,
                    "website": user.webSite,
                    "image": user.image,
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


@is_auth
def update_employer():
    """Update employer profile"""
    db: Session = next(get_db())

    try:
        user = (
            db.query(User)
            .filter(User.id == request.user_id, User.role == "employer")
            .first()
        )

        if not user:
            return jsonify({"error": "Employer not found"}), 404

        data = request.get_json(silent=True) or {}

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
        if "headLine" in data or "headline" in data:
            user.headLine = data.get("headLine") or data.get("headline")
        if "bio" in data:
            user.bio = data.get("bio")
        if "companyName" in data:
            user.companyName = data.get("companyName")
        if "website" in data:
            user.webSite = data.get("website")

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
                    "company_name": user.companyName,
                    "website": user.webSite,
                    "image": user.image,
                }
            ),
            200,
        )

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def upload_profile_image(employer_id: int):
    """Upload profile image for employer"""
    db: Session = next(get_db())

    try:
        user = (
            db.query(User)
            .filter(User.id == employer_id, User.role == "employer")
            .first()
        )

        if not user:
            return jsonify({"error": "Employer not found"}), 404

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
        saved_name = f"user_{employer_id}_{timestamp}.{ext}"
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


def get_random_employers():
    """Get 5 random employers who are not the current user and not already connected"""
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

        employers = (
            db.query(User)
            .filter(
                User.role == "employer",
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
                        "id": emp.id,
                        "full_name": emp.full_name,
                        "company_name": emp.companyName,
                        "image": emp.image,
                        "role": emp.role,
                    }
                    for emp in employers
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
