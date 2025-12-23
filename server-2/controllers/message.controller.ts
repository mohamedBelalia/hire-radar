import { Response } from "express";
import { IsAuthenticatedRequest } from "../isAuth.middleware";
import Message from "../models/message.model";
import Conversation from "../models/conversation.model";

export const getMessages = async (request: IsAuthenticatedRequest, response: Response) => {
    try {
        // const userId: string = request.user.id
        const { conversationId }  = request.params

        const messages = await Message.find({ conversation: conversationId })
                                        .sort({ createdAt: 1 })
                                        .populate("sender", "-password");

        response.json({ messages });
    } catch {
        response.status(500).json(
            { message: "Failed to get messages" },
        );
    }
};

export const sendMessage = async (request: IsAuthenticatedRequest, response: Response) => {
    try {
        const userId: string = request.user.id;
        const { conversationId }  = request.body;
    
        const { text } = await request.body;
    
        const newMessage = await new Message({
            sender: userId,
            conversation: conversationId,
            text,
        }).save();
    
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: text,
            updatedAt: new Date(),
        });
    
        response.json({
            message: "Message sent",
            newMessage,
        });
    } catch {
        response.status(500).json(
            { message: "Failed to send message" },
        );
    }
};


export const deleteMessage = async (request: IsAuthenticatedRequest, response: Response) =>{
    try{
        const userId: string = request.user.id;

        const { messageId } = request.params; 
        const deleted = await Message.findOneAndDelete({
            _id: messageId,
            sender: userId,
        });
      
        if (!deleted) {
            response.status(404).json(
                { message: "Message not found or you're not authorized" },
            );
        }
      
        response.json({ 
            message: "Message deleted successfully!" 
        });
    }catch{
        response.status(500).json({
            message: 'Failed to delete message'
        })
    }
}