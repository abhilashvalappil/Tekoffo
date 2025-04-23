import { useState } from 'react';
import { CheckCircle, ChevronRight, Clock, DollarSign, User } from 'lucide-react';

export default function PaymentReview() {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
    }, 2000);
  };
  
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  return (
    <div className="w-full max-w-md mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg border border-slate-700">
      {/* Header */}
      <div className="py-4 px-6 bg-gradient-to-r from-indigo-600 to-violet-600">
        <h2 className="text-xl font-bold flex items-center">
          <DollarSign className="mr-2 h-5 w-5" />
          Payment Review
        </h2>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Job Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Job Title</span>
            <span className="font-medium text-white">Full Stack Web Development</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center">
              <User className="mr-2 h-4 w-4" /> Freelancer
            </span>
            <span className="font-medium text-white">Alex Morgan</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center">
              <DollarSign className="mr-2 h-4 w-4" /> Budget
            </span>
            <span className="font-medium text-white">$2,500.00</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center">
              <Clock className="mr-2 h-4 w-4" /> Duration
            </span>
            <span className="font-medium text-white">30 days</span>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-slate-700"></div>
        
        {/* Payment Breakdown */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Payment Breakdown</h3>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Project Base Fee</span>
            <span className="text-white">$2,500.00</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Service Fee (5%)</span>
            <span className="text-white">$125.00</span>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-slate-700 mt-2">
            <span className="font-medium">Total</span>
            <span className="font-bold text-lg text-indigo-400">$2,625.00</span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-6 bg-slate-800 flex flex-col sm:flex-row gap-3">
        <button 
          className="px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors text-slate-300 flex-1"
          onClick={() => {}}
        >
          Cancel
        </button>
        
        <button 
          className={`px-4 py-2 rounded-lg flex-1 flex justify-center items-center gap-2 ${
            paymentComplete 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'
          } transition-all`}
          onClick={handlePayment}
          disabled={isProcessing || paymentComplete}
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : paymentComplete ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Payment Complete</span>
            </>
          ) : (
            <>
              <span>Proceed to Payment</span>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
      
      {/* Futuristic Elements */}
      <div className="absolute -top-10 -right-10 h-20 w-20 bg-indigo-500 opacity-20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-10 -left-10 h-20 w-20 bg-violet-500 opacity-20 rounded-full blur-xl"></div>
    </div>
  );
}