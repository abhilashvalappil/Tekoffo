
import React, { useState, useRef, useEffect } from 'react';
import {Briefcase,User,Settings,LogOut,Menu,X,Bell,MessageSquare,DollarSign,BellRing} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import socket from '../../../utils/socket';
import API from '../../../services/api';
import type { JSX } from 'react';

interface NavItem {
  icon: JSX.Element;
  label: string;
  id: string;
  path?: string;
}

interface Notification {
  id: string; // Backend _id from database
  type: 'job' | 'message' | 'payment' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  status: 'unread' | 'read';
}
interface notification {
  _id: string; // Backend _id from database
  type: 'job' | 'message' | 'payment' | 'system';
  title: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read';
}

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  user: { username?: string; profilePicture?: string } | null;
  handleLogout: () => void;
  navItems: NavItem[];
}

const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isMenuOpen,
  setIsMenuOpen,
  isProfileOpen,
  setIsProfileOpen,
  user,
  handleLogout,
  navItems,
}) => {
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await API.get('/notifications');
        const fetchedNotifications: Notification[] = response.data.map((n: notification) => ({
          id: n._id,
          type: 'payment',  
          title: ' Payment Authorized', 
          message: n.message,
          timestamp: new Date(n.createdAt),
          status: n.status,
        }));
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };
  
    fetchNotifications();
  }, []);

  useEffect(() => {
    socket.on('notification', (data: { id: string; message: string }) => {
      const newNotification: Notification = {
        id: data.id, // Use backend _id
        type: 'payment',
        title: 'Payment Authorized',
        message: data.message,
        timestamp: new Date(),
        status: 'unread',
      };
      setNotifications((prevNotifications) => [
        newNotification,
        ...prevNotifications,
      ]);
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      //* Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, status: 'read' } : notification
        )
      );
      // console.log('console from markas readiddddddddd :',id)
      await API.put(`/notifications/${id}/read`, { read: true });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, status: 'read' }))
      );
      const unreadIds = notifications
        .filter((n) => n.status === 'unread')
        .map((n) => n.id);
      if (unreadIds.length > 0) {
        await API.put('/notifications/read-all', { ids: unreadIds });
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      // Optionally revert local state or show error to user
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'job':
        return <Briefcase className="h-5 w-5 text-blue-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'payment':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      default:
        return <BellRing className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    return date.toLocaleDateString();
  };

  return (
    <nav className="bg-[#0A142F] text-white fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center -ml-8">
            <a href="/" className="flex items-center">
              <Briefcase className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold">Tekoffo</span>
            </a>
            <div className="hidden md:flex items-center ml-10 space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.path) navigate(item.path);
                  }}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="text-gray-300 hover:text-white relative focus:outline-none"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0A142F] rounded-lg shadow-lg border border-white/10 overflow-hidden z-50">
                  <div className="p-4 border-b border-white/10">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-white">Notifications</h2>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-blue-400 hover:text-blue-300"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="divide-y divide-white/10 max-h-[60vh] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center">
                        <div className="flex justify-center">
                          <Bell className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="mt-2 text-gray-400">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-4 hover:bg-white/10 cursor-pointer ${
                            notification.status === 'unread' ? 'bg-blue-500/20' : 'bg-[#0A142F]'
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0">
                              {getIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium ${
                                  notification.status === 'unread' ? 'text-white' : 'text-gray-300'
                                }`}
                              >
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <img
                  src={user?.profilePicture || 'https://via.placeholder.com/32'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                />
                <span className="font-medium text-white">{user?.username || 'User'}</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                  <button
                    onClick={() => navigate('/freelancer/profile')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </button>
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-[#0A142F] border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMenuOpen(false);
                  if (item.path) navigate(item.path);
                }}
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="flex items-center w-full px-3 py-2 text-gray-300 hover:bg-white/10 hover:text-white rounded-md text-sm font-medium relative"
            >
              <Bell className="h-5 w-5 mr-2" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {isNotificationsOpen && (
              <div className="bg-[#0A142F] rounded-lg border border-white/10 mt-2">
                <div className="p-4 border-b border-white/10">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white">Notifications</h2>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>
                <div className="divide-y divide-white/10 max-h-[40vh] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center">
                      <div className="flex justify-center">
                        <Bell className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="mt-2 text-gray-400">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`p-4 hover:bg-white/10 cursor-pointer ${
                          notification.status === 'unread' ? 'bg-blue-500/20' : 'bg-[#0A142F]'
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0">
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium ${
                                notification.status === 'unread' ? 'text-white' : 'text-gray-300'
                              }`}
                            >
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTime(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            <hr className="border-white/10 my-2" />
            <button
              onClick={() => navigate('/freelancer/profile')}
              className="flex items-center w-full px-3 py-2 text-gray-300 hover:bg-white/10 hover:text-white rounded-md text-sm font-medium"
            >
              <User className="h-5 w-5 mr-2" />
              View Profile
            </button>
            <button
              className="flex items-center w-full px-3 py-2 text-gray-300 hover:bg-white/10 hover:text-white rounded-md text-sm font-medium"
            >
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-red-400 hover:bg-white/10 hover:text-red-300 rounded-md text-sm font-medium"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;