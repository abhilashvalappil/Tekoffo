// src/pages/CompleteOnboarding.tsx

import React from 'react';
import { createConnectedStripeAccount } from '../../../api';   
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';  
import { RootState } from '../../../redux/store';   

const CompleteOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);  

  const handleOnboard = async () => {
    try {
      if (!user?.email) {
        toast.error('User email not found.');
        return;
      }
      const { onboardingLink } = await createConnectedStripeAccount(user.email);
      window.location.href = onboardingLink;
    } catch (error) {
      console.error('Failed to create onboarding link:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate(-1); // go back to previous page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Complete Your Freelancer Setup</h1>
        <p className="text-gray-600 mb-8">
          To apply for jobs, you need to complete the Stripe onboarding process.
        </p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleOnboard}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold"
          >
            Complete Onboarding
          </button>
          <button
            onClick={handleCancel}
            className="border border-gray-400 text-gray-600 py-2 px-6 rounded-lg font-semibold hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteOnboarding;
