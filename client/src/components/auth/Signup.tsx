import React, { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
// import { signUp } from '../../redux/services/authService';
import {signUp} from '../../api/common';
import {RootState,AppDispatch} from '../../redux/store'
import { clearMessages } from '../../redux/slices/authSlice'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignUpFormData } from '../../utils/validations/AuthValidation'
import { handleApiError } from '../../utils/errors/errorHandler';
 


const SignupPage: React.FC = () => {
  const location = useLocation();
  const role = location.state.role;

  //*zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  

  
  const [serverError, setServerError] = useState<string | null>(null);
  // const [otpSent, setOtpSent] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading,error,successMessage } = useSelector((state: RootState) => state.auth);


  useEffect(() => {
    dispatch(clearMessages());
    localStorage.clear()
  }, [dispatch])

  const handleSignup = async (data: SignUpFormData) => {
    try {
        setServerError(null);
        // setOtpSent(false)
        localStorage.setItem('otpEmail',data.email)

      const { confirmPassword:_, ...userData } = data;

      const signupData = {
        ...userData,
        role: role,
      };

      // const result = await dispatch(signUp(signupData)).unwrap();

      const result = await signUp((signupData))
      if (result.success) {
        localStorage.setItem('otpTimer', result.expiresIn.toString());
        setTimeout(() => {
          navigate('/verify-otp', { state: { email: result.email, role:result.role, otpTimer:result.expiresIn } });
        }, 1000);
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setServerError(errorMessage);
      // setServerError((err as Error).message);
      // console.error('Signup failed:', err);
    }
  };
 

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your Tekoffo account
        </h2>
        {/* <p className="mt-2 text-center text-sm text-gray-600">
          Find your next freelance opportunity
        </p> */}
        <p className="mt-2 text-center text-sm text-gray-600">
          {role === 'client' 
            ? 'Post projects and hire talented freelancers'
            : role === 'freelancer'
            ? 'Find work and showcase your skills'
            : 'Find your next freelance opportunity'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(handleSignup)} className="space-y-6">
            {/* userName Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  type="text"
                  placeholder="username"
                  autoComplete="username"
                  {...register("username", { required: true })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  autoComplete="email"
                  {...register("email", { required: true })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  autoComplete="password"
                  {...register("password", { required: true, minLength: 6 })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="confirmPassword"
                  {...register("confirmPassword", { required: true })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Server Error Display */}
            {/* {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {serverError && <p className="text-red-500 text-sm text-center">{serverError}</p>}
            {otpSent && <p className="text-green-500 text-sm text-center">{serverMessage}</p>} */}

            {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {serverError && <p style={{ color: 'red' }}>{serverError}</p>} {/* Display error */}

            {/* Submit Button */}
            <div>
              <input
                type="submit"
                value={loading ? 'Signing up...' : 'Sign up'}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FcGoogle className="h-5 w-5 mr-2" />
                Sign up with Google
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
