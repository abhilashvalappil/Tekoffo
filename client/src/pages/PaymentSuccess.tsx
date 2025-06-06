 
import { useNavigate } from 'react-router-dom';
import PaymentLottie from '../assets/PaymentSuccessLottie';  // adjust path as needed
import { useEffect } from 'react';

const PaymentSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
          navigate('/client/proposals', { replace: true });  
        }, 3000); 
    
        return () => clearTimeout(timer); 
      }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center bg-slate-700 text-white p-15 rounded-xl w-fit mx-auto mt-20">
      <PaymentLottie className="w-64 h-64" />
      <h2 className="text-2xl mt-6 font-semibold">Payment Authorized</h2>
      <p className="text-slate-400 mt-2">Funds are held in Stripe. You're all set!</p>
    </div>
  );
};

export default PaymentSuccess;
