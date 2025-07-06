 
import React, { useState, useEffect, useRef } from 'react';
import { deleteMessageApi, fetchChatContacts, fetchChatMessages, markMessagesAsRead, sendMessage } from '../../../api';
import { handleApiError } from '../../../utils/errors/errorHandler';
import { Contact, SocketMessage } from '../../../types/messageTypes';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import socket from '../../../utils/socket';
import VideoCall from '../video/VideoCall';
import Navbar from '../shared/Navbar';
import ClientSidebar from '../../client/shared/Sidebar';
import FreelancerSidebar from '../shared/FreelancerSidebar';

const ChatBox: React.FC = () => {
  const [chats, setChats] = useState<Contact[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [someoneTyping, setSomeoneTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<{[key: string]: boolean}>({});
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showCallPage, setShowCallPage] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  // const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   


  const selectedChat = chats.find((chat) => chat._id === selectedChatId);
  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);
  const currentUser = useSelector((state: RootState) => state.auth.user)
  

  // Initialize socket connection and user join
  useEffect(() => {
    if (currentUserId) {
      socket.connect();
      
      const handleConnect = () => {
        console.log('Socket connected, joining as user:', currentUserId);
        socket.emit('user:join', currentUserId);

        socket.emit('get:online-users');
      };

      if (socket.connected) {
        handleConnect();
      } else {
        socket.on('connect', handleConnect);
      }
    }

    return () => {
      if (currentUserId) {
        socket.off('connect');
        socket.disconnect();
      }
    };
  }, [currentUserId]);

  // Listen for user status updates
  useEffect(() => {
    const handleUserStatusUpdate = ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
      console.log(`User ${userId} is now ${isOnline ? 'online' : 'offline'}`);
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: isOnline,
      }));
    };

    const handleOnlineUsersList = (users: string[]) => {
      console.log('Received online users list:', users);
      const onlineUsersObj: {[key: string]: boolean} = {};
      users.forEach(userId => {
        onlineUsersObj[userId] = true;
      });
      setOnlineUsers(onlineUsersObj);
    };

    socket.on('update-user-status', handleUserStatusUpdate);
    socket.on('online-users-list', handleOnlineUsersList);

    return () => {
      socket.off('update-user-status', handleUserStatusUpdate);
      socket.off('online-users-list', handleOnlineUsersList);
    };
  }, []);

  // Listen for typing events
  useEffect(() => {
    const handleTyping = ({ senderId }: { senderId: string }) => {
      if (senderId !== currentUserId) setSomeoneTyping(true);
    };

    const handleStopTyping = ({ senderId }: { senderId: string }) => {
      if (senderId !== currentUserId) setSomeoneTyping(false);
    };

    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [currentUserId]);

  //* Fetch chat contacts
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const fetchChats = await fetchChatContacts();
        setChats(fetchChats);
      } catch (error) {
        handleApiError(error);
      }
    };
    loadContacts();
  }, []);

  //* Fetch messages for selected contact and mark as read
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChatId) return;

      try {
        const messages = await fetchChatMessages(selectedChatId);
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChatId
              ? { ...chat, messages, unreadCount: 0 }
              : chat
          )
        );

        socket.emit('join_room', selectedChatId);
        console.log('Joined room:', selectedChatId);

        await markMessagesAsRead(selectedChatId);
      } catch (error) {
        handleApiError(error);
      }
    };

    loadMessages();
  }, [selectedChatId]);

  //* Handle receiving messages in real-time
  useEffect(() => {
    if (!currentUserId) return;

    const handleReceiveMessage = (message: SocketMessage) => {
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat._id === message.chatId) {
            if (message.chatId === selectedChatId) {
              return { 
                ...chat, 
                messages: [...(chat.messages ?? []), message],
                unreadCount: 0
              };
            } else {
              return {
                ...chat,
                lastMessage: {
                  content: message.content,
                  senderId: message.senderId,
                  timestamp: new Date(message.timestamp),
                  isRead: false,
                },
                unreadCount: (chat.unreadCount || 0) + 1,
              };
            }
          }
          return chat;
        })
      );

      if (message.chatId === selectedChatId) {
        markMessagesAsRead(message.chatId).catch(handleApiError);
      }
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [selectedChatId, currentUserId]);

  // Handle new message notifications (for chats not currently open)
  useEffect(() => {
    const handleNewMessage = (message: SocketMessage) => {
      if (message.chatId !== selectedChatId) {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === message.chatId
              ? {
                  ...chat,
                  lastMessage: {
                    content: message.content,
                    senderId: message.senderId,
                    timestamp: new Date(message.timestamp),
                    isRead: false,
                  },
                  unreadCount: (chat.unreadCount || 0) + 1,
                }
              : chat
          )
        );
      }
    };

    socket.on("new-message", handleNewMessage);
    
    return () => {
      socket.off("new-message");
    };
  }, [selectedChatId]);

  const handleSend = async () => {
    if ((!newMessage.trim() && !media) || !selectedChatId || !selectedChat?.contact._id) return;
    try {
      const formData = new FormData();
    formData.append('chatId', selectedChatId);
    formData.append('receiverId', selectedChat.contact._id);

    if (newMessage.trim()) formData.append('content', newMessage.trim());
    if (media) formData.append('media', media);

      const message = await sendMessage(formData);

      const newMsg = {
      _id: message._id,
      chatId: selectedChatId,
      senderId: currentUserId,
      receiverId: selectedChat?.contact._id || '',
      content: message.content,
      mediaUrl: message.mediaUrl,
      timestamp: new Date().toISOString()
    };

      socket.emit('send_message', {
        chatId: selectedChatId,
        content: message.content,
        mediaUrl: message.mediaUrl,
        receiverId: selectedChat?.contact._id,
        senderId: currentUserId,
        _id: message._id
      });

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat._id === selectedChatId) {
            return {
              ...chat,
              messages: [...(chat.messages ?? []), newMsg]
            } as Contact;
          }
          return chat;
        })
      );

      setNewMessage('');
      // setSelectedMedia(null);
      setMedia(null)
    setMediaPreview(null);
      setIsTyping(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleChatSelection = async (chatId: string) => {
    setSelectedChatId(chatId);
    
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    );

    try {
      await markMessagesAsRead(chatId);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { roomId: selectedChatId, senderId: currentUserId });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("stop_typing", { roomId: selectedChatId, senderId: currentUserId });
    }, 1200);
  };
  
 
  useEffect(() => {
  const handleMessageDeleted = ({ messageId, chatId, content,mediaUrl }: { 
    messageId: string; 
    chatId: string; 
    content?: string
    mediaUrl?: string; 
  }) => {
    console.log('Message deleted received:', { messageId, chatId, content });
    
   setChats((prevChats) =>
    prevChats.map((chat) => {
      if (chat._id === chatId) {
        return {
          ...chat,
          messages: chat.messages?.map((msg) =>
            msg._id === messageId
              ? {
                  ...msg,
                  content: content !== undefined ? content : msg.content,
                  mediaUrl: mediaUrl !== undefined ? mediaUrl : msg.mediaUrl,
                  isDeleted: true
                }
              : msg
          ),
        };
      }
      return chat;
    })
  );
};

  socket.on('message_deleted', handleMessageDeleted);

  return () => {
    socket.off('message_deleted', handleMessageDeleted);
  };
}, [selectedChatId]); 

useEffect(() => {
  // Listen for incoming calls and automatically open the modal
  const handleIncomingCall = () => {
    console.log('Incoming call received - opening modal');
    setShowCallPage(true);
  };

  socket.on('incoming_call', handleIncomingCall);

  return () => {
    socket.off('incoming_call', handleIncomingCall);
  };
}, []);

  const handleDeleteMessage = async (messageId: string) => {
    try {
      // Example: call API to delete message from backend
      const message = await deleteMessageApi(messageId);
      socket.emit('delete_message',{
        messageId,
        chatId:selectedChatId,
        content:message.content,
        mediaUrl: message.mediaUrl
      })
      console.log('deleted messageeeeee',message)

      
      setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat._id === selectedChatId) {
              return {
                ...chat,
                messages: chat.messages?.map((msg) =>
                  msg._id === messageId
                    ? { ...msg, content: message.content, isDeleted: true }
                    : msg
                ),
              };
            }
            return chat;
          })
        );

      setSelectedMessageId(null); // hide delete option
    } catch (error) {
      handleApiError(error);
    }
};

const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    setMedia(file);
    setMediaPreview(URL.createObjectURL(file));
  }
};

const handleRemoveMedia = () => {
    // setSelectedMedia(null);
    setMediaPreview(null);
  };
    

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

return (
  <div className="min-h-screen bg-white flex flex-col">
    <div className="flex flex-1">
      {/* Sidebar */}
      <>
  {/* Mobile Sidebar (drawer) */}
  <div
    className={`fixed top-0 left-0 z-50 h-full w-60 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } md:hidden`}
  >
    <button
      onClick={() => setIsSidebarOpen(false)}
      className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
    >
      ✕
    </button>
    {currentUser.role === 'client' ? <ClientSidebar /> : <FreelancerSidebar />}
  </div>

  {/* Desktop Sidebar */}
    <div className="hidden md:block fixed top-0 left-0 w-60 h-full bg-white border-r border-gray-200 z-40">
      {currentUser.role === 'client' ? <ClientSidebar /> : <FreelancerSidebar />}
    </div>
  </>
      <Navbar onSidebarToggle={() => setIsSidebarOpen(true)} />
      {/* <div className="flex-1 flex flex-col mt-18 ml-60 md:flex-row h-[calc(100vh-64px)]"> */}
      <div className="flex-1 flex flex-col mt-18 md:ml-60 md:flex-row h-[calc(100vh-64px)]">

        {/* Contacts */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Messages</h2>
          <div className="space-y-3">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => handleChatSelection(chat._id)}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition hover:bg-gray-100 ${
                  selectedChatId === chat._id ? 'bg-gray-100' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={chat.contact.profilePicture}
                      alt={chat.contact.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                        onlineUsers[chat.contact._id]
                          ? 'bg-green-500'
                          : 'bg-gray-400'
                      }`}
                    ></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{chat.contact.fullName}</p>
                    <p className="text-xs text-gray-500">{chat.contact.companyName}</p>
                  </div>
                </div>
                {chat.unreadCount > 0 && (
                  <div className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          {selectedChat?.contact ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={selectedChat.contact.profilePicture}
                  alt={selectedChat.contact.fullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    onlineUsers[selectedChat.contact._id] ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                ></span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {selectedChat.contact.fullName}
                </p>
                <p className="text-xs text-gray-500">
                  {someoneTyping
                    ? 'Typing...'
                    : onlineUsers[selectedChat.contact._id]
                    ? 'Online'
                    : 'Offline'}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">Select a chat to start messaging</p>
          )}

          {selectedChat && (
            <button
              onClick={() => setShowCallPage(true)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded-full"
            >
              📞 <span className="hidden sm:inline">Video Call</span>
            </button>
          )}
        </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {selectedChat?.messages?.map((msg) => {
              const isSentByUser = msg.senderId === currentUserId;
              const isSelected = selectedMessageId === msg._id;

              return (
                <div
                  key={msg._id}
                  className={`flex ${isSentByUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    onClick={() => setSelectedMessageId(isSelected ? null : msg._id)}
                    className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg text-white select-none cursor-pointer ${
                      isSentByUser ? 'bg-blue-600' : 'bg-gray-400'
                    } ${msg.isDeleted ? 'italic opacity-60' : ''} ${isSelected ? 'ring-2 ring-red-500' : ''}`}
                  >
                    {msg.mediaUrl ? (
                      msg.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video src={msg.mediaUrl} controls className="max-w-full rounded" />
                      ) : (
                        <img src={msg.mediaUrl} alt="media" className="max-w-full rounded" />
                      )
                    ) : (
                      msg.content
                    )}
                  </div>
                  {isSelected && isSentByUser && !msg.isDeleted && (
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="ml-2 text-red-600 hover:text-red-800 text-xs font-semibold"
                    >
                      Delete
                    </button>
                  )}
                </div>
              );
            })}
            {someoneTyping && <div className="text-sm italic text-gray-500">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-300">
            {media && mediaPreview && (
              <div className="mb-3 relative w-fit">
                {media.type.startsWith('image/') ? (
                  <img src={mediaPreview} alt="Preview" className="h-32 rounded" />
                ) : (
                  <video src={mediaPreview} controls className="h-32 rounded" />
                )}
                <button
                  onClick={handleRemoveMedia}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={handleTyping}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none"
              />
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaSelect}
                className="hidden"
                id="mediaInput"
              />
              <label
                htmlFor="mediaInput"
                className="cursor-pointer bg-gray-100 p-2 rounded-full"
              >
                📎
              </label>
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Call Modal */}
    {showCallPage && selectedChatId && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {/* <div className="bg-white rounded-lg shadow-lg p-4 relative w-full max-w-2xl h-[80%] w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%]"> */}
         <div className="bg-white rounded-lg shadow-lg p-4 relative w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-w-2xl h-[80%]">
          <button
            onClick={() => setShowCallPage(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          <VideoCall
            roomId={selectedChatId}
            onCallEnd={() => setShowCallPage(false)}
          />
        </div>
      </div>
    )}
  </div>
);

};

export default ChatBox;