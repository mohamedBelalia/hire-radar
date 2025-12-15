from flask import Blueprint
from controllers.employers import (
    get_employer,
    update_employer,
)

employers = Blueprint("employers", __name__)

# Employer routes
employers.add_url_rule("/<int:employer_id>", "get_employer", get_employer, methods=["GET"])
employers.add_url_rule("/<int:employer_id>", "update_employer", update_employer, methods=["PUT"])
