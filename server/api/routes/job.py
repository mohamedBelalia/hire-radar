from flask import Blueprint
from controllers.job import (
    search_jobs,
    get_job_by_id,
    create_job,
    update_job,
    delete_job,
    save_job,
    unsave_job,
    apply_to_job,
)

job = Blueprint("job", __name__)

@job.route("", methods=["GET"])
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


@job.route("/<int:job_id>/save", methods=["POST"])
def save_job_route(job_id: int):
    return save_job(job_id)


@job.route("/<int:job_id>/save", methods=["DELETE"])
def unsave_job_route(job_id: int):
    return unsave_job(job_id)


@job.route("/<int:job_id>/apply", methods=["POST"])
def apply_to_job_route(job_id: int):
    return apply_to_job(job_id)
