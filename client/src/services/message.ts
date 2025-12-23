import apiClient from "@/lib/apiClient";
import { Conversation, Message } from "@/types";

/**
 * Get messages of a conversation
 */
export const _getMessages = async (
  conversationId: string
): Promise<Message[]> => {
  const { data } = await apiClient.get(
    `/api/mssgs/${conversationId}`
  );
  return data.messages;
};




/**
 * Get conversations of authenticated user
 */
export const getConvs = async (): Promise<Conversation[]> => {
  const { data } = await apiClient.get(`/api/mssgs/conversations`);
  return data.conversations;
};


/**
 * Send a message
 */
export const _sendMessage = async (
  conversationId: string,
  text: string
): Promise<Message> => {
  const { data } = await apiClient.post(
    `/api/mssgs/send`,
    { conversationId, text }
  );
  return data.message;
};

/**
 * Delete a message
 */
export const _deleteMessage = async (
  messageId: string
): Promise<{ success: boolean }> => {
  const { data } = await apiClient.delete(
    `/api/mssgs/delete/${messageId}`
  );
  return data;
};
