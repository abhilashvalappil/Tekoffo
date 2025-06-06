

import { Route} from "react-router-dom";
import ClientDashboard from "../components/client/dashboard/ClientDashboard";
import ProtectedRoute from "./ProtectedRoute";
import CreateProfile from "../components/client/profile/CreateProfile";
import DisplayProfile from "../components/client/profile/Profile";
import ChangePassword from "../components/client/profile/ChangePassword";
import PostJob from "../components/client/dashboard/PostJob";
import MyJobPosts from "../components/client/dashboard/MyJobs";
import Freelancers from "../components/client/dashboard/AvailableFreelancers";
import Proposals from "../components/client/dashboard/Proposals";
import PaymentReview from "../components/client/payment/PaymentReview";
import PaymentSuccess from "../pages/PaymentSuccess";
import Contracts from "../components/client/dashboard/Contracts";
import FreelancerGigsList from "../components/client/dashboard/GigPosts";
import JobTabs from "../components/shared/Sample";

 
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
        <ProtectedRoute allowedRoles={["client","freelancer"]}>
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

    <Route 
      path="/client/freelancer-gigs"
      element={
        <ProtectedRoute allowedRoles={["client"]}>
          <FreelancerGigsList />
        </ProtectedRoute>
     } />

    <Route 
      path="/client/proposals"
      element={
        <ProtectedRoute allowedRoles={["client"]}>
          <Proposals />
        </ProtectedRoute>
     } />

    <Route 
      path="/client/proposalss"
      element={
        <ProtectedRoute allowedRoles={["client"]}>
          <JobTabs />
        </ProtectedRoute>
     } />

    <Route 
      path="/client/contracts"
      element={
        <ProtectedRoute allowedRoles={["client"]}>
          <Contracts />
        </ProtectedRoute>
     } />

    <Route 
      path="/client/payment-review"
      element={
        <ProtectedRoute allowedRoles={["client"]}>
          <PaymentReview />
        </ProtectedRoute>
     } />

    <Route 
      path="/payment-success"
      element={
        // <ProtectedRoute allowedRoles={["client"]}>
          <PaymentSuccess />
        // </ProtectedRoute>
     } />
     
  </>
);

export default ClientRoutes;
