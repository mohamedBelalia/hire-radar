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
    get_employer_jobs,
    get_skills,
    create_or_get_skill,
    get_jobs_for_user
)

job = Blueprint("job", __name__)


job.add_url_rule("/suggested", "get_jobs_for_user", get_jobs_for_user, methods=["GET"])

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


@job.route("/my-jobs", methods=["GET"])
def get_employer_jobs_route():
    return get_employer_jobs()


@job.route("/skills", methods=["GET"])
def get_skills_route():
    return get_skills()


@job.route("/skills", methods=["POST"])
def create_or_get_skill_route():
    return create_or_get_skill()


@job.route("/<int:job_id>/apply", methods=["POST"])
def apply_to_job_route(job_id: int):
    return apply_to_job(job_id)


@job.route("/<int:job_id>/report", methods=["POST"])
def report_job_route(job_id: int):
    return report_job(job_id)
