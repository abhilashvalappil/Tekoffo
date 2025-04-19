

import { Route,   } from "react-router-dom";
import FreelancerHome from "../components/freelancer/Freelancer";
import ProtectedRoute from "./ProtectedRoute";
import CreateFreelancerProfile from "../components/freelancer/CreateProfile"; 
import FreelancerProfile from "../components/freelancer/Profile";
import AvailableJobs from "../components/freelancer/AvailableJobs";

 
const FreelancerRoutes = () => (
  <>
    <Route
      path="/freelancer-dashboard"
      element={
        <ProtectedRoute allowedRoles={["freelancer"]}>
          <FreelancerHome />
        </ProtectedRoute>
      }
    />
    <Route
      path="/freelancer/profile" 
       element={
         <ProtectedRoute allowedRoles={["freelancer"]}>
       <FreelancerProfile />
         </ProtectedRoute>
       } />

    <Route 
      path="/freelancer/createprofile" 
        element={
          <ProtectedRoute allowedRoles={["freelancer"]}>
        <CreateFreelancerProfile />
          </ProtectedRoute>
        } />

    <Route 
    path="/freelancer/jobs" 
     element={
        <ProtectedRoute allowedRoles={["freelancer"]}>
     <AvailableJobs />
      </ProtectedRoute>
     } />

  </>
);

export default FreelancerRoutes;
