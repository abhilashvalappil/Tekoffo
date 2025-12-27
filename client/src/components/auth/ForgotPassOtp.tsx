import React, { useEffect, useRef, useState } from 'react';
import { KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../redux/services/api/baseUrl';
import { commonENDPOINTS } from '../../redux/services/api/endpointUrl';
import { handleApiError } from '../../utils/errors/errorHandler';
import { resetPassword } from '../../api';

const ForgotPasswordOtp =()=> {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const navigate = useNavigate();

  const otpTimer = localStorage.getItem('otpTimer');
  const email = localStorage.getItem('forgotEmail');

  useEffect(() => {
    if(!otpTimer){
      navigate('/signin')
    }
  },[otpTimer,navigate])

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

  const initialTimer = parseInt(otpTimer || "0");
  const [timer, setTimer] = useState(initialTimer);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
 

  useEffect(() => {
     if (email) {
       localStorage.setItem("otpTimer", initialTimer.toString());
     }
       intervalRef.current = setInterval(() => {
         setTimer((prev) => {
           const newTime = prev - 1;
           localStorage.setItem("otpTimer", newTime.toString());
           return newTime  > 0 ? newTime : 0;
         });
       }, 1000); 
     return () => {
       if (intervalRef.current) {
         clearInterval(intervalRef.current);
         intervalRef.current = null;
       }
     };
   }, [email, initialTimer ]);




  const handleResendOtp = async() => {
    setIsResending(true);
    setServerError(null);
    try {
    const response = await resetPassword((email))
    if (response.success) { 
      setTimer(response.expiresIn);
      localStorage.setItem("otpTimer", response.expiresIn.toString());
    }else {
      setServerError(response.data.message || "Failed to resend OTP");
    }
  }catch (error) {
    const errormessage = handleApiError(error)
    setServerError(errormessage);
  } finally {
    setIsResending(false);
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpValues.join('');
    if (otp.length !== 6) {
      setServerError('Please enter a 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setServerError(null);

    try {
      const response = await API.post(commonENDPOINTS.VERIFY_FORGOT_OTP, {
        email,
        otp,
      });
      if (response.data.success) {
        navigate('/reset-password',{ state: { email:email } });
      }
    } catch (error) {
      const errormessage = handleApiError(error)
      setServerError(errormessage);
    } finally {
      setIsLoading(false);
    }
  };

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

        <form >
          <div className="flex gap-2 mb-8 justify-center">
            {Array(6).fill(null).map((_, index) => (
              <input
                ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                key={index}
                // ref={(el) => (inputRefs.current[index] = el)}
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
            type="button"
            onClick={handleResendOtp}
            disabled={isResending}
            className="text-blue-600 hover:underline mb-2"
          >
            {isResending ? 'Resending...' :'Resend OTP'}
          </button>
        )}
      </div>
          <button onClick={handleSubmit}
            type="button"
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

export default ForgotPasswordOtp;