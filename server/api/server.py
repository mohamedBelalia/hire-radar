from flask import Flask, jsonify
from flask_cors import CORS
from config.db import Base, engine
from routes.auth import auth
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
Base.metadata.create_all(bind=engine)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:3000"],
    allow_headers=["Content-Type", "Authorization"],
)

app.register_blueprint(auth, url_prefix="/api/auth")


@app.route("/")
def home():
    return jsonify({"message": "Server is running", "status": "ok"})


if __name__ == "__main__":
    app.run(debug=True)
