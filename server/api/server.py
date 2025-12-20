from dotenv import load_dotenv

load_dotenv()

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config.db import Base, engine
from routes.auth import auth
from routes.job import job
from routes.candidates import candidates
from routes.employers import employers
from routes.applications import applications
import os
from pathlib import Path

# Get the project root directory (where uploads folder is located)
# This file is in server/api/, so we go up 2 levels to get to project root
PROJECT_ROOT = Path(__file__).parent.parent
UPLOADS_DIR = PROJECT_ROOT / "uploads"

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")


def init_db():
    """Initialize database tables. Call this after the app starts."""
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully!")
    except Exception as e:
        print(f"Warning: Could not create database tables: {e}")
        print("Make sure PostgreSQL is running and the database is accessible.")


print(UPLOADS_DIR)

print(UPLOADS_DIR)

CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:3000"],
    allow_headers=["Content-Type", "Authorization"],
)

app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(job, url_prefix="/api/jobs")
app.register_blueprint(candidates, url_prefix="/api/candidates")
app.register_blueprint(employers, url_prefix="/api/employers")
app.register_blueprint(applications, url_prefix="/api/applications")

from routes.connections import connections
from routes.notifications import notifications

app.register_blueprint(connections, url_prefix="/api/connections")
app.register_blueprint(notifications, url_prefix="/api/notifications")

# OAuth routes
app.add_url_rule(
    "/api/oauth/github/connect",
    "github_connect",
    github_connect,
    methods=["GET"],
)
app.add_url_rule(
    "/api/oauth/github/callback",
    "github_callback",
    github_callback,
    methods=["GET"],
)


@app.route("/")
def home():
    return jsonify({"message": "Server is running", "status": "ok"})


# Serve uploaded files
@app.route("/uploads/<path:filename>")
def serve_upload(filename):
    return send_from_directory(str(UPLOADS_DIR), filename)


# Handle incorrect OAuth redirect URI (without /api prefix)
# This redirects to the Next.js frontend route handler
@app.route("/auth/google/callback")
def handle_incorrect_oauth_callback():
    from flask import redirect, request

    # Redirect to Next.js frontend route handler with all query params
    frontend_url = f"http://localhost:3000/api/auth/google/callback?{request.query_string.decode()}"
    return redirect(frontend_url, code=302)


if __name__ == "__main__":
    # Initialize database tables when running directly
    init_db()
    app.run(debug=True)
