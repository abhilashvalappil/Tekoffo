 
 
import { ChevronRight } from 'lucide-react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ProposalData } from '../../../types/proposalTypes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createContract, createPaymentIntent, fetchAndUpdateProposal } from '../../../api';  
import { handleApiError } from '../../../utils/errors/errorHandler';

interface PaymentFormProps {
  proposalData: ProposalData | null;
  totalAmount: number;
  amount:number;
  serviceFee:number;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
  setError: (value: string | null) => void;
  setSuccess?: (value: string | null) => void;  
}

export default function PaymentForm({
  proposalData,
  amount,
  serviceFee,
  totalAmount,
  isProcessing,
  setIsProcessing,
  setError,
  setSuccess,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isCardValid, setIsCardValid] = useState(false);
  const navigate = useNavigate();

  console.log('now at@@@@@@@@@@@',proposalData)

  const handlePayment = async () => {
    if (!stripe || !elements || !proposalData || !totalAmount || !proposalData.freelancerId._id) {
      setError('Invalid proposal data, amount, or Stripe initialization. Please try again.');
      return;
    }
    setIsProcessing(true);
    setError(null);
 
    try {
      // Validate proposal data
      const { _id: proposalId, freelancerId, clientId, jobId } = proposalData;
   
      // const freelancer = freelancerId._id;
      // const jobId = job._id;
      
      // if (!proposalId || !freelancer || !clientId || !jobId) {
      //   throw new Error('Incomplete proposal data.');
      // }
 
      const paymentIntentData = {
        proposalId,
        freelancerId:freelancerId._id,
        amount: amount,
        serviceFee:serviceFee,
        clientId: clientId._id,
        jobId: jobId._id,
      }
      console.log('worlddddddddddddddddd')
      const { clientSecret, transactionId } = await createPaymentIntent(paymentIntentData)
      console.log('console from paymentform',clientSecret, transactionId)

      if (!clientSecret) {
        throw new Error('Failed to create PaymentIntent.');
      }

      // Get the card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found.');
      }

      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: proposalData.clientId?.fullName,  
          },
        },
      });
      console.log('Stripe confirmCardPayment result:', { stripeError, paymentIntent });

      if (stripeError) {
        setError(stripeError.message || 'An error occurred during payment confirmation.');
      } else if (paymentIntent?.status === 'requires_capture') {
        setSuccess?.('Payment authorized. Funds are held in the stripe.');
        await fetchAndUpdateProposal(proposalId,'accepted')
        navigate('/client/payment-success', { replace: true });
        await createContract(transactionId)
      }
    } catch (err) {
      const error = handleApiError(err)
      setError(error|| 'Something went wrong.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-slate-400" htmlFor="card-element">
          Card Details
        </label>
        <CardElement
          id="card-element"
          className="p-2 border border-slate-600 rounded-lg bg-slate-900 text-white"
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#fff',
                '::placeholder': { color: '#a0aec0' },
              },
              invalid: { color: '#ef4444' },
            },
          }}
          onChange={(e) => setIsCardValid(e.complete)}
        />
      </div>
      {/* <button
        className={`px-4 py-2 rounded-lg flex-1 min-w-[180px] flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all ${
          isProcessing || !isCardValid || !stripe || !elements
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }`}
        onClick={handlePayment}
        disabled={isProcessing || !isCardValid || !stripe || !elements}
        aria-label="Proceed to payment"
        aria-busy={isProcessing}
      >
        {isProcessing ? (
          <>
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>Proceed to Payment</span>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </button> */}
      <button
  className={`px-4 py-2 rounded-lg flex-1 min-w-[180px] flex justify-center items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 transition-all ${
    isProcessing || !isCardValid || !stripe || !elements
      ? 'opacity-50 cursor-not-allowed'
      : ''
  }`}
  onClick={handlePayment}
  disabled={isProcessing || !isCardValid || !stripe || !elements}
  aria-label="Pay Now"
  aria-busy={isProcessing}
>
  {isProcessing ? (
    <>
      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      <span>Processing...</span>
    </>
  ) : (
    <>
      <span>Pay Now</span>
      <ChevronRight className="h-4 w-4" />
    </>
  )}
</button>

    </div>
  );
}