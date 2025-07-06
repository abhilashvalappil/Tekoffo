
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { acceptInvitation, fetchAndUpdateProposalToReject, fetchClientProfile, fetchJobData, fetchJobInvitations, fetchReviews, SortOption } from '../../../../api';
import { JobInvitationView } from '../../../../types/proposalTypes';
import JobDetailsModal from './JobDetailsModal';
import { JobCard } from './JobCard';
import { JobDataType } from '../../../../types/invitationTypes';
import UserProfileModal from './UserProfileModal';
import ReviewsModal from '../../../shared/ReviewsModal'
import { UserProfileResponse } from '../../../../types/userTypes';
import { IFrontendPopulatedReview } from '../../../../types/review';
import { usePagination } from '../../../../hooks/customhooks/usePagination';
import { useDebounce } from '../../../../hooks/customhooks/useDebounce';
import { handleApiError } from '../../../../utils/errors/errorHandler';


export default function JobInvitationsPage() {
  const [invitations, setInvitations] = useState<JobInvitationView[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<JobDataType | null>(null);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfileResponse>()
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState<boolean>(false);
  const [clientReviews, setClientReviews] = useState<IFrontendPopulatedReview[]>([]);
  const { pagination, handlePageChange, updateMeta } = usePagination({
      total: 0,
      page: 1,
      pages: 1,
      limit: 5,
    });

  const debouncedSearchTerm = useDebounce(searchQuery,500)

  useEffect(() => {
    const loadJobInvitations = async () => {
      const response = await fetchJobInvitations(pagination.page, pagination.limit, debouncedSearchTerm,sortOption);
      setInvitations(response.data);
      updateMeta(response.meta.total, response.meta.pages);
    };
    loadJobInvitations();
  }, [pagination.page, pagination.limit,updateMeta,debouncedSearchTerm,sortOption]);

  const handleAccept = async(id: string) => {
    try{
      setInvitations(invitations.map(invite => 
        invite._id === id ? { ...invite, status: 'accepted' } : invite
      ));
      const message = await acceptInvitation(id)
      toast.success(message)
    }catch(error){
      handleApiError(error)
    }
  };

  const handleReject = async(id: string) => {
    setInvitations(invitations.map(invite => 
      invite._id === id ? { ...invite, status: 'rejected' } : invite
    ));
    const message = await fetchAndUpdateProposalToReject(id)
    toast.success(message)
  };

  const handleViewProfile = async(clientId: string) => {
    const data = await fetchClientProfile(clientId)
    setUserProfile(data)
    setIsUserProfileModalOpen(true);
  };

  const handleCloseUserProfileModal = () => {
    setIsUserProfileModalOpen(false);
  };

  const handleViewReviews = async(clientId: string) => {
    try {
      const reviews = await fetchReviews(clientId);
      setClientReviews(reviews);
      setIsReviewsModalOpen(true);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    }
  };

  const handleCloseReviewsModal = () => {
    setIsReviewsModalOpen(false);
    setClientReviews([]);
  };

  const handleViewDetails = async(id: string) => {
    const jobData = await fetchJobData(id)
    setSelectedJob(jobData)
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  return (
    
    // <div className="min-h-screen ml-38 bg-gray-50 text-gray-900">
    <div className="min-h-screen bg-gray-50 text-gray-900 ml-0 md:ml-64">
      {/* <div className="container mx-auto px-28 py-20"> */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Toaster position="top-center" />

        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0A142F]">
            Job Invitations
          </h1>
        </div>
        
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search invitations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
              <Filter size={16} className="mr-2" /> Filter
            </button>
            <select 
             value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="budget-high">Budget: High to low</option>
              <option value="budget-low">Budget: Low to high</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          {invitations.map((invitation) => (
            <JobCard 
              key={invitation._id} 
              invitation={invitation} 
              onAccept={handleAccept} 
              onReject={handleReject}
              onViewProfile={handleViewProfile}
              onViewDetails={handleViewDetails}
              onViewReviews={handleViewReviews} 
            />
          ))}
        </div>
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing 1-{invitations.length} of {invitations.length} invitations
          </p>
          <div className="flex space-x-2">
            <button className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <Stack spacing={2} alignItems="center" className="mt-4">
          <Pagination
            count={pagination.pages}
            page={pagination.page}
            onChange={(_, value) => handlePageChange(value)}
            color="primary"
          />
        </Stack>
      </div>
      
      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          jobData={selectedJob}
        />
      )}
      
      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        onClose={handleCloseUserProfileModal}
        userProfile={userProfile || null}
      />

      {/* Reviews Modal */}
      <ReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={handleCloseReviewsModal}
        reviews={clientReviews}
      />
    </div>
  );
}