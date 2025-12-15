from flask import Blueprint
from api.controllers.job import (
    search_jobs,
    get_job_by_id,
    create_job,
    update_job,
    delete_job,
)
from api.controllers.applications import (
    apply_for_job,
    list_job_applicants,
)

job = Blueprint("job", __name__)


# Job routes
@job.route("/", methods=["GET"])
def search_jobs_route():
    return search_jobs()


@job.route("/<int:job_id>", methods=["GET"])
def get_job_by_id_route(job_id: int):
    return get_job_by_id(job_id)


@job.route("", methods=["POST"])
def create_job_route():
    return create_job()


@job.route("/<int:job_id>", methods=["PUT"])
def update_job_route(job_id: int):
    return update_job(job_id)


@job.route("/<int:job_id>", methods=["DELETE"])
def delete_job_route(job_id: int):
    return delete_job(job_id)


# Application routes for jobs
@job.route("/<int:job_id>/apply", methods=["POST"])
def apply_for_job_route(job_id: int):
    """Candidate applies for a job"""
    return apply_for_job(job_id)


@job.route("/<int:job_id>/applicants", methods=["GET"])
def get_job_applicants_route(job_id: int):
    """Get all applicants for a job"""
    return list_job_applicants(job_id)
