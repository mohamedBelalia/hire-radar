from flask import request, jsonify, redirect, session
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
from dotenv import load_dotenv
from config.db import SessionLocal
from core.models import User
from core.models import DeleteRequest
from google_auth_oauthlib.flow import Flow
import os
import requests
from middlewares.auth import is_auth

load_dotenv()
SECRET_KEY = os.getenv("JWT_SECRET")

# Allow insecure transport for local development (HTTP instead of HTTPS)
# Only enable in development environment, never in production
if os.getenv("FLASK_ENV") != "production" and os.getenv("ENVIRONMENT") != "production":
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
JWT_SECRET = os.getenv("JWT_SECRET", "secret123")
GOOGLE_REDIRECT_URI = os.getenv(
    "GOOGLE_REDIRECT_URI", "http://localhost:3000/api/auth/google/callback"
)
GITHUB_REDIRECT_URI = os.getenv(
    "GITHUB_REDIRECT_URI", "http://localhost:5000/api/oauth/github/callback"
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def google_login():
    # Ensure redirect URI is set (must point to Next.js frontend, not Flask backend)
    redirect_uri = (
        GOOGLE_REDIRECT_URI or "http://localhost:3000/api/auth/google/callback"
    )

    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uris": [redirect_uri],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=["openid", "email", "profile"],
    )

    flow.redirect_uri = redirect_uri

    authorization_url, state = flow.authorization_url(
        access_type="offline", include_granted_scopes="true"
    )

    session["state"] = state
    return jsonify({"auth_url": authorization_url})


def google_callback():
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "Missing authorization code"}), 400

    token_url = "https://oauth2.googleapis.com/token"
    redirect_uri = (
        GOOGLE_REDIRECT_URI or "http://localhost:3000/api/auth/google/callback"
    )

    token_data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code",
    }

    token_res = requests.post(token_url, data=token_data).json()
    access_token = token_res.get("access_token")

    if not access_token:
        return jsonify({"error": "Token exchange failed", "details": token_res}), 400

    user_info = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
    ).json()

    email = user_info.get("email")
    if not email:
        return jsonify({"error": "Google did not return an email"}), 400

    name = user_info.get("name", "")
    picture = user_info.get("picture", "")

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()

        if not user:
            user = User(
                full_name=name,
                email=email,
                password=None,
                role="candidate",
                image=picture,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            user.image = picture
            db.commit()

        token = jwt.encode(
            {"id": user.id, "exp": datetime.utcnow() + timedelta(hours=24)},
            JWT_SECRET,
            algorithm="HS256",
        )

        return (
            jsonify(
                {
                    "token": token,
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "full_name": user.full_name,
                        "image": user.image,
                        "role": user.role,
                    },
                }
            ),
            200,
        )

    finally:
        db.close()


def get_current_user():
    auth = request.headers.get("Authorization")
    print(auth)
    if not auth or not auth.startswith("Bearer "):
        return jsonify({"error": "Missing or invalid Authorization header"}), 401

    token = auth.split(" ")[1]
    db = SessionLocal()

    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        print(decoded)
        user = db.query(User).get(decoded["id"])
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify(
            {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role,
                "image": user.image,
            }
        )

    except jwt.ExpiredSignatureError:
        print("expired")
        return jsonify({"error": "Token expired"}), 401
    except Exception:
        print("invalid")
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
        new_user = User(
            full_name=name, email=email, password=password_hash, role=role, image=None
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        token = jwt.encode(
            {"id": new_user.id, "exp": datetime.utcnow() + timedelta(hours=24)},
            JWT_SECRET,
            algorithm="HS256",
        )

        return jsonify(
            {
                "token": token,
                "user": {
                    "id": new_user.id,
                    "full_name": new_user.full_name,
                    "email": new_user.email,
                    "role": new_user.role,
                    "image": new_user.image,
                },
            }
        )
    finally:
        db.close()


def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    db = SessionLocal()
    try:
        user = db.query(User).filter_by(email=email).first()
        # Check if user exists and has a password (OAuth users don't have passwords)
        if not user:
            return jsonify({"error": "Invalid email or password"}), 400

        # If user has no password, they likely signed up via OAuth
        if not user.password:
            return (
                jsonify(
                    {
                        "error": "This account was created with Google. Please use Google Sign In."
                    }
                ),
                400,
            )

        # Verify password hash
        if not check_password_hash(user.password, password):
            return jsonify({"error": "Invalid email or password"}), 400

        token = jwt.encode(
            {"id": user.id, "exp": datetime.utcnow() + timedelta(hours=24)},
            JWT_SECRET,
            algorithm="HS256",
        )

        return jsonify(
            {
                "token": token,
                "user": {
                    "id": user.id,
                    "full_name": user.full_name,
                    "email": user.email,
                    "role": user.role,
                    "image": user.image,
                },
            }
        )
    finally:
        db.close()


def github_connect():
    """Initiate GitHub OAuth flow for account linking"""

    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        return jsonify({"error": "Authentication required"}), 401

    token = auth.split(" ")[1]

    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = decoded["id"]
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

    # Store user id in session
    session["github_link_user_id"] = user_id

    # Create state token (CSRF protection)
    state = jwt.encode(
        {
            "user_id": user_id,
            "exp": datetime.utcnow() + timedelta(minutes=10),
        },
        JWT_SECRET,
        algorithm="HS256",
    )

    session["github_state"] = state

    # GitHub OAuth authorization URL
    auth_url = (
        "https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}"
        f"&redirect_uri={GITHUB_REDIRECT_URI}"
        f"&scope=user:email"
        f"&state={state}"
    )

    return jsonify({"auth_url": auth_url}), 200


def github_callback():
    """Handle GitHub OAuth callback and link account"""
    code = request.args.get("code")
    state = request.args.get("state")
    error = request.args.get("error")

    if error:
        return redirect(f"http://localhost:3000/profile?error={error}")

    if not code or not state:
        return redirect("http://localhost:3000/profile?error=missing_params")

    # Verify state
    try:
        decoded_state = jwt.decode(state, JWT_SECRET, algorithms=["HS256"])
        user_id = decoded_state["user_id"]
    except:
        return redirect("http://localhost:3000/profile?error=invalid_state")

    # Exchange code for access token
    token_url = "https://github.com/login/oauth/access_token"
    token_data = {
        "client_id": GITHUB_CLIENT_ID,
        "client_secret": GITHUB_CLIENT_SECRET,
        "code": code,
        "redirect_uri": GITHUB_REDIRECT_URI,
    }
    token_headers = {"Accept": "application/json"}

    token_res = requests.post(token_url, data=token_data, headers=token_headers).json()
    access_token = token_res.get("access_token")

    if not access_token:
        return redirect("http://localhost:3000/profile?error=token_failed")

    # Get GitHub user info
    user_info = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"Bearer {access_token}"},
    ).json()

    github_id = str(user_info.get("id"))
    github_username = user_info.get("login")

    if not github_id:
        return redirect("http://localhost:3000/profile?error=no_github_id")

    # Link GitHub account to user
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return redirect("http://localhost:3000/profile?error=user_not_found")

        # Check if GitHub account is already linked to another user
        existing_user = db.query(User).filter(User.github_id == github_id).first()
        if existing_user and existing_user.id != user_id:
            return redirect("http://localhost:3000/profile?error=github_already_linked")

        # Link GitHub account
        user.github_id = github_id
        user.github_username = github_username
        db.commit()

        return redirect("http://localhost:3000/profile?github_linked=success")
    except Exception as e:
        db.rollback()
        return redirect(f"http://localhost:3000/profile?error={str(e)}")
    finally:
        db.close()

def get_connected_accounts():
    """Get connected accounts for the current user"""
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        return jsonify({"error": "Authentication required"}), 401

    token = auth.split(" ")[1]
    db = SessionLocal()

    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(User).get(decoded["id"])
        if not user:
            return jsonify({"error": "User not found"}), 404

        connected_accounts = {
            "github": bool(user.github_id),
            "google": bool(
                user.email and not user.password
            ),  # Google users don't have passwords
        }

        accounts = []
        if connected_accounts["github"]:
            accounts.append(
                {
                    "provider": "github",
                    "username": user.github_username,
                    "connected": True,
                }
            )
        if connected_accounts["google"]:
            accounts.append(
                {
                    "provider": "google",
                    "connected": True,
                }
            )

        return jsonify({"connected_accounts": accounts})
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


@is_auth
def update_password():
    db = SessionLocal()  #
    
    try:
        data = request.get_json()
        current_password = data.get("currentPassword")
        new_password = data.get("newPassword")
        confirm_password = data.get("confirmPassword")

        if not current_password or not new_password or not confirm_password:
            return jsonify({"message": "All fields are required."}), 400

        if new_password != confirm_password:
            return jsonify({"message": "New password and confirm password do not match."}), 400

        user_id = request.user_id  

        user = db.get(User, user_id) 
        if not user:
            return jsonify({"message": "User not found."}), 404

        if not check_password_hash(user.password, current_password):
            return jsonify({"message": "Current password is incorrect."}), 400

        user.password = generate_password_hash(new_password)
        db.commit()

        return jsonify({"message": "Password updated successfully!"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"message": str(e)}), 500
    finally:
        db.close()


@is_auth
def delete_account_request():
    """
    Receives a delete account request with a reason.
    """
    db = SessionLocal()
    try:
        data = request.get_json()
        reason = data.get("reason")

        if not reason or not reason.strip():
            return jsonify({"message": "Reason is required."}), 400

        user_id = request.user_id

        delete_request = DeleteRequest(user_id=user_id, reason=reason.strip())
        db.add(delete_request)
        db.commit()

        return jsonify({"message": "Delete request submitted successfully!"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"message": str(e)}), 500
    finally:
        db.close()