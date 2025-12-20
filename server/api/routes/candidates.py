from flask import Blueprint
from controllers.candidates import (
    get_candidate,
    update_candidate,
    upload_cv,
    get_saved_jobs,
    add_skill,
    remove_skill,
    upload_profile_image,
    get_random_candidates,
)

candidates = Blueprint("candidates", __name__)

# Candidate routes
candidates.add_url_rule(
    "/<int:candidate_id>", "get_candidate", get_candidate, methods=["GET"]
)
candidates.add_url_rule(
    "/<int:candidate_id>", "update_candidate", update_candidate, methods=["PUT"]
)
candidates.add_url_rule(
    "/<int:candidate_id>/upload-cv", "upload_cv", upload_cv, methods=["POST"]
)
candidates.add_url_rule(
    "/<int:candidate_id>/saved-jobs", "get_saved_jobs", get_saved_jobs, methods=["GET"]
)
candidates.add_url_rule(
    "/<int:candidate_id>/skills", "add_skill", add_skill, methods=["POST"]
)
candidates.add_url_rule(
    "/<int:candidate_id>/skills/<int:skill_id>",
    "remove_skill",
    remove_skill,
    methods=["DELETE"],
)
candidates.add_url_rule(
    "/random",
    "get_random_candidates",
    get_random_candidates,
    methods=["GET"],
)

# Profile image upload
candidates.add_url_rule(
    "/<int:candidate_id>/upload-image",
    "upload_profile_image",
    upload_profile_image,
    methods=["POST"],
)
