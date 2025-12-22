from flask import Blueprint
from middlewares.auth import admin_required
from controllers.admin import (
    get_platform_stats,
    get_all_users,
    delete_user,
    get_all_jobs,
    delete_job,
    get_all_skills,
    add_skill,
    delete_skill,
    update_skill,
    get_all_categories,
    add_category,
    delete_category,
    update_category,
    create_admin,
    delete_admin,
    getAdmins,
    get_all_delete_requests,
    get_reported_jobs,
    get_dashboard_data,
    user_roles_chart,
    delete_requests_chart,
    jobs_per_category_chart,
    application_status_chart
)

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")

admin_bp.get("/stats")(admin_required(get_platform_stats))
admin_bp.get("/users")(admin_required(get_all_users))
admin_bp.delete("/users/<int:user_id>")(admin_required(delete_user))

admin_bp.get("/jobs")(admin_required(get_all_jobs))
admin_bp.delete("/jobs/<int:job_id>")(admin_required(delete_job))

admin_bp.get("/skills")(get_all_skills)
admin_bp.post("/skills")(admin_required(add_skill))
admin_bp.delete("/skills/<int:skill_id>")(admin_required(delete_skill))
admin_bp.put("/skills/<int:skill_id>")(admin_required(update_skill))

admin_bp.get("/categories")(get_all_categories)
admin_bp.post("/categories")(admin_required(add_category))
admin_bp.delete("/categories/<int:category_id>")(admin_required(delete_category))
admin_bp.put("/categories/<int:category_id>")(admin_required(update_category))

admin_bp.get("/admins")(admin_required(getAdmins))
admin_bp.post("/add-admin")(admin_required(create_admin))
admin_bp.delete("/<int:admin_id>")(admin_required(delete_admin))

admin_bp.get("/deletion-requests")(admin_required(get_all_delete_requests))

admin_bp.get("/reported-jobs")(admin_required(get_reported_jobs))

admin_bp.get("/dashboard")(admin_required(get_dashboard_data))
admin_bp.get("/user-roles")(admin_required(user_roles_chart))
admin_bp.get("/delete-requests-chart")(admin_required(delete_requests_chart))
admin_bp.get("/jobs-per-category")(admin_required(jobs_per_category_chart))
admin_bp.get("/app-status-chart")(admin_required(application_status_chart))
