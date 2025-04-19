import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {resetPassword} from '../../api/common'

const ForgotPasswod = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
          const result = await resetPassword((email))
          console.log("console from forgotpass.tsxxxxxxxxx",result.message)
        // const response = await API.post(commonENDPOINTS.FORGOT_PASS,{email});
        if(result.success){
          setIsSuccess(result.message)
          localStorage.setItem('otpTimer',result.expiresIn.toString());
          localStorage.setItem('forgotEmail',result.email)
            navigate('/forgot-password-otp')
        }else{
          setServerError(result.message)
        } 
    } catch (error:any) {
        setServerError(error.response?.data?.message || "Error sending OTP");
    }
    setIsSuccess(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Logo Area */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
          <p className="mt-2 text-gray-600">
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </div>

        {/* {!isSuccess ? ( */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            {serverError && (
            <div className="text-sm text-red-600 text-center mb-4">{serverError}</div>
          )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Send Reset OTP'
              )}
            </button>

            <div className="text-center">
              <a
                href="/signin"
                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to login
              </a>
            </div>
          </form>
        {/* ) : (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Check your email</h3>
            <p className="text-gray-600 mb-6">
              We have sent password reset instructions to {email}
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="text-sm text-indigo-600 hover:text-indigo-500 inline-flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to forgot password
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default ForgotPasswod;