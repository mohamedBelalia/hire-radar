from dotenv import load_dotenv

load_dotenv()

from flask import Flask, jsonify
from flask_cors import CORS
from config.db import Base, engine
from routes.auth import auth
from routes.job import job
import os


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


@app.route("/")
def home():
    return jsonify({"message": "Server is running", "status": "ok"})


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
