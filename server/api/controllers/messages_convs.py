from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room
from sqlalchemy.orm import Session, joinedload
from core.models import Conversation, conversation_participants, Message, User
from middlewares.auth import is_auth 
from config.db import SessionLocal
import traceback


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@is_auth
def get_conversations():
    """Get all conversations for the authenticated user"""
    user_id = request.user_id
    print(f"[GET_CONVERSATIONS] User ID: {user_id}")
    
    db = SessionLocal()

    try:
        # Query conversations with participants loaded
        conversations = (
            db.query(Conversation)
            .join(conversation_participants)
            .filter(conversation_participants.c.user_id == user_id)
            .options(joinedload(Conversation.participants))
            .order_by(Conversation.created_at.desc())
            .all()
        )

        print(f"[GET_CONVERSATIONS] Found {len(conversations)} conversations")

        data = []
        for convo in conversations:
            # Get other participants (exclude current user)
            other_users = [
                {
                    "_id": str(u.id),
                    "id": str(u.id),  # Add both for compatibility
                    "name": u.full_name,
                    "profilePictureUrl": u.image,
                    "headline":u.headLine,  # Add headline if it exists
                }
                for u in convo.participants
                if u.id != user_id
            ]

            # Get last message
            last_message = (
                db.query(Message)
                .filter(Message.conversation_id == convo.id)
                .order_by(Message.created_at.desc())
                .first()
            )

            conversation_data = {
                "_id": str(convo.id),
                "id": str(convo.id),  # Add both for compatibility
                "participants": other_users,
                "lastMessage": last_message.content if last_message else None,
                "updatedAt": (
                    last_message.created_at.isoformat()
                    if last_message
                    else convo.created_at.isoformat()
                ),
            }
            
            data.append(conversation_data)

        print(f"[GET_CONVERSATIONS] Returning {len(data)} conversations")
        return jsonify({"conversations": data}), 200

    except Exception as e:
        print(f"[GET_CONVERSATIONS] Error: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": f"Failed to fetch conversations: {str(e)}"}), 500
    finally:
        db.close()


@is_auth
def get_messages(conversation_id):
    """Get messages for a specific conversation"""
    user_id = request.user_id
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 50))
    
    print(f"[GET_MESSAGES] User: {user_id}, Conversation: {conversation_id}, Page: {page}")
    
    db = SessionLocal()

    try:
        # Verify user is participant
        is_participant = (
            db.query(conversation_participants)
            .filter(
                conversation_participants.c.conversation_id == conversation_id,
                conversation_participants.c.user_id == user_id,
            )
            .first()
        )

        if not is_participant:
            print(f"[GET_MESSAGES] Access denied - user {user_id} not in conversation {conversation_id}")
            return jsonify({"error": "Access denied"}), 403

        # Query messages with sender info
        query = (
            db.query(Message)
            .options(joinedload(Message.sender))
            .filter(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
        )

        total = query.count()
        messages = query.offset((page - 1) * limit).limit(limit).all()

        data = [
            {
                "_id": str(m.id),
                "text": m.content,
                "sender": {
                    "_id": str(m.sender_id),
                    "name": m.sender.full_name if m.sender else "Unknown",
                },
                "createdAt": m.created_at.isoformat(),
            }
            for m in messages
        ]

        print(f"[GET_MESSAGES] Returning {len(data)} messages (total: {total})")
        
        return jsonify(
            {
                "messages": data,
                "total": total,
                "page": page,
                "limit": limit,
            }
        ), 200

    except Exception as e:
        print(f"[GET_MESSAGES] Error: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": f"Failed to fetch messages: {str(e)}"}), 500
    finally:
        db.close()


@is_auth
def send_message():
    """Send a new message in a conversation"""
    user_id = request.user_id
    body = request.get_json()
    
    if not body:
        return jsonify({"error": "Request body is required"}), 400
    
    conversation_id = body.get("conversationId")
    text = body.get("text", "").strip()
    
    print(f"[SEND_MESSAGE] User: {user_id}, Conversation: {conversation_id}, Text length: {len(text)}")
    
    db = SessionLocal()

    if not text:
        return jsonify({"error": "Message content is required"}), 400
    
    if not conversation_id:
        return jsonify({"error": "Conversation ID is required"}), 400

    try:
        # Verify user is participant
        is_participant = (
            db.query(conversation_participants)
            .filter(
                conversation_participants.c.conversation_id == conversation_id,
                conversation_participants.c.user_id == user_id,
            )
            .first()
        )

        if not is_participant:
            print(f"[SEND_MESSAGE] Access denied - user {user_id} not in conversation {conversation_id}")
            return jsonify({"error": "Access denied"}), 403

        # Create message
        message = Message(
            conversation_id=conversation_id,
            sender_id=user_id,
            content=text,
        )

        db.add(message)
        db.commit()
        db.refresh(message)

        print(f"[SEND_MESSAGE] Message created with ID: {message.id}")

        response_data = {
            "_id": str(message.id),
            "conversationId": str(conversation_id),
            "text": message.content,
            "sender": {
                "_id": str(user_id),
            },
            "createdAt": message.created_at.isoformat(),
        }

        return jsonify(response_data), 201

    except Exception as e:
        db.rollback()
        print(f"[SEND_MESSAGE] Error: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": f"Failed to send message: {str(e)}"}), 500
    finally:
        db.close()


@is_auth
def delete_message(message_id):
    """Delete a message (only by sender)"""
    user_id = request.user_id
    
    print(f"[DELETE_MESSAGE] User: {user_id}, Message: {message_id}")
    
    db = SessionLocal()

    try:
        # Convert message_id to int if needed
        try:
            msg_id = int(message_id)
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid message ID format"}), 400

        # Find message
        message = db.query(Message).filter(Message.id == msg_id).first()

        if not message:
            print(f"[DELETE_MESSAGE] Message {msg_id} not found")
            return jsonify({"error": "Message not found"}), 404

        # Verify user is the sender
        if message.sender_id != user_id:
            print(f"[DELETE_MESSAGE] Access denied - user {user_id} is not sender of message {msg_id}")
            return jsonify({"error": "You can only delete your own messages"}), 403

        db.delete(message)
        db.commit()

        print(f"[DELETE_MESSAGE] Message {msg_id} deleted successfully")
        
        return jsonify({
            "message": "Message deleted successfully",
            "deleted": True,
            "_id": str(msg_id)
        }), 200

    except Exception as e:
        db.rollback()
        print(f"[DELETE_MESSAGE] Error: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": f"Failed to delete message: {str(e)}"}), 500
    finally:
        db.close()


@is_auth
def create_conversation():
    """Create a new conversation"""
    user_id = request.user_id
    body = request.get_json()
    
    if not body:
        return jsonify({"error": "Request body is required"}), 400
    
    participant_ids = body.get("participantIds", [])
    is_group = body.get("isGroup", False)
    title = body.get("title")
    
    print(f"[CREATE_CONVERSATION] Creator: {user_id}, Participants: {participant_ids}")
    
    db = SessionLocal()

    try:
        # Validate participants
        if not participant_ids:
            return jsonify({"error": "At least one participant is required"}), 400
        
        # Check if participants exist
        participants = db.query(User).filter(User.id.in_(participant_ids)).all()
        
        if len(participants) != len(participant_ids):
            return jsonify({"error": "Some participants not found"}), 404
        
        # For non-group chats, check if conversation already exists
        if not is_group and len(participant_ids) == 1:
            existing = (
                db.query(Conversation)
                .join(conversation_participants, Conversation.id == conversation_participants.c.conversation_id)
                .filter(
                    Conversation.is_group == 0,
                    conversation_participants.c.user_id.in_([user_id, participant_ids[0]])
                )
                .group_by(Conversation.id)
                .having(db.func.count(conversation_participants.c.user_id) == 2)
                .first()
            )
            
            if existing:
                print(f"[CREATE_CONVERSATION] Returning existing conversation: {existing.id}")
                return jsonify({
                    "_id": str(existing.id),
                    "message": "Conversation already exists"
                }), 200

        # Create conversation
        conversation = Conversation(
            created_by=user_id,
            is_group=1 if is_group else 0,
            title=title,
        )
        
        db.add(conversation)
        db.flush()
        
        # Add creator and participants
        all_participant_ids = list(set([user_id] + participant_ids))
        
        for pid in all_participant_ids:
            db.execute(
                conversation_participants.insert().values(
                    conversation_id=conversation.id,
                    user_id=pid
                )
            )
        
        db.commit()
        db.refresh(conversation)
        
        print(f"[CREATE_CONVERSATION] Created conversation {conversation.id}")
        
        return jsonify({
            "_id": str(conversation.id),
            "message": "Conversation created successfully"
        }), 201

    except Exception as e:
        db.rollback()
        print(f"[CREATE_CONVERSATION] Error: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": f"Failed to create conversation: {str(e)}"}), 500
    finally:
        db.close()