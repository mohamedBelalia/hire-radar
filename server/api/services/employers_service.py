from api.config.db import SessionLocal
from api.core.models import User


def list_employers():
    session = SessionLocal()
    try:
        employers = session.query(User).filter(User.role == "employer").all()
        return employers
    finally:
        session.close()


def get_employer(id):
    session = SessionLocal()
    try:
        employer = (
            session.query(User).filter(User.id == id, User.role == "employer").first()
        )
        return employer
    finally:
        session.close()


def update_employer(id, data: dict):
    session = SessionLocal()
    try:
        employer = (
            session.query(User).filter(User.id == id, User.role == "employer").first()
        )
        if not employer:
            return None
        for key, value in data.items():
            if hasattr(employer, key):
                setattr(employer, key, value)
        session.commit()
        return employer
    finally:
        session.close()
