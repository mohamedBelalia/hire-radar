"""Utility functions for controllers"""

from flask import request
import jwt
from api.config.db import SessionLocal
from api.core.models import User
import os
from dotenv import load_dotenv

load_dotenv()
JWT_SECRET = os.getenv("JWT_SECRET", "secret123")


def get_user_id_from_token() -> int:
    """Extract user ID from JWT token in Authorization header"""
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise ValueError("Missing or invalid Authorization header")

    token = auth_header.split(" ")[1]

    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return decoded["id"]
    except jwt.ExpiredSignatureError:
        raise ValueError("Token expired")
    except Exception:
        raise ValueError("Invalid token")


def get_current_user_from_token() -> User:
    """Get current user from JWT token"""
    user_id = get_user_id_from_token()
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
        return user
    finally:
        db.close()
