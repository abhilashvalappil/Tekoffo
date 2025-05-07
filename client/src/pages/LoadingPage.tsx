import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-4">
      <div className="max-w-md w-full">
        <DotLottieReact
          src="https://lottie.host/2ada5d25-fc49-490d-8114-83585d119990/GANw7Vn5ZR.lottie"
          loop
          autoplay
        />
        <h1 className="text-xl font-medium text-gray-700 mt-4">
          Loading, please wait...
        </h1>
      </div>
    </div>
  );
};

export default LoadingPage;
