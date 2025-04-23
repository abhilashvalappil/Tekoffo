import React, { useState, ChangeEvent, FormEvent, useCallback } from 'react';
import { ArrowLeft, Lock, AlertCircle } from 'lucide-react';

type CardType = 'visa' | 'mastercard' | null;

// Constants for validation
const CARD_NUMBER_LENGTH = 16;
const CVV_LENGTH = 3;
const EXPIRY_DATE_REGEX = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
const NAME_REGEX = /^[a-zA-Z\s]{2,50}$/;

interface FormErrors {
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}

const PaymentForm: React.FC = () => {
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardName, setCardName] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentComplete, setPaymentComplete] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>('');
  const [saveCard, setSaveCard] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Format card number (e.g., 1234 5678 9012 3456)
  const formatCardNumber = useCallback((value: string): string => {
    const cleanValue = value.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    const parts: string[] = [];
    for (let i = 0; i < cleanValue.length; i += 4) {
      parts.push(cleanValue.substring(i, i + 4));
    }
    return parts.join(' ');
  }, []);

  // Format expiry date (e.g., MM/YY)
  const formatExpiryDate = useCallback((value: string): string => {
    const cleanValue = value.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    return cleanValue.length > 2
      ? `${cleanValue.substring(0, 2)}/${cleanValue.substring(2, 4)}`
      : cleanValue;
  }, []);

  // Validate form inputs
  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};

    // Card Number
    const cleanCardNumber = cardNumber.replace(/\s+/g, '');
    if (cleanCardNumber.length !== CARD_NUMBER_LENGTH) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    } else if (!/^\d{16}$/.test(cleanCardNumber)) {
      newErrors.cardNumber = 'Invalid card number';
    }

    // Cardholder Name
    if (!NAME_REGEX.test(cardName)) {
      newErrors.cardName = 'Enter a valid name (2-50 characters)';
    }

    // Expiry Date
    if (!EXPIRY_DATE_REGEX.test(expiryDate)) {
      newErrors.expiryDate = 'Enter a valid expiry date (MM/YY)';
    } else {
      const [month, year] = expiryDate.split('/').map(Number);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    // CVV
    if (cvv.length !== CVV_LENGTH || !/^\d{3}$/.test(cvv)) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    return newErrors;
  }, [cardNumber, cardName, expiryDate, cvv]);

  // Handle form submission
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setPaymentError('');
      setErrors({});

      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsProcessing(true);

      // Simulate API call
      setTimeout(() => {
        setIsProcessing(false);
        if (Math.random() > 0.1) {
          setPaymentComplete(true);
        } else {
          setPaymentError('Payment failed. Please try again.');
        }
      }, 2000);
    },
    [validateForm]
  );

  // Determine card type
  const getCardType = useCallback((): CardType => {
    const cleanCardNumber = cardNumber.replace(/\s+/g, '');
    const visaRegex = /^4/;
    const mastercardRegex = /^5[1-5]/;

    if (visaRegex.test(cleanCardNumber)) return 'visa';
    if (mastercardRegex.test(cleanCardNumber)) return 'mastercard';
    return null;
  }, [cardNumber]);

  const cardType = getCardType();

  // Handle input changes with sanitization
  const handleInputChange = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string>>, formatter?: (value: string) => string) => (
      e: ChangeEvent<HTMLInputElement>
    ) => {
      const value = e.target.value.replace(/[<>{}]/g, ''); // Basic XSS prevention
      setter(formatter ? formatter(value) : value);
    },
    []
  );

  if (paymentComplete) {
    return (
      <div className="w-full max-w-md mx-auto rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg border border-slate-700 p-6 text-center">
        <div className="w-14 h-14 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-1">Payment Successful!</h2>
        <p className="text-slate-300 mb-4 text-sm">Your payment has been processed successfully.</p>
        <div className="p-3 bg-slate-800 rounded-lg mb-4">
          <div className="flex justify-between mb-1 text-sm">
            <span className="text-slate-400">Amount Paid:</span>
            <span className="font-medium">$2,625.00</span>
          </div>
          <div className="flex justify-between mb-1 text-sm">
            <span className="text-slate-400">Payment Method:</span>
            <span className="font-medium flex items-center">
              {cardType === 'mastercard' ? 'Mastercard' : 'Visa'}
              <div
                className={`ml-2 w-6 h-4 rounded ${
                  cardType === 'mastercard'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500'
                    : 'bg-gradient-to-r from-blue-500 to-blue-700'
                }`}
              ></div>
            </span>
          </div>
          <div className="flex justify-between mb-1 text-sm">
            <span className="text-slate-400">Transaction ID:</span>
            <span className="font-medium">TXN83942751</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Date:</span>
            <span className="font-medium">April 23, 2025</span>
          </div>
        </div>
        <button
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={() => window.location.href = '/dashboard'}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg border border-slate-700">
      <div className="py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center">
          <ArrowLeft
            className="mr-2 h-4 w-4 cursor-pointer"
            onClick={() => window.history.back()}
            aria-label="Go back"
          />
          Make Payment
        </h2>
        <div className="flex items-center">
          <Lock className="h-3 w-3 mr-1" />
          <span className="text-xs">Secure Payment</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-3" noValidate>
        {paymentError && (
          <div
            className="bg-red-900 bg-opacity-30 border border-red-800 rounded-lg p-3 flex items-start"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-xs">{paymentError}</p>
          </div>
        )}

        <div className="bg-slate-800 p-3 rounded-lg">
          <div className="flex justify-between mb-1 text-sm">
            <span className="text-slate-400">Total Amount:</span>
            <span className="font-bold">$2,625.00</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Project:</span>
            <span className="text-slate-300">Full Stack Web Development</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label htmlFor="cardNumber" className="block text-xs font-medium text-slate-400 mb-1">
              Card Number
            </label>
            <div className="relative">
              <input
                id="cardNumber"
                type="text"
                value={cardNumber}
                onChange={handleInputChange(setCardNumber, formatCardNumber)}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                className={`w-full bg-slate-800 border ${
                  errors.cardNumber ? 'border-red-500' : 'border-slate-700'
                } rounded-lg py-2 px-3 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
                aria-invalid={!!errors.cardNumber}
                aria-describedby={errors.cardNumber ? 'cardNumber-error' : undefined}
              />
              <div className="absolute right-2 top-2 flex items-center">
                <div
                  className={`w-8 h-5 rounded ${
                    cardType === 'mastercard'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500'
                      : 'bg-gradient-to-r from-blue-500 to-blue-700'
                  }`}
                />
              </div>
            </div>
            {errors.cardNumber && (
              <p id="cardNumber-error" className="text-xs text-red-500 mt-1">
                {errors.cardNumber}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="cardName" className="block text-xs font-medium text-slate-400 mb-1">
              Cardholder Name
            </label>
            <input
              id="cardName"
              type="text"
              value={cardName}
              onChange={handleInputChange(setCardName)}
              placeholder="John Smith"
              className={`w-full bg-slate-800 border ${
                errors.cardName ? 'border-red-500' : 'border-slate-700'
              } rounded-lg py-2 px-3 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
              aria-invalid={!!errors.cardName}
              aria-describedby={errors.cardName ? 'cardName-error' : undefined}
            />
            {errors.cardName && (
              <p id="cardName-error" className="text-xs text-red-500 mt-1">
                {errors.cardName}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="expiryDate" className="block text-xs font-medium text-slate-400 mb-1">
                Expiry Date
              </label>
              <input
                id="expiryDate"
                type="text"
                value={expiryDate}
                onChange={handleInputChange(setExpiryDate, formatExpiryDate)}
                placeholder="MM/YY"
                maxLength={5}
                className={`w-full bg-slate-800 border ${
                  errors.expiryDate ? 'border-red-500' : 'border-slate-700'
                } rounded-lg py-2 px-3 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
                aria-invalid={!!errors.expiryDate}
                aria-describedby={errors.expiryDate ? 'expiryDate-error' : undefined}
              />
              {errors.expiryDate && (
                <p id="expiryDate-error" className="text-xs text-red-500 mt-1">
                  {errors.expiryDate}
                </p>
              )}
            </div>

            <div className="w-20">
              <label htmlFor="cvv" className="block text-xs font-medium text-slate-400 mb-1">
                CVV
              </label>
              <input
                id="cvv"
                type="text"
                value={cvv}
                onChange={handleInputChange(setCvv, (value) => value.replace(/\D/g, ''))}
                placeholder="123"
                maxLength={3}
                className={`w-full bg-slate-800 border ${
                  errors.cvv ? 'border-red-500' : 'border-slate-700'
                } rounded-lg py-2 px-3 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
                aria-invalid={!!errors.cvv}
                aria-describedby={errors.cvv ? 'cvv-error' : undefined}
              />
              {errors.cvv && (
                <p id="cvv-error" className="text-xs text-red-500 mt-1">
                  {errors.cvv}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="saveCard"
            checked={saveCard}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSaveCard(e.target.checked)}
            className="h-3 w-3 bg-slate-800 border border-slate-700 rounded text-indigo-500 focus:ring-indigo-500"
            aria-checked={saveCard}
          />
          <label htmlFor="saveCard" className="ml-2 text-xs text-slate-300">
            Save card for future payments
          </label>
        </div>
      </form>

      <div className="p-4 pt-0">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isProcessing || Object.keys(errors).length > 0}
          className={`w-full py-2 px-4 rounded-lg flex justify-center items-center gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
            isProcessing || Object.keys(errors).length > 0
              ? 'bg-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'
          }`}
          aria-disabled={isProcessing || Object.keys(errors).length > 0}
        >
          {isProcessing ? (
            <>
              <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Lock className="h-3 w-3" />
              <span>Pay $2,625.00</span>
            </>
          )}
        </button>

        <p className="text-[10px] text-slate-400 text-center mt-3 flex items-center justify-center">
          <Lock className="h-2 w-2 mr-1" />
          Your payment information is encrypted and secure
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;