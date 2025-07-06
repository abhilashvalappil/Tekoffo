import React, { useEffect, useState } from 'react';
import {Briefcase,LogOut,User,Settings,Bell,} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../redux/services/authService';
import { AppDispatch, RootState } from '../../../redux/store';
import { fetchNotifications } from '../../../api';
import NotificationDropdown from './NotificationDropdown';
import { INotification } from '../../../types/notificationTypes';
import socket from '../../../utils/socket';

interface NavbarProps {
  onSidebarToggle: () => void;
}

const ClientNavbar: React.FC<NavbarProps> = ({ onSidebarToggle }) => {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
        setNotifications((prev) => [notification, ...prev]);
      });

      return () => {
        socket.off('notification');
      };
    }, []);

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
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16  w-full">
          <div className="flex items-center   -ml-8">
            <a href="/" className="flex items-center -ml-18">
              <Briefcase className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold">Tekoffo</span>
            </a>
            <div className="hidden md:flex items-center ml-10 space-x-4">
            </div>
          </div> */}
          <div className="px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between h-16 w-full">
                    <div className="flex items-center gap-2 min-w-0">
                    <Briefcase className="h-8 w-8 text-white flex-shrink-0" />
                    <span className="text-xl font-bold truncate">Tekoffo</span>
                  </div>

          <div className="hidden md:flex items-center space-x-6 ml-auto">
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
                  src={user?.profilePicture || defaultProfilePicture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                />
                <span className="font-medium text-white">{user?.username}</span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                  <button
                    onClick={() =>{
                      setIsProfileOpen(false);
                       navigate('/client/profile')
                    }}
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

          {/* <button
            className="md:hidden text-white  ml-4"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button> */}
           <button
            onClick={onSidebarToggle}
            className="md:hidden text-white text-xl px-3"
          >
            ☰
          </button>
        </div>
      </div>
{/* 
      {isMenuOpen && (
        <div className="md:hidden bg-[#0A142F] border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
          </div>
        </div>
      )} */}
    </nav>
  );
};

export default ClientNavbar;