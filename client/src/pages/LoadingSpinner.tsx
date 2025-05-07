import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="w-24 h-24">
        <DotLottieReact
          src="https://lottie.host/2ada5d25-fc49-490d-8114-83585d119990/GANw7Vn5ZR.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
