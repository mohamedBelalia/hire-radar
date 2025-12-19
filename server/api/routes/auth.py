from flask import Blueprint
from controllers.auth import (
    google_login,
    google_callback,
    get_current_user,
    logout,
    signup,
    login,
    github_connect,
    github_callback,
    get_connected_accounts,
)

auth = Blueprint("auth", __name__)

# Auth routes - using proper Flask blueprint syntax
auth.add_url_rule("/google", "google_login", google_login, methods=["GET"])
auth.add_url_rule(
    "/google/callback", "google_callback", google_callback, methods=["GET"]
)
auth.add_url_rule("/me", "get_current_user", get_current_user, methods=["GET"])
auth.add_url_rule("/logout", "logout", logout, methods=["POST"])
auth.add_url_rule("/signup", "signup", signup, methods=["POST"])
auth.add_url_rule("/login", "login", login, methods=["POST"])
auth.add_url_rule(
    "/me/connected-accounts",
    "get_connected_accounts",
    get_connected_accounts,
    methods=["GET"],
)
