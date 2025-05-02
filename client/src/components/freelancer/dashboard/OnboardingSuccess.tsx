// src/pages/OnboardingSuccess.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OnboardingSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/freelancer/jobs'); // or wherever you want user to go after success
    }, 3000); // 3 seconds wait

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-green-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Onboarding Successful!</h1>
        <p className="text-gray-700 mb-8">
          Thank you for completing your freelancer setup. Redirecting you to find jobs...
        </p>
      </div>
    </div>
  );
};

export default OnboardingSuccess;
