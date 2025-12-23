from dotenv import load_dotenv
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config.db import Base, engine
from routes.auth import auth
from routes.job import job 
from routes.admin import admin_bp
from routes.candidates import candidates
from routes.employers import employers
from routes.applications import applications
import os
from pathlib import Path
from sockethh import socketio
from routes.connections import connections
from routes.notifications import notifications

load_dotenv()

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


CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:3000"],
    allow_headers=["Content-Type", "Authorization"],
)

app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(job, url_prefix="/api/jobs")
app.register_blueprint(admin_bp, url_prefix="/api/admin")
app.register_blueprint(candidates, url_prefix="/api/candidates")
app.register_blueprint(employers, url_prefix="/api/employers")
app.register_blueprint(applications, url_prefix="/api/applications")
app.register_blueprint(connections, url_prefix="/api/connections")
app.register_blueprint(notifications, url_prefix="/api/notifications")

socketio.init_app(app)

@app.route("/")
def home():
    return jsonify({"message": "Server is running", "status": "ok"})


@app.route("/uploads/<path:filename>")
def serve_upload(filename):
    return send_from_directory(str(UPLOADS_DIR), filename)



if __name__ == "__main__":
    init_db()
    app.run(debug=True)
