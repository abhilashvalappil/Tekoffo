import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface LottieLoaderProps {
  className?: string;
}

const PaymentLottie: React.FC<LottieLoaderProps> = ({ className }) => {
  return (
    <div className={className}>
      <DotLottieReact
        src="https://lottie.host/82715872-544f-4be7-843c-cc94c86f64aa/0btXUcYrk4.lottie"
        loop
        autoplay
      />
    </div>
  );
};

export default PaymentLottie;
