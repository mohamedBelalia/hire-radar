from flask import jsonify, request
from api.services.applications_service import (
    candidate_apply_for_job,
    get_all_applications,
    get_candidate_applications,
    get_job_applicants,
    update_application_status,
    get_application_by_id,
    delete_application,
)


def apply_for_job(job_id: int):
    """
    POST /jobs/{job_id}/apply
    Candidate applies for a job
    """
    try:
        data = request.get_json()

        if not data or "user_id" not in data:
            return jsonify({"error": "Missing required field: user_id"}), 400

        user_id = data.get("user_id")
        cover_letter = data.get("cover_letter")
        resume_url = data.get("resume_url")

        application, error = candidate_apply_for_job(
            job_id=job_id,
            user_id=user_id,
            cover_letter=cover_letter,
            resume_url=resume_url,
        )

        if error:
            return jsonify({"error": error}), 400

        return (
            jsonify(
                {
                    "message": "Application submitted successfully",
                    "application": application,
                }
            ),
            201,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def list_all_applications():
    """
    GET /applications
    List all applications (admin/employer view)
    """
    try:
        applications = get_all_applications()
        return jsonify({"applications": applications, "count": len(applications)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def list_candidate_applications(id: int):
    """
    GET /candidates/{candidate_id}/applications
    Get all applications for a candidate
    """
    try:
        applications, error = get_candidate_applications(id)

        if error:
            return jsonify({"error": error}), 404

        return jsonify({"applications": applications, "count": len(applications)}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def list_job_applicants(job_id: int):
    """
    GET /jobs/{job_id}/applicants
    Get all applicants for a job
    """
    try:
        applications, error = get_job_applicants(job_id)

        if error:
            return jsonify({"error": error}), 404

        return jsonify({"applicants": applications, "count": len(applications)}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def update_application(application_id: int):
    """
    PUT /applications/{application_id}
    Update application status
    """
    try:
        data = request.get_json()

        if not data or "status" not in data:
            return jsonify({"error": "Missing required field: status"}), 400

        status = data.get("status")

        application, error = update_application_status(application_id, status)

        if error:
            return jsonify({"error": error}), 400

        return (
            jsonify(
                {
                    "message": "Application updated successfully",
                    "application": application,
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_application(application_id: int):
    """
    GET /applications/{application_id}
    Get a specific application
    """
    try:
        application, error = get_application_by_id(application_id)

        if error:
            return jsonify({"error": error}), 404

        return jsonify({"application": application}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def remove_application(application_id: int):
    """
    DELETE /applications/{application_id}
    Delete an application
    """
    try:
        success, error = delete_application(application_id)

        if error:
            return jsonify({"error": error}), 404

        return jsonify({"message": "Application deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
