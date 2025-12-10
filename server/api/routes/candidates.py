from flask import Blueprint
from api.controllers.candidates import (
    list_candidates,
    get_candidate,
    update_candidate,
    upload_cv,
    get_candidate_cv
)

candidates = Blueprint("candidates", __name__)

# Routes
candidates.get("/")(list_candidates)
candidates.get("/<int:id>")(get_candidate)
candidates.put("/<int:id>")(update_candidate)
candidates.post("/<int:id>/upload-cv")(upload_cv)
candidates.get("/<int:id>/cv")(get_candidate_cv) 
