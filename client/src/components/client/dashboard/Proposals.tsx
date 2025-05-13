 

import { useState, useEffect } from 'react';
import { Search, Calendar, Filter, Eye, Check, X, ChevronDown, User, LayoutDashboard, Briefcase, ClipboardList, Users, FileText, MessageSquare } from 'lucide-react';
import Navbar from '../shared/Navbar';
import { navItems } from '../shared/NavbarItems';
import { getReceivedProposals } from '../../../api';
import { ProposalData } from '../../../types/proposalTypes';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { usePagination } from '../../../hooks/customhooks/usePagination';
import Footer from '../../shared/Footer';

 
type Proposal = {
  id: string;
  _id: string; 
  jobId: {
    _id: string;
    title: string;
    description: string;
  };  
  freelancerId: {
    _id: string;
    fullName: string;
    email:string;
  }; 
  title: string;
  sender: string;
  receiver: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
  viewed: boolean;
  proposedBudget: number;
  amount:number;
  description: string;
  duration?: string;  
  senderEmail?: string;
  senderProfilePicture?: string;
  senderCountry?: string;
  senderDescription?: string;
  senderSkills?: string[];
  senderPreferredJobFields?: string[];
  senderLinkedinUrl?: string;
  senderGithubUrl?: string;
  senderPortfolioUrl?: string;
};

type Profile = {
  name: string;
  email: string;
  country: string;
  description: string;
  profilePicture: string;
  skills: string[];
  preferredJobFields: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
};

const Proposals = () => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [proposalData, setProposalData] = useState<ProposalData[]>([]);
   const [totalCount,setTotalCount] = useState(0);
   const {
    pagination,
    handlePageChange,
    updateMeta,
  } = usePagination({ total: 0, page: 1, pages: 1, limit: 5 });


  const navigate = useNavigate();
  
  //* Fetch proposals
  useEffect(() => {
    const loadProposals = async () => {
      try {
        const response = await getReceivedProposals(pagination.page, pagination.limit);
        setProposalData(response.data);
        updateMeta(response.meta.total, response.meta.pages);
         setTotalCount(response.meta.total);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      }
    };
    loadProposals();
  }, [pagination.page, pagination.limit]);

   
  const mapProposals = (data: ProposalData[]): Proposal[] => {
    return data.map((item) => ({
      id: item._id.toString(),
      title: item.jobId.title,
      sender: item.freelancerId.fullName,
      receiver: 'Your Company',
      date: new Date(item.createdAt).toISOString().split('T')[0],
      status: item.status as 'pending' | 'accepted' | 'rejected',
      // viewed: item.viewedByReceiver,
      amount: item.proposedBudget,
      description: item.coverLetter,
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

  // Filter proposals
  useEffect(() => {
    const proposals = mapProposals(proposalData).filter((p) =>
      activeTab === 'received' ? p.receiver === 'Your Company' : p.sender === 'Your Company'
    );

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

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Apply time filter
    if (timeFilter !== 'all') {
      const today = new Date();
      filtered = filtered.filter((p) => {
        const proposalDate = new Date(p.date);
        switch (timeFilter) {
          case 'day':
            return proposalDate.toDateString() === today.toDateString();
          case 'week': {
            const weekAgo = new Date();
            weekAgo.setDate(today.getDate() - 7);
            return proposalDate >= weekAgo;
          }
          case 'month': {
            const monthAgo = new Date();
            monthAgo.setMonth(today.getMonth() - 1);
            return proposalDate >= monthAgo;
          }
          case 'year': {
            const yearAgo = new Date();
            yearAgo.setFullYear(today.getFullYear() - 1);
            return proposalDate >= yearAgo;
          }
          default:
            return true;
        }
      });
    }

    setFilteredProposals(filtered);
  }, [activeTab, searchQuery, statusFilter, timeFilter, proposalData]);

  const viewProposal = (proposal: Proposal) => {
    if (activeTab === 'received' && !proposal.viewed) {
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

  const handleAcceptProposal = async(proposal: Proposal) => {
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

   

  const handleRejectProposal = (proposal: Proposal) => {
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
      <Navbar navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="container mx-auto px-30 py-20">
        <h1 className="text-3xl font-bold mb-8">Proposal Management</h1>

        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            className={`pb-2 px-4 font-medium ${activeTab === 'received' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            Received Proposals
          </button>
          <button
            className={`pb-2 px-4 font-medium ${activeTab === 'sent' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            Sent Proposals
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search proposals..."
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
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
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
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <ChevronDown className="absolute right-2 top-2.5 text-gray-400" size={18} />
            </div>
          </div>
        </div>

        {/* Proposals List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredProposals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{activeTab === 'received' ? 'From' : 'To'}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProposals.map((proposal) => (
                    <tr key={proposal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium">
                            {proposal.title}
                            {activeTab === 'sent' && proposal.viewed && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Viewed</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          {activeTab === 'received' ? (
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
                            proposal.receiver
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
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => viewProposal(proposal)}
                          className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                        >
                          <Eye size={16} className="mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">No proposals found matching your criteria.</div>
          )}
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

      {/* Proposal Details Modal */}
      {isModalOpen && selectedProposal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedProposal.title}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-medium">{selectedProposal.sender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">To</p>
                  <p className="font-medium">{selectedProposal.receiver}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{new Date(selectedProposal.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">${selectedProposal.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedProposal.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : selectedProposal.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {selectedProposal.status.charAt(0).toUpperCase() + selectedProposal.status.slice(1)}
                  </span>
                </div>
              </div>

              {selectedProposal.description && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Cover Letter</p>
              <p className="text-sm">{selectedProposal.description}</p>
            </div>
          )}       
              {/* <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Cover Letter</p>
                <p className="text-sm">{selectedProposal.description}</p>
              </div> */}

              {activeTab === 'received' && selectedProposal.status === 'pending' && (
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleRejectProposal(selectedProposal)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                  >
                    <X size={16} className="mr-1" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleAcceptProposal(selectedProposal)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
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
       <Footer />
    </div>
  );
};

export default Proposals;