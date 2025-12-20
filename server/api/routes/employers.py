from flask import Blueprint
from controllers.employers import (
    get_employer,
    update_employer,
    upload_profile_image,
    get_random_employers,
)

employers = Blueprint("employers", __name__)

employers.add_url_rule(
    "/<int:employer_id>", "get_employer", get_employer, methods=["GET"]
)
employers.add_url_rule(
    "/<int:employer_id>", "update_employer", update_employer, methods=["PUT"]
)

employers.add_url_rule(
    "/<int:employer_id>/upload-image",
    "upload_profile_image",
    upload_profile_image,
    methods=["POST"],
)

employers.add_url_rule(
    "/random",
    "get_random_employers",
    get_random_employers,
    methods=["GET"],
)
