from functools import wraps
from flask import request, jsonify
import jwt
import os

SECRET_KEY = os.getenv("JWT_SECRET")

def admin_required(f):
    """
    Decorator that enforces that a Flask view is accessed only with a valid JWT containing role "admin" in the Authorization Bearer header.
    
    Parameters:
        f (callable): Flask view function to wrap.
    
    Returns:
        callable: Wrapped view function that:
            - returns (json, 401) {"error": "Token missing"} if no Bearer token is provided,
            - returns (json, 401) {"error": "Token expired"} if the token has expired,
            - returns (json, 401) {"error": "Invalid token"} if the token cannot be decoded,
            - returns (json, 403) {"error": "Admin access only"} if the token's `role` is not "admin",
            - otherwise calls and returns the original view function's result.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"error": "Token missing"}), 401

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            if payload.get("role") != "admin":
                print(payload.get("role"))
                return jsonify({"error": "Admin access only"}), 403

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated