import React, { useState } from 'react';
import { Briefcase, Eye, EyeOff, LogIn } from 'lucide-react';
import { useDispatch,useSelector } from 'react-redux';
import { RootState,AppDispatch } from '../../redux/store'
import { signIn } from '../../redux/services/authService';
import { signinSchema } from '../../utils/validations/AuthValidation';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import {GoogleLogin,CredentialResponse } from '@react-oauth/google';
import { handleApiError } from '../../utils/errors/errorHandler';
 

interface FormData {
  identifier: string;
  password: string;
}

interface FormErrors {
  identifier?: string;
  password?: string;
}

const SignIn = () => {

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const {loading } = useSelector((state: RootState) => state.auth);
    

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    identifier: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  console.log('conosle from singin.tsxxxxxxx',serverError)


const validateForm = (): boolean => {
    try {
        signinSchema.parse(formData);  
        setErrors({});  
        setServerError(null);
        return true;
    } catch (e) {
        if (e instanceof z.ZodError) {
            const newErrors: FormErrors = {};
            e.errors.forEach((error) => {
                newErrors[error.path[0] as keyof FormErrors] = error.message;
            });
            setErrors(newErrors);
            return false;
        }
        return false;
    }
};


  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const result = await dispatch(signIn({ identifier: formData.identifier, password: formData.password }));
        console.log('signin reponse printing : ', result)
        if (signIn.fulfilled.match(result)) {
          const userRole = result.payload.user.role;
        if (userRole === 'freelancer') {
          navigate('/freelancer-dashboard');
        } else if (userRole === 'client') {
          navigate('/client-dashboard');
        } else {
          navigate('/admin/dashboard');
        }
        }else if(signIn.rejected.match(result)){
          console.log("Rejected payload:", result.payload);

          // const errorMessage = result.payload as string;
          // setServerError(errorMessage || 'Sign in failed');
          const errorMessage =
          typeof result.payload === "string"
            ? result.payload
            : "Sign in failed";
        setServerError(errorMessage);
        }
        
      } catch (error) {
        console.log('console from signin.tsx',error)
        console.error('Sign in failed:', error);
        
      }
    }
     
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    //* Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

    //* google
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const result = await dispatch(signIn({ googleCredential: credentialResponse.credential }));
      if (signIn.fulfilled.match(result)) {
        navigate('/freelancer-dashboard');
      } else {
        setServerError(result.payload as string || 'Google Sign-In failed');
      }
    } catch (error) {
      const errormessage = handleApiError(error)
      setServerError(errormessage);
    }
  };

  const handleGoogleError = () => {
    setServerError('Google authentication failed. Please try again.');
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#3a4b82] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6">
      <div className="flex items-center justify-center gap-2 mb-4">
          <Briefcase className="text-blue-700" size={28} />
          <h1 className="text-3xl font-bold tracking-wide text-gray-800">Tekoffo</h1>
        </div>
        <div className="text-center">
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p> */}
          <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500">Sign in to continue</p>
        </div>

        {loading && <p>Loading...</p>}
        {serverError && (
                    <p className="text-center text-sm text-red-500">{serverError}</p>
                )}
        {/* {error && <p style={{ color: "red" }}>{error}</p>} */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
              Email or Username
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
               autoComplete="username"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.identifier ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email or username"
            />
            {errors.identifier && (
              <p className="mt-1 text-sm text-red-500">{errors.identifier}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-gray-600">Remember me</span>
            </label>
            <a href="/forgot-password" className="text-blue-600 hover:text-blue-800 transition-colors">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <LogIn size={20} />
            Sign In
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            width="100%"
            // width="352px" 
          />

        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signup-as" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
            Sign up now
          </a>
        </div>
      </div>
    </div>
  );
  
}

export default SignIn;