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
    candidates = get_all_candidates()
    return jsonify({"candidates": candidates, "count": len(candidates)})


def get_candidate(id):
    candidate = get_candidate_by_id(id)
    if not candidate:
        return jsonify({"error": "Candidate not found"}), 404
    return jsonify({"candidate": candidate})


def update_candidate(id):
    update_data = request.json
    updated_candidate = update_candidate_info(id, update_data)
    if not updated_candidate:
        return jsonify({"error": "Candidate not found"}), 404
    return jsonify({"message": "Candidate updated", "candidate": updated_candidate})


# UPLOAD CV

ALLOWED_EXTENSIONS = {"pdf", "doc", "docx"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_cv(id):
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
    filename = get_candidate_cv_path(id)
    if filename:
        return send_from_directory("uploads", filename, as_attachment=False)
    return jsonify({"error": "CV not found"}), 404
