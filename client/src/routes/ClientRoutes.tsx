

import { Route,   } from "react-router-dom";
import ClientDashboard from "../components/client/ClientDashboard";
import ProtectedRoute from "./ProtectedRoute";
import CreateProfile from "../components/client/CreateProfile";
import DisplayProfile from "../components/client/Profile";
import ChangePassword from "../components/client/ChangePassword";
import PostJob from "../components/client/PostJob";
import MyJobPosts from "../components/client/MyJobs";
import Freelancers from "../components/client/AvailableFreelancers";

 
const ClientRoutes = () => (
  <>
     
    <Route
      path="/client-dashboard"
      element={
        <ProtectedRoute allowedRoles={["client"]}>
          <ClientDashboard />
        </ProtectedRoute>
      }
    />

    <Route 
      path="/client/createprofile" 
      element={
        <ProtectedRoute allowedRoles={["client"]}>
          <CreateProfile />
       </ProtectedRoute>
    } 
    />

    <Route 
      path="/client/profile" 
      element={
        <ProtectedRoute allowedRoles={["client"]}>
          <DisplayProfile />
        </ProtectedRoute>
    } 
    />



    <Route 
      path="/client/change-password"
      element={
        <ProtectedRoute allowedRoles={["client"]}>
          <ChangePassword />
        </ProtectedRoute>
     } 
     />

    <Route 
      path="/client/post-job" 
      element={
        <ProtectedRoute allowedRoles={["client"]}>
          <PostJob />
        </ProtectedRoute>
    } 
    />

    <Route 
      path="/client/myjobs" 
      element={
        <ProtectedRoute allowedRoles={["client"]}>
          <MyJobPosts />
        </ProtectedRoute>
    } 
    />

    <Route 
      path="/client/freelancers"
      element={
        <ProtectedRoute allowedRoles={["client"]}>
          <Freelancers />
        </ProtectedRoute>
     } />
     
  </>
);

export default ClientRoutes;
