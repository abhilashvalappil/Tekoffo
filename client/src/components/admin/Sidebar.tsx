// // Sidebar.tsx
// import React from 'react';
// import {
//   Users,
//   Tag,
//   Briefcase,
//   MessageSquare,
//   Settings,
//   BarChart3,
//   Menu,
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// interface NavItem {
//   id: string;
//   label: string;
//   icon: React.ComponentType<{ className?: string }>;
  
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

//     const navigate = useNavigate();

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
//                 navigate(item.path);
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

//****************************** */

import React, { useEffect } from 'react';
import {
  Users,
  Tag,
  Briefcase,
  MessageSquare,
  Settings,
  BarChart3,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string; // Make path optional if not all items have a route
}

interface SidebarProps {
  selectedItem: string;
  setSelectedItem: (id: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const navItems: NavItem[] = [
  { id: 'users', label: 'Users', icon: Users, path: '/admin/dashboard' },
  { id: 'category-management', label: 'Category Management', icon: Tag, path: '/admin/category' },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({
  selectedItem,
  setSelectedItem,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  // Sync selectedItem with the current route
  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = navItems.find((item) => item.path === currentPath);
    if (activeItem) {
      setSelectedItem(activeItem.id);
    }
  }, [location.pathname, setSelectedItem]);

  return (
    <aside
      className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-[#0A1529] shadow-lg`}
    >
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0066FF] rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Tekoffo</h1>
        </div>
        <p className="text-sm text-gray-400 mt-1">Admin Dashboard</p>
      </div>
      <nav className="mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedItem(item.id);
                setIsMobileMenuOpen(false);
                if (item.path) {
                  navigate(item.path);
                }
              }}
              className={`w-full flex items-center px-6 py-3 transition-colors ${
                selectedItem === item.id
                  ? 'text-white bg-[#0066FF] border-r-4 border-white'
                  : 'text-gray-300 hover:bg-[#1A2942] hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;