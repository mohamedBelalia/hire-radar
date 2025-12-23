from flask import Blueprint
from controllers.messages_convs import (
    get_conversations,
    get_messages,
    send_message, 
    delete_message
)

mssg = Blueprint("mssg", __name__)

mssg.add_url_rule("/conversations", "get_conversations", get_conversations, methods=["GET"])
mssg.add_url_rule("/<int:conversation_id>", "get_messages", get_messages, methods=["GET"])
mssg.add_url_rule("/send", "send_message", send_message, methods=["POST"])
mssg.add_url_rule("/delete/<int:message_id>", "delete_message", delete_message, methods=["DELETE"])

