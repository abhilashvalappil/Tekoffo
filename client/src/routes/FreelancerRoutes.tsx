import { lazy, Suspense } from "react";
import { Route} from "react-router-dom";
import FreelancerHome from "../components/freelancer/dashboard/FreelancerDashboard";
import ProtectedRoute from "./ProtectedRoute";
import FreelancerLayout from "../components/freelancer/shared/Layout";
import Loader from "../components/common/Loader";


const FreelancerProfile = lazy(() => import("../components/freelancer/profile/Profile"));
const CreateFreelancerProfile = lazy(() => import("../components/freelancer/profile/CreateProfile"));
const Wallet = lazy(() => import("../components/freelancer/profile/Wallet"));
const AvailableJobs = lazy(() => import("../components/freelancer/dashboard/AvailableJobs"));
const FreelancerProposals = lazy(() => import("../components/freelancer/dashboard/Proposals"));
const Contracts = lazy(() => import("../components/freelancer/dashboard/Contracts"));
const CreateGig = lazy(() => import("../components/freelancer/dashboard/gig/GigForm"));
const MyGigs = lazy(() => import("../components/freelancer/dashboard/gig/Gigs"));
const JobInvitationsPage = lazy(() => import("../components/freelancer/dashboard/invitations/JobInvitations"));
const CompleteOnboarding = lazy(() => import("../components/freelancer/dashboard/CompleteOnboarding"));
const OnboardingSuccess = lazy(() => import("../components/freelancer/dashboard/OnboardingSuccess"));
const ChatBox = lazy(() => import("../components/freelancer/dashboard/Chat"));
const Reviews = lazy(() => import("../components/freelancer/dashboard/Reviews"));

 
const FreelancerRoutes = () => (
  <>
    <Route
      path="/freelancer"
      element={
        <ProtectedRoute allowedRoles={["freelancer"]}>
          <FreelancerLayout />
        </ProtectedRoute>
      }
    >
     <Route index element={<FreelancerHome />} />
     
     <Route
        path="profile"
        element={
          <Suspense fallback={<Loader />}>
            <ProtectedRoute allowedRoles={["freelancer"]}>
              <FreelancerProfile />
            </ProtectedRoute>
          </Suspense>
        }
      />

     <Route
        path="createprofile"
        element={
          <Suspense fallback={<Loader />}>
            <ProtectedRoute allowedRoles={["freelancer"]}>
              <CreateFreelancerProfile />
            </ProtectedRoute>
          </Suspense>
        }
      />

     <Route
        path="wallet"
        element={
          <Suspense fallback={<Loader />}>
            <ProtectedRoute allowedRoles={["freelancer"]}>
              <Wallet />
            </ProtectedRoute>
          </Suspense>
        }
      />

    <Route
        path="jobs"
        element={
          <Suspense fallback={<Loader />}>
            <ProtectedRoute allowedRoles={["freelancer"]}>
              <AvailableJobs />
            </ProtectedRoute>
          </Suspense>
        }
      />
    
     <Route
        path="proposals"
        element={
          <Suspense fallback={<Loader />}>
            <FreelancerProposals />
          </Suspense>
        }
      />

     <Route
        path="contracts"
        element={
          <Suspense fallback={<Loader />}>
            <Contracts />
          </Suspense>
        }
      />
 
     <Route
        path="create-gig"
        element={
          <Suspense fallback={<Loader />}>
            <CreateGig />
          </Suspense>
        }
      />

   

     <Route
        path="gigs"
        element={
          <Suspense fallback={<Loader />}>
            <MyGigs />
          </Suspense>
        }
      />

    
    <Route
        path="invitations"
        element={
          <Suspense fallback={<Loader />}>
            <JobInvitationsPage />
          </Suspense>
        }
      />

      <Route
        path="reviews"
        element={
          <Suspense fallback={<Loader />}>
            <Reviews />
          </Suspense>
        }
      />
  

    <Route 
    path="/freelancer/complete-onboarding" 
     element={
           <Suspense fallback={<Loader />}>
        <ProtectedRoute allowedRoles={["freelancer"]}>
          <CompleteOnboarding />
      </ProtectedRoute>
        </Suspense>
     } />

   
</Route>

 <Route 
    path="/onboarding/success" 
     element={
           <Suspense fallback={<Loader />}>
        <ProtectedRoute allowedRoles={["freelancer"]}>
          <OnboardingSuccess />
      </ProtectedRoute>
           </Suspense>
     } />

  <Route 
    path="/messages" 
     element={
            <Suspense fallback={<Loader />}>
              <ProtectedRoute allowedRoles={["freelancer","client"]}>
                <ChatBox />
            </ProtectedRoute>
          </Suspense>
     } />
  </>
);

export default FreelancerRoutes;
