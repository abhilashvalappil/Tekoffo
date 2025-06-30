
import React, { useState, useEffect } from 'react';
import {Briefcase,User,Settings,LogOut,Menu,X,Bell} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import socket from '../../../utils/socket';
import type { JSX } from 'react';
import { fetchNotifications } from '../../../api';
import { INotification } from '../../../types/notificationTypes';
import NotificationDropdown from '../../client/shared/NotificationDropdown';

interface NavItem {
  icon: JSX.Element;
  label: string;
  id: string;
  path?: string;
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
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  

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

  // const unreadCount = notifications.filter(n => n.status === 'unread').length;

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

            <NotificationDropdown
                isOpen={isNotifOpen}
                notifications={notifications}
                setNotifications={setNotifications}
                onClose={() => setIsNotifOpen(false)}
              />
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