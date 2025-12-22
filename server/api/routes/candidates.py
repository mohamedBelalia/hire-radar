from flask import Blueprint
from controllers.candidates import (
    get_candidate_career,
    update_candidate,
    upload_cv,
    get_saved_jobs,
    add_skill,
    upload_profile_image,
    add_education,
    update_education,
    delete_education,
    add_experience,
    update_experience,
    delete_experience,
    delete_skill,
    get_skills,
    get_public_user
)


candidates = Blueprint("candidates", __name__)

# Public candidate profile
candidates.add_url_rule(
    "/<int:user_id>", "get_public_user", get_public_user, methods=["GET"]
)

# Candidate routes
candidates.add_url_rule(
    "/career", "get_candidate-career", get_candidate_career, methods=["GET"]
)
candidates.add_url_rule(
    "/update-profile", "update_candidate", update_candidate, methods=["PUT"]
)
candidates.add_url_rule(
    "/<int:candidate_id>/upload-cv", "upload_cv", upload_cv, methods=["POST"]
)
candidates.add_url_rule(
    "/<int:candidate_id>/saved-jobs", "get_saved_jobs", get_saved_jobs, methods=["GET"]
)

# Profile image upload
candidates.add_url_rule(
    "/<int:candidate_id>/upload-image",
    "upload_profile_image",
    upload_profile_image,
    methods=["POST"],
)



# EDUCATION ROUTES
candidates.add_url_rule(
    "/educations", "add_education", add_education, methods=["POST"]
)
candidates.add_url_rule(
    "/educations/<int:education_id>", "update_education", update_education, methods=["PUT"]
)
candidates.add_url_rule(
    "/educations/<int:education_id>", "delete_education", delete_education, methods=["DELETE"]
)

# EXPERIENCE ROUTES
candidates.add_url_rule(
    "/experiences", "add_experience", add_experience, methods=["POST"]
)
candidates.add_url_rule(
    "/experiences/<int:experience_id>", "update_experience", update_experience, methods=["PUT"]
)
candidates.add_url_rule(
    "/experiences/<int:experience_id>", "delete_experience", delete_experience, methods=["DELETE"]
)

# SKILL ROUTES

candidates.add_url_rule(
    "/skills", "get_skills", get_skills, methods=["GET"]
)

candidates.add_url_rule(
    "/skills", "add_skill", add_skill, methods=["POST"]
)
candidates.add_url_rule(
    "/skills/<int:skill_id>", "delete_skill", delete_skill, methods=["DELETE"]
)