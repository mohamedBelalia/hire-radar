from flask import Blueprint
from api.controllers.applications import (
    apply_for_job,
    list_all_applications,
    list_candidate_applications,
    list_job_applicants,
    update_application,
    get_application,
    remove_application,
)

applications = Blueprint("applications", __name__)


# Applications routes
@applications.route("/", methods=["GET"])
def list_applications_route():
    """Get all applications (admin/employer view)"""
    return list_all_applications()


@applications.route("/<int:application_id>", methods=["GET"])
def get_application_route(application_id: int):
    """Get a specific application"""
    return get_application(application_id)


@applications.route("/<int:application_id>", methods=["PUT"])
def update_application_route(application_id: int):
    """Update application status"""
    return update_application(application_id)


@applications.route("/<int:application_id>", methods=["DELETE"])
def delete_application_route(application_id: int):
    """Delete an application"""
    return remove_application(application_id)
