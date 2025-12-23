"use client";

import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface User {
  id: number;
  full_name: string;
  image?: string;
}

interface Message {
  id: number;
  sender_id: number;
  content: string;
  created_at: string;
}

interface Conversation {
  conversation_id: number;
  participants: User[];
  last_message?: string;
  last_message_at?: string;
}

let socket: Socket;

const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize socket
  useEffect(() => {
    socket = io("http://localhost:5000", {
      withCredentials: true,
      auth: {
        token: localStorage.getItem("token"), // if you use JWT auth
      },
    });

    // Listen for conversations
    socket.emit("get_conversations");
    socket.on("conversations", (data: { conversations: Conversation[] }) => {
      setConversations(data.conversations);
    });

    // Listen for new messages
    socket.on("new_message", (msg: Message & { conversation_id: number }) => {
      if (selectedConversation?.conversation_id === msg.conversation_id) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedConversation]);

  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    socket.emit("join_conversation", { conversation_id: conversation.conversation_id });
    socket.emit("get_messages", { conversation_id: conversation.conversation_id, page: 1, limit: 50 });

    socket.on("messages", (data: { messages: Message[] }) => {
      setMessages(data.messages.reverse());
      scrollToBottom();
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    socket.emit("send_message", {
      conversation_id: selectedConversation.conversation_id,
      content: newMessage.trim(),
    });

    setNewMessage("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar - Conversations */}
      <div className="w-1/4 border-r overflow-y-auto">
        <ScrollArea className="h-full">
          {conversations.map((conv) => {
            const otherUser = conv.participants[0]; // private conversation assumption
            return (
              <Card
                key={conv.conversation_id}
                className={`m-2 p-2 cursor-pointer ${
                  selectedConversation?.conversation_id === conv.conversation_id
                    ? "border-blue-500"
                    : ""
                }`}
                onClick={() => selectConversation(conv)}
              >
                <CardHeader className="flex items-center space-x-2">
                  <Avatar>
                    {otherUser.image ? (
                      <AvatarImage src={otherUser.image} />
                    ) : (
                      <AvatarFallback>{otherUser.full_name[0]}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <CardTitle>{otherUser.full_name}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {conv.last_message?.slice(0, 50)}
                    </p>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          <ScrollArea className="h-full">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`my-2 p-2 rounded-lg max-w-xs ${
                  msg.sender_id === 1 // replace 1 with your user id from context
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p>{msg.content}</p>
                <span className="text-xs text-gray-400">
                  {format(new Date(msg.created_at), "HH:mm dd/MM/yyyy")}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>
        </div>

        {/* Input */}
        <div className="p-4 border-t flex space-x-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
