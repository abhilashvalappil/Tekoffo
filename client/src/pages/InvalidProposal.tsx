import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const InvalidProposalPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-60 h-60">
        <DotLottieReact
          src="https://lottie.host/b2cbefbf-0309-40c3-90a5-2323ee9f4249/3VDirN8mni.lottie"
          loop
          autoplay
        />
      </div>
      <p className="text-red-600 text-lg font-semibold mt-6 text-center">
        Invalid proposal ID. Please go back and try again.
      </p>
    </div>
  );
};

export default InvalidProposalPage;
