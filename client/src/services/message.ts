import { expressServer } from "@/lib/express-server";

export const _getMessages = async (conversationId: string) =>{
    const response = await expressServer.get(`/api/message/get/${conversationId}`);
    return response;
}

export const _sendMessage  = async (conversationId: string, text: string) =>{
    const response = await expressServer.post(`/api/message/sendMessage`, {conversationId, text});
    return response;
}

export const _deleteMessage = async (messageId: string) =>{
    const response = await expressServer.delete(`/api/message/deleteMessage/${messageId}`)
    return response;
}