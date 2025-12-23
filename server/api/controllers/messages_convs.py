from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room
from sqlalchemy.orm import Session
from sqlalchemy import func
from core.models import (
    get_db,
    Conversation,
    conversation_participants,
    Message,
    User
)
from middlewares.auth import is_auth  # your auth decorator

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# =========================================
# JOIN A USER TO A ROOM (conversation)
# =========================================
@socketio.on("join_conversation")
@is_auth
def handle_join_conversation(data):
    """Join the Socket.IO room for a conversation"""
    user_id = request.user_id
    conversation_id = data.get("conversation_id")

    db: Session = next(get_db())
    try:
        # Check if user is participant
        is_participant = db.query(conversation_participants).filter(
            conversation_participants.c.conversation_id == conversation_id,
            conversation_participants.c.user_id == user_id
        ).first()

        if not is_participant:
            emit("error", {"message": "Access denied"})
            return

        join_room(str(conversation_id))
        emit("joined", {"conversation_id": conversation_id})
    finally:
        db.close()

# =========================================
# SEND A MESSAGE
# =========================================
@socketio.on("send_message")
@is_auth
def handle_send_message(data):
    """Send a message in real-time"""
    user_id = request.user_id
    conversation_id = data.get("conversation_id")
    content = data.get("content", "").strip()

    if not content:
        emit("error", {"message": "Message content is required"})
        return

    db: Session = next(get_db())
    try:
        # Check membership
        is_participant = db.query(conversation_participants).filter(
            conversation_participants.c.conversation_id == conversation_id,
            conversation_participants.c.user_id == user_id
        ).first()

        if not is_participant:
            emit("error", {"message": "Access denied"})
            return

        message = Message(
            conversation_id=conversation_id,
            sender_id=user_id,
            content=content
        )

        db.add(message)
        db.commit()
        db.refresh(message)

        message_data = {
            "id": message.id,
            "conversation_id": conversation_id,
            "sender_id": user_id,
            "content": content,
            "created_at": str(message.created_at)
        }

        # Emit to all participants in the room
        emit("new_message", message_data, room=str(conversation_id))
    except Exception as e:
        db.rollback()
        emit("error", {"message": str(e)})
    finally:
        db.close()

# =========================================
# GET MESSAGES OF A CONVERSATION (optional)
# =========================================
@socketio.on("get_messages")
@is_auth
def handle_get_messages(data):
    """Fetch paginated messages of a conversation"""
    user_id = request.user_id
    conversation_id = data.get("conversation_id")
    page = int(data.get("page", 1))
    limit = int(data.get("limit", 20))

    db: Session = next(get_db())
    try:
        # Check membership
        is_participant = db.query(conversation_participants).filter(
            conversation_participants.c.conversation_id == conversation_id,
            conversation_participants.c.user_id == user_id
        ).first()

        if not is_participant:
            emit("error", {"message": "Access denied"})
            return

        query = db.query(Message).filter(
            Message.conversation_id == conversation_id
        ).order_by(Message.created_at.desc())

        total = query.count()
        messages = query.offset((page - 1) * limit).limit(limit).all()

        data = [
            {
                "id": m.id,
                "content": m.content,
                "sender_id": m.sender_id,
                "created_at": str(m.created_at)
            }
            for m in messages
        ]

        emit("messages", {
            "messages": data,
            "total": total,
            "page": page,
            "limit": limit
        })

    finally:
        db.close()

# =========================================
# GET USER CONVERSATIONS
# =========================================
@socketio.on("get_conversations")
@is_auth
def handle_get_conversations():
    """Get all conversations of the authenticated user"""
    user_id = request.user_id
    db: Session = next(get_db())
    try:
        conversations = db.query(Conversation).join(conversation_participants).filter(
            conversation_participants.c.user_id == user_id
        ).order_by(Conversation.created_at.desc()).all()

        data = []
        for convo in conversations:
            other_users = [
                {"id": u.id, "full_name": u.full_name, "image": u.image}
                for u in convo.participants if u.id != user_id
            ]

            last_message = db.query(Message).filter(
                Message.conversation_id == convo.id
            ).order_by(Message.created_at.desc()).first()

            data.append({
                "conversation_id": convo.id,
                "participants": other_users,
                "last_message": last_message.content if last_message else None,
                "last_message_at": str(last_message.created_at) if last_message else None,
            })

        emit("conversations", {"conversations": data})
    finally:
        db.close()


if __name__ == "__main__":
    # Using eventlet for async server
    import eventlet
    eventlet.monkey_patch()
    socketio.run(app, host="0.0.0.0", port=5000)
