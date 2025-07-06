 import { Outlet } from "react-router-dom";
import ClientNavbar from "./Navbar";
import ClientSidebar from "./Sidebar";
import { useState } from "react";

const ClientLayout = () => {
const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <div
        className={`
          fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-200 z-40 
          ${isSidebarOpen ? 'block' : 'hidden'} 
          md:block
        `}
      >
        <ClientSidebar onLinkClick={() => setIsSidebarOpen(false)} />
      </div>
      <div className="flex-1 md:ml-0">
        <ClientNavbar onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4">
          <Outlet />  
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
