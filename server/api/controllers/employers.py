from flask import jsonify, request
from api.services.employers_service import list_employers, get_employer, update_employer

def list_employers_controller():
    """
    Serialize all employers and return them as a JSON response.
    
    Returns:
        flask.Response: JSON object with key "employers" mapping to a list of employer dictionaries.
        Each employer dictionary contains the fields: id, full_name, email, companyName, webSite, location, phone, and bio.
    """
    employers = list_employers()
    result = [
        {
            "id": e.id,
            "full_name": e.full_name,
            "email": e.email,
            "companyName": e.companyName,
            "webSite": e.webSite,
            "location": e.location,
            "phone": e.phone,
            "bio": e.bio,
        }
        for e in employers
    ]
    return jsonify({"employers": result})

def get_employer_controller(id):
    """
    Retrieve a single employer by its identifier and return a JSON HTTP response.
    
    If an employer with the given id exists, returns a JSON object with key "employer" whose value is a mapping containing the employer's id, full_name, email, companyName, webSite, location, phone, and bio. If no employer is found, returns a JSON error message with HTTP status 404.
    
    Parameters:
        id (int | str): Identifier of the employer to fetch.
    
    Returns:
        Response: Flask JSON response; on success contains {"employer": {...}}, on failure contains {"error": "Employer not found"} with HTTP 404 status.
    """
    e = get_employer(id)
    if not e:
        return jsonify({"error": "Employer not found"}), 404
    result = {
        "id": e.id,
        "full_name": e.full_name,
        "email": e.email,
        "companyName": e.companyName,
        "webSite": e.webSite,
        "location": e.location,
        "phone": e.phone,
        "bio": e.bio,
    }
    return jsonify({"employer": result})

def update_employer_controller(id):
    """
    Update an employer's record using JSON payload from the current request.
    
    Parameters:
        id (str|int): Identifier of the employer to update.
    
    Returns:
        tuple: A JSON response and HTTP status code. On success, JSON contains
        `message` ("Employer {id} updated") and `employer` (the submitted data) with a 200 status.
        If no employer is found, JSON contains `error` ("Employer not found") with a 404 status.
    """
    data = request.json
    e = update_employer(id, data)
    if not e:
        return jsonify({"error": "Employer not found"}), 404
    return jsonify({"message": f"Employer {id} updated", "employer": data})