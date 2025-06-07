import { Route} from "react-router-dom";
import FreelancerHome from "../components/freelancer/dashboard/FreelancerDashboard";
import ProtectedRoute from "./ProtectedRoute";
import CreateFreelancerProfile from "../components/freelancer/profile/CreateProfile"; 
import FreelancerProfile from "../components/freelancer/profile/Profile";
import AvailableJobs from "../components/freelancer/dashboard/AvailableJobs";
import CompleteOnboarding from "../components/freelancer/dashboard/CompleteOnboarding";
import OnboardingSuccess from "../components/freelancer/dashboard/OnboardingSuccess";
import FreelancerProposals from "../components/freelancer/dashboard/Proposals";
import Contracts from "../components/freelancer/dashboard/Contracts";
import CreateGig from "../components/freelancer/dashboard/gig/GigForm";
import MyGigs from "../components/freelancer/dashboard/gig/Gigs";
import JobInvitationsPage from "../components/freelancer/dashboard/invitations/JobInvitations";
import ChatBox from "../components/freelancer/dashboard/Chat";
import Wallet from "../components/freelancer/profile/Wallet";

 
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
      path="/freelancer/wallet" 
        element={
          <ProtectedRoute allowedRoles={["freelancer"]}>
        <Wallet />
          </ProtectedRoute>
        } />

    <Route 
    path="/freelancer/jobs" 
     element={
        <ProtectedRoute allowedRoles={["freelancer"]}>
     <AvailableJobs />
      </ProtectedRoute>
     } />

    <Route 
    path="/freelancer/proposals" 
     element={
        <ProtectedRoute allowedRoles={["freelancer"]}>
     <FreelancerProposals />
      </ProtectedRoute>
     } />

    <Route 
    path="/freelancer/contracts" 
     element={
        <ProtectedRoute allowedRoles={["freelancer"]}>
     <Contracts />
      </ProtectedRoute>
     } />

    <Route 
    path="/freelancer/create-gig" 
     element={
        <ProtectedRoute allowedRoles={["freelancer"]}>
     <CreateGig />
      </ProtectedRoute>
     } />

    <Route 
    path="/freelancer/gigs" 
     element={
        <ProtectedRoute allowedRoles={["freelancer"]}>
     <MyGigs />
      </ProtectedRoute>
     } />

    <Route 
    path="/freelancer/invitations" 
     element={
        <ProtectedRoute allowedRoles={["freelancer"]}>
     <JobInvitationsPage />
      </ProtectedRoute>
     } />

    <Route 
    path="/messages" 
     element={
        <ProtectedRoute allowedRoles={["freelancer","client"]}>
     <ChatBox />
      </ProtectedRoute>
     } />

    <Route 
    path="/freelancer/complete-onboarding" 
     element={
        <ProtectedRoute allowedRoles={["freelancer"]}>
     <CompleteOnboarding />
      </ProtectedRoute>
     } />

    <Route 
    path="/onboarding/success" 
     element={
        <ProtectedRoute allowedRoles={["freelancer"]}>
     <OnboardingSuccess />
      </ProtectedRoute>
     } />

  </>
);

export default FreelancerRoutes;
