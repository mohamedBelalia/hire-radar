from flask import Blueprint, jsonify, request
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from api.config.db import SessionLocal
from api.core.models import User, Job, Application, Skill, Category
from werkzeug.security import generate_password_hash
import jwt
import os

SECRET_KEY = os.getenv("JWT_SECRET")

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")


# ============================================================
# 1. GET /admin/stats → Platform metrics
# ============================================================
def get_platform_stats():
    """
    Return platform-wide counts for users, jobs, and applications.
    
    Returns:
        A Flask JSON response with keys `total_users`, `total_jobs`, and `total_applications` containing their integer counts, accompanied by HTTP status code 200.
    """
    db = SessionLocal()

    total_users = db.query(func.count(User.id)).scalar()
    total_jobs = db.query(func.count(Job.id)).scalar()
    total_applications = db.query(func.count(Application.id)).scalar()

    db.close()

    return jsonify({
        "total_users": total_users,
        "total_jobs": total_jobs,
        "total_applications": total_applications,
    }), 200


# ============================================================
# 2. GET /admin/users → List all users
# ============================================================
def get_all_users():
    """
    Return a list of all non-admin users.
    
    Returns:
        A JSON array of user objects and HTTP status 200. Each user object contains:
          - id: user identifier
          - full_name: user's full name
          - email: user's email address
          - role: user's role
          - location: user's location (or null)
          - image: URL or identifier for the user's image (or null)
          - phone: user's phone number (or null)
          - headLine: user's headline (or null)
          - created_at: ISO 8601 timestamp string of account creation (or null)
    """
    db = SessionLocal()

    users = (
        db.query(User)
        .filter(User.role != "admin")
        .all()
    )

    data = [
        {
            "id": u.id,
            "full_name": u.full_name,
            "email": u.email,
            "role": u.role,
            "location": u.location,
            "image": u.image,
            "phone": u.phone,
            "headLine": u.headLine,
            "created_at": u.created_at.isoformat() if u.created_at else None,
        }
        for u in users
    ]

    db.close()
    return jsonify(data), 200



# ============================================================
# 3. DELETE /admin/users/<id> → Remove user
# ============================================================
def delete_user(user_id):
    """
    Delete a user by ID.
    
    Parameters:
    	user_id (int): Identifier of the user to remove.
    
    Returns:
    	(response, int): On success, JSON {"message": "User <id> deleted successfully"} and HTTP 200. If no user exists with the given ID, JSON {"error": "User not found"} and HTTP 404.
    """
    db = SessionLocal()

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        db.close()
        return jsonify({"error": "User not found"}), 404

    db.delete(user)
    db.commit()
    db.close()

    return jsonify({"message": f"User {user_id} deleted successfully"}), 200


# ============================================================
# 4. GET /admin/jobs → List all jobs
# ============================================================
def get_all_jobs():
    """
    Return a JSON array of all jobs with selected fields.
    
    Each job object contains: `id`, `title`, `company`, `location`, `emp_type`, `salary_range`, `employer_id`, `category_id`, and `created_at` (ISO 8601 string or `None`).
    
    Returns:
    	A Flask JSON response containing the array of job objects and HTTP status 200.
    """
    db = SessionLocal()
    jobs = db.query(Job).all()

    data = [
        {
            "id": j.id,
            "title": j.title,
            "company": j.company,
            "location": j.location,
            "emp_type": j.emp_type,
            "salary_range": j.salary_range,
            "employer_id": j.employer_id,
            "category_id": j.category_id,
            "created_at": j.created_at.isoformat() if j.created_at else None,
        }
        for j in jobs
    ]

    db.close()
    return jsonify(data), 200


# ============================================================
# 5. DELETE /admin/jobs/<id> → Delete job
# ============================================================
def delete_job(job_id):
    """
    Delete a job identified by its ID.
    
    Returns:
    	A tuple (Flask JSON response, int): on success, JSON {"message": "Job <job_id> deleted successfully"} with HTTP status 200; if the job does not exist, JSON {"error": "Job not found"} with HTTP status 404.
    """
    db = SessionLocal()

    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        db.close()
        return jsonify({"error": "Job not found"}), 404

    db.delete(job)
    db.commit()
    db.close()

    return jsonify({"message": f"Job {job_id} deleted successfully"}), 200


# ============================================================
# 6. GET /admin/skills → List all skills
# ============================================================
def get_all_skills():
    """
    List all skills with their `id` and `name`.
    
    Returns:
        JSON array: A list of skill objects, each containing `id` (int) and `name` (str).
    """
    db = SessionLocal()
    skills = db.query(Skill).all()

    data = [{"id": s.id, "name": s.name} for s in skills]

    db.close()
    return jsonify(data), 200

# ============================================================
# 7. POST /admin/skills → add skill
# ============================================================
def add_skill():
    """
    Create a new Skill from the request JSON payload.
    
    Reads the JSON body and expects a "name" field. If a skill with the same name (case-insensitive) already exists or "name" is missing, returns an error response with a message. On success returns a JSON object with the created skill's `id` and `name`.
    """
    db = SessionLocal()

    data = request.get_json()
    name = data.get("name")

    if not name:
        return jsonify({"error": "Skill name is required"}), 400

    if db.query(Skill).filter(Skill.name.ilike(name)).first():
        return jsonify({"error": "Skill already exists"}), 400

    new_skill = Skill(name=name)

    db.add(new_skill)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        return jsonify({"error": "Skill already exists"}), 400

    db.refresh(new_skill)
    db.close()

    return jsonify({"id": new_skill.id, "name": new_skill.name})

# ============================================================
# 8. DELETE /admin/skills/<id> → Delete skill
# ============================================================
def delete_skill(skill_id):
    """
    Delete the Skill record identified by skill_id and return an HTTP response describing the outcome.
    
    Deletes the skill from the database if it exists.
    
    Returns:
    	Flask response: 200 with a success message when the skill is deleted; 404 with an error message if no skill with the given id exists.
    """
    db = SessionLocal()

    skill = db.query(Skill).filter(Skill.id == skill_id).first()

    if not skill:
        db.close()
        return jsonify({"error": "Skill not found"}), 404

    db.delete(skill)
    db.commit()
    db.close()

    return jsonify({"message": f"Skill {skill_id} deleted successfully"}), 200


# ============================================================
# 9. PUT /admin/skills/<id> → Update skill
# ============================================================
def update_skill(skill_id):
    """
    Update the name of an existing skill by its ID.
    
    Validates that the skill exists and that the request JSON includes a "name" field. On success, commits the new name to the database.
    
    Returns:
    	A tuple (response_json, status_code):
    	- Success: {"message": "Skill updated successfully"}, 200
    	- Missing `name` field: {"error": "Missing field: name"}, 400
    	- Skill not found: {"error": "Skill not found"}, 404
    """
    db = SessionLocal()

    skill = db.query(Skill).filter(Skill.id == skill_id).first()

    if not skill:
        db.close()
        return jsonify({"error": "Skill not found"}), 404

    data = request.get_json()
    new_name = data.get("name")

    if not new_name:
        db.close()
        return jsonify({"error": "Missing field: name"}), 400

    skill.name = new_name
    db.commit()
    db.close()

    return jsonify({"message": "Skill updated successfully"}), 200


# ============================================================
# 10. GET /admin/categories → List all categories
# ============================================================
def get_all_categories():
    """
    Retrieve all categories and return them as id/name pairs.
    
    Returns:
    	JSON response containing an array of category objects (each with `id` and `name`) and HTTP 200 status.
    """
    db = SessionLocal()
    categories = db.query(Category).all()

    data = [{"id": c.id, "name": c.name} for c in categories]

    db.close()
    return jsonify(data), 200


# ============================================================
# 11. POST /admin/categories → add new category
# ============================================================
def add_category():
    """
    Create a new category from the request JSON.
    
    Expects a JSON body with a "name" field. On success returns the created category's id and name. If "name" is missing or a category with the same name (case-insensitive) already exists, returns a JSON error message and HTTP 400.
    
    Returns:
        A Flask JSON response containing either:
        - {"id": <int>, "name": <str>} for the newly created category, or
        - {"error": "<message>"} with HTTP status 400 when validation or uniqueness checks fail.
    """
    db = SessionLocal()

    data = request.get_json()
    name = data.get("name")

    if not name:
        return jsonify({"error": "Category name is required"}), 400

    # Check if category already exists
    if db.query(Category).filter(Category.name.ilike(name)).first():
        return jsonify({"error": "Category already exists"}), 400

    new_category = Category(name=name)

    db.add(new_category)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        return jsonify({"error": "Category already exists"}), 400

    db.refresh(new_category)
    db.close()

    return jsonify({"id": new_category.id, "name": new_category.name})


# ============================================================
# 12. DELETE /admin/categories/<id>
# ============================================================
def delete_category(category_id):
    """
    Delete a category by its ID.
    
    Parameters:
        category_id (int): The ID of the category to remove.
    
    Returns:
        tuple: A Flask JSON response and HTTP status code. On success returns a message confirming deletion and status 200; if the category does not exist returns an error message and status 404.
    """
    db = SessionLocal()

    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        db.close()
        return jsonify({"error": "Category not found"}), 404

    db.delete(category)
    db.commit()
    db.close()

    return jsonify({"message": f"Category {category_id} deleted successfully"}), 200


# ============================================================
# 13. PUT /admin/categories/<id> → Update category name
# ============================================================
def update_category(category_id):
    """
    Update an existing category's name using the JSON payload from the request.
    
    Parameters:
        category_id (int): ID of the category to update.
    
    Returns:
        A Flask JSON response. On success returns {"message": "Category updated successfully"} with status 200. If the category does not exist returns {"error": "Category not found"} with status 404. If the request JSON is missing the `name` field returns {"error": "Missing field: name"} with status 400.
    """
    db = SessionLocal()
    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        db.close()
        return jsonify({"error": "Category not found"}), 404

    data = request.get_json()
    new_name = data.get("name")

    if not new_name:
        db.close()
        return jsonify({"error": "Missing field: name"}), 400

    category.name = new_name
    db.commit()
    db.close()

    return jsonify({"message": "Category updated successfully"}), 200


# ============================================================
# 14. GET /admin/admins → List all admins
# ============================================================
def getAdmins():
    """
    List admin users excluding the one authenticated by the request token.
    
    Extracts a JWT from the `Authorization: Bearer <token>` header, decodes it to determine the current admin's id, queries the database for users with role `"admin"` whose id differs from the current admin, and returns a JSON array of admin objects containing `id`, `full_name`, `email`, and `created_at` (ISO 8601 string or `null`).
    
    Returns:
    	JSON array of admin objects with keys `id`, `full_name`, `email`, `created_at`.
    """
    db = SessionLocal()

    # Extract token manually to get current admin ID
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Token missing"}), 401

    token = auth_header.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

    current_admin_id = payload.get("id")

    # Fetch all admins except the current one
    admins = (
        db.query(User)
        .filter(User.role == "admin", User.id != current_admin_id)
        .all()
    )

    data = [
        {
            "id": u.id,
            "full_name": u.full_name,
            "email": u.email,
            "created_at": u.created_at.isoformat() if u.created_at else None,
        }
        for u in admins
    ]

    db.close()
    return jsonify(data), 200



# ============================================================
# 15. POST /admin/add-admin → Add new admin
# ============================================================
def create_admin():
    """
    Create a new admin account from a JSON payload.
    
    Expects JSON with `full_name`, `email`, and `password`. On success returns a JSON object containing a success message and the created admin's `id`, `full_name`, `email`, and `role` with HTTP status 201. Returns HTTP 400 if any required field is missing, HTTP 409 if the email already exists, and HTTP 500 with an error message on unexpected server errors.
    
    Returns:
        A tuple of (JSON response, HTTP status code):
        - Success (201): {"message": "Admin created successfully", "admin": {"id": int, "full_name": str, "email": str, "role": str}}
        - Bad request (400): {"error": "full_name, email, and password are required"}
        - Conflict (409): {"error": "Email already exists"}
        - Server error (500): {"error": "<exception message>"}
    """
    data = request.get_json()

    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")

    if not full_name or not email or not password:
        return jsonify({"error": "full_name, email, and password are required"}), 400

    db = SessionLocal()

    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            return jsonify({"error": "Email already exists"}), 409

        new_admin = User(
            full_name=full_name,
            email=email,
            password=generate_password_hash(password),
            role="admin",
        )

        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)

        return jsonify({
            "message": "Admin created successfully",
            "admin": {
                "id": new_admin.id,
                "full_name": new_admin.full_name,
                "email": new_admin.email,
                "role": new_admin.role,
            }
        }), 201

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    
    finally:
        db.close()


# ============================================================
# 16. DELETE /admin/<int:admin_id> → Delete an admin
# ============================================================
def delete_admin(admin_id, current_user=None):
    """
    Delete an admin user by ID, preventing self-deletion when the current user is provided.
    
    Parameters:
        admin_id (int): ID of the admin to delete.
        current_user (User, optional): If provided, prevents deletion when current_user.id equals admin_id.
    
    Returns:
        JSON response and HTTP status code:
          - 200: {"message": "Admin <admin_id> deleted successfully"} on successful deletion.
          - 400: {"error": "You cannot delete your own admin account"} if attempting self-deletion.
          - 404: {"error": "Admin not found"} if no admin exists with the given ID.
          - 500: {"error": "<error message>"} on unexpected errors during deletion.
    """
    if current_user and current_user.id == admin_id:
        return jsonify({"error": "You cannot delete your own admin account"}), 400

    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.id == admin_id, User.role == "admin").first()

        if not admin:
            return jsonify({"error": "Admin not found"}), 404

        db.delete(admin)
        db.commit()

        return jsonify({"message": f"Admin {admin_id} deleted successfully"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        db.close()