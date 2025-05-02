// import { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import {   Clock, DollarSign, User, Briefcase, FileText, Users, LayoutDashboard, ClipboardList, MessageSquare } from 'lucide-react';
// import Navbar from './Navbar';
// import { createCheckout, fetchAndUpdateProposal } from '../../api/common'; 
// import { ProposalData  } from '../../types/proposalTypes';

 

// export default function PaymentReview() {
  
//   const [activeTab, setActiveTab] = useState('payment');
//   const [proposalData, setProposalData] = useState<ProposalData | null>(null);
//   console.log('console from paymentreview.tsxx',proposalData)

//   const location = useLocation();
   
//   const state = location.state as { proposalId: string };
//   console.log('second console from paymentrevie.tsxxxxxx',state)
//   const proposalId = state?.proposalId || 'N/A';

//   useEffect(() => {
//     if (proposalId && proposalId !== 'N/A') {
//       const loadProposalDetails = async () => {
//         try {
//           const data = await fetchAndUpdateProposal(proposalId);
//           console.log('Fetched proposal data:', data);
//           setProposalData(data);
//         } catch (error) {
//           console.error('Error fetching proposal data:', error);
//         }
//       };

//       loadProposalDetails();
//     }
//   }, [proposalId]);

//   // Use fetched data or fallbacks
//   const title = proposalData?.jobId.title ;
//   const sender = proposalData?.freelancerId.fullName ;
//   const amount = proposalData?.proposedBudget ;
//   const duration = proposalData?.duration  ;

//   const serviceFee = amount * 0.05;
//   const totalAmount = amount + serviceFee;

//   const handlePayment = async() => {
//     await createCheckout({
//       totalAmount: totalAmount * 100, // Convert to cents
//       proposalId: proposalData._id,
//       clientId: proposalData.clientId,
//       freelancerId: proposalData.freelancerId,
//     });
//   };

//   const navItems = [
//     { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', id: 'overview' },
//     { icon: <Briefcase className="h-5 w-5" />, label: 'Post a Job', id: 'post', path: '/client/post-job' },
//     { icon: <ClipboardList className="h-5 w-5" />, label: 'My Job Posts', id: 'my-jobs', path: '/client/myjobs' },
//     { icon: <Users className="h-5 w-5" />, label: 'Talent', id: 'talent', path: '/client/freelancers' },
//     { icon: <FileText className="h-5 w-5" />, label: 'Proposals', id: 'proposals', path: '/client/proposals' },
//     { icon: <MessageSquare className="h-5 w-5" />, label: 'Messages', id: 'messages' },
//   ];

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navbar */}
//       <Navbar navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab} />

//       {/* Payment Review Content */}
//       <div className="pt-20 px-4 sm:px-6 lg:px-8">
//         <div className="w-full max-w-md mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg border border-slate-700">
//           {/* Header */}
//           <div className="py-4 px-6 bg-gradient-to-r from-indigo-600 to-violet-600">
//             <h2 className="text-xl font-bold flex items-center">
//               <DollarSign className="mr-2 h-5 w-5" />
//               Payment Review
//             </h2>
//           </div>

//           {/* Content */}
//           <div className="p-6 space-y-6">
//             {/* Job Details */}
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-slate-400">Job Title</span>
//                 <span className="font-medium text-white">{title}</span>
//               </div>

//               <div className="flex justify-between items-center">
//                 <span className="text-slate-400 flex items-center">
//                   <User className="mr-2 h-4 w-4" /> Freelancer
//                 </span>
//                 <span className="font-medium text-white">{sender}</span>
//               </div>

//               <div className="flex justify-between items-center">
//                 <span className="text-slate-400 flex items-center">
//                   <DollarSign className="mr-2 h-4 w-4" /> Budget
//                 </span>
//                 <span className="font-medium text-white">{proposalData?.proposedBudget}</span>
//               </div>

//               <div className="flex justify-between items-center">
//                 <span className="text-slate-400 flex items-center">
//                   <Clock className="mr-2 h-4 w-4" /> Duration
//                 </span>
//                 <span className="font-medium text-white">{proposalData?.duration}</span>
//               </div>
//             </div>

//             {/* Divider */}
//             <div className="border-t border-slate-700"></div>

//             {/* Payment Breakdown */}
//             <div className="space-y-2">
//               <h3 className="text-lg font-medium">Payment Breakdown</h3>

//               <div className="flex justify-between items-center">
//                 <span className="text-slate-400">Project Base Fee</span>
//                 <span className="text-white">{proposalData?.proposedBudget}</span>
//               </div>

//               <div className="flex justify-between items-center">
//                 <span className="text-slate-400">Service Fee (5%)</span>
//                 <span className="text-white">${serviceFee.toFixed(2)}</span>
//               </div>

//               <div className="flex justify-between items-center pt-2 border-t border-slate-700 mt-2">
//                 <span className="font-medium">Total</span>
//                 <span className="font-bold text-lg text-indigo-400">${totalAmount.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           {/* <div className="p-6 bg-slate-800 flex flex-col sm:flex-row gap-3">
//             <button
//               className="px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors text-slate-300 flex-1"
//               onClick={() => {}}
//             >
//               Cancel
//             </button>

//             <button
//               className={`px-4 py-2 rounded-lg flex-1 flex justify-center items-center gap-2 ${
//                 paymentComplete
//                   ? 'bg-green-600 hover:bg-green-700'
//                   : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'
//               } transition-all`}
//               onClick={handlePayment}
//               disabled={isProcessing || paymentComplete}
//             >
//               {isProcessing ? (
//                 <>
//                   <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span>Processing...</span>
//                 </>
//               ) : paymentComplete ? (
//                 <>
//                   <CheckCircle className="h-4 w-4" />
//                   <span>Payment Complete</span>
//                 </>
//               ) : (
//                 <>
//                   <span>Proceed to Payment</span>
//                   <ChevronRight className="h-4 w-4" />
//                 </>
//               )}
//             </button>
//           </div> */}
//           <div className="p-6 bg-slate-800 flex flex-col sm:flex-row gap-3">
//   <button
//     className="px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors text-slate-300 flex-1 min-w-[180px]"
//     onClick={() => {}}
//   >
//     Cancel
//   </button>

//   <button
//     className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white transition-all flex-1 min-w-[180px]"
//     onClick={handlePayment}
//   >
//     Proceed to Payment
//   </button>
// </div>


//           {/* Futuristic Elements */}
//           <div className="absolute -top-10 -right-10 h-20 w-20 bg-indigo-500 opacity-20 rounded-full blur-xl"></div>
//           <div className="absolute -bottom-10 -left-10 h-20 w-20 bg-violet-500 opacity-20 rounded-full blur-xl"></div>
//         </div>
//       </div>
//     </div>
//   );
// }


//************************************* */

// import { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Clock, DollarSign, User, Briefcase, FileText, Users, LayoutDashboard, ClipboardList, MessageSquare, ChevronRight } from 'lucide-react';
// import Navbar from './Navbar';
// import { fetchAndUpdateProposal } from '../../api/common';
// import { ProposalData } from '../../types/proposalTypes';
// import { loadStripe } from '@stripe/stripe-js';
// import API from '../../services/api';

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// export default function PaymentReview() {
//   const [activeTab, setActiveTab] = useState('payment');
//   const [proposalData, setProposalData] = useState<ProposalData | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const location = useLocation();
//   const navigate = useNavigate();
//   const state = location.state as { proposalId: string };
//   const proposalId = state?.proposalId || 'N/A';

//   useEffect(() => {
//     if (proposalId && proposalId !== 'N/A') {
//       const loadProposalDetails = async () => {
//         try {
//           const data = await fetchAndUpdateProposal(proposalId);
//           setProposalData(data);
//         } catch (error) {
//           console.error('Error fetching proposal data:', error);
//           setError('Failed to load proposal details.');
//         }
//       };
//       loadProposalDetails();
//     }
//   }, [proposalId]);

//   const title = proposalData?.jobId.title || 'N/A';
//   const sender = proposalData?.freelancerId.fullName || 'N/A';
//   const amount = proposalData?.proposedBudget || 0;
//   const duration = proposalData?.duration || 'N/A';

//   const serviceFee = amount * 0.05;
//   const totalAmount = amount + serviceFee;

//   const handlePayment = async () => {
//     if (!proposalData || !amount || !proposalData.freelancerId._id) {
//       setError('Invalid proposal data, amount, or freelancer ID. Please try again.');
//       return;
//     }

//     setIsProcessing(true);
//     setError(null);

//     try {
//       const stripe = await stripePromise;

//       if (!stripe) {
//         setError('Stripe initialization failed.');
//         setIsProcessing(false);
//         return;
//       }

//       // Create PaymentIntent with manual capture on the backend
//       const response = await API.post('/create-payment-intent', {
//         proposalId: proposalData._id,
//         freelancerId: proposalData.freelancerId._id,
//         amount: totalAmount,
//         clientId: proposalData.clientId,
//         jobId: proposalData.jobId
//       });

//       const { clientSecret } = response.data;

//       if (!clientSecret) {
//         throw new Error('Failed to create PaymentIntent.');
//       }

//       // Confirm the payment with Stripe
//       const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret);

//       if (stripeError) {
//         setError(stripeError.message || 'An error occurred during payment confirmation.');
//       } else if (paymentIntent?.status === 'succeeded') {
//         // Payment authorized, but not captured yet
//         setError('Payment authorized. It will be captured later.');
//       }
//     } catch (error: any) {
//       console.error('Payment error:', error);
//       setError(error.response?.data?.message || error.message || 'Something went wrong.');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const navItems = [
//     { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', id: 'overview' },
//     { icon: <Briefcase className="h-5 w-5" />, label: 'Post a Job', id: 'post', path: '/client/post-job' },
//     { icon: <ClipboardList className="h-5 w-5" />, label: 'My Job Posts', id: 'my-jobs', path: '/client/myjobs' },
//     { icon: <Users className="h-5 w-5" />, label: 'Talent', id: 'talent', path: '/client/freelancers' },
//     { icon: <FileText className="h-5 w-5" />, label: 'Proposals', id: 'proposals', path: '/client/proposals' },
//     { icon: <MessageSquare className="h-5 w-5" />, label: 'Messages', id: 'messages' },
//   ];

//   return (
//     <div className="min-h-screen bg-white">
//       <Navbar navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab} />
//       <div className="pt-20 px-4 sm:px-6 lg:px-8">
//         <div className="w-full max-w-md mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg border border-slate-700 relative">
//           <div className="py-4 px-6 bg-gradient-to-r from-indigo-600 to-violet-600">
//             <h2 className="text-xl font-bold flex items-center">
//               <DollarSign className="mr-2 h-5 w-5" />
//               Payment Review
//             </h2>
//           </div>
//           <div className="p-6 space-y-6">
//             {error && <div className="text-red-500">{error}</div>}
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-slate-400">Job Title</span>
//                 <span className="font-medium text-white">{title}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-slate-400 flex items-center">
//                   <User className="mr-2 h-4 w-4" /> Freelancer
//                 </span>
//                 <span className="font-medium text-white">{sender}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-slate-400 flex items-center">
//                   <DollarSign className="mr-2 h-4 w-4" /> Budget
//                 </span>
//                 <span className="font-medium text-white">${amount.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-slate-400 flex items-center">
//                   <Clock className="mr-2 h-4 w-4" /> Duration
//                 </span>
//                 <span className="font-medium text-white">{duration}</span>
//               </div>
//             </div>
//             <div className="border-t border-slate-700"></div>
//             <div className="space-y-2">
//               <h3 className="text-lg font-medium">Payment Breakdown</h3>
//               <div className="flex justify-between items-center">
//                 <span className="text-slate-400">Project Base Fee</span>
//                 <span className="text-white">${amount.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-slate-400">Service Fee (5%)</span>
//                 <span className="text-white">${serviceFee.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between items-center pt-2 border-t border-slate-700 mt-2">
//                 <span className="font-medium">Total</span>
//                 <span className="font-bold text-lg text-indigo-400">${totalAmount.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//           <div className="p-6 bg-slate-800 flex flex-col sm:flex-row gap-3">
//             <button
//               className="px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors text-slate-300 flex-1 min-w-[180px]"
//               onClick={() => navigate(-1)}
//             >
//               Cancel
//             </button>
//             <button
//               className={`px-4 py-2 rounded-lg flex-1 min-w-[180px] flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
//               onClick={handlePayment}
//               disabled={isProcessing}
//             >
//               {isProcessing ? (
//                 <>
//                   <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span>Processing...</span>
//                 </>
//               ) : (
//                 <>
//                   <span>Proceed to Payment</span>
//                   <ChevronRight className="h-4 w-4" />
//                 </>
//               )}
//             </button>
//           </div>
//           <div className="absolute -top-10 -right-10 h-20 w-20 bg-indigo-500 opacity-20 rounded-full blur-xl"></div>
//           <div className="absolute -bottom-10 -left-10 h-20 w-20 bg-violet-500 opacity-20 rounded-full blur-xl"></div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, DollarSign, Briefcase, FileText, LayoutDashboard, ClipboardList, MessageSquare } from 'lucide-react';
import Navbar from '../dashboard/Navbar';
import { fetchProposal } from '../../../api';  
import { ProposalData } from '../../../types/proposalTypes';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';
import { SERVICE_FEE_PERCENTAGE } from '../../../constants/service'; 
import InvalidProposalPage from '../../../pages/InvalidProposal';

// Initialize Stripe once
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface LocationState {
  proposalId?: string;
}

export default function PaymentReview() {
  const [activeTab, setActiveTab] = useState('payment');
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const proposalId = state?.proposalId || null;

  useEffect(() => {
    if (!proposalId) {
      setError('Invalid proposal ID.');
      return;
    }

    const loadProposalDetails = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProposal(proposalId);
        console.log('propodaldetailsssssss555555555',data)
        setProposalData(data);
      } catch (error) {
        console.error('Error fetching proposal data:', error);
        setError('Failed to load proposal details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadProposalDetails();
  }, [proposalId]);

  if (!proposalId) {
    return <InvalidProposalPage />;
    // return (
    //   <div className="min-h-screen bg-white flex items-center justify-center">
    //     <p className="text-red-500">Invalid proposal ID. Please go back and try again.</p>
    //   </div>
    // );
  }

  // const title = proposalData?.jobId?.title ?? 'N/A';
  // const sender = proposalData?.freelancerId?.fullName ?? 'N/A';
  const amount = proposalData?.proposedBudget ?? 0;
  const duration = proposalData?.duration ?? 'N/A';

  const serviceFee = amount * SERVICE_FEE_PERCENTAGE;
  const totalAmount = amount + serviceFee;

  const navItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', id: 'overview', path: '/client/overview' },
    { icon: <Briefcase className="h-5 w-5" />, label: 'Post a Job', id: 'post', path: '/client/post-job' },
    { icon: <ClipboardList className="h-5 w-5" />, label: 'My Job Posts', id: 'my-jobs', path: '/client/myjobs' },
    { icon: <FileText className="h-5 w-5" />, label: 'Proposals', id: 'proposals', path: '/client/proposals' },
    { icon: <MessageSquare className="h-5 w-5" />, label: 'Messages', id: 'messages', path: '/client/messages' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto rounded-xl overflow-hidden bg-white text-[#0A142F] shadow-md border border-gray-200 relative">
          <div className="py-4 px-6 bg-[#0A142F]">
            <h2 className="text-xl font-bold flex items-center text-white">
              <DollarSign className="mr-2 h-5 w-5" />
              Payment Review
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {isLoading && <div className="text-center text-[#0A142F]">Loading proposal details...</div>}
            {error && (
              <div className="text-red-500 flex justify-between items-center">
                {error}
                <button
                  className="text-[#0A142F] underline"
                  onClick={() => navigate('/client/proposals')}
                >
                  Go Back
                </button>
              </div>
            )}
            {!isLoading && !error && (
              <>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" /> Budget
                    </span>
                    <span className="font-medium text-[#0A142F]">${amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center">
                      <Clock className="mr-2 h-4 w-4" /> Duration
                    </span>
                    <span className="font-medium text-[#0A142F]">{duration}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200"></div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-[#0A142F]">Payment Breakdown</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Job Base Fee</span>
                    <span className="text-[#0A142F]">${amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Service Fee ({SERVICE_FEE_PERCENTAGE * 100}%)</span>
                    <span className="text-[#0A142F]">${serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                    <span className="font-medium text-[#0A142F]">Total</span>
                    <span className="font-bold text-lg text-[#0A142F]">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200"></div>
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    proposalData={proposalData}
                    totalAmount={totalAmount}
                    isProcessing={isProcessing}
                    setIsProcessing={setIsProcessing}
                    setError={setError}
                  />
                </Elements>
              </>
            )}
          </div>
          <div className="p-6 bg-gray-50 flex flex-col sm:flex-row gap-3">
            <button
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors text-[#0A142F] flex-1 min-w-[180px]"
              onClick={() => navigate('/client/proposals')}
              aria-label="Go back to proposals"
            >
              Back to Proposals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}