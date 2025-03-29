import { Route, Routes } from "react-router-dom";
import Signup from '../components/auth/Signup';
import OtpVerificationPage from '../components/auth/OtpVerification'
import FreelancePlatformHome from "../components/dashboard/guestDashboard";
import RoleSelection from "../components/auth/Role";
import SignInPage from "../components/auth/Signin";
import ForgotPasswod from '../components/auth/ForgotPass'
import ForgotPasswordOtp from '../components/auth/ForgotPassOtp'
import ResetPassword from "../components/auth/ResetPassword";


const PublicRoutes = () => {
    return(
        <Routes>
            <Route path="/" element={<FreelancePlatformHome/>} /> 
            <Route path="/signup-as" element={<RoleSelection/>} />
            <Route path="/signin" element={<SignInPage/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/verify-otp" element={<OtpVerificationPage />} />
            <Route path="/fogot-password" element={<ForgotPasswod />} />
            <Route path="/forgot-password-otp" element={<ForgotPasswordOtp/>} />
            <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
    )
}

export default PublicRoutes;