import React, { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";
import Modal from "react-modal";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import ProfileSidebar from "./ProfileSidebar";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Navbar from '../shared/Navbar';
import { navItems } from '../shared/NavbarItems';
import { fetchTransactions, fetchWallet } from "../../../api";
import { IWallet } from "../../../types/wallet";
import WithdrawForm from "./WithdrawForm";
import { handleApiError } from "../../../utils/errors/errorHandler";
import { ITransaction } from "../../../types/transaction";
import { useAuth } from "../../../hooks/customhooks/useAuth";
import Footer from "../../shared/Footer";
import { usePagination } from "../../../hooks/customhooks/usePagination";
Modal.setAppElement("#root");  


const Wallet: React.FC = () => {
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [activeTab, setActiveTab] = useState<string>('contracts');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const { pagination, handlePageChange, updateMeta } = usePagination({
      total: 0,
      page: 1,
      pages: 1,
      limit: 4,
    });

  const user = useSelector((state: RootState) => state.auth.user);
  const { handleLogout } = useAuth();

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async() => {
    try {
      const data = await fetchWallet();
      setWallet(data);
    } catch (error) {
      handleApiError(error)
    }
  };

  useEffect(() => {
  const loadTransactions = async() => {
    try {
      const response = await fetchTransactions(pagination.page, pagination.limit)
      setTransactions(response.data);
      updateMeta(response.meta.total,response.meta.pages)
    } catch (error) {
      handleApiError(error)
    }
  }
  loadTransactions();
  },[pagination.page, pagination.limit,updateMeta])

 
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white text-gray-800">
       <Navbar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              isProfileOpen={isProfileOpen}
              setIsProfileOpen={setIsProfileOpen}
              user={user}
               handleLogout={handleLogout}
              navItems={navItems}
            />
      <div className="container mx-auto px-4 py-22">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileSidebar
            freelancer={{
              fullName: user?.fullName || "Anonymous User",
              profilePicture: user?.profilePicture,
            }}
          />

          <div className="max-w-4xl mx-auto mr-94.5 mt-0 px-6 md:px-10 font-sans space-y-10">
            {/* Wallet Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-5 shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <FaWallet size={24} />
                <h1 className="text-xl font-bold tracking-wide">My Wallet</h1>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h2 className="text-sm uppercase tracking-widest opacity-80">Total Balance</h2>
                  <p className="text-4xl font-extrabold mt-2">
                    ${wallet ? wallet.currentBalance.toFixed(2) : "0.00"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white text-indigo-700 font-semibold px-7 py-3 rounded-lg shadow-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                >
                  Withdraw Funds
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm uppercase opacity-80">Total Earnings</p>
                  <p className="text-2xl font-bold mt-1">
                    ${wallet ? wallet.totalEarnings.toFixed(2) : "0.00"}
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase opacity-80">Pending Earnings</p>
                  <p className="text-2xl font-bold mt-1">
                    ${wallet ? wallet.pendingEarnings.toFixed(2) : "0.00"}
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase opacity-80">Withdrawn Amount</p>
                  <p className="text-2xl font-bold mt-1">
                    ${wallet ? wallet.withdrawnAmount.toFixed(2) : "0.00"}
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            {/* <section className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900 border-b border-gray-200 pb-3">
                Recent Transactions
              </h3>
              <ul className="divide-y divide-gray-200">
                {transactions.map((txn) => (
                  <li
                    key={txn._id}
                    className="flex items-center justify-between py-4 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-full ${
                          txn.type === "credit"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {txn.type === "credit" ? <FaArrowDown size={16} /> : <FaArrowUp size={16} />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{txn.description}</p>
                        <p className="text-sm text-gray-500">{formatDate(txn.createdAt)}</p>
                      </div>
                    </div>
                    <div
                      className={`text-lg font-semibold ${
                        txn.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {txn.type === "credit" ? "+" : "-"}${txn.amount.toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            </section> */}
            <section className="bg-white rounded-xl shadow p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                Recent Transactions
              </h3>
              <ul className="divide-y divide-gray-200">
                {transactions.map((txn) => (
                  <li
                    key={txn._id}
                    className="flex items-center justify-between py-3 hover:bg-indigo-50 rounded-md transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          txn.type === "credit"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {txn.type === "credit" ? <FaArrowDown size={14} /> : <FaArrowUp size={14} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{txn.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(txn.createdAt)}</p>
                      </div>
                    </div>
                    <div
                      className={`text-base font-semibold ${
                        txn.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {txn.type === "credit" ? "+" : "-"}${txn.amount.toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <Stack spacing={2} alignItems="center" className="mt-4">
              <Pagination
                count={pagination.pages}
                page={pagination.page}
                onChange={(_e, value) => handlePageChange(value)}
                color="primary"
              />
            </Stack>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: "transparent",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            border: "none",
            background: "none",
            padding: 0,
          },
        }}
      >
        <WithdrawForm
          onClose={() => setIsModalOpen(false)}
          onSuccess={loadWallet}
        />
      </Modal>
      <Footer />
    </div>
  );
};

export default Wallet;
