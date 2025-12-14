from flask import Blueprint
from api.controllers.job import (
    search_jobs,
    get_job_by_id,
    create_job,
    update_job,
    delete_job,
)

job = Blueprint("job", __name__)


# Job routes
@job.route("", methods=["GET"])
def search_jobs_route():
    """
    Handle HTTP GET requests for listing and searching jobs.
    
    Returns:
        A Flask response containing the job search results (e.g., list of jobs, pagination metadata, and HTTP status).
    """
    return search_jobs()


@job.route("/<int:job_id>", methods=["GET"])
def get_job_by_id_route(job_id: int):
    """
    Return the HTTP response for fetching a job by its numeric ID.
    
    Parameters:
        job_id (int): ID of the job to retrieve.
    
    Returns:
        The Flask response containing the job resource if found, or an error response (e.g., 404) otherwise.
    """
    return get_job_by_id(job_id)


@job.route("", methods=["POST"])
def create_job_route():
    """
    Create a new job resource.
    
    Returns:
        flask.Response: A response representing the created job on success, or an error response on failure.
    """
    return create_job()


@job.route("/<int:job_id>", methods=["PUT"])
def update_job_route(job_id: int):
    """
    Handle updating the job resource identified by job_id.
    
    Parameters:
    	job_id (int): The numeric ID of the job to update.
    
    Returns:
    	Response: HTTP response containing the updated job representation on success or an error response on failure.
    """
    return update_job(job_id)


@job.route("/<int:job_id>", methods=["DELETE"])
def delete_job_route(job_id: int):
    """
    Delete a job by its identifier.
    
    Parameters:
        job_id (int): Identifier of the job to delete.
    
    Returns:
        Response: Flask response representing the deletion outcome (status and body).
    """
    return delete_job(job_id)