import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <div className="w-85 h-85">
        <DotLottieReact
          src="https://lottie.host/6c056495-9754-40ac-b5d0-3fc9de06f61c/XzjaWvIziA.lottie"
          loop
          autoplay
        />
      </div>
      <h1 className="text-2xl font-semibold text-gray-800 mt-6">
        The page you are looking for does not exist
      </h1>
      <Link
        to="/"
        className="mt-4 inline-block text-blue-600 hover:underline font-medium"
      >
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;
