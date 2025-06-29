 
import { useEffect, useState } from 'react';
import { Search, Filter, ChevronDown} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useFetchContracts } from '../../../hooks/customhooks/useFetchContracts';
import { approveContract, fetchSubmittedReviews, submitReview } from '../../../api';
import ClientNavbar from '../shared/Navbar';
import { clientNavItems } from '../shared/NavbarItems';
import { handleApiError } from '../../../utils/errors/errorHandler';
import { useDebounce } from '../../../hooks/customhooks/useDebounce';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import ReviewModal from '../../shared/Rating';
import { usePagination } from '../../../hooks/customhooks/usePagination';
import Footer from '../../shared/Footer';
import { IReview } from '../../../types/review';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import ChatButton from '../../freelancer/shared/ChatButton';

const Contracts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  // const [timeFilter, setTimeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('contracts');
  const [isOpen, setIsOpen] = useState(false);
  const [reviews,setReviews] = useState<IReview[]>([])
  const { pagination, handlePageChange, updateMeta } = usePagination({
    total: 0,
    page: 1,
    pages: 1, 
    limit: 5,
  });

  const debouncedSearchTerm = useDebounce(searchQuery,500)

  const user = useSelector((state: RootState) => state.auth.user);
  const { contracts, loading, error, meta, refetch } = useFetchContracts(pagination.page, pagination.limit ,debouncedSearchTerm, statusFilter);
  
  useEffect(() => {
    updateMeta(meta.total, meta.pages);
  }, [meta, updateMeta]);

  const handleContractWorkApprove = async(contractId:string,stripePaymentIntentId:string,transactionId:string) => {
    try{
    const message  = await approveContract(contractId,stripePaymentIntentId,transactionId)
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
    } catch (error) {
      toast.error(handleApiError(error));
    }
  }

  useEffect(() => {
    getreviews()
  },[])

  const getreviews = async() => {
    const reviews = await fetchSubmittedReviews()
    setReviews(reviews)
  }

  if (loading) return <p>Loading contracts...</p>;
  if (error) return <p>Error loading contracts: {error.message}</p>;

  return (
  <div className="min-h-screen bg-white text-[#0A142F]">
    <ClientNavbar activeTab={activeTab} setActiveTab={setActiveTab} navItems={clientNavItems} />
    <Toaster position="top-center" reverseOrder={false} />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Contracts Management</h1>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search contracts..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative w-full md:w-auto">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-8 py-2 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="submitted">Submitted</option>
              <option value="completed">Completed</option>
            </select>
            <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <ChevronDown className="absolute right-2 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {contracts.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Contract</th>
                  <th className="px-4 py-3">Freelancer</th>
                  <th className="px-4 py-3">Start Date</th>
                  <th className="px-4 py-3">End Date</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                  <th className="px-4 py-3">Chat</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contracts.map((contract) => (
                  <tr key={contract._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">{contract.job.title}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{contract.freelancer.fullName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(contract.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {contract.completedAt ? new Date(contract.completedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{contract.amount}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
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
                        {contract.contractStatus.charAt(0).toUpperCase() + contract.contractStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {contract.contractStatus === 'submitted' ? (
                        <button
                          onClick={() =>
                            handleContractWorkApprove(
                              contract._id,
                              contract.stripePaymentIntentId,
                              contract.transactionId
                            )
                          }
                          className="bg-green-600 text-white text-xs px-3 py-1 rounded-md hover:bg-green-700 shadow-sm transition"
                        >
                          Approve
                        </button>
                      ) : contract.contractStatus === 'active' ? (
                        <span className="inline-block text-xs px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-md animate-pulse">
                          Waiting for submission
                        </span>
                      ) : (
                        <>
                          {reviews.some(
                            (review) =>
                              review.reviewerId === user?._id &&
                              review.reviewedUserId === contract.freelancer._id &&
                              review.contractId === contract._id
                          ) ? (
                            <span className="text-xs text-green-600 font-medium">Review Submitted</span>
                          ) : (
                            <>
                              <button
                                onClick={() => setIsOpen(true)}
                                className="text-xs px-3 py-1 rounded-md bg-gradient-to-r from-green-400 to-emerald-600 text-white shadow-sm transition"
                              >
                                Leave a review
                              </button>

                              <ReviewModal
                                open={isOpen}
                                onClose={() => setIsOpen(false)}
                                onSubmit={(reviewData) =>
                                  handleReviewSubmit(contract.freelancer._id, reviewData, contract._id)
                                }
                              />
                            </>
                          )}
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {user?._id && (
                        <button>
                          <ChatButton senderId={user._id} receiverId={contract.freelancer._id} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">No contracts found matching your criteria.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Stack spacing={2} alignItems="center">
          <Pagination
            count={pagination.pages}
            page={pagination.page}
            onChange={(_e, page) => handlePageChange(page)}
            color="primary"
          />
        </Stack>
      </div>
    </div>

    <Footer />
  </div>
);

};

export default Contracts;