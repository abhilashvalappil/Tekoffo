
import { useEffect, useState } from 'react';
import { Search, Calendar, Filter, ChevronDown } from 'lucide-react';
import { useFetchContracts } from '../../../hooks/customhooks/useFetchContracts';
import { fetchSubmittedReviews, submitContract, submitReview } from '../../../api';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../shared/Navbar';
import { navItems } from '../shared/NavbarItems';
import { handleApiError } from '../../../utils/errors/errorHandler';
import { useDebounce } from '../../../hooks/customhooks/useDebounce';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import ReviewModal from '../../shared/Rating';
import { usePagination } from '../../../hooks/customhooks/usePagination';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import ChatButton from '../shared/ChatButton';
import Footer from '../../shared/Footer';
import { useAuth } from '../../../hooks/customhooks/useAuth';
import { IReview } from '../../../types/review';
import { contractResponse } from '../../../types/paymentTypes';

const Contracts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('contracts');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
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
  const { handleLogout } = useAuth();
  const debouncedSearchTerm = useDebounce(searchQuery,500)
  const { contracts, loading, error, meta, refetch } = useFetchContracts(pagination.page, pagination.limit, debouncedSearchTerm, statusFilter);
  console.log('checking fetch #### ====== !!!!!!@@@@@@', contracts)

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
      // Refetch reviews after successful submission
      await getreviews()
      setIsOpen(false) // Close the modal after successful submission
      setSelectedContract(null) // Clear selected contract
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
        console.log('console from contracts.tsx getreviewss ====>>>',reviews)
        setReviews(reviews)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      }
    }

  if (loading) return <p>Loading contracts...</p>;
  if (error) return <p>Error loading contracts: {error.message}</p>;

  return (
    <div className="min-h-screen bg-white text-[#0A142F]">
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
      <Toaster position="top-center" reverseOrder={false}/>
      <div className="container mx-auto px-30 py-20">
        <h1 className="text-3xl font-bold mb-8">Contracts Management</h1>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative w-full md:w-64">
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
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <ChevronDown className="absolute right-2 top-2.5 text-gray-400" size={18} />
            </div>
          </div>
        </div>

        {/* Contracts List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {contracts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">chat</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contracts.map((contract) => (
                    <tr key={contract._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{contract.jobId.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{contract.clientId.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(contract.startedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {contract.completedAt ? new Date(contract.completedAt).toLocaleDateString() : 'N/A'}
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
                          {contract.contractStatus.charAt(0).toUpperCase() + contract.contractStatus.slice(1)}
                        </span>
                      </td>
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
                                review.reviewedUserId === contract.clientId._id &&
                                review.contractId === contract._id
                            ) ? (
                              <span className="text-xs text-green-600 font-medium">Review Submitted</span>
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
                      <td>
                        {user?._id && (
                          <button>
                            <ChatButton senderId={user._id} receiverId={contract.clientId._id} />
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
        <Stack spacing={2} alignItems="center" className="mt-4">
          <Pagination
            count={pagination.pages}
            page={pagination.page}
            onChange={(_e, value) => handlePageChange(value)}
            color="primary"
          />
        </Stack>
      </div>
      <Footer />
      
      {/* ReviewModal outside the table */}
      <ReviewModal
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedContract(null);
        }}
        onSubmit={(reviewData) =>
          selectedContract && handleReviewSubmit(
            selectedContract.clientId._id, 
            reviewData, 
            selectedContract._id
          )
        }
      />
    </div>
  );
};

export default Contracts;