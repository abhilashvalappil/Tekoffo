import { useState, useEffect } from 'react';
import { Calendar, Filter, Eye, Check, X, User } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { usePagination } from '../../../hooks/customhooks/usePagination';
import { fetchAndUpdateProposal, fetchInvitationsSent, getReceivedProposals } from '../../../api';
import { ProposalData, Proposal, Profile } from '../../../types/proposalTypes';
import { Button } from '@mui/material';
import { FaCheckCircle } from 'react-icons/fa';
import { useDebounce } from '../../../hooks/customhooks/useDebounce';
import { handleApiError } from '../../../utils/errors/errorHandler';
import SearchBar from '../../common/SearchBar';
import SelectDropdown from '../../common/SelectDropdown';


const Proposals = () => {
  const [activeeTab, setActiveeTab] = useState<'received' | 'sent'>('received');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [proposalData, setProposalData] = useState<ProposalData[]>([]);
  const [sentInvitations, setSentInvitations] = useState<ProposalData[]>([]);
  const [filters, setFilters] = useState<{ status?: string; time?: string }>({});
  const {
    pagination,
    handlePageChange,
    updateMeta,
  } = usePagination({ total: 0, page: 1, pages: 1, limit: 5 });

  const navigate = useNavigate();
  const debouncedSearchTerm = useDebounce(searchQuery, 500);

  //* Fetch received proposals
  useEffect(() => {
    const loadProposals = async () => {
      try {
        const response = await getReceivedProposals(pagination.page, pagination.limit, debouncedSearchTerm,filters);
        setProposalData(response.data);
        updateMeta(response.meta.total, response.meta.pages);
      } catch (error) {
        handleApiError(error)
      }
    };
    loadProposals();
  }, [pagination.page, pagination.limit,debouncedSearchTerm,filters,updateMeta]);

  //* Fetch sent invitations
  useEffect(() => {
    const loadSentInvitations = async () => {
      try {
        const invitations = await fetchInvitationsSent(debouncedSearchTerm,filters);
        setSentInvitations(invitations);
      } catch (error) {
        handleApiError(error)
      }
    };
    loadSentInvitations();
  }, [pagination.page, pagination.limit,debouncedSearchTerm,filters,updateMeta]);

  const mapProposals = (data: ProposalData[], isSent: boolean): Proposal[] => {
    return data.map((item) => ({
      id: item._id.toString(),
      _id: item._id,
      jobId: {
        _id: item.jobId._id,
        title: item.jobId.title,
        description: item.jobId.description,
      },
      freelancerId: {
        _id: item.freelancerId._id,
        fullName: item.freelancerId.fullName,
        email: item.freelancerId.email,
      },
      title: item.jobId.title,
      sender: isSent ? 'Your Company' : item.freelancerId.fullName,
      receiver: isSent ? item.freelancerId.fullName : 'Your Company',
      date: new Date(item.createdAt).toISOString().split('T')[0],
      status: item.status as 'pending' | 'accepted' | 'rejected',
      amount: item.proposedBudget,
      proposedBudget: item.proposedBudget,
      description: isSent ? item.jobId.description : item.coverLetter || 'No cover letter provided',
      duration: item.duration,
      attachments:item.attachments,
      senderEmail: item.freelancerId.email,
      senderProfilePicture: item.freelancerId.profilePicture,
      senderCountry: item.freelancerId.country,
      senderDescription: item.freelancerId.description,
      senderSkills: item.freelancerId.skills,
      senderPreferredJobFields: item.freelancerId.preferredJobFields,
      senderLinkedinUrl: item.freelancerId.linkedinUrl,
      senderGithubUrl: item.freelancerId.githubUrl,
      senderPortfolioUrl: item.freelancerId.portfolioUrl,
    }));
  };

  useEffect(() => {
  const newFilters: typeof filters = {};

  if (statusFilter !== 'all') newFilters.status = statusFilter;
  if (timeFilter !== 'all') newFilters.time = timeFilter;

  setFilters(newFilters);
}, [statusFilter, timeFilter]);

  // Filter proposals
  useEffect(() => {
    const data = activeeTab === 'received' ? proposalData : sentInvitations;
    const proposals = mapProposals(data, activeeTab === 'sent');

    let filtered = proposals;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.receiver.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProposals(filtered);
  }, [activeeTab, searchQuery, statusFilter, timeFilter, proposalData, sentInvitations]);

  
  const viewProposal = (proposal: Proposal) => {
    if (activeeTab === 'received' && !proposal.viewed) {
      setProposalData((prev) =>
        prev.map((item) =>
          item._id.toString() === proposal.id ? { ...item, viewedByReceiver: true } : item
        )
      );
    }
    setSelectedProposal(proposal);
    setIsModalOpen(true);
  };

  const viewProfile = (proposal: Proposal) => {
    const profile: Profile = {
      name: proposal.sender,
      email: proposal.senderEmail || 'N/A',
      country: proposal.senderCountry || 'N/A',
      description: proposal.senderDescription || 'No description available',
      profilePicture: proposal.senderProfilePicture || 'https://via.placeholder.com/150',
      skills: proposal.senderSkills || [],
      preferredJobFields: proposal.senderPreferredJobFields || [],
      linkedinUrl: proposal.senderLinkedinUrl,
      githubUrl: proposal.senderGithubUrl,
      portfolioUrl: proposal.senderPortfolioUrl,
    };
    setSelectedProfile(profile);
    setIsProfileModalOpen(true);
  };

  const handleAcceptProposal = async (proposal: Proposal) => {
    setProposalData((prev) =>
      prev.map((item) =>
        item._id.toString() === proposal.id ? { ...item, status: 'accepted' } : item
      )
    );
    setFilteredProposals((prev) =>
      prev.map((p) => (p.id === proposal.id ? { ...p, status: 'accepted' } : p))
    );
    setIsModalOpen(false);

    navigate('/client/payment-review', {
      state: {
        proposalId: proposal.id,
      },
    });
  };

  const handleRejectProposal = async(proposal: Proposal) => {
    await fetchAndUpdateProposal(proposal._id,'rejected')
     toast.success('Proposal rejected successfully')
    setProposalData((prev) =>
      prev.map((item) =>
        item._id.toString() === proposal.id ? { ...item, status: 'rejected' } : item
      )
    );
    setFilteredProposals((prev) =>
      prev.map((p) => (p.id === proposal.id ? { ...p, status: 'rejected' } : p))
    );
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-[#0A142F]">
       <Toaster position="top-center" />
      {/* <div className="container mx-auto px-4 ml-34 sm:px-6 md:px-38 py-20"> */}
      <div className="container mx-auto px-4 sm:px-6 md:px-38 md:ml-28 py-20">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center sm:text-left">
        Proposal Management
      </h1>


        {/* Tabs */}
        <div className="flex flex-wrap justify-center sm:justify-start mb-6 border-b">
          <button
            className={`pb-2 px-4 font-medium text-sm sm:text-base ${activeeTab === 'received' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
            onClick={() => setActiveeTab('received')}
          >
            Received Proposals
          </button>
          <button
            className={`pb-2 px-4 font-medium text-sm sm:text-base ${activeeTab === 'sent' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
            onClick={() => setActiveeTab('sent')}
          >
            Invitations Sent 
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
         <SearchBar
            placeholder="Search proposals..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-full sm:w-64 text-sm"
          />
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <SelectDropdown
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "pending", label: "Pending" },
                  { value: "accepted", label: "Accepted" },
                  { value: "rejected", label: "Rejected" },
                  ...(activeeTab === "sent"
                    ? [{ value: "invited", label: "Invited" }]
                    : []),
                ]}
                icon={<Filter size={18} />}
                className="w-full sm:w-auto"
              />

              <SelectDropdown
                  value={timeFilter}
                  onChange={setTimeFilter}
                  options={[
                    { value: "all", label: "All Time" },
                    { value: "today", label: "Today" },
                    { value: "week", label: "This Week" },
                    { value: "month", label: "This Month" },
                  ]}
                  icon={<Calendar size={18} />}
                  className="w-full sm:w-auto"
                />
          </div>
        </div>

        {/* Proposals List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredProposals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{activeeTab === 'received' ? 'From' : 'To'}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    {activeeTab === 'received' && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    )}
                    {activeeTab === 'sent' && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProposals.map((proposal) => (
                    <tr key={proposal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium">
                            {proposal.title}
                            {activeeTab === 'sent' && proposal.viewed && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Viewed</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          {activeeTab === 'received' ? (
                            <>
                              <span>{proposal.sender}</span>
                              <button
                                onClick={() => viewProfile(proposal)}
                                className="ml-2 text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <User size={16} className="mr-1" />
                                View Profile
                              </button>
                            </>
                          ) : (
                            <span>{proposal.receiver}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(proposal.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            proposal.status === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : proposal.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">${proposal.amount.toLocaleString()}</td>
                      {activeeTab === 'received' && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => viewProposal(proposal)}
                            className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                          >
                            <Eye size={16} className="mr-1" />
                            View
                          </button>
                        </td>
                      )}
                  
                    {activeeTab === 'sent' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {proposal.status === 'pending' ? (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleAcceptProposal(proposal)}
                            sx={{
                              background: 'linear-gradient(to right, #4ade80, #059669)', // green gradient
                              color: 'white',
                              fontSize: '0.75rem',
                              padding: '4px 12px',
                              borderRadius: '6px',
                              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                              textTransform: 'none',
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                background: 'linear-gradient(to right, #34d399, #047857)',
                              },
                            }}
                          >
                            Make Payment
                          </Button>
                        ) : proposal.status === 'accepted' ? (
                          <span
                            className="inline-flex items-center gap-2 px-3 py-1 text-white text-xs font-semibold rounded-md
                                      bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md"
                          >
                            <FaCheckCircle className="text-white" />
                            Paid
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    )}
                
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              {activeeTab === 'received' ? 'No proposals received matching your criteria.' : 'No invitations sent matching your criteria.'}
            </div>
          )}
        </div>
        {activeeTab === 'received' && (
          <Stack spacing={2} alignItems="center" className="mt-4">
            <Pagination
              count={pagination.pages}
              page={pagination.page}
              onChange={(_, value) => handlePageChange(value)}
              color="primary"
            />
          </Stack>
        )}
      </div>

      {/* Proposal Details Modal */}
     {isModalOpen && selectedProposal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="w-full max-w-3xl bg-white text-[#0A142F] rounded-2xl shadow-2xl border border-gray-200 overflow-y-auto max-h-[90vh] relative">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0A142F]">{selectedProposal.title}</h2>
            <p className="text-sm text-gray-500">{new Date(selectedProposal.date).toLocaleDateString()}</p>
          </div>
          <button onClick={() => setIsModalOpen(false)} className="hover:bg-gray-100 p-2 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm md:text-base">
          <div>
            <p className="text-gray-500 mb-1">{activeeTab === 'received' ? 'From' : 'To'}</p>
            <p className="font-medium">{activeeTab === 'received' ? selectedProposal.sender : selectedProposal.receiver}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">{activeeTab === 'received' ? 'To' : 'From'}</p>
            <p className="font-medium">{activeeTab === 'received' ? selectedProposal.receiver : selectedProposal.sender}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Amount</p>
            <p className="font-medium text-[#0A142F]">${selectedProposal.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Status</p>
            <span
              className={`px-3 py-1 text-xs rounded-full font-semibold ${
                selectedProposal.status === 'accepted'
                  ? 'bg-green-100 text-green-700'
                  : selectedProposal.status === 'rejected'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {selectedProposal.status.charAt(0).toUpperCase() + selectedProposal.status.slice(1)}
            </span>
          </div>
          {selectedProposal.duration && (
            <div>
              <p className="text-gray-500 mb-1">Duration</p>
              <p className="font-medium">{selectedProposal.duration}</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <p className="text-gray-500 mb-2">
            {activeeTab === 'received' ? 'Cover Letter' : 'Job Description'}
          </p>
          <div className="bg-gray-100 border border-gray-200 p-4 rounded-xl text-[#0A142F]">
            {selectedProposal.description}
          </div>
        </div>

        {selectedProposal.attachments && (
          <div className="mt-6">
            <p className="text-gray-500 mb-2">Attachment</p>
            <div className="bg-gray-100 border border-gray-200 p-3 rounded-lg flex justify-between items-center hover:bg-gray-200 transition">
              <span className="truncate">{selectedProposal.attachments.split('/').pop()}</span>
              <a
                href={selectedProposal.attachments.replace('/upload/', '/upload/fl_attachment:false/')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View
              </a>
            </div>
          </div>
        )}

        {activeeTab === 'received' && selectedProposal.status === 'pending' && (
          <div className="flex justify-end mt-8 space-x-3">
            <button
              onClick={() => handleRejectProposal(selectedProposal)}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center"
            >
              <X size={16} className="mr-1" />
              Reject
            </button>
            <button
              onClick={() => handleAcceptProposal(selectedProposal)}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
            >
              <Check size={16} className="mr-1" />
              Accept
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)}



      {/* Profile Modal */}
      {isProfileModalOpen && selectedProfile && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Profile Details</h2>
                <button onClick={() => setIsProfileModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="flex items-center mb-4">
                <img
                  src={selectedProfile.profilePicture}
                  alt={`${selectedProfile.name}'s profile`}
                  className="w-16 h-16 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="text-lg font-medium">{selectedProfile.name}</p>
                  <p className="text-sm text-gray-500">Freelancer</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedProfile.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="font-medium">{selectedProfile.country}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Skills</p>
                  <p className="text-sm">
                    {selectedProfile.skills.length > 0
                      ? selectedProfile.skills.join(', ')
                      : 'No skills listed'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Preferred Job Fields</p>
                  <p className="text-sm">
                    {selectedProfile.preferredJobFields.length > 0
                      ? selectedProfile.preferredJobFields.join(', ')
                      : 'No job fields listed'}
                  </p>
                </div>
                {selectedProfile.linkedinUrl && (
                  <div>
                    <p className="text-sm text-gray-500">LinkedIn</p>
                    <a
                      href={selectedProfile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {selectedProfile.linkedinUrl}
                    </a>
                  </div>
                )}
                {selectedProfile.githubUrl && (
                  <div>
                    <p className="text-sm text-gray-500">GitHub</p>
                    <a
                      href={selectedProfile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {selectedProfile.githubUrl}
                    </a>
                  </div>
                )}
                {selectedProfile.portfolioUrl && (
                  <div>
                    <p className="text-sm text-gray-500">Portfolio</p>
                    <a
                      href={selectedProfile.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {selectedProfile.portfolioUrl}
                    </a>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-sm">{selectedProfile.description}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Proposals;