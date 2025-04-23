import React from 'react';
import Lottie from 'lottie-react';
import blockedAnimation from '../../assets/lottie/blocked-account.json'

const AccountBlocked: React.FC = () => {
    return (
      <div className="flex flex-col justify-center items-center p-4 bg-gray-100 text-center">
        <Lottie animationData={blockedAnimation} loop={true} style={{ width: '200px', height: '200px' }} />
        <h2 className="text-xl font-bold mt-4">Account Blocked</h2>
        <p className="mt-2">Your account has been blocked by the admin.<br />Please contact support if you believe this is a mistake.</p>
      </div>
    );
  };
  
  export default AccountBlocked;