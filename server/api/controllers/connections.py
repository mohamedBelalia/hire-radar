from flask import request, jsonify
from sqlalchemy.orm import Session
from config.db import SessionLocal
from core.models import User, ConnectionRequest, Notification
import jwt
import os


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def send_request():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing or invalid Authorization header"}), 401

    token = auth_header.split(" ")[1]
    JWT_SECRET = os.getenv("JWT_SECRET", "secret123")

    data = request.json
    receiver_id = data.get("receiver_id")

    if not receiver_id:
        return jsonify({"error": "Missing receiver_id"}), 400

    db: Session = next(get_db())

    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        sender_id = decoded["id"]

        if sender_id == receiver_id:
            return jsonify({"error": "Cannot connect with yourself"}), 400

        existing_request = (
            db.query(ConnectionRequest)
            .filter(
                (
                    (ConnectionRequest.sender_id == sender_id)
                    & (ConnectionRequest.receiver_id == receiver_id)
                )
                | (
                    (ConnectionRequest.sender_id == receiver_id)
                    & (ConnectionRequest.receiver_id == sender_id)
                )
            )
            .first()
        )

        if existing_request:
            return jsonify({"error": "Connection request already exists"}), 400

        new_request = ConnectionRequest(
            sender_id=sender_id, receiver_id=receiver_id, status="pending"
        )
        db.add(new_request)

        sender = db.query(User).get(sender_id)
        notification = Notification(
            sender_id=sender_id,
            receiver_id=receiver_id,
            type="connection_request",
            title="New Connection Request",
            message=f"{sender.full_name or 'Someone'} wants to connect with you.",
            is_read=0,
        )
        db.add(notification)

        db.commit()

        return jsonify({"message": "Connection request sent successfully"}), 201

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def get_requests():
    """Get all connection requests for the current user"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing or invalid Authorization header"}), 401

    token = auth_header.split(" ")[1]
    JWT_SECRET = os.getenv("JWT_SECRET", "secret123")

    db: Session = next(get_db())

    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        current_user_id = decoded["id"]

        received = (
            db.query(ConnectionRequest)
            .filter(ConnectionRequest.receiver_id == current_user_id)
            .all()
        )

        sent = (
            db.query(ConnectionRequest)
            .filter(ConnectionRequest.sender_id == current_user_id)
            .all()
        )

        return (
            jsonify(
                {
                    "received": [
                        {
                            "id": req.id,
                            "sender": {
                                "id": req.sender.id,
                                "full_name": req.sender.full_name,
                                "image": req.sender.image,
                                "headline": req.sender.headLine,
                                "role": req.sender.role,
                            },
                            "status": req.status,
                            "created_at": req.created_at.isoformat(),
                        }
                        for req in received
                    ],
                    "sent": [
                        {
                            "id": req.id,
                            "receiver": {
                                "id": req.receiver.id,
                                "full_name": req.receiver.full_name,
                                "image": req.receiver.image,
                                "headline": req.receiver.headLine,
                                "role": req.receiver.role,
                            },
                            "status": req.status,
                            "created_at": req.created_at.isoformat(),
                        }
                        for req in sent
                    ],
                }
            ),
            200,
        )

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def accept_request(request_id: int):
    """Accept a connection request"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing or invalid Authorization header"}), 401

    token = auth_header.split(" ")[1]
    JWT_SECRET = os.getenv("JWT_SECRET", "secret123")

    db: Session = next(get_db())

    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        current_user_id = decoded["id"]

        req = (
            db.query(ConnectionRequest)
            .filter(
                ConnectionRequest.id == request_id,
                ConnectionRequest.receiver_id == current_user_id,
            )
            .first()
        )

        if not req:
            return jsonify({"error": "Request not found"}), 404

        if req.status != "pending":
            return jsonify({"error": f"Request already {req.status}"}), 400

        req.status = "accepted"

        receiver = db.query(User).get(current_user_id)
        notification = Notification(
            sender_id=current_user_id,
            receiver_id=req.sender_id,
            type="connection_accepted",
            title="Connection Accepted",
            message=f"{receiver.full_name} accepted your connection request.",
            is_read=0,
        )
        db.add(notification)

        db.commit()
        return jsonify({"message": "Connection accepted"}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def reject_request(request_id: int):
    """Reject a connection request"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing or invalid Authorization header"}), 401

    token = auth_header.split(" ")[1]
    JWT_SECRET = os.getenv("JWT_SECRET", "secret123")

    db: Session = next(get_db())

    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        current_user_id = decoded["id"]

        req = (
            db.query(ConnectionRequest)
            .filter(
                ConnectionRequest.id == request_id,
                ConnectionRequest.receiver_id == current_user_id,
            )
            .first()
        )

        if not req:
            return jsonify({"error": "Request not found"}), 404

        if req.status != "pending":
            return jsonify({"error": f"Request already {req.status}"}), 400

        req.status = "rejected"
        db.commit()
        return jsonify({"message": "Connection rejected"}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
