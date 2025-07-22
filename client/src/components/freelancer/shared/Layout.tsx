 
import { Outlet } from "react-router-dom";
import FreelancerSidebar from "./FreelancerSidebar";
import Navbar from "./Navbar";
import { useState } from "react";
import LogoutModal from "../../client/shared/LogoutModal";
import { useAuth } from "../../../hooks/customhooks/useAuth";

const FreelancerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
   const { handleLogout } = useAuth();

  return (
     <>
    <div className="flex">
      {/* Sidebar (Responsive) */}
      <div
        className={`
          fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-200 z-40 
          ${isSidebarOpen ? 'block' : 'hidden'} 
          md:block
        `}
      >
        {/* <FreelancerSidebar onLinkClick={() => setIsSidebarOpen(false)} /> */}
         <FreelancerSidebar
            onLinkClick={() => setIsSidebarOpen(false)}
            onLogoutClick={() => setShowLogoutModal(true)}  
          />
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-0">
        <Navbar onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
     {showLogoutModal && (
        <LogoutModal
          onConfirm={() => {
            setShowLogoutModal(false);
            handleLogout();
          }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
};

export default FreelancerLayout;

