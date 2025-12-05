from flask import request, jsonify, redirect, session
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
from dotenv import load_dotenv
from config.db import SessionLocal
from core.models import User

from google_auth_oauthlib.flow import Flow
import os

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
JWT_SECRET = os.getenv("JWT_SECRET", "secret123")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def google_login():
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uris": ["http://localhost:5000/auth/google/callback"],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=["openid", "email", "profile"],
    )

    flow.redirect_uri = "http://localhost:5000/auth/google/callback"

    authorization_url, state = flow.authorization_url(
        access_type="offline", include_granted_scopes="true"
    )

    session["state"] = state
    return redirect(authorization_url)


def google_callback():
    state = session.get("state")

    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uris": ["http://localhost:5000/auth/google/callback"],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=["openid", "email", "profile"],
        state=state
    )

    flow.redirect_uri = "http://localhost:5000/auth/google/callback"

    flow.fetch_token(authorization_response=request.url)

    from google.oauth2 import id_token
    from google.auth.transport import requests

    credentials = flow.credentials
    token_info = id_token.verify_oauth2_token(
        credentials.id_token,
        requests.Request(),
        GOOGLE_CLIENT_ID
    )

    email = token_info["email"]
    name = token_info.get("name", "Unknown")

    db = SessionLocal()
    try:
        user = db.query(User).filter_by(email=email).first()
        if not user:
            user = User(full_name=name, email=email, role="candidate")
            db.add(user)
            db.commit()
            db.refresh(user)

        token = jwt.encode(
            {"id": user.id, "exp": datetime.utcnow() + timedelta(hours=24)},
            JWT_SECRET,
            algorithm="HS256"
        )

        return jsonify({"token": token, "user": {"name": user.full_name, "email": user.email}})

    finally:
        db.close()


def get_current_user():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Missing token"}), 401

    db = SessionLocal()
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(User).get(decoded["id"])
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role
        })
    except Exception:
        return jsonify({"error": "Invalid token"}), 401
    finally:
        db.close()


def logout():
    session.clear()
    return jsonify({"message": "Logged out"})


def signup():
    data = request.json
    name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "candidate")

    if not name or not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    db = SessionLocal()
    try:
        if db.query(User).filter_by(email=email).first():
            return jsonify({"error": "Email already exists"}), 400

        password_hash = generate_password_hash(password)
        new_user = User(full_name=name, email=email, password=password_hash, role=role)

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        token = jwt.encode(
            {"id": new_user.id, "exp": datetime.utcnow() + timedelta(hours=24)},
            JWT_SECRET,
            algorithm="HS256"
        )

        return jsonify({"token": token, "user": {
            "full_name": new_user.full_name,
            "email": new_user.email,
            "role": new_user.role
        }})
    finally:
        db.close()



def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    db = SessionLocal()
    try:
        user = db.query(User).filter_by(email=email).first()
        if not user or not check_password_hash(user.password, password):
            return jsonify({"error": "Invalid email or password"}), 400

        token = jwt.encode(
            {"id": user.id, "exp": datetime.utcnow() + timedelta(hours=24)},
            JWT_SECRET,
            algorithm="HS256"
        )

        return jsonify({"token": token, "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role
        }})
    finally:
        db.close()



