import React, { useEffect, useState } from 'react';
import {Briefcase,Menu,X,LogOut,User,Settings,Bell,} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../redux/services/authService';
import { AppDispatch, RootState } from '../../../redux/store';
import { handleApiError } from '../../../utils/errors/errorHandler';
import { fetchNotifications, fetchUnreadChatCount } from '../../../api';
import NotificationDropdown from './NotificationDropdown';
import type { JSX } from 'react';
import { INotification } from '../../../types/notificationTypes';
import socket from '../../../utils/socket';

interface NavItem {
  icon: JSX.Element;
  label: string;
  id: string;
  path?: string;
}

interface NavbarProps {
  navItems: NavItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}


const ClientNavbar: React.FC<NavbarProps> = ({ navItems, activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  

  const userId = useSelector((state: RootState) => state.auth.user?._id || null);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };
  loadNotifications();
}, []);

    useEffect(() => {
      socket.on('notification', (notification) => {
        console.log('🔔 New live notification:', notification);
        setNotifications((prev) => [notification, ...prev]);
      });

      return () => {
        socket.off('notification');
      };
    }, []);


  useEffect(() => {
    const loadUnreadCount = async () =>{
      try {
        const count = await fetchUnreadChatCount()
        setUnreadCount(count)

      } catch (error) {
        handleApiError(error)
      }
    }
    loadUnreadCount()
  },[])

  const handleLogout = async () => {
    try {
      if (userId) {
        const result = await dispatch(logout(userId)).unwrap();
        console.log("Logout successful:", result);
        navigate("/signin");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const defaultProfilePicture =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100';

  return (
    <nav className="bg-[#0A142F] text-white fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center -ml-8">
            <a href="/" className="flex items-center">
              <Briefcase className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold">Tekoffo</span>
            </a>
            <div className="hidden md:flex items-center ml-10 space-x-4">
              {navItems.map((item) => {
                const isMessagesTab = item.id === 'messages';
                return item.path ? (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`relative flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-white/20 text-white'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>

                    {isMessagesTab && unreadCount > 0 && (
                      <span className="absolute top-0 right-0 mt-0.5 ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-white/20 text-white'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>

                    {isMessagesTab && unreadCount > 0 && (
                      <span className="absolute top-0 right-0 mt-0.5 ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="relative">
            <button
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="text-gray-300 hover:text-white relative"
            >
              <Bell className="w-6 h-6" />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </button>

            {/* <NotificationDropdown isOpen={isNotifOpen} notifications={notifications} /> */}
            <NotificationDropdown
                isOpen={isNotifOpen}
                notifications={notifications}
                setNotifications={setNotifications}
                onClose={() => setIsNotifOpen(false)}
                // onMarkAllAsRead={() => {
                //   const updated = notifications.map(n => ({ ...n, isRead: true }));
                //   setNotifications(updated);
                //   setUnreadCount(0);
                // }}
              />
          </div>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <img
                //   src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100"
                  src={user?.profilePicture || defaultProfilePicture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                />
                <span className="font-medium text-white">{user?.username}</span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                  <button
                    onClick={() => navigate('/client/profile')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default ClientNavbar;