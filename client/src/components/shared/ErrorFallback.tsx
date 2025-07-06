import React from 'react';

interface ErrorFallbackProps {
  onRetry: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ onRetry }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fefefe] text-center px-4">
      <div className="max-w-md p-8 bg-white shadow-xl rounded-2xl border border-gray-200">
        {/* You can replace this emoji with your logo or icon */}
        <div className="text-5xl mb-4">😓</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong.</h2>
        <p className="text-gray-600 mb-6">
          We encountered an unexpected error. Please try again later.
        </p>
        <button
          onClick={onRetry}
          className="px-5 py-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
