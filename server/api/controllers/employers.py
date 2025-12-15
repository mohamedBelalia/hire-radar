from flask import jsonify, request
from api.services.employers_service import list_employers, get_employer, update_employer


def list_employers_controller():
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
    data = request.json
    e = update_employer(id, data)
    if not e:
        return jsonify({"error": "Employer not found"}), 404
    return jsonify({"message": f"Employer {id} updated", "employer": data})
