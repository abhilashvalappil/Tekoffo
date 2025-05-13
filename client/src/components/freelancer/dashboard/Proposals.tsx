
import { useEffect, useState } from 'react';
import { Search, Calendar, Filter, Check, X, ChevronDown } from 'lucide-react';
import Navbar from '../shared/Navbar';
import { navItems } from '../shared/NavbarItems';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { fetchAppliedProposalsByFreelancer } from '../../../api';
import { handleApiError } from '../../../utils/errors/errorHandler';
import { AppliedProposal } from '../../../types/proposalTypes';
import { usePagination } from '../../../hooks/customhooks/usePagination';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, persistor, RootState } from '../../../redux/store';
import Footer from '../../shared/Footer';
import { useNavigate } from 'react-router-dom';

const FreelancerProposals = () => {
  const [activeTab, setActiveTab] = useState('sent');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [proposals, setProposals] = useState<AppliedProposal[]>([]);
  const [error, setError] = useState('')
  const [totalCount,setTotalCount] = useState(0);
  const { pagination, handlePageChange, updateMeta } = usePagination({
    total: 0,
    page: 1,
    pages: 1,
    limit: 6,
  });

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const loadAppliedProposals = async() => {
      try {
        const response = await fetchAppliedProposalsByFreelancer(pagination.page,pagination.limit)
        // console.log('console from freelancer applied proposals',appliedProposals)
        setProposals(response.data)
        updateMeta(response.meta.total, response.meta.pages);
        setTotalCount(response.meta.total);
      } catch (error) {
        const errormessage = handleApiError(error)
        setError(errormessage)
      }
    }
    loadAppliedProposals()
  },[pagination.page, pagination.limit])

    //* Handle logout
    const handleLogout = async () => {
      try {
        if (user?._id) {
          const result = await dispatch(logout(user._id)).unwrap();
          console.log('Logout successful:', result);
          persistor.purge();
          navigate('/signin');
        }
      } catch (error) {
        handleApiError(error)
      }
    };
  

  return (
    <div className="min-h-screen bg-white text-[#0A142F]">
      <Navbar 
      navItems={navItems} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
      isProfileOpen={isProfileOpen}
      setIsProfileOpen={setIsProfileOpen}
      handleLogout={handleLogout}
      user={user}
       />
      <div className="container mx-auto px-30 py-20">
        <h1 className="text-3xl font-bold mb-8">Proposal Management</h1>

        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            className={`pb-2 px-4 font-medium ${activeTab === 'sent' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            Applied Proposals
          </button>
          <button
            className={`pb-2 px-4 font-medium ${activeTab === 'received' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            Received Proposals
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
          {proposals.length > 0 ?(
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{activeTab === 'received' ? 'From' : 'To'}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {proposals.map((proposal) => (
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium">{proposal.jobId.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{proposal.clientId.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(proposal.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{proposal.proposedBudget}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {proposal.status}
                    </span> */}
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
                </tr>
                ))}
              </tbody>
            </table>
          </div>
          ):(
            <div className="text-center py-12 text-gray-500">No Proposals found!.</div>
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
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Sample Proposal</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-medium">John Doe</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">To</p>
                  <p className="font-medium">Your Company</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">05/08/2025</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">$1,000</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Cover Letter</p>
                <p className="text-sm">This is a sample cover letter for the proposal.</p>
              </div>

              {activeTab === 'received' && (
                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                  >
                    <X size={16} className="mr-1" />
                    Reject
                  </button>
                  <button
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
       <Footer />
    </div>
  );
};

export default FreelancerProposals;