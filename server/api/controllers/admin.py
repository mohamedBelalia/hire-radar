from flask import Blueprint, jsonify, request
from sqlalchemy import func, text
from sqlalchemy.exc import IntegrityError
from config.db import SessionLocal
from core.models import User, Job, Application, ReportedJob, Skill, Category, ConnectionRequest, DeleteRequest, Education, Notification, Experience
from werkzeug.security import generate_password_hash
import jwt
import os
from sqlalchemy.orm import joinedload
from datetime import datetime, timedelta

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

    return (
        jsonify(
            {
                "total_users": total_users,
                "total_jobs": total_jobs,
                "total_applications": total_applications,
            }
        ),
        200,
    )


# ============================================================
# 2. GET /admin/users → List all users
# ============================================================
def get_all_users():
    db = SessionLocal()

    users = db.query(User).filter(User.role != "admin").all()
    print(users)
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

    try:
        # Applications
        db.query(Application).filter(Application.user_id == user_id).delete()

        # Saved jobs
        db.execute(
            text("DELETE FROM saved_jobs WHERE user_id = :uid"),
            {"uid": user_id},
        )

        # Education & Experience
        db.query(Education).filter(Education.user_id == user_id).delete()
        db.query(Experience).filter(Experience.user_id == user_id).delete()

        # Notifications
        db.query(Notification).filter(
            (Notification.sender_id == user_id) | (Notification.receiver_id == user_id)
        ).delete()

        # Connection requests
        db.query(ConnectionRequest).filter(
            (ConnectionRequest.sender_id == user_id) | (ConnectionRequest.receiver_id == user_id)
        ).delete()

        # Delete requests
        db.query(DeleteRequest).filter(DeleteRequest.user_id == user_id).delete()

        # Reported jobs
        db.query(ReportedJob).filter(ReportedJob.user_id == user_id).delete()

        # M2M cleanup
        db.execute(
            text("DELETE FROM user_skills WHERE user_id = :uid"),
            {"uid": user_id},
        )
        db.execute(
            text("DELETE FROM job_applicants WHERE user_id = :uid"),
            {"uid": user_id},
        )

        # Jobs posted by user
        jobs = db.query(Job).filter(Job.employer_id == user_id).all()
        for job in jobs:
            delete_job_internal(job.id, db)

        # Delete user
        db.delete(user)
        db.commit()

        return jsonify({"message": "User deleted successfully"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()




def delete_job_internal(job_id, db):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise Exception("Job not found")

    # Applications
    db.query(Application).filter(Application.job_id == job_id).delete()

    # Saved jobs
    db.execute(
        text("DELETE FROM saved_jobs WHERE job_id = :jid"),
        {"jid": job_id},
    )

    # M2M tables
    db.execute(
        text("DELETE FROM job_skills WHERE job_id = :jid"),
        {"jid": job_id},
    )
    db.execute(
        text("DELETE FROM job_applicants WHERE job_id = :jid"),
        {"jid": job_id},
    )

    reported_jobs = db.query(ReportedJob).filter(ReportedJob.job_id == job_id).all()
    for rj in reported_jobs:
        db.delete(rj)

    db.delete(job)


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
    try:
        delete_job_internal(job_id, db)
        db.commit()
        return jsonify({"message": f"Job {job_id} deleted successfully"}), 200
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()




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
    try:
        db.execute(
            text("DELETE FROM user_skills WHERE skill_id = :sid"),
            {"sid": skill_id},
        )
        db.execute(
            text("DELETE FROM job_skills WHERE skill_id = :sid"),
            {"sid": skill_id},
        )

        skill = db.query(Skill).filter(Skill.id == skill_id).first()
        if not skill:
            return jsonify({"error": "Skill not found"}), 404

        db.delete(skill)
        db.commit()

        return jsonify({"message": "Skill deleted successfully"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()



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

    jobs_count = db.query(Job).filter(Job.category_id == category_id).count()
    if jobs_count > 0:
        db.close()
        return jsonify({
            "error": "Category has jobs assigned. Remove or reassign them first."
        }), 400

    db.delete(category)
    db.commit()
    db.close()

    return jsonify({"message": "Category deleted successfully"}), 200



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
        db.query(User).filter(User.role == "admin", User.id != current_admin_id).all()
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

        return (
            jsonify(
                {
                    "message": "Admin created successfully",
                    "admin": {
                        "id": new_admin.id,
                        "full_name": new_admin.full_name,
                        "email": new_admin.email,
                        "role": new_admin.role,
                    },
                }
            ),
            201,
        )

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
        admin = (
            db.query(User)
            .filter(User.id == admin_id, User.role == "admin")
            .first()
        )

        if not admin:
            return jsonify({"error": "Admin not found"}), 404

        db.execute(
            text("""
                DELETE FROM connection_requests
                WHERE sender_id = :uid OR receiver_id = :uid
            """),
            {"uid": admin_id},
        )

        db.execute(
            text("""
                DELETE FROM notifications
                WHERE sender_id = :uid OR receiver_id = :uid
            """),
            {"uid": admin_id},
        )

        db.execute(
            text("DELETE FROM user_skills WHERE user_id = :uid"),
            {"uid": admin_id},
        )

        db.execute(
            text("DELETE FROM saved_jobs WHERE user_id = :uid"),
            {"uid": admin_id},
        )

        db.execute(
            text("DELETE FROM delete_requests WHERE user_id = :uid"),
            {"uid": admin_id},
        )

        db.delete(admin)
        db.commit()

        return jsonify(
            {"message": f"Admin {admin_id} deleted successfully"}
        ), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        db.close()


# ============================================================
# 17. GET /admin/deletion-requests → Get all deletion requests
# ============================================================
def get_all_delete_requests():
    db = SessionLocal()
    try:
        requests = db.query(DeleteRequest).all()

        data = []
        for dr in requests:
            data.append({
                "id": dr.id,
                "reason": dr.reason,
                "created_at": dr.created_at.isoformat() if dr.created_at else None,
                "user": {
                    "id": dr.user.id,
                    "full_name": dr.user.full_name,
                    "email": dr.user.email,
                    "role": dr.user.role
                } if dr.user else None
            })

        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        db.close()



# ============================================================
# 18. GET /admin/reported-jobs → Get all reported jobs
# ============================================================
def get_reported_jobs():
    db = SessionLocal()
    try:
        reported_jobs = db.query(ReportedJob).options(
            joinedload(ReportedJob.user),
            joinedload(ReportedJob.job)
        ).all()

        data = [
            {
                "id": rj.id,
                "reason": rj.reason,
                "created_at": rj.created_at.isoformat() if rj.created_at else None,
                "user": {
                    "id": rj.user.id,
                    "full_name": getattr(rj.user, "full_name", None),
                    "email": getattr(rj.user, "email", None),
                } if rj.user else None,
                "job": {
                    "id": rj.job.id,
                    "title": getattr(rj.job, "title", None),
                    "company": getattr(rj.job, "company", None),
                } if rj.job else None,
            }
            for rj in reported_jobs
        ]

        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        db.close()



# ============================================================
# 18. GET /admin/stats → Get dashboard stats
# ============================================================
def get_dashboard_data(days: int = 90):
    db = SessionLocal()
    try:
        today = datetime.today()
        start_date = today - timedelta(days=days)

        chart_data = []

        for i in range(days + 1):
            day = start_date + timedelta(days=i)
            day_start = datetime(day.year, day.month, day.day)
            day_end = day_start + timedelta(days=1)

            users_count = db.query(User).filter(
                User.created_at >= day_start,
                User.created_at < day_end
            ).count()

            jobs_count = db.query(Job).filter(
                Job.created_at >= day_start,
                Job.created_at < day_end
            ).count()

            applicants_count = db.query(Application).filter(
                Application.applied_at >= day_start,
                Application.applied_at < day_end
            ).count()

            chart_data.append({
                "date": day_start.isoformat(),
                "users": users_count,
                "jobs": jobs_count,
                "applicants": applicants_count
            })

        return jsonify(chart_data), 200
    finally:
        db.close()


# ============================================================
# 19. GET /admin/user-roles → Get pie chart user-roles
# ============================================================
def user_roles_chart():
    db = SessionLocal()
    try:
        results = db.query(User.role, func.count(User.id)).group_by(User.role).all()

        chart_data = []
        color_map = {
            "admin": "var(--color-admin)",
            "employer": "var(--color-employer)",
            "candidate": "var(--color-candidate)",
        }

        for role, count in results:
            chart_data.append({
                "browser": role,  # reuse "browser" key for pie chart nameKey
                "visitors": count,
                "fill": color_map.get(role, "var(--color-other)")
            })

        return jsonify(chart_data)
    finally:
        db.close()


# ============================================================
# 20. GET /admin/delete-requests-chart → Get pie chart user-roles
# ============================================================
def delete_requests_chart():
    db = SessionLocal()
    try:
        today = datetime.today()
        # Start date: 6 months ago
        start_date = today - timedelta(days=180)

        # Group by month
        results = db.query(
            func.date_trunc('month', DeleteRequest.created_at).label('month'),
            func.count(DeleteRequest.id)
        ).filter(
            DeleteRequest.created_at >= start_date
        ).group_by('month').order_by('month').all()

        # Format data for chart
        chart_data = []
        for month, count in results:
            chart_data.append({
                "month": month.strftime("%Y-%m"),
                "requests": count,
                "fill": "var(--color-delete)"
            })

        return jsonify(chart_data), 200
    finally:
        db.close()


# ============================================================
# 21. GET /admin/jobs-per-category → Get pie chart jobs per category
# ============================================================
def jobs_per_category_chart():
    db = SessionLocal()
    try:
        results = (
            db.query(Category.name, func.count(Job.id))
            .join(Job, Job.category_id == Category.id)
            .group_by(Category.id)
            .order_by(func.count(Job.id).desc())
            .limit(8)
            .all()
        )

        # Format data for chart
        chart_data = []
        colors = [
            "var(--chart-1)",
            "var(--chart-2)",
            "var(--chart-3)",
            "var(--chart-4)",
            "var(--chart-5)",
            "var(--chart-6)",
            "var(--chart-7)",
            "var(--chart-8)",
        ]

        for index, (name, count) in enumerate(results):
            chart_data.append({
                "category": name,
                "jobs": count,
                "fill": colors[index % len(colors)]
            })

        return jsonify(chart_data), 200
    finally:
        db.close()



# ============================================================
# 22. GET /admin/app-status-chart → Get applications status chart
# ============================================================
def application_status_chart():
    db = SessionLocal()
    try:
        # Group applications by status
        results = (
            db.query(Application.status, func.count(Application.id))
            .group_by(Application.status)
            .all()
        )

        # Map colors for each status
        status_colors = {
            "pending": "var(--chart-1)",
            "reviewed": "var(--chart-2)",
            "accepted": "var(--chart-3)",
            "rejected": "var(--chart-4)",
            "other": "var(--chart-5)"
        }

        # Format data for pie chart
        chart_data = [
            {
                "status": status,
                "count": count,
                "fill": status_colors.get(status, status_colors["other"])
            }
            for status, count in results
        ]

        return jsonify(chart_data), 200
    finally:
        db.close()