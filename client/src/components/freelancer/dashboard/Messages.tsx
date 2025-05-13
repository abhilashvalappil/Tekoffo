import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, MoreVertical, ArrowLeft, Clock, Check, CheckCheck, Phone, Video, Search, Menu, X, Image, Mic } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import socket from '../../../utils/socket';
import { fetchReceiver } from '../../../api';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

// Message status types
type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

// Message interface
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  status: MessageStatus;
  attachments?: string[];
}

// Contact interface
interface Contact {
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  unread: number;
  lastMessage: string;
  messages: Message[];
}

// Sample data
const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Hey, can we discuss the project timeline?',
    sender: 'other',
    timestamp: new Date(),
    status: 'read',
  },
  {
    id: '2',
    text: 'Sure, let’s set up a call tomorrow.',
    sender: 'user',
    timestamp: new Date(),
    status: 'read',
  },
];

const initialContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    jobTitle: 'Project Manager',
    company: 'TechSolutions Inc.',
    avatar: '/api/placeholder/40/40',
    status: 'online',
    unread: 2,
    lastMessage: 'Let’s discuss the project scope and timeline...',
    messages: initialMessages,
  },
  {
    id: '2',
    name: 'Alex Rodriguez',
    jobTitle: 'CTO',
    company: 'Startup Innovations',
    avatar: '/api/placeholder/40/40',
    status: 'away',
    unread: 0,
    lastMessage: 'Thanks for your proposal. I’ll review it this weekend.',
    messages: [],
  },
];

export default function Chat() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [newMessage, setNewMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [receiver, setReceiver] = useState<any>(null);

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const roomId = [currentUser?.username, receiver?.username].sort().join('_');
  const location = useLocation();
  const { receiverId } = location.state || {};

  // Fetch receiver and join room
  useEffect(() => {
    if (receiverId) {
      const fetchReceiverData = async () => {
        try {
          const data = await fetchReceiver(receiverId);
          console.log('Receiver data:', data);
          setReceiver(data);

          const roomId = [currentUser?.username, data?.username].sort().join('_');
          console.log('Joining room on client side:', roomId, { currentUser: currentUser?.username, receiver: data?.username });
          socket.emit('join-room', roomId);

          const receiverContact: Contact = {
            id: data._id,
            name: data.fullName || data.username,
            jobTitle: data.role || 'Unknown',
            company: data.companyName || 'Unknown',
            avatar: data.profilePicture || '/api/placeholder/40/40',
            status: 'online',
            unread: 0,
            lastMessage: 'Start a conversation...',
            messages: [],
          };

          setContacts((prev) => {
            const existingContact = prev.find((contact) => contact.id === receiverContact.id);
            if (!existingContact) {
              console.log('Adding new contact:', receiverContact);
              return [...prev, receiverContact];
            }
            return prev;
          });

          setSelectedContact(receiverContact);
          setShowChat(true);
        } catch (error) {
          console.error('Error fetching receiver:', error);
        }
      };
      fetchReceiverData();
    }
  }, [receiverId, currentUser?.username]);

  // Handle socket connection and incoming messages
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected');
      if (roomId) {
        socket.emit('join-room', roomId);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('receive-message', (msg) => {
      console.log('Received message:', msg);
      const senderId = msg.user?._id;
      if (!senderId) {
        console.error('Invalid message: missing user._id', msg);
        return;
      }
      if (senderId !== currentUser._id) {
        const newMsg: Message = {
          id: Date.now().toString(),
          text: msg.text,
          sender: 'other',
          timestamp: new Date(),
          status: 'read',
        };

        setContacts((prev) => {
          const contactExists = prev.find((contact) => contact.id === senderId);
          console.log('Contacts:', prev, 'Sender ID:', senderId, 'Contact exists:', !!contactExists);
          if (!contactExists) {
            console.warn(`Contact with id ${senderId} not found`);
            return prev;
          }
          return prev.map((contact) =>
            contact.id === senderId
              ? {
                  ...contact,
                  messages: [...contact.messages, newMsg],
                  lastMessage: msg.text,
                  unread: contact.id === selectedContact?.id ? 0 : contact.unread + 1,
                }
              : contact
          );
        });
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('receive-message');
    };
  }, [selectedContact, currentUser._id, roomId]);

  // Handle window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowChat(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedContact?.messages]);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !selectedContact) return;

    const msg = { user: currentUser, text: newMessage };
    console.log('Sending message:', { roomId, message: msg });
    socket.emit('send-message', { roomId, message: msg });
    console.log('message sended')

    const newMsg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
    };

    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === selectedContact.id
          ? { ...contact, messages: [...contact.messages, newMsg], lastMessage: newMessage }
          : contact
      )
    );

    setNewMessage('');
    messageInputRef.current?.focus();

    // Simulate message status updates
    setTimeout(() => {
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === selectedContact.id
            ? {
                ...contact,
                messages: contact.messages.map((msg) =>
                  msg.id === newMsg.id ? { ...msg, status: 'sent' } : msg
                ),
              }
            : contact
        )
      );
      setTimeout(() => {
        setContacts((prev) =>
          prev.map((contact) =>
            contact.id === selectedContact.id
              ? {
                  ...contact,
                  messages: contact.messages.map((msg) =>
                    msg.id === newMsg.id ? { ...msg, status: 'delivered' } : msg
                  ),
                }
              : contact
          )
        );
        setTimeout(() => {
          setContacts((prev) =>
            prev.map((contact) =>
              contact.id === selectedContact.id
                ? {
                    ...contact,
                    messages: contact.messages.map((msg) =>
                      msg.id === newMsg.id ? { ...msg, status: 'read' } : msg
                    ),
                  }
                : contact
            )
          );
        }, 5000);
      }, 1000);
    }, 1000);
  };

  // Handle attachment selection
  const handleAttachment = (type: string) => {
    console.log(`Attaching ${type}`);
    setShowAttachMenu(false);
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get message status icon
  const getStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case 'sending':
        return <Clock size={14} className="text-gray-400" />;
      case 'sent':
        return <Check size={14} className="text-gray-400" />;
      case 'delivered':
        return <CheckCheck size={14} className="text-gray-400" />;
      case 'read':
        return <CheckCheck size={14} className="text-blue-400" />;
    }
  };

  // Filter contacts
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get message background
  const getMessageBackground = (sender: 'user' | 'other') => {
    return sender === 'user'
      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
      : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200';
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex h-full">
        {/* Contact List */}
        {(!isMobile || !showChat) && (
          <div className="w-full md:w-1/2 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Messages
              </h1>
              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                <Menu size={20} />
              </button>
            </div>

            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-l-4 ${
                      selectedContact?.id === contact.id
                        ? 'border-l-blue-500 bg-blue-50 dark:bg-gray-800 dark:border-l-blue-400'
                        : 'border-l-transparent'
                    }`}
                    onClick={() => {
                      setSelectedContact(contact);
                      setShowChat(true);
                      setContacts((prev) =>
                        prev.map((c) =>
                          c.id === contact.id ? { ...c, unread: 0 } : c
                        )
                      );
                      console.log('Selected contact:', contact);
                    }}
                  >
                    <div className="relative mr-3">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                          contact.status === 'online'
                            ? 'bg-green-500'
                            : contact.status === 'away'
                            ? 'bg-yellow-500'
                            : 'bg-gray-400'
                        }`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {contact.name}
                        </h3>
                        {contact.messages.length > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                            {formatTime(contact.messages[contact.messages.length - 1].timestamp)}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-full">
                          {contact.lastMessage}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {contact.jobTitle} • {contact.company}
                        </span>
                        {contact.unread > 0 && (
                          <div className="ml-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
                            {contact.unread}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No contacts found
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Area */}
        {(!isMobile || showChat) && selectedContact && (
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-l-2xl shadow-xl overflow-hidden">
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              {isMobile && (
                <button
                  onClick={() => setShowChat(false)}
                  className="mr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <div className="relative mr-3">
                <img
                  src={selectedContact.avatar}
                  alt={selectedContact.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                    selectedContact.status === 'online'
                      ? 'bg-green-500'
                      : selectedContact.status === 'away'
                      ? 'bg-yellow-500'
                      : 'bg-gray-400'
                  }`}
                ></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 truncate">
                  {selectedContact.name}
                </h3>
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      selectedContact.status === 'online'
                        ? 'bg-green-500'
                        : selectedContact.status === 'away'
                        ? 'bg-yellow-500'
                        : 'bg-gray-400'
                    }`}
                  ></div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {selectedContact.status === 'online'
                      ? 'Online'
                      : selectedContact.status === 'away'
                      ? 'Away'
                      : 'Offline'}{' '}
                    • {selectedContact.jobTitle} at {selectedContact.company}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                  <Phone size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                  <Video size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-center">
                  <span className="px-4 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium">
                    Today
                  </span>
                </div>

                {selectedContact.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    } animate-fade-in`}
                  >
                    {message.sender === 'other' && (
                      <img
                        src={selectedContact.avatar}
                        alt={selectedContact.name}
                        className="w-8 h-8 rounded-full mr-2 mt-1 object-cover border border-gray-200 dark:border-gray-700"
                      />
                    )}
                    <div className="max-w-xs md:max-w-md lg:max-w-lg">
                      <div
                        className={`rounded-2xl px-4 py-3 ${getMessageBackground(
                          message.sender
                        )} shadow-sm ${
                          message.sender === 'user'
                            ? 'rounded-br-none'
                            : 'rounded-bl-none'
                        }`}
                      >
                        <div className="mb-1 whitespace-pre-wrap">
                          {message.text}
                        </div>

                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 rounded-lg overflow-hidden">
                            {message.attachments.map((attachment, index) => (
                              <img
                                key={index}
                                src={attachment}
                                alt="Attachment"
                                className="w-full h-auto rounded-lg"
                              />
                            ))}
                          </div>
                        )}

                        <div className="flex justify-end items-center space-x-1 mt-1">
                          <span
                            className={`text-xs ${
                              message.sender === 'user'
                                ? 'text-blue-100'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </span>
                          {message.sender === 'user' && (
                            <span>{getStatusIcon(message.status)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {message.sender === 'user' && (
                      <img
                        src="/api/placeholder/40/40"
                        alt="You"
                        className="w-8 h-8 rounded-full ml-2 mt-1 object-cover border border-gray-200 dark:border-gray-700"
                      />
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {showAttachMenu && (
              <div className="absolute bottom-24 left-4 md:left-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 border border-gray-200 dark:border-gray-700 animate-fade-in z-10">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleAttachment('image')}
                    className="flex flex-col items-center justify-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-500 dark:text-blue-300 mb-1">
                      <Image size={20} />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Image
                    </span>
                  </button>
                  <button
                    onClick={() => handleAttachment('document')}
                    className="flex flex-col items-center justify-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-500 dark:text-green-300 mb-1">
                      <Paperclip size={20} />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Document
                    </span>
                  </button>
                  <button
                    onClick={() => handleAttachment('audio')}
                    className="flex flex-col items-center justify-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-500 dark:text-purple-300 mb-1">
                      <Mic size={20} />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Audio
                    </span>
                  </button>
                </div>
              </div>
            )}

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center">
                <button
                  className="p-3 mr-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-500 dark:hover:text-blue-400"
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                >
                  <Paperclip size={20} />
                </button>
                <div className="flex-1 mx-2 relative">
                  <input
                    ref={messageInputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                    placeholder="Type a message..."
                    className="w-full py-3 px-4 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200 shadow-sm"
                  />
                  <button className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <Mic size={20} />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`p-3 rounded-full shadow-md hover:shadow-lg ${
                    newMessage.trim()
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                  }`}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}