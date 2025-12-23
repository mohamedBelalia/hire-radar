'use client'


import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { type Conversation, type Message } from '@/interfaces';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Search, Send, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Loading } from '@/components/ui/Loading';
import socket from '@/socket';
import { _deleteMessage, _getMessages, _sendMessage } from '@/services/message';
import { getConvs } from '@/services/conversation';
import { useCurrentUser } from '@/features/auth/hook';
import { getToken } from '@/lib';
import Image from 'next/image';


export default function Inbox() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [filteredConversations,setFilteredConversations] = useState<Conversation[]>([])
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [otherParticipant,setOtherParticipant] = useState<UserI>();
    const [query,setQuery] = useState<string>('')
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const conversationsToShow = query ? filteredConversations : conversations;
    const selectedConversationRef = useRef<Conversation | null>(null);
    const [loadConvs,setLoadConvs] = useState<boolean>(true);
    const [loadMssgs,setLoadMssgs] = useState<boolean>(false);
    const { data : userData } = useCurrentUser(getToken()!)

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = async () => {
      if (!newMessage.trim()) return;
      const newMsg: Message = {
        _id: String(Date.now()),
        text: newMessage,
        conversationId: selectedConversation?._id,
        sender: { _id: userData.id },
        createdAt: new Date(),
      };

      try {
        await _sendMessage(selectedConversation._id, newMessage);
        socket.emit("send_message", {
          conversationId: selectedConversation?._id,
          message: newMsg,
        });
        setConversations((prev) => {
          const updatedConversation = {
            ...selectedConversation,
            lastMessage: newMessage,
            updatedAt: new Date().toISOString(),
          };
    
          const filtered = prev.filter((c) => c._id !== selectedConversation._id);
          return [updatedConversation, ...filtered];
        });
    
      } catch {
        toast.error('Failed to send message');
      }      
      setNewMessage('');
    };

    const deleteMessage = (messageId: string) =>{
      try{
        toast.promise(_deleteMessage(messageId),{
          loading: '...Deleting message',
          success: (res) => {
            const newMessages = messages.filter((message) => message._id !== messageId);
            setMessages(newMessages)
            return res.data.message
          },
          error: (err) => err.response.data.message
        })

      }catch{
        toast.error('Operation failed',{
          description: 'Failed to delete message'
        })
      }
    }

    useEffect(() => {
      const fetchConversations = async () => {
        try {
          setLoadConvs(true)
          const response = await getConvs();
          if (response.status === 200) {
            setConversations(response.data.conversations);
            const first = response.data.conversations[0];
            setSelectedConversation(first);
          }
        } catch {
          toast.error('Operation failed', {
            description: 'Failed to load your conversations',
          });
        }finally{
          setLoadConvs(false);
        }
      };
      fetchConversations();
    }, []);

    useEffect(() => {
      const searchConv = () => {
        const lowerTerm = query.toLowerCase();
    
        return conversations.filter((conversation) => {
          const otherParticipant = conversation.participants.find(
            (p) => p._id !== userData.id
          );
          if (!otherParticipant) return false;
    
          return (
            otherParticipant.name?.toLowerCase().includes(lowerTerm) ||
            otherParticipant.username?.toLowerCase().includes(lowerTerm)
          );
        });
      };
    
      if (query !== '') {
        const results = searchConv();
        setFilteredConversations(results);
      } else {
        setFilteredConversations(conversations);
      }
    }, [query, conversations, userData.id]);
    

    useEffect(() => {
      const fetchMessages = async () => {
        if (!selectedConversation) return;
        socket.emit("join_conversation", selectedConversation?._id);

        try {
          setLoadMssgs(true);
          const response = await _getMessages(selectedConversation._id);
          
          if (response.status === 200) {
            setMessages(response.data.messages);
          }
        } catch {
          toast.error('Operation failed', {
            description: 'Failed to load your messages',
          });
        }finally{
          setLoadMssgs(false);
        }
      };
      fetchMessages();
    }, [selectedConversation]);

    useEffect(() =>{
        setOtherParticipant(selectedConversation?.participants.find((p) => p._id !== userData.id))
    },[selectedConversation,userData.id])    

    useEffect(() => {
      selectedConversationRef.current = selectedConversation;
    }, [selectedConversation]);
  
    useEffect(() => {
      
      const handler = (message: Message) => {
        if (selectedConversationRef.current?._id === message.conversationId) {
          setMessages((prev) => [...prev, message])
        }
    
        setConversations((prevConversations) => {
          const index = prevConversations.findIndex(c => c._id === message.conversationId);
          if (index === -1) return prevConversations;
    
          const updated = [...prevConversations];
          const target = updated.splice(index, 1)[0];
          target.lastMessage = message.text;
          target.updatedAt = new Date().toISOString();
    
          return [target, ...updated];
        });
      };
    
      socket.on("new_message", handler);

      return () => {
        socket.off("new_message");
      };
    }, []);

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    if(status === 'loading') return <Loading />

    return (
        <>
            <div className="flex h-[90vh] bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100">
                <div className="w-1/3 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-2xl font-bold">Messages</h2>
                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                        placeholder="Search conversations..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {conversationsToShow.map((conv) => {
                        const participant = conv.participants.find((p) => p._id !== userData.id);

                        return (
                        <div
                            key={conv._id}
                            className={cn(
                            'flex items-center p-4 gap-3 cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20',
                            selectedConversation?._id === conv._id && 'bg-blue-100/30 dark:bg-blue-800/30 border-l-4 border-blue-500'
                            )}
                            onClick={() => setSelectedConversation(conv)}
                        >
                            <Avatar className="w-12 h-12 shadow-md ring-2 ring-blue-300 dark:ring-blue-600">
                                {
                                    participant.profilePictureUrl ? 
                                        <Image
                                            src={participant.profilePictureUrl}
                                            alt="Profile"
                                            width={30}
                                            height={30}
                                            className="w-12 h-12 rounded-full object-cover transition border-2 border-white"
                                        />
                                    : <Image
                                            src={'/icons/default-image.png'}
                                            alt="Profile"
                                            width={30}
                                            height={30}
                                            className="w-12 h-12 rounded-full object-cover transition border-2 border-white"
                                        />
                                }
                            </Avatar>
                            <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold truncate">{participant?.name}</h3>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{conv.lastMessage}</div>
                            </div>
                        </div>
                        );
                    })}
                    {
                        loadConvs ?
                        <h1 className='text-xl mt-2 ml-2'>Loading your conversations...</h1>
                        :null
                    }
                    {
                        conversations.length === 0 && !loadConvs &&(
                            <h1 className='text-xl mt-2 ml-2'>Loading your conversations...</h1>
                        )
                    }
                    </div>
                </div>

                <div className="w-2/3 flex flex-col">
                    {selectedConversation && (
                    <>
                        <div className="flex items-center justify-between w-full border-b border-gray-200 dark:border-gray-800 p-4">
                        <div className='flex gap-4'>
                            <Avatar className="w-12 h-12 shadow-md ring-2 ring-blue-300 dark:ring-blue-600">
                                {
                                    otherParticipant?.profilePictureUrl ? 
                                        <img
                                            src={otherParticipant.profilePictureUrl}
                                            alt="Profile"
                                            className="w-12 h-12 rounded-full object-cover transition border-2 border-white"
                                        />
                                    : <img
                                            src={defaultImage}
                                            alt="Profile"
                                            className="w-12 h-12 rounded-full object-cover transition border-2 border-white"
                                        />
                                }
                            </Avatar>

                            <div className="flex-1">
                            <div className="font-semibold text-lg">
                                <span>
                                {otherParticipant?.name}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Last active{' '}
                                {selectedConversation?.updatedAt
                                ? formatDistanceToNow(new Date(selectedConversation.updatedAt), {
                                    addSuffix: true,
                                    })
                                : 'unknown'}
                            </div>
                            </div>
                        </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-950 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:bg-[url('https://www.transparenttextures.com/patterns/dark-cubes.png')] bg-opacity-5 custom-scrollbar">
                        {messages.map((msg) => {
                            const isOwnMessage = msg.sender._id === userData.id;

                            return (
                            <div
                                key={msg._id}
                                className={cn(
                                'flex transition-all duration-200 group',
                                !isOwnMessage ? 'justify-start' : 'justify-end'
                                )}
                            >
                                <div
                                className={cn(
                                    'relative max-w-xl p-4 rounded-2xl shadow transition-all duration-200',
                                    !isOwnMessage
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none'
                                    : 'bg-blue-600 text-white rounded-tr-none'
                                )}
                                >
                                    {isOwnMessage && (
                                        <button
                                        onClick={() => deleteMessage(msg._id)}
                                        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow cursor-pointer"
                                        title="Delete message"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}

                                    <p className="leading-relaxed break-words">{msg.text}</p>

                                    <div
                                        className={cn(
                                        'text-xs mt-2 opacity-70',
                                        !isOwnMessage ? 'text-gray-500 dark:text-gray-400' : 'text-blue-100'
                                        )}
                                    >
                                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                        {
                            loadMssgs ?
                            <h1 className='text-xl text-center mt-2'>Loading your messages...</h1>
                            :null
                        }
                        <div ref={messagesEndRef} />
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
                        <div className="flex gap-3 items-center">
                            <Input
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            className="flex-1 rounded-full bg-gray-100 dark:bg-gray-800 border-none px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
                            />
                            <Button
                            onClick={sendMessage}
                            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition disabled:opacity-50"
                            disabled={!newMessage.trim()}
                            >
                            <Send className="h-5 w-5" />
                            </Button>
                        </div>
                        </div>
                    </>
                    )}
                </div>
            </div>
        </>        
  );
}