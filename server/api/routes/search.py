from flask import Blueprint
from controllers.search import search_all

search = Blueprint("search", __name__)

search.add_url_rule("", "search_all", search_all, methods=["GET"])
