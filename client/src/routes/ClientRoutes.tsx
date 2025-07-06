
import { lazy, Suspense } from "react";
import { Route} from "react-router-dom";
import ClientDashboard from "../components/client/dashboard/ClientDashboard";
import ProtectedRoute from "./ProtectedRoute";
import ClientLayout from "../components/client/shared/Layout";
import Loader from "../components/shared/Loader";

const DisplayProfile = lazy(() => import("../components/client/profile/Profile"));
const CreateProfile = lazy(() => import("../components/client/profile/CreateProfile"));
const PostJob = lazy(() => import("../components/client/dashboard/PostJob"));
const MyJobPosts = lazy(() => import("../components/client/dashboard/MyJobs"));
const FreelancerGigsList = lazy(() => import("../components/client/dashboard/GigPosts"));
const Proposals = lazy(() => import("../components/client/dashboard/Proposals"));
const Contracts = lazy(() => import("../components/client/dashboard/Contracts"));
const PaymentReview = lazy(() => import("../components/client/payment/PaymentReview"));
const ChatBox = lazy(() => import("../components/freelancer/dashboard/Chat"));
const PaymentSuccess = lazy(() => import("../pages/PaymentSuccess"));
 

const ClientRoutes = () => (
  <>
    <Route
    path="/client"
    element={
      <ProtectedRoute allowedRoles={["client"]}>
        <ClientLayout />
      </ProtectedRoute>
    }
  > 
     
     <Route index element={<ClientDashboard />} />

    <Route 
      path="createprofile" 
      element={
         <Suspense fallback={<Loader />}>
        <ProtectedRoute allowedRoles={["client"]}>
          <CreateProfile />
       </ProtectedRoute>
       </Suspense>
    } 
    />

    <Route 
      path="profile" 
      element={
           <Suspense fallback={<Loader />}>
        <ProtectedRoute allowedRoles={["client"]}>
          <DisplayProfile />
        </ProtectedRoute>
          </Suspense>
    } 
    />

     <Route
      path="post-job"
      element={
        <Suspense fallback={<Loader />}>
          <PostJob />
        </Suspense>
      }
    />

     <Route
      path="myjobs"
      element={
        <Suspense fallback={<Loader />}>
          <MyJobPosts />
        </Suspense>
      }
    />

     <Route
      path="freelancer-gigs"
      element={
        <Suspense fallback={<Loader />}>
          <FreelancerGigsList />
        </Suspense>
      }
    />
    <Route
      path="proposals"
      element={
        <Suspense fallback={<Loader />}>
          <Proposals />
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
      path="payment-review"
      element={
           <Suspense fallback={<Loader />}>
        <ProtectedRoute allowedRoles={["client"]}>
          <PaymentReview />
        </ProtectedRoute>
          </Suspense>
     } />

     <Route
      path="messages"
      element={
        <Suspense fallback={<Loader />}>
          <ChatBox />
        </Suspense>
      }
    />

    <Route 
      path="payment-success"
      element={
        <Suspense fallback={<Loader />}>
          <PaymentSuccess />
          </Suspense>
     } />

     </Route>
  </>
);

export default ClientRoutes;
