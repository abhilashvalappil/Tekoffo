import { useState, useEffect } from 'react';
import { Filter, ChevronDown, ChevronUp,Briefcase,LayoutDashboard,MessageSquare,Wallet,FileText,ScrollText} from 'lucide-react';
import { fetchAppliedProposalsByFreelancer } from '../../../api';
import Navbar from '../shared/Navbar';
import { navItems } from '../shared/NavbarItems';

// Define types
type ProposalStatus = 'accepted' | 'rejected' | 'pending';
type DateFilterType = 'all' | 'day' | 'week' | 'month' | 'year';
type StatusFilterType = 'all' | ProposalStatus;

interface Proposal {
  id: string;
  title: string;
  client: string;
  budget: string;
  submittedDate: string;
  status: ProposalStatus;
  description: string;
  viewedByReceiver: boolean;
}

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
}

// Dropdown component for filters
const Dropdown: React.FC<DropdownProps> = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white border rounded-md shadow-sm text-gray-700 hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{label}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          <ul className="py-1 overflow-auto text-sm max-h-48">
            {options.map((option) => (
              <li
                key={option.value}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  value === option.value ? 'bg-blue-50 text-blue-700' : ''
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Main component
const FreelancerProposals: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
   const [activeTab, setActiveTab] = useState<string>('proposals');
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadProposals = async () => {
      try {
        const fetchedProposals = await fetchAppliedProposalsByFreelancer();
        // Map backend data to frontend Proposal interface
        const mappedProposals: Proposal[] = fetchedProposals.map((proposal: any) => ({
          id: proposal._id,
          title: proposal.jobId.title,
          client: proposal.clientId.fullName,
          budget: `$${proposal.proposedBudget.toLocaleString()}`,
          submittedDate: new Date(proposal.createdAt).toISOString().split('T')[0],
          status: proposal.status as ProposalStatus,
          description: `Proposal for ${proposal.jobId.title} with a duration of ${proposal.duration}.`,
          viewedByReceiver: proposal.viewedByReceiver,
        }));
        setProposals(mappedProposals);
        setIsDataLoaded(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load proposals.');
        setIsDataLoaded(true);
      }
    };

    loadProposals();
  }, []);

  // Filter proposals based on selected filters
  const filteredProposals = proposals.filter((proposal) => {
    // Filter by status
    if (statusFilter !== 'all' && proposal.status !== statusFilter) {
      return false;
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const currentDate = new Date();
      const proposalDate = new Date(proposal.submittedDate);
      
      switch (dateFilter) {
        case 'day':
          return proposalDate.toDateString() === currentDate.toDateString();
        case 'week':
          const weekStart = new Date(currentDate);
          weekStart.setDate(currentDate.getDate() - currentDate.getDay());
          return proposalDate >= weekStart;
        case 'month':
          return proposalDate.getMonth() === currentDate.getMonth() && 
                 proposalDate.getFullYear() === currentDate.getFullYear();
        case 'year':
          return proposalDate.getFullYear() === currentDate.getFullYear();
        default:
          return true;
      }
    }
    
    return true;
  });
 

  return (
    <div className="w-full   bg-white">
        <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        navItems={navItems}
      />
      <h1 className="mb-8 pt-20 text-2xl font-bold text-[#0A142F]">Sent Proposals</h1>
      
      {/* Filters section */}
      <div className="p-4 mb-6 border rounded-lg bg-gray-50">
        <div className="flex items-center mb-4">
          <Filter size={18} className="mr-2 text-gray-500" />
          <h2 className="text-sm font-semibold text-[#0A142F]">Filter Proposals</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Dropdown
            label="Status"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as StatusFilterType)}
            options={[
              { label: 'All Proposals', value: 'all' },
              { label: 'Accepted', value: 'accepted' },
              { label: 'Pending', value: 'pending' },
              { label: 'Rejected', value: 'rejected' },
            ]}
          />
          
          <Dropdown
            label="Date Range"
            value={dateFilter}
            onChange={(value) => setDateFilter(value as DateFilterType)}
            options={[
              { label: 'All Time', value: 'all' },
              { label: 'Today', value: 'day' },
              { label: 'This Week', value: 'week' },
              { label: 'This Month', value: 'month' },
              { label: 'This Year', value: 'year' },
            ]}
          />
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="p-4 mb-6 text-red-800 bg-red-100 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      
      {/* Proposals table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isDataLoaded ? (
          filteredProposals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProposals.map((proposal) => (
                    <tr key={proposal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium">
                            {proposal.title}
                            {proposal.viewedByReceiver && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Viewed</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {proposal.client}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {proposal.budget}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(proposal.submittedDate).toLocaleDateString()}
                      </td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No proposals found matching your criteria.
            </div>
          )
        ) : (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-300 border-l-blue-300 border-r-blue-300 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerProposals;