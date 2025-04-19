import React, { useEffect, useRef, useState } from 'react';
import { KeyRound } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../redux/services/api/baseUrl';
import { commonENDPOINTS } from '../../redux/services/api/endpointUrl';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import {register} from '../../redux/services/authService'

 

const VerifyOtp = () => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [inputError, setInputError] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const { email, role } = location.state || {}; 
  
  const storedEmail = localStorage.getItem('otpEmail');
  const otpTimer = localStorage.getItem('otpTimer')
  // console.log("console from otpveificationnnnnnnnn",otpTimer)

  useEffect(() => {
    if(!otpTimer){
      navigate('/signin')
    }
  },[ otpTimer,navigate])
   

  const handleInput = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');  
    if (value.length > 1) return;  

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      }
    };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // const initialTimer = storedEmail === email && storedTimer ? parseInt(storedTimer) : 30;

  const initialTimer = parseInt(otpTimer);
  const [timer, setTimer] = useState(initialTimer);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (email) {
      localStorage.setItem("otpTimer", initialTimer.toString());
    }

    // if (timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev - 1;
          localStorage.setItem("otpTimer", newTime.toString());
          return newTime  > 0 ? newTime : 0;
        });
      }, 1000);
    // } 
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [email, initialTimer ]);



//*** resend otp 
  const handleResendOtp = async() => {
    setIsLoading(true);
    setServerError(null);
    try {
    const response = await API.post(commonENDPOINTS.RESEND_OTP,{email})
    if (response.data.success) {
      setTimer(30);  
      }else {
        setServerError(response.data.message || "Failed to resend OTP");
      }
    }catch (error: any) {
     setServerError(error.response?.data?.message || "Error resending OTP");
      console.log("Error:", error.response);
   } finally {
     setIsLoading(false);
    }
  };

  //***** submiting otp
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpValues.join('');
    if (otp.length !== 6) {
      setInputError('Please enter a 6-digit OTP');
      return;
    }
    setIsLoading(true);
    setServerError(null);
    setInputError('');
    

    try{
      const result = await dispatch(register({email,otp}));

      if (register.fulfilled.match(result)) {
        const role = result.payload.user.role;
        if(role == 'freelancer'){
          navigate('/freelancer-dashboard')
          // navigate('/freelancer/createprofile')
        }else if(role == 'client'){
          navigate('/client-dashboard')
          // navigate('/client/createprofile')
        }
      }else if(register.rejected.match(result)){
        setServerError(result.payload as string)
      }
    } catch (error: any) {
      setServerError(error.response?.data?.message );
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to signup if no email is provided
//   if (!email) {
//     navigate('/signup');
//     return null;
//   }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="bg-indigo-100 p-3 rounded-full">
            <KeyRound className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Verification Required
        </h1>
        <p className="text-center text-gray-600 mb-8">
          We've sent a verification code to {email}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 mb-8 justify-center">
            {Array(6).fill(null).map((_, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otpValues[index]}  
                onChange={(e) => handleInput(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 border-2 rounded-lg text-center text-xl font-semibold text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
              />
            ))}
          </div>
          {inputError && (
            <div className="text-sm text-red-600 text-center mb-4">{inputError}</div>
          )}
          {serverError && (
            <div className="text-sm text-red-600 text-center mb-4">{serverError}</div>
          )}
           
           <div className='text-center'>
        {timer > 0 ? (
          <>
            <h5>OTP Timer:</h5>
            <span>{timer} sec</span>
          </>
        ) : (
          <button
            type="submit"
            onClick={handleResendOtp}
            disabled={isLoading}
            className="text-blue-600 hover:underline mb-2"
          >
            Resend OTP
          </button>
        )}
      </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Didn't receive the code?{' '}
            <button className="text-indigo-600 font-semibold hover:text-indigo-700">
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;