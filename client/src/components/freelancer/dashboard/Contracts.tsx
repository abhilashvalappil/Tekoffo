
import { useEffect, useState } from 'react';
import { useFetchContracts } from '../../../hooks/customhooks/useFetchContracts';
import { fetchSubmittedReviews, submitContract, submitReview } from '../../../api';
import toast, { Toaster } from 'react-hot-toast';
import { handleApiError } from '../../../utils/errors/errorHandler';
import { useDebounce } from '../../../hooks/customhooks/useDebounce';
import ReviewModal from '../../common/Rating';
import { usePagination } from '../../../hooks/customhooks/usePagination';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import ChatButton from '../shared/ChatButton';
import { IReview } from '../../../types/review';
import { contractResponse } from '../../../types/paymentTypes';
import DataTable from '../../common/DataTable';

const Contracts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<contractResponse | null>(null);
  const [reviews,setReviews] = useState<IReview[]>([])
  const { pagination, handlePageChange, updateMeta } = usePagination({
    total: 0,
    page: 1,
    pages: 1,
    limit: 6,
  });

  const user = useSelector((state: RootState) => state.auth.user);
  const debouncedSearchTerm = useDebounce(searchQuery,500)
  const { contracts, loading, error, meta, refetch } = useFetchContracts(pagination.page, pagination.limit, debouncedSearchTerm, statusFilter);

  useEffect(() => {
    updateMeta(meta.total, meta.pages);
  }, [meta, updateMeta]);

  const handleApplyForApproval = async(contractId:string) => {
    try{
    const message  = await submitContract(contractId)
    toast.success(message)
    refetch();
    }catch(error){
      toast.error(handleApiError(error));
    }
  }

  const handleReviewSubmit = async(reviewedUserId:string, reviewData:{ rating: number; review: string },contractId:string) => {
    try {
      const message = await submitReview(reviewedUserId,reviewData,contractId)   
      toast.success(message)
      await getreviews()
      setIsOpen(false)  
      setSelectedContract(null) 
    } catch (error) {
      toast.error(handleApiError(error));
    }
  }

  useEffect(() => {
      getreviews()
    },[])
  
    const getreviews = async() => {
      try {
        const reviews = await fetchSubmittedReviews()
        setReviews(reviews)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      }
    }

  if (loading) return <p>Loading contracts...</p>;
  if (error) return <p>Error loading contracts: {error.message}</p>;

  return (
      <>
      <Toaster position="top-center" reverseOrder={false} />

      <DataTable
        title="Contracts Management"
        searchPlaceholder="Search contracts..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={[
          { value: 'all', label: 'All Status' },
          { value: 'active', label: 'Active' },
          { value: 'submitted', label: 'Submitted' },
          { value: 'completed', label: 'Completed' },
        ]}
        columns={[
          { key: 'contract', label: 'Contract' },
          { key: 'client', label: 'Client' },
          { key: 'startDate', label: 'Start Date' },
          { key: 'value', label: 'Value' },
          { key: 'status', label: 'Status' },
          { key: 'actions', label: 'Actions' },
          { key: 'chat', label: 'Chat' },
        ]}
        data={contracts}
        renderRow={(contract) => (
          <tr key={contract._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              {contract.job.title}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">{contract.client.fullName}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {new Date(contract.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">{contract.amount}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  contract.contractStatus === 'submitted'
                    ? 'bg-yellow-100 text-yellow-800'
                    : contract.contractStatus === 'active'
                    ? 'bg-green-100 text-green-800'
                    : contract.contractStatus === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {contract.contractStatus.charAt(0).toUpperCase() +
                  contract.contractStatus.slice(1)}
              </span>
            </td>

            {/* Actions */}
            <td className="px-6 py-4 whitespace-nowrap">
              {contract.contractStatus === 'active' ? (
                <button
                  onClick={() => handleApplyForApproval(contract._id)}
                  className="bg-blue-900 text-white text-xs px-3 py-1 rounded-md hover:bg-blue-800 shadow-sm transition"
                >
                  Apply for Approval
                </button>
              ) : contract.contractStatus === 'submitted' ? (
                <span className="inline-block text-xs px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-md animate-pulse">
                  Waiting for Approval
                </span>
              ) : (
                <>
                  {reviews.some(
                    (review) =>
                      review.reviewerId === user?._id &&
                      review.reviewedUserId === contract.client._id &&
                      review.contractId === contract._id
                  ) ? (
                    <span className="text-xs text-green-600 font-medium">
                      Review Submitted
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedContract(contract);
                        setIsOpen(true);
                      }}
                      className="text-xs px-3 py-1 rounded-md bg-gradient-to-r from-green-400 to-emerald-600 text-white shadow-sm transition"
                    >
                      Leave a review
                    </button>
                  )}
                </>
              )}
            </td>

            {/* Chat */}
            <td className="px-6 py-4 whitespace-nowrap">
              {user?._id && (
                <ChatButton senderId={user._id} receiverId={contract.client._id} />
              )}
            </td>
          </tr>
        )}
        pagination={pagination}
        handlePageChange={handlePageChange}
        error={error?.message}
        emptyMessage="No contracts found matching your criteria."
      />
      <ReviewModal
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedContract(null);
        }}
        onSubmit={(reviewData) =>
          selectedContract && handleReviewSubmit(
            selectedContract.client._id, 
            reviewData, 
            selectedContract._id
          )
        }
      />
    </>
  );
};

export default Contracts;