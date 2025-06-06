import React, { useState } from "react";
import { Toaster, toast } from 'react-hot-toast';
import { withdrawAmount } from "../../../api";
import { handleApiError } from "../../../utils/errors/errorHandler";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const WithdrawForm: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleWithdraw = async () => {
    setError("");
    if (!amount || amount <= 0) {
      return setError("Please enter a valid amount.");
    }

    try {
      setLoading(true);
      const message = await withdrawAmount(amount);
        toast.success(message);
        setTimeout(() => {
        onSuccess();
        onClose();
        }, 1000);
    } catch (err) {
        const error = handleApiError(err)
      setError(error || "Withdrawal failed.");
       toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 rounded-2xl shadow-2xl backdrop-blur-sm bg-white/80 border border-gray-200 dark:bg-[#0F172A]/70 dark:border-[#1E293B]">
        <Toaster position="top-center" />
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        Withdraw Funds
      </h2>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Enter amount"
        className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700 dark:text-white dark:bg-transparent dark:border-slate-600"
      />

      {error && (
        <p className="mt-3 text-sm text-red-500 text-center font-medium">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={onClose}
          className="px-6 py-2 font-semibold rounded-xl text-sm bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-gray-800 dark:text-white transition duration-150"
        >
          Cancel
        </button>
        <button
          onClick={handleWithdraw}
          disabled={loading}
          className={`px-6 py-2 font-semibold rounded-xl text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-400/40 transition duration-200 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : "Withdraw"}
        </button>
      </div>
    </div>
  );
};

export default WithdrawForm;
