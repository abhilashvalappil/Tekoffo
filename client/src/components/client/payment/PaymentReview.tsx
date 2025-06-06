
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, DollarSign, Briefcase, FileText, LayoutDashboard, ClipboardList, MessageSquare } from 'lucide-react';
import ClientNavbar from '../shared/Navbar';
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
  }

  if (!proposalData) return null; 
  const amount = proposalData.proposedBudget;
  const duration = proposalData.duration;

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
      <ClientNavbar navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab} />
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
                    <span className="font-medium text-[#0A142F]">${amount?.toFixed(2)}</span>
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
                    <span className="text-[#0A142F]">${amount?.toFixed(2)}</span>
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
                    amount={amount}
                    serviceFee={serviceFee}
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