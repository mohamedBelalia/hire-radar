from flask import Blueprint
from controllers.applications import (
    get_all_applications,
    get_application,
    update_application,
)

applications = Blueprint("applications", __name__)

applications.add_url_rule(
    "", "get_all_applications", get_all_applications, methods=["GET"]
)
applications.add_url_rule(
    "/<int:application_id>", "get_application", get_application, methods=["GET"]
)
applications.add_url_rule(
    "/<int:application_id>", "update_application", update_application, methods=["PUT"]
)
