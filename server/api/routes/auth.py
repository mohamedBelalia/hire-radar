from flask import Blueprint
from controllers.auth import google_login, google_callback, get_current_user, logout, signup, login, logout

auth = Blueprint("auth", __name__)

auth.get("/google")(google_login)
auth.get("/google/callback")(google_callback)
auth.get("/me")(get_current_user)
auth.post("/logout")(logout)
auth.post("/signup")(signup)
auth.post("/login")(login)
auth.post("/logout")(logout)