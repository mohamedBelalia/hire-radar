from flask import Blueprint

from api.controllers.auth import (
    get_current_user,
    google_callback,
    google_login,
    login,
    logout,
    signup,
)

auth = Blueprint("auth", __name__)

auth.get("/google")(google_login)
auth.get("/google/callback")(google_callback)
auth.get("/me")(get_current_user)
auth.post("/logout")(logout)
auth.post("/signup")(signup)
auth.post("/login")(login)
