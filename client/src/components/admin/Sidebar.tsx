 

// //****************************** */

// import React, { useEffect } from 'react';
// import {
//   Users,
//   Tag,
//   Briefcase,
//   MessageSquare,
//   Settings,
//   BarChart3,
// } from 'lucide-react';
// import { useNavigate, useLocation } from 'react-router-dom';

// interface NavItem {
//   id: string;
//   label: string;
//   icon: React.ComponentType<{ className?: string }>;
//   path?: string; // Make path optional if not all items have a route
// }

// interface SidebarProps {
//   selectedItem: string;
//   setSelectedItem: (id: string) => void;
//   isMobileMenuOpen: boolean;
//   setIsMobileMenuOpen: (open: boolean) => void;
// }

// const navItems: NavItem[] = [
//   { id: 'users', label: 'Users', icon: Users, path: '/admin/dashboard' },
//   { id: 'category-management', label: 'Category Management', icon: Tag, path: '/admin/category' },
//   { id: 'jobs', label: 'Jobs', icon: Briefcase },
//   { id: 'messages', label: 'Messages', icon: MessageSquare },
//   { id: 'analytics', label: 'Analytics', icon: BarChart3 },
//   { id: 'settings', label: 'Settings', icon: Settings },
// ];

// const Sidebar: React.FC<SidebarProps> = ({
//   selectedItem,
//   setSelectedItem,
//   isMobileMenuOpen,
//   setIsMobileMenuOpen,
// }) => {
//   const navigate = useNavigate();
//   const location = useLocation(); // Get the current route

//   // Sync selectedItem with the current route
//   useEffect(() => {
//     const currentPath = location.pathname;
//     const activeItem = navItems.find((item) => item.path === currentPath);
//     if (activeItem) {
//       setSelectedItem(activeItem.id);
//     }
//   }, [location.pathname, setSelectedItem]);

//   return (
//     <aside
//       className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-[#0A1529] shadow-lg`}
//     >
//       <div className="p-6">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 bg-[#0066FF] rounded-lg flex items-center justify-center">
//             <Briefcase className="w-5 h-5 text-white" />
//           </div>
//           <h1 className="text-2xl font-bold text-white">Tekoffo</h1>
//         </div>
//         <p className="text-sm text-gray-400 mt-1">Admin Dashboard</p>
//       </div>
//       <nav className="mt-4">
//         {navItems.map((item) => {
//           const Icon = item.icon;
//           return (
//             <button
//               key={item.id}
//               onClick={() => {
//                 setSelectedItem(item.id);
//                 setIsMobileMenuOpen(false);
//                 if (item.path) {
//                   navigate(item.path);
//                 }
//               }}
//               className={`w-full flex items-center px-6 py-3 transition-colors ${
//                 selectedItem === item.id
//                   ? 'text-white bg-[#0066FF] border-r-4 border-white'
//                   : 'text-gray-300 hover:bg-[#1A2942] hover:text-white'
//               }`}
//             >
//               <Icon className="w-5 h-5 mr-3" />
//               {item.label}
//             </button>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;


import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard,  
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  FolderKanban,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../hooks/customhooks/useAuth';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  
  const navigationItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Categories', path: '/admin/category', icon: <FolderKanban size={20} /> },
    { name: 'Payments', path: '/admin/payments', icon: <CreditCard size={20} /> },
    // { name: 'Jobs', path: '/jobs', icon: <Briefcase size={20} /> },
    // { name: 'Calendar', path: '/calendar', icon: <Calendar size={20} /> },
    // { name: 'Notifications', path: '/notifications', icon: <Bell size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const user = useSelector((state: RootState) => state.auth.user);
  const { handleLogout } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/50 z-40"
          onClick={onToggle}
        />
      )}
    
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={onToggle}
        aria-label="Toggle navigation"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-slate-800 text-white z-50
          transition-transform duration-300 ease-in-out
          w-64 flex flex-col shadow-xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-xl font-bold">JobTrack Admin</h1>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center px-3 py-2.5 rounded-md text-sm font-medium
                  transition-colors duration-150 ease-in-out
                  ${isActive 
                    ? 'bg-slate-700 text-white' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
                `}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    onToggle();
                  }
                }}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3">
            <img
              src={user?.profilePicture}
              alt="Admin User"
              className="h-8 w-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.username}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          
          <button
          onClick={handleLogout}
            className="mt-4 flex items-center w-full px-3 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-700 hover:text-white"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;