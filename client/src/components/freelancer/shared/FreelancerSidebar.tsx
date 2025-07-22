import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiLogOut } from 'react-icons/fi';
import {
  MdDashboard,
  MdMessage,
  MdWorkOutline,
} from 'react-icons/md';
import {
  ClipboardList,
  CreditCard,
  FileCheck2,
  FilePlus,
  FileText,
  MailOpen,
} from 'lucide-react';
 

interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', icon: MdDashboard, path: '/freelancer' },
  { name: 'Find Jobs', icon: MdWorkOutline, path: '/freelancer/jobs' },
  { name: 'Proposals', icon: FileCheck2, path: '/freelancer/proposals' },
  { name: 'Invitations', icon: MailOpen, path: '/freelancer/invitations' },
  { name: 'Contracts', icon: FileText, path: '/freelancer/contracts' },
  { name: 'Messages', icon: MdMessage, path: '/messages' },
  { name: 'Create Gig', icon: FilePlus, path: '/freelancer/create-gig' },
  { name: 'My Gigs', icon: ClipboardList, path: '/freelancer/gigs' },
  { name: 'Wallet', icon: CreditCard, path: '/freelancer/wallet' },
];

interface FreelancerSidebarProps {
  onLinkClick?: () => void;
  onLogoutClick?: () => void;
}

const FreelancerSidebar: React.FC<FreelancerSidebarProps> = ({ onLinkClick,onLogoutClick }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
   

  const handleNavigate = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) setIsOpen(false);
     if (onLinkClick) onLinkClick();
  };

  return (
    <>
      {/* Hamburger (Mobile) */}
      <div className="md:hidden p-4 z-40 relative">
        <FiMenu
          size={30}
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-800 cursor-pointer"
        />
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] z-30 transition-transform duration-300 flex flex-col w-60 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-gray-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Scrollable Menu Section + Logout */}
        <div className="overflow-y-auto flex-1 px-4 py-6 space-y-3">
          {/* Menu Items */}
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 text-lg font-medium ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'text-gray-800 hover:bg-indigo-100 hover:shadow-md'
                }`}
                onClick={() => handleNavigate(item.path)}
              >
                <Icon size={26} />
                <span>{item.name}</span>
              </div>
            );
          })}

          {/* Logout (scrolls with menu) */}
          <div className="mt-6 pt-6 border-t border-gray-300">
            {/* <div
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 text-lg text-red-600 font-semibold rounded-lg cursor-pointer hover:bg-red-100 transition-all"
            >
              <FiLogOut size={24} />
              <span>Logout</span>
            </div> */}
            <div
            onClick={onLogoutClick}  
            className="flex items-center gap-3 p-3 text-lg text-red-600 font-semibold rounded-lg cursor-pointer hover:bg-red-100 transition-all"
          >
            <FiLogOut size={24} />
            <span>Logout</span>
          </div>
          </div>
        </div>
      </aside>

      {/* Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default FreelancerSidebar;
