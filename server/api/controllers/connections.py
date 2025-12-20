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

        # Check if request already exists
        existing_request = db.query(ConnectionRequest).filter(
            ((ConnectionRequest.sender_id == sender_id) & (ConnectionRequest.receiver_id == receiver_id)) |
            ((ConnectionRequest.sender_id == receiver_id) & (ConnectionRequest.receiver_id == sender_id))
        ).first()

        if existing_request:
            return jsonify({"error": "Connection request already exists"}), 400
            
        # Create connection request
        new_request = ConnectionRequest(
            sender_id=sender_id,
            receiver_id=receiver_id,
            status="pending"
        )
        db.add(new_request)
        
        # Create notification
        sender = db.query(User).get(sender_id)
        notification = Notification(
            sender_id=sender_id,
            receiver_id=receiver_id,
            type="connection_request",
            title="New Connection Request",
            message=f"{sender.full_name or 'Someone'} wants to connect with you.",
            is_read=0
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
