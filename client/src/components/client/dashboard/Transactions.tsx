import React, { useEffect, useState } from "react";
import { TransactionResult } from "../../../types/transaction";  
import { fetchPayments } from "../../../api";
import { usePagination } from "../../../hooks/customhooks/usePagination";
import { useDebounce } from "../../../hooks/customhooks/useDebounce";
import { Pagination, Stack } from "@mui/material";
 

const statusColors: Record<string, string> = {
  authorized: "bg-yellow-100 text-yellow-700",
  released: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  inEscrow: "bg-blue-100 text-blue-700",
};

const ClientTransactions: React.FC = () => {
  const [search, setSearch] = useState("");
  const [transactions,setTransactions] = useState<TransactionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { pagination, handlePageChange, updateMeta } = usePagination({
    total: 0,
    page: 1,
    pages: 1,
    limit: 5,
  });

  const debouncedSearch = useDebounce(search, 500);

   useEffect(() => {
    const getTransactions = async () => {
      try {
        setLoading(true);
        const response = await fetchPayments(
          pagination.page,
          pagination.limit,
          debouncedSearch
        );
        setTransactions(response.data);
        updateMeta(response.meta.total,  response.meta.pages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getTransactions();
  }, [pagination.page, pagination.limit, debouncedSearch, updateMeta]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10 pt-20 sm:pt-24 lg:pt-28">
  <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 px-4 sm:px-6 lg:px-8 lg:ml-64">
    <h1 className="text-2xl font-semibold text-gray-800 mb-6">
     Transaction Management
    </h1>
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by project or freelancer..."
            className="w-full sm:w-1/2 px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                {/* <th className="p-3 text-sm font-medium">Transaction ID</th> */}
                <th className="p-3 text-sm font-medium">Date</th>
                <th className="p-3 text-sm font-medium">Project</th>
                <th className="p-3 text-sm font-medium">Freelancer</th>
                <th className="p-3 text-sm font-medium">Amount ($)</th>
                <th className="p-3 text-sm font-medium">Status</th>
                {/* <th className="p-3 text-sm font-medium text-right">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-gray-500 text-sm"
                >
                    Loading transactions...
                </td>
            </tr>
            ) :transactions.length > 0 ? (
                transactions.map((txn) => (
                  <tr
                    key={txn.transactionId}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {/* <td className="p-3 text-sm text-gray-800">{txn.transactionId}</td> */}
                    <td className="p-3 text-sm text-gray-600"> {new Date(txn.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-sm font-medium text-gray-900">
                      {txn.jobTitle}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {txn.freelancerName}
                    </td>
                    <td className="p-3 text-sm text-gray-900 font-semibold">
                      ${txn.amount.toFixed(2)}
                    </td>
                    <td className="p-3 text-sm">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${statusColors[txn.status]}`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    {/* <td className="p-3 text-sm text-right">
                      <button className="text-indigo-600 hover:underline mr-3">
                        View
                      </button>
                      <button className="text-gray-600 hover:text-red-600">
                        Refund
                      </button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Stack spacing={2} alignItems="center" className="mt-4">
            <Pagination
              count={pagination.pages}
              page={pagination.page}
              onChange={(_, value) => handlePageChange(value)}
              color="primary"
            />
          </Stack>

        {/* Summary */}
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-3">
          <p className="text-gray-600 text-sm">
            Showing { transactions.length} of {transactions.length} transactions
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientTransactions;
