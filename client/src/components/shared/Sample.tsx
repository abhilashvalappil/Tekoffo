import React, { useEffect, useState } from "react";
import { getReceivedProposals } from "../../api";
import { usePagination } from "../../hooks/customhooks/usePagination";
import { ProposalData } from "../../types/proposalTypes";

type Invitation = {
  id: number;
  title: string;
  to: string;
  date: string;
  status: string;
  amount: string;
};

const JobTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ProposalData>();
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
//   const [showProposalModal, setShowProposalModal] = useState(false);
const [proposalsReceived, setProposalsReceived] = useState<ProposalData[]>([]);
const [totalCount, setTotalCount] = useState(0);

 const {
    pagination,
    handlePageChange,
    updateMeta,
  } = usePagination({ total: 0, page: 1, pages: 1, limit: 5 });

 // Fetch received proposals
  useEffect(() => {
    const loadProposals = async () => {
      try {
        const response = await getReceivedProposals(pagination.page, pagination.limit);
        setProposalsReceived(response.data);
        updateMeta(response.meta.total, response.meta.pages);
        setTotalCount(response.meta.total);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      }
    };
    loadProposals();
  }, [pagination.page, pagination.limit,updateMeta]);

 
  const invitationsSent: Invitation[] = [
    {
      id: 1,
      title: "Create Landing Page",
      to: "Ali Khan",
      date: "2025-06-01",
      status: "Sent",
      amount: "$400",
    },
    {
      id: 2,
      title: "Setup Node Backend",
      to: "Maria Garcia",
      date: "2025-06-03",
      status: "Pending",
      amount: "$600",
    },
  ];

  const handleViewProfile = (proposal: Proposal) => {
    setSelectedUser(proposal);
    setShowProfileModal(true);
  };

  const handleViewProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowProposalModal(true);
  };

  const closeModals = () => {
    setShowProfileModal(false);
    setShowProposalModal(false);
    setSelectedUser("");
    setSelectedProposal(null);
  };

  return (
    <div className="w-full p-4">
      {/* Tabs */}
      <div className="border-b border-gray-300 mb-4">
        <div className="flex space-x-6">
          <button
            className={`pb-2 text-sm font-semibold ${
              activeTab === "received"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-black"
            }`}
            onClick={() => setActiveTab("received")}
          >
            Received Proposals
          </button>
          <button
            className={`pb-2 text-sm font-semibold ${
              activeTab === "sent"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-black"
            }`}
            onClick={() => setActiveTab("sent")}
          >
            Sent Invitations
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border-b">Title</th>
              <th className="px-4 py-2 border-b">
                {activeTab === "received" ? "From" : "To"}
              </th>
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Amount</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {activeTab === "received"
              ? proposalsReceived.map((proposal) => (
                  <tr key={proposal._id}>
                    <td className="px-4 py-2 border-b">{proposal.jobId.title}</td>
                    <td className="px-4 py-2 border-b">
                      <div className="flex items-center space-x-2">
                        <span>{proposal.freelancerId.fullName}</span>
                        <button
                          onClick={() => handleViewProfile(proposal)}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          View Profile
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b">{new Date(proposal.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border-b">{proposal.status}</td>
                    <td className="px-4 py-2 border-b">{proposal.proposedBudget}</td>
                    <td className="px-4 py-2 border-b space-x-2">
                      <button
                        onClick={() => handleViewProposal(p)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Proposal
                      </button>
                      <button className="text-sm text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700">
                        Accept
                      </button>
                    </td>
                  </tr>
                ))
              : invitationsSent.map((i) => (
                  <tr key={i.id}>
                    <td className="px-4 py-2 border-b">{i.title}</td>
                    <td className="px-4 py-2 border-b">{i.to}</td>
                    <td className="px-4 py-2 border-b">{i.date}</td>
                    <td className="px-4 py-2 border-b">{i.status}</td>
                    <td className="px-4 py-2 border-b">{i.amount}</td>
                    <td className="px-4 py-2 border-b">
                      <button className="text-sm text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700">
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Profile Modal */}
   
      {showProfileModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/60">
    <div className="relative w-full max-w-2xl mx-4 p-6 rounded-2xl bg-gradient-to-br from-[#1e1e2f] to-[#2a2a3d] text-white shadow-2xl border border-white/10 animate-fade-in">
      <div className="absolute top-4 right-4">
        <button
          onClick={closeModals}
          className="text-gray-300 hover:text-white transition-colors duration-200"
        >
          ✕
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
        <img
          src={selectedUser?.freelancerId.profilePicture}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-cyan-400 shadow-md"
        />
        <div>
          <h2 className="text-2xl font-semibold">{selectedUser?.freelancerId.fullName}</h2>
          <p className="text-cyan-400">Freelancer</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-400">Email</p>
          <p className="text-white">{selectedUser?.freelancerId.email}</p>
        </div>
        <div>
          <p className="text-gray-400">Country</p>
          <p className="text-white">{selectedUser?.freelancerId.country}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-gray-400">Skills</p>
          <p className="text-white">{selectedUser?.freelancerId.skills}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-gray-400">Preferred Job Fields</p>
          <p className="text-white">
            {selectedUser?.freelancerId.preferredJobFields}
          </p>
        </div>
        <div>
          <p className="text-gray-400">LinkedIn</p>
          <a
            href="https://linkedin.com/in/anvar-dev"
            target="_blank"
            className="text-cyan-400 hover:underline"
          >
            {selectedUser?.freelancerId.linkedinUrl}
          </a>
        </div>
        <div>
          <p className="text-gray-400">GitHub</p>
          <a
            href="https://github.com/anvar.dev"
            target="_blank"
            className="text-cyan-400 hover:underline"
          >
            {selectedUser?.freelancerId.githubUrl}
          </a>
        </div>
        <div className="sm:col-span-2">
          <p className="text-gray-400">Description</p>
          <p className="text-white">
            {selectedUser?.freelancerId.description}
          </p>
        </div>
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={closeModals}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-full transition-all duration-200 shadow-md"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


      {/* Proposal Details Modal */}
     
      {showProposalModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/60">
    <div className="relative w-full max-w-2xl mx-4 p-6 rounded-2xl bg-gradient-to-br from-[#1e1e2f] to-[#2a2a3d] text-white shadow-2xl border border-white/10 animate-fade-in">
      <div className="absolute top-4 right-4">
        <button
          onClick={closeModals}
          className="text-gray-300 hover:text-white transition-colors duration-200"
        >
          ✕
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-cyan-400">
        UI/UX Designer for Mobile Banking App
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-400">From</p>
          <p className="text-white">Anvar MS</p>
        </div>
        <div>
          <p className="text-gray-400">To</p>
          <p className="text-white">Your Company</p>
        </div>
        <div>
          <p className="text-gray-400">Date</p>
          <p className="text-white">5/21/2025</p>
        </div>
        <div>
          <p className="text-gray-400">Amount</p>
          <p className="text-white">$10,000</p>
        </div>
        <div>
          <p className="text-gray-400">Status</p>
          <p
            className={`font-semibold ${
              proposalData?.status === 'Pending'
                ? 'text-yellow-400'
                : proposalData?.status === 'Accepted'
                ? 'text-green-400'
                : 'text-gray-300'
            }`}
          >
            {proposalData?.status || 'Accepted'}
          </p>
        </div>
        <div>
          <p className="text-gray-400">Duration</p>
          <p className="text-white">20 days</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-gray-400">Cover Letter</p>
          <p className="text-white mt-1">
            I am a passionate UI/UX designer with 5+ years of experience designing intuitive mobile apps. This project fits perfectly with my expertise, and I’d love to collaborate to deliver a world-class experience.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        {proposalData?.status === 'Pending' && (
          <button
            onClick={handleAcceptProposal}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition-all duration-200 shadow-md"
          >
            Accept Proposal
          </button>
        )}
        <button
          onClick={closeModals}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full transition-all duration-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default JobTabs;
