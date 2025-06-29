
import React, { useEffect, useState } from 'react';
import { Wallet, ShieldCheck, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchEscrowFunds, fetchPlatformRevenue } from '../../api';
import { fetchAllTransactions } from '../../api/admin';
import { TransactionWithUsername } from '../../types/transaction';

const PaymentAnalysis = () => {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [EscrowTotal, setEscrowTotal] = useState(0);
    const [transactions, setTransactions] = useState<TransactionWithUsername[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const platformRevenu = async () => {
          const totalRevenue = await fetchPlatformRevenue()
          setTotalRevenue(totalRevenue)
        }
        platformRevenu()
      }, [])

    useEffect(() => {
        const FundsInEscrow = async () => {
          const totalFundsinEscrow = await fetchEscrowFunds()
          setEscrowTotal(totalFundsinEscrow)
        }
        FundsInEscrow()
      }, [])

    useEffect(() => {
        const loadTransactions = async () => {
          try {
            setLoading(true);
            const transactionsData = await fetchAllTransactions();
            setTransactions(transactionsData);
          } catch (error) {
            console.error('Error loading transactions:', error);
          } finally {
            setLoading(false);
          }
        }
        loadTransactions()
      }, [])

    // Calculate total transactions amount
    const totalTransactionsAmount = transactions.reduce((sum, txn) => sum + txn.amount, 0);

    // Format date for display
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    // Get status display for transaction type
    const getStatusDisplay = (type: 'credit' | 'debit') => {
      return type === 'credit' ? 'Credit' : 'Debit';
    };

    // Get status styling
    const getStatusStyling = (type: 'credit' | 'debit') => {
      return type === 'credit' 
        ? 'bg-green-100 text-green-700' 
        : 'bg-red-100 text-red-700';
    };

    // Pagination logic
    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTransactions = transactions.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
      setCurrentPage(page);
    };

    const goToPrevious = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

    const goToNext = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

  return (
    <div className="min-h-screen bg-gray-300">
      <div className="fixed top-0 w-full z-50 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Payment Analytics</h1>
          </div>
        </div>
      </div>
      <div className="pt-25 ml-8 mr-10">
      {/* Cards Section */}
      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Platform Earnings */}
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Platform Earnings</p>
            <h2 className="text-2xl font-semibold text-green-600">${totalRevenue.toLocaleString()}</h2>
          </div>
          <Wallet className="w-10 h-10 text-green-500" />
        </div>

        {/* Funds in Escrow */}
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Funds in Escrow</p>
            <h2 className="text-2xl font-semibold text-yellow-600">${EscrowTotal.toLocaleString()}</h2>
          </div>
          <ShieldCheck className="w-10 h-10 text-yellow-500" />
        </div>

        {/* Total Transactions */}
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Transactions</p>
            <h2 className="text-2xl font-semibold text-blue-600">${totalTransactionsAmount.toLocaleString()}</h2>
          </div>
          <CreditCard className="w-10 h-10 text-blue-500" />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">All Transactions</h2>
          {transactions.length > 0 && (
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1}-{Math.min(endIndex, transactions.length)} of {transactions.length} transactions
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">Loading transactions...</div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">No transactions found</div>
            </div>
          ) : (
            <>
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTransactions.map((txn, index) => (
                    <tr key={`${txn._id}-${index}`} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{txn.username}</td>
                      <td className="py-3 px-4 font-semibold">${txn.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyling(txn.type)}`}
                        >
                          {getStatusDisplay(txn.type)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{txn.description}</td>
                      <td className="py-3 px-4">{formatDate(txn.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={goToPrevious}
                      disabled={currentPage === 1}
                      className={`flex items-center px-3 py-2 text-sm rounded-md ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                          {page === '...' ? (
                            <span className="px-3 py-2 text-gray-400">...</span>
                          ) : (
                            <button
                              onClick={() => goToPage(page as number)}
                              className={`px-3 py-2 text-sm rounded-md ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={goToNext}
                      disabled={currentPage === totalPages}
                      className={`flex items-center px-3 py-2 text-sm rounded-md ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default PaymentAnalysis;