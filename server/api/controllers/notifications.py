from flask import request, jsonify
from sqlalchemy.orm import Session
from config.db import SessionLocal
from core.models import Notification, User
import jwt
import os


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_notifications():
    """Get notifications for the current user"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing or invalid Authorization header"}), 401

    token = auth_header.split(" ")[1]
    JWT_SECRET = os.getenv("JWT_SECRET", "secret123")

    db: Session = next(get_db())

    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        current_user_id = decoded["id"]

        notifications = (
            db.query(Notification)
            .filter(Notification.receiver_id == current_user_id)
            .order_by(Notification.created_at.desc())
            .limit(20)
            .all()
        )

        return (
            jsonify(
                [
                    {
                        "id": notif.id,
                        "sender_id": notif.sender_id,
                        "receiver_id": notif.receiver_id,
                        "type": notif.type,
                        "title": notif.title,
                        "message": notif.message,
                        "is_read": notif.is_read,
                        "created_at": notif.created_at.isoformat(),
                        "sender": (
                            {
                                "id": notif.sender.id,
                                "full_name": notif.sender.full_name,
                                "image": notif.sender.image,
                            }
                            if notif.sender
                            else None
                        ),
                    }
                    for notif in notifications
                ]
            ),
            200,
        )

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


def mark_notification_read(notification_id: int):
    """Mark a notification as read"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing or invalid Authorization header"}), 401

    token = auth_header.split(" ")[1]
    JWT_SECRET = os.getenv("JWT_SECRET", "secret123")

    db: Session = next(get_db())

    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        current_user_id = decoded["id"]

        notification = (
            db.query(Notification)
            .filter(
                Notification.id == notification_id,
                Notification.receiver_id == current_user_id,
            )
            .first()
        )

        if not notification:
            return jsonify({"error": "Notification not found"}), 404

        notification.is_read = 1
        db.commit()

        return jsonify({"message": "Notification marked as read"}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
