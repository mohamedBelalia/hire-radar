'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Conversation, Message } from '@/interfaces'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Search, Send, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { Loading } from '@/components/ui/Loading'
import { _deleteMessage, _getMessages, _sendMessage, getConvs } from '@/services/message'
import { useCurrentUser } from '@/features/auth/hook'
import Image from 'next/image'
import { User } from '@/types'

export default function Inbox() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [query, setQuery] = useState('')
  const [loadConvs, setLoadConvs] = useState(true)
  const [loadMsgs, setLoadMsgs] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data } = useCurrentUser()
  const currentUser = data as User | undefined

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  /* ---------------- FETCH CONVERSATIONS ---------------- */

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoadConvs(true)
        const res = await getConvs()
        console.log('API Response:', res)
        
        // Handle different response formats
        let conversationsData = []
        
        if (Array.isArray(res)) {
          // Direct array response
          conversationsData = res
        } else if (res?.data?.conversations) {
          // Nested in data.conversations
          conversationsData = res.data.conversations
        } else if (res?.conversations) {
          // Nested in conversations
          conversationsData = res.conversations
        } else if (res?.data && Array.isArray(res.data)) {
          // Nested in data as array
          conversationsData = res.data
        }
        
        // Normalize the data to ensure _id exists
        conversationsData = conversationsData.map(conv => ({
          ...conv,
          _id: conv._id || conv.id, // Use _id if exists, otherwise use id
          participants: conv.participants?.map(p => ({
            ...p,
            _id: p._id || p.id
          })) || []
        }))
        
        
        setConversations(conversationsData)
        console.log(conversationsData);
        
        setFilteredConversations(conversationsData)
        setSelectedConversation(conversationsData[0] ?? null)
        
      } catch (error) {
        console.error('Error loading conversations:', error)
        toast.error(`Failed to load conversations: ${error instanceof Error ? error.message : 'Unknown error'}`)
      } finally {
        setLoadConvs(false)
      }
    }

    if (currentUser?.id) {
      fetchConversations()
    }
  }, [currentUser?.id])

  /* ---------------- FETCH MESSAGES ---------------- */

  useEffect(() => {
    if (!selectedConversation) return

    const fetchMessages = async () => {
      try {
        setLoadMsgs(true)
        const res = await _getMessages(selectedConversation._id)
        console.log(res);
        
        console.log('Messages response:', res)
        
        // Handle different response formats
        let messagesData = []
        
        if (Array.isArray(res)) {
          // Direct array response
          messagesData = res
        } else if (res?.data?.messages) {
          // Nested in data.messages
          messagesData = res.data.messages
        } else if (res?.messages) {
          // Nested in messages
          messagesData = res.messages
        } else if (res?.data && Array.isArray(res.data)) {
          // Nested in data as array
          messagesData = res.data
        }
        
        // Normalize the data
        messagesData = messagesData.map(msg => ({
          ...msg,
          _id: msg._id || msg.id,
          sender: {
            ...msg.sender,
            _id: msg.sender?._id || msg.sender?.id
          }
        }))
        
        console.log('Normalized messages:', messagesData)
        setMessages(messagesData)
        
      } catch (error) {
        console.error('Error loading messages:', error)
        toast.error(`Failed to load messages: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setMessages([])
      } finally {
        setLoadMsgs(false)
      }
    }

    fetchMessages()
  }, [selectedConversation])

  /* ---------------- SEND MESSAGE ---------------- */

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    const tempMessage = newMessage
    setNewMessage('')

    try {
      const res = await _sendMessage(selectedConversation._id, tempMessage)
      console.log('Send message response:', res)
      console.log('Response type:', typeof res, 'Is array:', Array.isArray(res))

      // Handle different response formats - check all possible locations
      let messageData = null
      
      // Check if response has the message directly
      if (res?._id || res?.id) {
        messageData = res
      }
      // Check if it's nested in data
      else if (res?.data) {
        messageData = res.data
      }
      // Check if the entire response IS the data (from axios)
      else if (res) {
        messageData = res
      }

      console.log('Extracted messageData:', messageData)

      if (messageData && (messageData._id || messageData.id)) {
        // Get the current user ID - handle both formats
        const currentUserId = String(currentUser?.id || currentUser?._id || '')
        
        // Normalize the message data
        const normalizedMessage = {
          _id: String(messageData._id || messageData.id),
          text: messageData.text || messageData.content || tempMessage,
          sender: {
            _id: String(messageData.sender?._id || messageData.sender?.id || currentUserId),
            name: messageData.sender?.name || currentUser?.name || currentUser?.full_name || 'You'
          },
          createdAt: messageData.createdAt || new Date().toISOString()
        }

        console.log('Normalized new message:', normalizedMessage)
        console.log('Current messages count:', messages.length)
        
        // Add to messages
        setMessages(prev => {
          const updated = [...prev, normalizedMessage]
          console.log('Updated messages count:', updated.length)
          return updated
        })

        // Update conversation list
        setConversations(prev => {
          const updated = prev.map(c => {
            if (c._id === selectedConversation._id || String(c._id) === String(selectedConversation._id)) {
              return {
                ...c,
                lastMessage: normalizedMessage.text,
                updatedAt: normalizedMessage.createdAt,
              }
            }
            return c
          })
          
          // Sort by updatedAt
          return updated.sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
        })

        // Force scroll after state update
        setTimeout(scrollToBottom, 100)
        
        toast.success('Message sent')
      } else {
        console.error('Invalid message response - no ID found:', res)
        console.error('MessageData:', messageData)
        
        // Still try to add the message with a temporary ID
        const tempId = `temp-${Date.now()}`
        const tempMessageObj = {
          _id: tempId,
          text: tempMessage,
          sender: {
            _id: String(currentUser?.id || currentUser?._id || ''),
            name: currentUser?.name || currentUser?.full_name || 'You'
          },
          createdAt: new Date().toISOString()
        }
        
        setMessages(prev => [...prev, tempMessageObj])
        setTimeout(scrollToBottom, 100)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setNewMessage(tempMessage)
    }
  }

  /* ---------------- DELETE MESSAGE ---------------- */

  const deleteMessage = async (id: string) => {
    if (!id) {
      toast.error('Invalid message ID')
      return
    }
    
    console.log('Attempting to delete message:', id)

    // Optimistically remove from UI
    const originalMessages = [...messages]
    setMessages(prev => prev.filter(m => m._id !== id))

    try {
      const res = await _deleteMessage(id)
    } catch (error) {
      console.error('Error deleting message:', error)
      // Restore messages on error
      setMessages(originalMessages)
      toast.error(`Failed to delete message: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /* ---------------- SEARCH ---------------- */

  useEffect(() => {
    if (!query.trim()) {
      setFilteredConversations(conversations)
      return
    }

    const q = query.toLowerCase()

    setFilteredConversations(
      conversations.filter(conv =>
        conv.participants.some(
          p =>
            p._id !== currentUser?.id &&
            p.name?.toLowerCase().includes(q)
        )
      )
    )
  }, [query, conversations, currentUser?.id])

  useEffect(scrollToBottom, [messages])

  if (!currentUser) return <Loading />

  /* ---------------- UI ---------------- */

  return (
    <div className="flex h-[90vh]">
      {/* LEFT - Conversations List */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadConvs ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading conversations...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {query ? 'No conversations found' : 'No conversations yet'}
            </div>
          ) : (
            filteredConversations.map(conv => {
              const other = conv.participants.find(p => p._id !== currentUser.id)

              return (
                <div
                  key={conv._id}
                  onClick={() => setSelectedConversation(conv)}
                  className={cn(
                    'flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b',
                    selectedConversation?._id === conv._id && 'bg-muted'
                  )}
                >
                  <Avatar className="w-10 h-10">
                    <Image
                      src={other?.profilePictureUrl || '/icons/default-image.png'}
                      alt={other?.name || 'User'}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{other?.name || 'Unknown User'}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                  </div>

                  {conv.updatedAt && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* RIGHT - Messages */}
      <div className="w-2/3 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                {(() => {
                  const other = selectedConversation.participants.find(
                    p => p._id !== currentUser.id
                  )
                  return (
                    <>
                      <Avatar className="w-10 h-10">
                        <Image
                          src={other?.profilePictureUrl || '/icons/default-image.png'}
                          alt={other?.name || 'User'}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      </Avatar>
                      <div>
                        <p className="font-medium">{other?.name || 'Unknown User'}</p>
                        <p className="text-xs text-muted-foreground">{other?.headline || 'headline'}</p>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadMsgs ? (
                <div className="text-center text-muted-foreground">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map(msg => {
                  // Normalize IDs for comparison
                  const senderId = msg.sender?._id || msg.sender?.id
                  const currentUserId = currentUser?.id || currentUser?._id
                  const isMine = senderId === currentUserId || String(senderId) === String(currentUserId)

                  console.log('Message check:', { 
                    senderId, 
                    currentUserId, 
                    isMine,
                    msgText: msg.text?.substring(0, 30) 
                  })

                  return (
                    <div
                      key={msg._id}
                      className={cn(
                        'flex',
                        isMine ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[70%] p-3 rounded-lg relative group',
                          isMine 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-muted rounded-bl-none'
                        )}
                      >
                        {isMine && (
                          <button
                            onClick={() => deleteMessage(msg._id)}
                            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            title="Delete message"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                        <p className="break-words">{msg.text}</p>
                        <span
                          className={cn(
                            'text-xs block mt-1',
                            isMine ? 'text-blue-100' : 'text-muted-foreground'
                          )}
                        >
                          {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!newMessage.trim()}
                  className="px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  )
}