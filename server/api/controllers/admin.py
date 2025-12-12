from flask import Blueprint, jsonify, request
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from config.db import SessionLocal
from core.models import User, Job, Application, Skill, Category
from werkzeug.security import generate_password_hash
import jwt
import os

SECRET_KEY = os.getenv("JWT_SECRET")

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")


# ============================================================
# 1. GET /admin/stats → Platform metrics
# ============================================================
def get_platform_stats():
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
    db = SessionLocal()
    skills = db.query(Skill).all()

    data = [{"id": s.id, "name": s.name} for s in skills]

    db.close()
    return jsonify(data), 200

# ============================================================
# 7. POST /admin/skills → add skill
# ============================================================
def add_skill():
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
    db = SessionLocal()
    categories = db.query(Category).all()

    data = [{"id": c.id, "name": c.name} for c in categories]

    db.close()
    return jsonify(data), 200


# ============================================================
# 11. POST /admin/categories → add new category
# ============================================================
def add_category():
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