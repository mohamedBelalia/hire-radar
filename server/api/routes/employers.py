from flask import Blueprint
from api.controllers.employers import (
    list_employers_controller,
    get_employer_controller,
    update_employer_controller,
)

employers = Blueprint("employers", __name__)

# Endpoints
employers.get("/")(list_employers_controller)  # GET /api/employers
employers.get("/<int:id>")(get_employer_controller)  # GET /api/employers/<id>
employers.put("/<int:id>")(update_employer_controller)  # PUT /api/employers/<id>
