import { Route,   } from "react-router-dom";
import Signup from '../components/auth/Signup';
import OtpVerificationPage from '../components/auth/OtpVerification'
import RoleSelection from "../components/auth/Role";
import SignInPage from "../components/auth/Signin";
import ForgotPasswod from '../components/auth/ForgotPass'
import ForgotPasswordOtp from '../components/auth/ForgotPassOtp'
import ResetPassword from "../components/auth/ResetPassword";
import Landing from "../components/shared/Landing";
import PublicLayout from "./PublicLayout";
import NotFound from "../pages/NotFound";
import AccountBlockedPage from "../pages/AccountBlockedPage";
 


const PublicRoutes = () => (
    <>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing/>} />
        <Route path="/signup-as" element={<RoleSelection />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswod />} />
        <Route path="/forgot-password-otp" element={<ForgotPasswordOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/blocked" element={<AccountBlockedPage />} />

      </Route>
        <Route path="*" element={<NotFound />} />
    </>
  );

export default PublicRoutes;