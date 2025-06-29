import React, { useState } from 'react';
import { Sidebar } from '../Sidebar';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-1 bg-gray-100 ml-64">
        {/* Optional: Add a top navbar with toggle button for mobile */}
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
