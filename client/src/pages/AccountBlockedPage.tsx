import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const AccountBlockedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-4">
      <div className="max-w-md w-full">
        <DotLottieReact
          src="https://lottie.host/cec5b2ad-aa0b-485a-87b3-16262d889fc5/TJRnyHbi37.lottie"
          loop
          autoplay
        />
        <h1 className="text-2xl font-semibold text-red-600 mt-4">
          Your account has been blocked by the admin.
        </h1>
        <p className="text-gray-600 mt-2">
          Please contact support if you believe this is a mistake or need further assistance.
        </p>
      </div>
    </div>
  );
};

export default AccountBlockedPage;
