from flask import request, jsonify
from sqlalchemy.orm import Session
from config.db import SessionLocal
from core.models import User


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
        user = db.query(User).filter(
            User.id == employer_id,
            User.role == "employer"
        ).first()
        
        if not user:
            return jsonify({"error": "Employer not found"}), 404
        
        return jsonify({
            "id": user.id,
            "user_id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "location": user.location,
            "bio": user.bio,
            "company_name": user.company_name,
            "website": user.website,
            "image": user.image,
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role,
                "image": user.image,
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def update_employer(employer_id: int):
    """Update employer profile"""
    db: Session = next(get_db())
    
    try:
        user = db.query(User).filter(
            User.id == employer_id,
            User.role == "employer"
        ).first()
        
        if not user:
            return jsonify({"error": "Employer not found"}), 404
        
        data = request.get_json()
        
        # Update fields
        if "full_name" in data:
            user.full_name = data["full_name"]
        if "phone" in data:
            user.phone = data.get("phone")
        if "location" in data:
            user.location = data.get("location")
        if "bio" in data:
            user.bio = data.get("bio")
        if "company_name" in data:
            user.company_name = data.get("company_name")
        if "website" in data:
            user.website = data.get("website")
        
        db.commit()
        db.refresh(user)
        
        return jsonify({
            "id": user.id,
            "user_id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "location": user.location,
            "bio": user.bio,
            "company_name": user.company_name,
            "website": user.website,
            "image": user.image,
        }), 200
        
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
