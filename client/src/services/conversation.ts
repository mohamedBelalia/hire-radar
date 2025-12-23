import { getToken } from "@/lib";
import { expressServer } from "@/lib/express-server";
import { Conversation } from "@/types";

/**
 * Get conversations of authenticated user
 */
export const getConvs = async (): Promise<Conversation[]> => {
  const { data } = await expressServer.get(`/api/conversation/my`,{
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return data.conversations;
};

/**
 * Create or get existing conversation
 */
export const _createConversation = async (
  participantId: number | string
): Promise<Conversation> => {
  const { data } = await expressServer.post(
    `/api/conversation/create`,
    { participantId }
  );
  return data.conversation;
};

/**
 * Delete a conversation
 */
export const _deleteConversation = async (
  conversationId: string
): Promise<{ success: boolean }> => {
  const { data } = await expressServer.delete(
    `/api/conversation/${conversationId}`
  );
  return data;
};
