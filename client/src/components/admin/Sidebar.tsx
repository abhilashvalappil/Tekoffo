import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard,  
  Users, 
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
    // { name: 'Settings', path: '/', icon: <Settings size={20} /> },
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
          <h1 className="text-xl font-bold">Tekoffo Admin</h1>
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
              src={user?.profilePicture || undefined}
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
