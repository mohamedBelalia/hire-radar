import os
from datetime import datetime, timedelta

import jwt
import requests
from dotenv import load_dotenv
from flask import jsonify, request, session
from google_auth_oauthlib.flow import Flow
from werkzeug.security import check_password_hash, generate_password_hash

from api.config.db import SessionLocal
from api.core.models import User

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
JWT_SECRET = os.getenv("JWT_SECRET")
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")


# ---------------------------
#   🔥 GOOGLE LOGIN
# ---------------------------
def google_login():
    flow = Flow.from_client_secrets_file(
        "client_secret.json",
        scopes=["https://www.googleapis.com/auth/userinfo.email", "openid"],
        redirect_uri=REDIRECT_URI,
    )

    auth_url, _ = flow.authorization_url(prompt="consent")

    return jsonify({"auth_url": auth_url})


# ---------------------------
#   🔥 GOOGLE CALLBACK
# ---------------------------
def google_callback():
    flow = Flow.from_client_secrets_file(
        "client_secret.json",
        scopes=["https://www.googleapis.com/auth/userinfo.email", "openid"],
        redirect_uri=REDIRECT_URI,
    )

    flow.fetch_token(authorization_response=request.url)

    credentials = flow.credentials

    r = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {credentials.token}"},
    )

    data = r.json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Failed to fetch email"}), 400

    db = SessionLocal()
    user = db.query(User).filter_by(email=email).first()

    if not user:
        user = User(email=email)
        db.add(user)
        db.commit()
        db.refresh(user)

    # Create JWT
    token = jwt.encode(
        {"id": user.id, "exp": datetime.utcnow() + timedelta(days=7)},
        JWT_SECRET,
        algorithm="HS256",
    )

    return jsonify({"token": token, "email": email})


# ---------------------------
#   🔥 GET CURRENT USER
# ---------------------------
def get_current_user():
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return jsonify({"error": "Unauthorized"}), 401

    token = auth_header.replace("Bearer ", "")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except:
        return jsonify({"error": "Invalid token"}), 401

    db = SessionLocal()
    user = db.query(User).filter_by(id=payload["id"]).first()

    return jsonify({"id": user.id, "email": user.email})


# ---------------------------
#   🔥 SIGNUP
# ---------------------------
def signup():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    db = SessionLocal()

    if db.query(User).filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400

    user = User(email=email, password=generate_password_hash(password))

    db.add(user)
    db.commit()

    return jsonify({"message": "User created"})


# ---------------------------
#   🔥 LOGIN
# ---------------------------
def login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    db = SessionLocal()
    user = db.query(User).filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode(
        {"id": user.id, "exp": datetime.utcnow() + timedelta(days=7)},
        JWT_SECRET,
        algorithm="HS256",
    )

    return jsonify({"token": token, "email": user.email})


# ---------------------------
#   🔥 LOGOUT
# ---------------------------
def logout():
    session.clear()
    return jsonify({"message": "Logged out"})
