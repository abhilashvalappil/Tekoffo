
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { fetchAppliedProposalsByFreelancer } from '../../../api';
import { handleApiError } from '../../../utils/errors/errorHandler';
import { AppliedProposal } from '../../../types/proposalTypes';
import { usePagination } from '../../../hooks/customhooks/usePagination';
import { useDebounce } from '../../../hooks/customhooks/useDebounce';
import DataTable from '../../common/DataTable';
 

const FreelancerProposals = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposals, setProposals] = useState<AppliedProposal[]>([]);
  const [error, setError] = useState('')
  const { pagination, handlePageChange, updateMeta } = usePagination({
    total: 0,
    page: 1,
    pages: 1,
    limit: 6,
  });
  
  const debouncedSearchTerm = useDebounce(searchQuery, 500);
  
  useEffect(() => {
    const loadAppliedProposals = async() => {
      try {
        const response = await fetchAppliedProposalsByFreelancer(pagination.page,pagination.limit,debouncedSearchTerm,statusFilter)
        setProposals(response.data)
        updateMeta(response.meta.total, response.meta.pages);
      } catch (error) {
        const errormessage = handleApiError(error)
        setError(errormessage)
      }
    }
    loadAppliedProposals()
  },[pagination.page, pagination.limit,updateMeta,debouncedSearchTerm,statusFilter])


    return (
      <>
      <DataTable 
        title="Proposal Management"
        searchPlaceholder="Search proposals..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={[
          { value: 'all', label: 'All Status' },
          { value: 'pending', label: 'Pending' },
          { value: 'accepted', label: 'Accepted' },
          { value: 'rejected', label: 'Rejected' },
        ]}
         columns={[
          { key: 'title', label: 'Title' },
          { key: 'to', label: 'To' },
          { key: 'date', label: 'Date' },
          { key: 'budget', label: 'Budget' },
          { key: 'status', label: 'Status' },
          // { key: 'actions', label: 'Actions' },
        ]}
        data={proposals}
        renderRow={(proposal) => (
          <tr key={proposal._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              {proposal.jobDetails.title}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {proposal.clientDetails.fullName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {new Date(proposal.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {proposal.proposedBudget}
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
            <td className="px-6 py-4 whitespace-nowrap">
            </td>
          </tr>
        )}
        pagination={pagination}
        handlePageChange={handlePageChange}
        error={error}
        emptyMessage="No Proposals found!"
      />

      
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FreelancerProposals;