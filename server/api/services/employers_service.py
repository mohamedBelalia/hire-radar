from api.config.db import SessionLocal
from api.core.models import User

def list_employers():
    """
    Return all User records whose role is "employer".
    
    Returns:
        list[User]: A list of employer User objects; empty list if no employers exist.
    """
    session = SessionLocal()
    try:
        employers = session.query(User).filter(User.role == "employer").all()
        return employers
    finally:
        session.close()

def get_employer(id):
    """
    Retrieve an employer user by their identifier.
    
    Parameters:
        id: The employer's identifier to look up.
    
    Returns:
        employer (User or None): The matching User with role "employer", or None if no match is found.
    """
    session = SessionLocal()
    try:
        employer = session.query(User).filter(User.id == id, User.role == "employer").first()
        return employer
    finally:
        session.close()

def update_employer(id, data: dict):
    """
    Update fields on an employer user with provided values.
    
    Parameters:
        id (int): ID of the employer to update.
        data (dict): Mapping of attribute names to new values; only attributes that exist on the employer are modified.
    
    Returns:
        The updated User instance if an employer with the given ID exists, otherwise None.
    """
    session = SessionLocal()
    try:
        employer = session.query(User).filter(User.id == id, User.role == "employer").first()
        if not employer:
            return None
        for key, value in data.items():
            if hasattr(employer, key):
                setattr(employer, key, value)
        session.commit()
        return employer
    finally:
        session.close()