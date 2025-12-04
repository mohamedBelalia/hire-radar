import os

from dotenv import load_dotenv
from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

load_dotenv()


database = SQLAlchemy()
db_migration = Migrate()


def create_app(config_type=os.getenv("CONFIG_TYPE")):
    app = Flask(__name__)

    app.config.from_object(config_type)

    initailize_extension(app)

    return app


def initailize_extension(app):
    database.init_app(app)

    db_migration.init_app(app, database)

    import core.models  # noqa:F401
