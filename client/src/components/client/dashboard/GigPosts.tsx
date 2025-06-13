import { useEffect, useState } from 'react';
import { Briefcase, ChevronRight, DollarSign, Clock, Repeat, User, Search } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import ClientNavbar from '../shared/Navbar';
import Footer from '../../shared/Footer';
import { clientNavItems } from '../shared/NavbarItems';
import { fetchFreelancersGigs, fetchJobs, fetchReviews, inviteFreelancerToJob } from '../../../api';
import { FreelancerGigListDTO } from '../../../types/gigTypes';
import ReviewsModal from '../../shared/ReviewsModal';
import InviteToJobModal from './InviteJobModal';
import Rating from '@mui/material/Rating';
import { handleApiError } from '../../../utils/errors/errorHandler';
import { IFrontendPopulatedReview } from '../../../types/review';
import { Job } from '../../../types/userTypes';
import { usePagination } from '../../../hooks/customhooks/usePagination';
import { useDebounce } from '../../../hooks/customhooks/useDebounce';



const FreelancerGigs = () => {
  const [gigs, setGigs] = useState<FreelancerGigListDTO[]>([]);
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('gigs');
  const [showReviews, setShowReviews] = useState<boolean>(false);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [selectedFreelancerId, setSelectedFreelancerId] = useState<string | null>(null);
  const [selectedFreelancerName, setSelectedFreelancerName] = useState<string | null>(null);
  const [reviews, setReviews] = useState<IFrontendPopulatedReview[]>([]);
  const {
      pagination,
      handlePageChange,
      updateMeta,
    } = usePagination({ total: 0, page: 1, pages: 1, limit: 3 });

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const loadGigs = async() => {
      const response = await fetchFreelancersGigs(pagination.page, pagination.limit, debouncedSearchTerm)
      setGigs(response.data)
      updateMeta(response.meta.total,  response.meta.pages);
    }
    loadGigs()
  },[pagination.page, pagination.limit, debouncedSearchTerm, updateMeta])

  useEffect(() => {
    const loadJobs = async() => {
      const response = await fetchJobs()
      setJobs(response.data)
    }
    loadJobs()
  },[])

  const handleInvite = (freelancerId:string, freelancerName: string) => {
    setSelectedFreelancerId(freelancerId);
    setSelectedFreelancerName(freelancerName);
  };

    const handleSendInvite = async(jobId:string,freelancerId:string) => {
      try {
        const message = await inviteFreelancerToJob(jobId,freelancerId)
        toast.success(message)
      } catch (error) {
        toast.error(handleApiError(error))
      }
  }

  const handleViewReviews = async(freelancerId:string) => {
    console.log('console from handleviewReviewssssss',freelancerId)
    const reviews = await fetchReviews(freelancerId)
    setReviews(reviews)
    setShowReviews(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#0A142F]">
      <Toaster position="top-center" reverseOrder={false} />
      <ClientNavbar navItems={clientNavItems} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="pt-16 p-4 md:p-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0A142F] mb-8">Freelancer Gigs</h1>
          <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search freelancer gigs by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A142F]/20"
              />
            </div>
          <div className="grid gap-6 py-8">
            {gigs.length === 0 ? (
              <div className="text-center py-8 text-[#0A142F]/70">No gigs found</div>
            ) : (
              gigs.map((gig) => (
                <div
                  key={gig._id}
                  className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={gig.freelancer.profilePicture}
                        alt="Freelancer"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h2 className="text-lg md:text-xl font-semibold text-[#0A142F] mb-2">{gig.title}</h2>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#0A142F]/70 mb-3">
                          <div className="flex items-center gap-1">
                            <User size={16} />
                            <span>{gig.freelancer.fullName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase size={16} />
                            <span>{gig.category}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Rating
                              name="read-only-rating"
                              value={gig.averageRating}
                              precision={0.5}
                              size="medium"
                              readOnly
                            />
                            <span>{gig.averageRating.toFixed(1)} ({gig.totalReviews} reviews)</span>
                          </div>
                          <button
                          onClick={() => {
                                setShowReviews(true);
                                handleViewReviews(gig.freelancer._id);
                              }}
                            // onClick={() => handleViewReviews(gig.freelancerId._id)}
                            className="text-[#0A142F]/70 hover:text-[#0A142F] underline text-sm transition-colors"
                          >
                            View Ratings & Reviews
                          </button>
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className="text-[#0A142F]/40 group-hover:text-[#0A142F] transition-colors"
                      size={24}
                    />
                  </div>
                  <p className="text-[#0A142F]/70 mb-4 line-clamp-2">{gig.description}</p>
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-[#0A142F] mb-2">Skills:</h3>
                    <div className="flex flex-wrap gap-2">
                      {gig.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-50 rounded-full text-sm text-[#0A142F]/70"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-[#0A142F] mb-2">Requirements:</h3>
                    {gig.requirements.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-sm text-[#0A142F]/70">
                        {gig.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[#0A142F]/70 text-sm">No requirements listed</p>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between pt-4 border-t border-gray-100 gap-4 md:gap-0">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-[#0A142F]">
                        <DollarSign size={20} />
                        <span className="font-semibold">${gig.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#0A142F]">
                        <Repeat size={20} />
                        <span>{gig.revisions} Revisions</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#0A142F]">
                        <Clock size={20} />
                        <span>{gig.deliveryTime}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowInviteModal(true);
                        handleInvite(gig.freelancer._id, gig.freelancer.fullName)
                      }}
                      className="w-full md:w-auto px-4 py-2 bg-[#0A142F] text-white hover:bg-[#0A142F]/90 rounded-lg transition-colors"
                    >
                      Invite to Job
                    </button>
                  </div>
                </div>
              ))
            )}
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
       <ReviewsModal 
        isOpen={showReviews}
        onClose={() => setShowReviews(false)}
        reviews={reviews}
      />
      <InviteToJobModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        freelancerName={selectedFreelancerName || ''}
        freelancerId={selectedFreelancerId || ''}
        onSendInvite={handleSendInvite}
        jobs={jobs}
      />
      <Footer />
    </div>
  );
};

export default FreelancerGigs;