from flask import Blueprint
from controllers.connections import send_request

connections = Blueprint("connections", __name__)

connections.add_url_rule(
    "/request",
    "send_request",
    send_request,
    methods=["POST"],
)
