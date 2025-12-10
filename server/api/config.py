import os

from sqlalchemy.engine.url import URL

BASEDIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    FLASK_ENV = os.getenv("FLASK_ENV")
    DEBUG = os.getenv("DEBUG")


class DevelopmentConfig(Config):
    DEBUG = True

    SQLALCHEMY_DATABASE_URI = URL.create(
        "postgresql+psycopg2",
        username=os.getenv("DB_USERNAME"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
    )

    # url_object = URL.create(
    #     "postgresql+psycopg2",  # this is the used driver to connect with the db & manage connection to it
    #     username=os.getenv("DB_USERNAME"),
    #     password=os.getenv("DB_PASSWORD"),
    #     host=os.getenv("DB_HOST"),
    #     database=os.getenv("DB_NAME"),
    # )

    # SQLALCHEMY_DATABASE_URI = url_object


class ProductionConfig(Config):
    FLASK_ENV = "production"
    DEBUG = False
