
import React, { useState, useEffect } from 'react';
import {Clock,Briefcase,Tags,DollarSign,Calendar,ChevronRight,Filter,Search,X,Building2,MapPin,User,} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/customhooks/useAuth';
import { RootState } from '../../../redux/store';
import { JobDataType, useJobs } from '../../../hooks/customhooks/useJobs';
import Navbar from '../shared/Navbar';
import { navItems } from '../shared/NavbarItems';
import JobDetailsModal from './JobApply';
import { userENDPOINTS } from '../../../constants/endpointUrl';
import { useClient } from '../../../hooks/customhooks/useClients';
import ClientProfileModal from '../profile/ClientProfileModal';
import { checkStripeAccount, fetchListedCategories } from '../../../api';
import { usePagination } from '../../../hooks/customhooks/usePagination';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Footer from '../../shared/Footer';
import { Toaster, toast } from 'react-hot-toast';
import { fetchAppliedProposalsByFreelancer } from '../../../api';
import { AppliedProposal } from '../../../types/proposalTypes';
import { useDebounce } from '../../../hooks/customhooks/useDebounce';
import { Category } from '../../../types/jobTypes';

interface Client {
  id: string;
  fullName: string;
  profilePicture?: string;
  companyName?: string;
  country: string;
  avatarUrl?: string;
  description: string;
  email: string;
}

//* Interface for budget range filter
interface BudgetRange {
  min: string;
  max: string;
}

export interface JobFilters {
  category?: string;
  subCategory?: string;
  budgetRange?: string;
}
 
const AvailableJobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [budgetRange, setBudgetRange] = useState<BudgetRange>({ min: '', max: '' });
  const [activeTab, setActiveTab] = useState<string>('jobs');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<JobDataType | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  // const [appliedProposals, setAppliedProposals] = useState<{ data: Proposal[] }>({ data: [] });
  const [appliedProposals, setAppliedProposals] = useState<{ data: AppliedProposal[] }>({ data: [] });
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<JobFilters>({});
  
  const { pagination, handlePageChange, updateMeta } = usePagination({
    total: 0,
    page: 1,
    pages: 1,
    limit: 4,
  });

  const { handleLogout } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const debouncedSearchTerm = useDebounce(searchTerm,500)

  //* Fetch jobs and client customhooks
  const { jobs, loading, error, meta } = useJobs(userENDPOINTS.GET_POSTED_JOBS, pagination.page, pagination.limit, debouncedSearchTerm, filters);
  const {client,fetchClient} = useClient()
  
  useEffect(() => {
    updateMeta(meta.total, meta.pages);
  }, [meta, updateMeta]);

  useEffect(() => {
    const loadProposals = async() => {
      const appliedJobs = await fetchAppliedProposalsByFreelancer();
      console.log('console from available jobs =======',appliedJobs.data)
      setAppliedProposals(appliedJobs)
      const jobIds = appliedJobs.data.map((proposal) => proposal.jobId);
      setAppliedJobIds(jobIds)
    }
    loadProposals()

  },[])

  const hasApplied = (jobId: string) => {
    return appliedProposals.data.some((proposal) => proposal.jobId === jobId);
  };

   useEffect(() => {
    const newFilters: typeof filters = {};
    if (selectedCategory) newFilters.category = selectedCategory;
    if (selectedSubcategory) newFilters.subCategory = selectedSubcategory;
  
  if (budgetRange.min && budgetRange.max) {
  const min = Math.min(Number(budgetRange.min), Number(budgetRange.max));
  const max = Math.max(Number(budgetRange.min), Number(budgetRange.max));
  newFilters.budgetRange = `${min}-${max}`;
}
    setFilters(newFilters);
  }, [selectedCategory, selectedSubcategory, budgetRange]);

   const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchListedCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    useEffect(() => {
      loadCategories()
    },[])
 
  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setBudgetRange({ min: '', max: '' });
    setFilters({})
  };

  const handleView = async (job: JobDataType) => {
    try {
      const clientData = await fetchClient(job.clientId._id);  
      setSelectedClient(clientData);  
      setIsClientModalOpen(true); 
    } catch (error) {
      console.error('Failed to fetch client:', error);
      
    }
  };

   
  const handleApplyNow = async(e: React.MouseEvent<HTMLButtonElement>,job: JobDataType) => {
    console.log('console from availablejobss.tsx',job)
    e.preventDefault()

    const hasStripeAccount = await checkStripeAccount();
    if(!hasStripeAccount){
      navigate('/freelancer/complete-onboarding');
      return;
    }

    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleSubmitSuccess = (message: string) => {
    toast.success(message, { duration: 3000 });
  };
   

  // Loading and error states
  if (loading) {
    return <p className="text-center py-8 text-[#0A142F]">Loading jobs...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-red-500">Error: {error}</p>;
  }

  return (
    <div className="min-h-screen bg-white text-[#0A142F]">
       <Toaster position="top-center" reverseOrder={false} />
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

      {/* Main Content */}
      <main className="pt-20 p-4 md:p-8 lg:p-20 bg-[#F8FAFC] z-10 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-[#0A142F]">
                Available Jobs
              </h1>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <Filter size={20} className="text-[#0A142F]" />
                <span className="text-[#0A142F]">Filter Jobs</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search jobs by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A142F]/20"
              />
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-[#0A142F]">Filters</h2>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-[#0A142F]/70 hover:text-[#0A142F] flex items-center gap-1"
                  >
                    <X size={16} />
                    Reset
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#0A142F]">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A142F]/20"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#0A142F]">
                      Subcategory
                    </label>
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A142F]/20"
                    >
                      <option value="">All Subcategories</option>
                      {categories.flatMap((category) =>
                        category.subCategories.map((subcategory) => (
                          <option key={`${category._id}-${subcategory}`} value={subcategory}>
                            {subcategory}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#0A142F]">
                      Budget Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={budgetRange.min}
                        onChange={(e) =>
                          setBudgetRange((prev) => ({ ...prev, min: e.target.value }))
                        }
                        className="w-1/2 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A142F]/20"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={budgetRange.max}
                        onChange={(e) =>
                          setBudgetRange((prev) => ({ ...prev, max: e.target.value }))
                        }
                        className="w-1/2 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A142F]/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Jobs Grid */}
          <div className="grid gap-6">
            {jobs && jobs.length === 0 ? (
              <div className="text-center py-8 text-[#0A142F]/70">
                No jobs found matching your criteria
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg md:text-xl font-semibold text-[#0A142F] mb-2">
                        {job.title}
                      </h2>
                      <div className="flex flex-wrap md:flex-nowrap items-center gap-4 text-sm text-[#0A142F]/70 mb-3">
                        <div className="flex items-center gap-1">
                          <Briefcase size={16} />
                          <span>{job.category}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tags size={16} />
                          <span>{job.subCategory}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className="text-[#0A142F]/40 group-hover:text-[#0A142F] transition-colors"
                      size={24}
                    />
                  </div>

                   {/* Client Profile Preview */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-4">
                      <img 
                        src={job.clientId?.profilePicture || 'https://via.placeholder.com/48'} 
                        // alt={client.name}
                        alt="Client"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#0A142F]">{job.clientId?.fullName}</h4>
                        {/* <p className="text-sm text-[#0A142F]/70">{client.title}</p> */}
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-[#0A142F]/70">
                          <div className="flex items-center gap-1">
                            <Building2 size={14} />
                            <span>{job.clientId.companyName || 'No Company name provided'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{job.clientId.country}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleView(job)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <User size={16} />
                        <span className="text-sm font-medium">View Profile</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[#0A142F]/70 mb-4 line-clamp-2">{job.description}</p>

                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-[#0A142F] mb-2">Requirements:</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.length > 0 ? (
                        job.requirements.map((req, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-50 rounded-full text-sm text-[#0A142F]/70"
                          >
                            {req}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#0A142F]/70 text-sm">No requirements specified</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between pt-4 border-t border-gray-100 gap-4 md:gap-0">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-[#0A142F]">
                        <DollarSign size={20} />
                        <span className="font-semibold">${job.budget}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#0A142F]">
                        <Calendar size={20} />
                        <span>{job.duration}</span>
                      </div>
                    </div>
                    
                    {hasApplied(job._id) || appliedJobIds.includes(job._id) ? (
                  <button
                    className="w-full md:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded-lg cursor-not-allowed"
                    disabled
                  >
                    Applied
                  </button>
                ) : (
                  <button
                    onClick={(e) => handleApplyNow(e, job)}
                    className="w-full md:w-auto px-4 py-2 bg-[#0A142F] text-white rounded-lg hover:bg-[#0A142F]/90 transition-colors"
                  >
                    Apply Now
                  </button>
                )}
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
      </main>

      {/* Job Details Modal */}
      {selectedJob && (
      <JobDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedJob(null);
        }}
        job={selectedJob}
        client={client}
        onSubmitSuccess={handleSubmitSuccess}
         onSuccessfulApply={(jobId) => {
    setAppliedJobIds((prev) => [...prev, jobId]);
  }}
      />
      )}
      {/* Client Profile Modal */}
      <ClientProfileModal
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
      />
       <Footer />
    </div>
  );
};

export default AvailableJobs;