//  import { Outlet } from "react-router-dom";
//  import FreelancerSidebar from "./FreelancerSidebar";
//  import Navbar from "./Navbar";

// const FreelancerLayout = () => {
// //   const [activeTab, setActiveTab] = useState("");

//   return (
//     <div className="flex">
//       <FreelancerSidebar />
//       <div className="flex-1">
//         <Navbar />
//         <main className="p-4">
//           <Outlet />  
//         </main>
//       </div>
//     </div>
//   );
// };

// export default FreelancerLayout;

import { Outlet } from "react-router-dom";
import FreelancerSidebar from "./FreelancerSidebar";
import Navbar from "./Navbar";
import { useState } from "react";

const FreelancerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar (Responsive) */}
      <div
        className={`
          fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-200 z-40 
          ${isSidebarOpen ? 'block' : 'hidden'} 
          md:block
        `}
      >
        <FreelancerSidebar onLinkClick={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-0">
        <Navbar onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FreelancerLayout;

