from flask import jsonify, request, send_from_directory
from api.services.candidates_service import (
    get_all_candidates,
    get_candidate_by_id,
    update_candidate_info,
    save_candidate_cv,
    get_candidate_cv_path,
)

# from werkzeug.utils import secure_filename
import os


def list_candidates():
    """
    Return a JSON response containing all candidates and the total count.
    
    Returns:
        response: JSON object with keys "candidates" (list of candidate records) and "count" (integer total number of candidates).
    """
    candidates = get_all_candidates()
    return jsonify({"candidates": candidates, "count": len(candidates)})


def get_candidate(id):
    """
    Retrieve a candidate by identifier and return it as JSON.
    
    Parameters:
    	id: The candidate's identifier used to look up the record.
    
    Returns:
    	On success: JSON object with the key "candidate" containing the candidate data (HTTP 200).
    	If no candidate is found: JSON object {"error": "Candidate not found"} with HTTP 404.
    """
    candidate = get_candidate_by_id(id)
    if not candidate:
        return jsonify({"error": "Candidate not found"}), 404
    return jsonify({"candidate": candidate})


def update_candidate(id):
    """
    Update the candidate with the given id using the JSON payload from the current request.
    
    Parameters:
        id (int | str): Identifier of the candidate to update.
    
    Returns:
        tuple: A Flask JSON response. On success, returns {"message": "Candidate updated", "candidate": updated_candidate} with a 200 status. If the candidate does not exist, returns {"error": "Candidate not found"} with a 404 status.
    """
    update_data = request.json
    updated_candidate = update_candidate_info(id, update_data)
    if not updated_candidate:
        return jsonify({"error": "Candidate not found"}), 404
    return jsonify({"message": "Candidate updated", "candidate": updated_candidate})


# UPLOAD CV

ALLOWED_EXTENSIONS = {"pdf", "doc", "docx"}


def allowed_file(filename):
    """
    Determine whether a filename has an allowed extension for CV uploads.
    
    Parameters:
    	filename (str): The filename to validate.
    
    Returns:
    	allowed (bool): `True` if the filename contains an extension and that extension (case-insensitive) is one of "pdf", "doc", or "docx", `False` otherwise.
    """
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_cv(id):
    """
    Handle a candidate CV file upload from the current request.
    
    Validates presence of the uploaded file and its extension, saves the file as "cv_{id}.pdf" under "uploads/cvs", updates the candidate's resume URL via the service, and returns a JSON response indicating success or the appropriate error.
    
    Parameters:
        id (int | str): Candidate identifier used to name and associate the saved CV.
    
    Returns:
        Flask response: On success, JSON {"message": "CV uploaded successfully", "resume_url": "<path>"} with a 200 status.
        On client errors, JSON {"error": "<message>"} with a 400 status for missing/invalid file.
        If the candidate is not found, JSON {"error": "Candidate not found"} with a 404 status.
    """
    if "file" not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return (
            jsonify({"error": "Invalid file type. Only PDF, DOC, DOCX allowed."}),
            400,
        )

    filename = f"cv_{id}.pdf"
    file_path = os.path.join("uploads/cvs", f"{filename}")

    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    file.save(file_path)

    resume_url = f"/uploads/cvs/{filename}"
    updated_candidate = save_candidate_cv(id, resume_url)

    if not updated_candidate:
        return jsonify({"error": "Candidate not found"}), 404

    return jsonify({"message": "CV uploaded successfully", "resume_url": resume_url})


def get_candidate_cv(id):
    """
    Serve the stored CV file for the candidate identified by `id`, or return a 404 error if none is found.
    
    Parameters:
        id (int | str): Identifier of the candidate whose CV should be retrieved.
    
    Returns:
        Flask response: the CV file served from the "uploads" directory when present; otherwise a JSON object `{"error": "CV not found"}` with HTTP status 404.
    """
    filename = get_candidate_cv_path(id)
    if filename:
        return send_from_directory("uploads", filename, as_attachment=False)
    return jsonify({"error": "CV not found"}), 404