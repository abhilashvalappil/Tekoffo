// import React, { useState, useMemo } from 'react';

// // Proposal type
// interface Proposal {
//   id: string;
//   title: string;
//   description: string;
//   status: 'accepted' | 'rejected' | 'pending';
//   date: string;
//   dueDate: string;
//   viewed: boolean;
//   client: string;
//   amount: number;
//   category: string;
// }

// const Proposals: React.FC = () => {
//   // Sample data
//   const [receivedProposals, setReceivedProposals] = useState<Proposal[]>([
//     { id: '1', title: 'Website Redesign Project', description: 'Complete redesign of corporate website with modern UI/UX principles and mobile responsiveness.', status: 'pending', date: '2023-04-15', dueDate: '2023-05-30', viewed: false, client: 'Acme Corporation', amount: 5000, category: 'Web Development' },
//     { id: '2', title: 'Mobile App Development', description: 'Development of a cross-platform mobile application for inventory management.', status: 'accepted', date: '2023-04-10', dueDate: '2023-06-10', viewed: true, client: 'Tech Solutions', amount: 12000, category: 'App Development' },
//     { id: '3', title: 'E-commerce Integration', description: 'Integration of payment gateway and shopping cart functionality into existing website.', status: 'rejected', date: '2023-04-05', dueDate: '2023-05-05', viewed: true, client: 'ShopEasy', amount: 3500, category: 'E-commerce' },
//   ]);

//   const [sentProposals, setSentProposals] = useState<Proposal[]>([
//     { id: '4', title: 'Branding & Logo Design', description: 'Complete brand identity package including logo design, color palette, and brand guidelines.', status: 'pending', date: '2023-04-18', dueDate: '2023-05-18', viewed: true, client: 'Sunrise Bakery', amount: 3000, category: 'Design' },
//     { id: '5', title: 'Social Media Management', description: 'Six-month social media management package including content creation and community engagement.', status: 'accepted', date: '2023-04-12', dueDate: '2023-10-12', viewed: true, client: 'Fitness First Gym', amount: 8400, category: 'Digital Marketing' },
//     { id: '6', title: 'Video Production Service', description: 'Production of five promotional videos for product launch, including scripting and editing.', status: 'rejected', date: '2023-04-01', dueDate: '2023-05-01', viewed: false, client: 'Media Corp', amount: 7500, category: 'Video Production' },
//   ]);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<'all' | 'accepted' | 'rejected' | 'pending'>('all');
//   const [dateFilter, setDateFilter] = useState<'all' | 'day' | 'week' | 'month' | 'year'>('all');
//   const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
//   const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

//   // Filter proposals based on search, status, and date
//   const filterProposals = (proposals: Proposal[]) => {
//     const now = new Date();
//     return proposals.filter((proposal) => {
//       const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         proposal.description.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
//       const proposalDate = new Date(proposal.date);
//       let matchesDate = true;
//       if (dateFilter === 'day') {
//         matchesDate = proposalDate.toDateString() === now.toDateString();
//       } else if (dateFilter === 'week') {
//         const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
//         matchesDate = proposalDate >= oneWeekAgo;
//       } else if (dateFilter === 'month') {
//         matchesDate = proposalDate.getMonth() === now.getMonth() && proposalDate.getFullYear() === now.getFullYear();
//       } else if (dateFilter === 'year') {
//         matchesDate = proposalDate.getFullYear() === now.getFullYear();
//       }
//       return matchesSearch && matchesStatus && matchesDate;
//     });
//   };

//   const filteredReceived = useMemo(() => filterProposals(receivedProposals), [receivedProposals, searchTerm, statusFilter, dateFilter]);
//   const filteredSent = useMemo(() => filterProposals(sentProposals), [sentProposals, searchTerm, statusFilter, dateFilter]);

//   // Handle view proposal (mark as viewed for sender)
//   const handleViewProposal = (proposal: Proposal) => {
//     setSelectedProposal(proposal);
//     if (activeTab === 'received' && !proposal.viewed) {
//       setReceivedProposals((prev) =>
//         prev.map((p) => (p.id === proposal.id ? { ...p, viewed: true } : p))
//       );
//       setSentProposals((prev) =>
//         prev.map((p) => (p.id === proposal.id ? { ...p, viewed: true } : p))
//       );
//     }
//   };

//   // Handle accept/reject proposal
//   const handleAcceptProposal = (proposal: Proposal) => {
//     setReceivedProposals((prev) =>
//       prev.map((p) => (p.id === proposal.id ? { ...p, status: 'accepted' } : p))
//     );
//     setSentProposals((prev) =>
//       prev.map((p) => (p.id === proposal.id ? { ...p, status: 'accepted' } : p))
//     );
//     setSelectedProposal(null);
//   };

//   const handleRejectProposal = (proposal: Proposal) => {
//     setReceivedProposals((prev) =>
//       prev.map((p) => (p.id === proposal.id ? { ...p, status: 'rejected' } : p))
//     );
//     setSentProposals((prev) =>
//       prev.map((p) => (p.id === proposal.id ? { ...p, status: 'rejected' } : p))
//     );
//     setSelectedProposal(null);
//   };

//   // Modal for viewing proposal details
//   const ViewDetailsModal: React.FC<{ proposal: Proposal; onClose: () => void }> = ({ proposal, onClose }) => (
//     <div className="fixed inset-0 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative border border-gray-200">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-[#0A142F]">Proposal Details</h2>
//           <button onClick={onClose} className="text-[#0A142F] text-lg">×</button>
//         </div>
//         <h3 className="text-xl font-bold text-[#0A142F] mb-2">{proposal.title}</h3>
//         <div className="flex items-center mb-2">
//           <span className={`px-2 py-1 rounded text-sm ${proposal.status === 'accepted' ? 'bg-green-100 text-green-700' : proposal.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
//             {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
//           </span>
//           <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">{activeTab === 'received' ? 'Received' : 'Sent'}</span>
//           <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">{proposal.category}</span>
//         </div>
//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <div>
//             <p className="text-[#0A142F] mb-2"><strong>Client:</strong> {proposal.client}</p>
//             <p className="text-[#0A142F] mb-2"><strong>Submission Date:</strong> {new Date(proposal.date).toLocaleDateString()}</p>
//           </div>
//           <div>
//             <p className="text-[#0A142F] mb-2"><strong>Amount:</strong> ${proposal.amount.toLocaleString()}</p>
//             <p className="text-[#0A142F] mb-2"><strong>Due Date:</strong> {new Date(proposal.dueDate).toLocaleDateString()}</p>
//           </div>
//         </div>
//         <p className="text-[#0A142F] mb-4"><strong>Description:</strong> {proposal.description}</p>
//         {activeTab === 'received' && proposal.status === 'pending' && (
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => handleRejectProposal(proposal)}
//               className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
//             >
//               Reject Proposal
//             </button>
//             <button
//               onClick={() => handleAcceptProposal(proposal)}
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
//             >
//               Accept Proposal
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-white text-[#0A142F] p-4 sm:p-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
//           <div>
//             <h1 className="text-3xl font-bold text-[#0A142F]">Proposals Management</h1>
//             <p className="text-sm text-[#0A142F]">Manage your {activeTab === 'received' ? 'received' : 'sent'} proposals</p>
//           </div>
//           <p className="text-sm text-[#0A142F]">{(activeTab === 'received' ? filteredReceived : filteredSent).length} proposals found</p>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2">
//           <button
//             onClick={() => setActiveTab('received')}
//             className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'received' ? 'border-b-2 border-[#0A142F] text-[#0A142F]' : 'text-gray-500'}`}
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
//             </svg>
//             Received Proposals
//           </button>
//           <button
//             onClick={() => setActiveTab('sent')}
//             className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'sent' ? 'border-b-2 border-[#0A142F] text-[#0A142F]' : 'text-gray-500'}`}
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
//             </svg>
//             Sent Proposals
//           </button>
//         </div>

//         {/* Search and Filters */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-6">
//           <div className="relative flex-1">
//             <input
//               type="text"
//               placeholder="Search proposals..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full p-2 pl-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0A142F]"
//             />
//             <svg className="absolute left-3 top-3 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//             </svg>
//           </div>
//           <div className="flex gap-2">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value as 'all' | 'accepted' | 'rejected' | 'pending')}
//               className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0A142F]"
//             >
//               <option value="all">All</option>
//               <option value="pending">Pending</option>
//               <option value="accepted">Accepted</option>
//               <option value="rejected">Rejected</option>
//             </select>
//             <select
//               value={dateFilter}
//               onChange={(e) => setDateFilter(e.target.value as 'all' | 'day' | 'week' | 'month' | 'year')}
//               className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0A142F]"
//             >
//               <option value="all">All Time</option>
//               <option value="day">Today</option>
//               <option value="week">This Week</option>
//               <option value="month">This Month</option>
//               <option value="year">This Year</option>
//             </select>
//           </div>
//         </div>

//         {/* Proposals List */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {(activeTab === 'received' ? filteredReceived : filteredSent).map((proposal) => (
//             <div key={proposal.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
//               <h3 className="text-lg font-semibold text-[#0A142F]">{proposal.title}</h3>
//               <p className="text-sm text-[#0A142F] mb-2">{proposal.description}</p>
//               <div className="flex items-center gap-2 mb-2">
//                 <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//                 </svg>
//                 <span className="text-sm text-[#0A142F]">{new Date(proposal.date).toLocaleDateString()}</span>
//               </div>
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-lg font-bold text-[#0A142F]">${proposal.amount.toLocaleString()}</span>
//                 {activeTab === 'sent' && (
//                   <span className="text-sm flex items-center gap-1 text-[#0A142F]">
//                     {proposal.viewed ? (
//                       <>
//                         <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                         </svg>
//                         Viewed
//                       </>
//                     ) : (
//                       <>
//                         <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//                         </svg>
//                         Not Viewed
//                       </>
//                     )}
//                   </span>
//                 )}
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className={`px-2 py-1 rounded text-sm ${proposal.status === 'accepted' ? 'bg-green-100 text-green-700' : proposal.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
//                   {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
//                 </span>
//                 <button
//                   onClick={() => handleViewProposal(proposal)}
//                   className="ml-auto flex items-center gap-1 px-3 py-1 bg-[#0A142F] text-white rounded hover:bg-[#0A142F]/90 transition"
//                 >
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12h.01M12 12h.01M9 12h.01M12 9v.01M12 15v.01M12 12a3 3 0 100-6 3 3 0 000 6zm0 0a3 3 0 100 6 3 3 0 000-6zm0 0a9 9 0 01-9-9 9 9 0 0118 0 9 9 0 01-9 9z"></path>
//                   </svg>
//                   View Details
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Modal */}
//         {selectedProposal && (
//           <ViewDetailsModal proposal={selectedProposal} onClose={() => setSelectedProposal(null)} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Proposals;
 

import { useState, useEffect } from 'react';
import { Search, Calendar, Filter, Eye, Check, X, ChevronDown, User, LayoutDashboard, Briefcase, ClipboardList, Users, FileText, MessageSquare } from 'lucide-react';
import Navbar from './Navbar';
import { fetchProposalsReceived } from '../../api/common';
import { ProposalData } from '../../types/proposalTypes';

// Types
type Proposal = {
  id: string;
  title: string;
  sender: string;
  receiver: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
  viewed: boolean;
  amount: number;
  description: string;
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

  const navItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', id: 'overview' },
    { icon: <Briefcase className="h-5 w-5" />, label: 'Post a Job', id: 'post', path: '/client/post-job' },
    { icon: <ClipboardList className="h-5 w-5" />, label: 'My Job Posts', id: 'my-jobs', path: '/client/myjobs' },
    { icon: <Users className="h-5 w-5" />, label: 'Talent', id: 'talent', path: '/client/freelancers' },
    { icon: <FileText className="h-5 w-5" />, label: 'Proposals', id: 'proposals', path: '/client/proposals' },
    { icon: <MessageSquare className="h-5 w-5" />, label: 'Messages', id: 'messages' },
  ];

  // Fetch proposals
  useEffect(() => {
    const loadProposals = async () => {
      try {
        const data = await fetchProposalsReceived();
        setProposalData(data);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      }
    };
    loadProposals();
  }, []);

  // Map API data to Proposal type
  const mapProposals = (data: ProposalData[]): Proposal[] => {
    return data.map((item) => ({
      id: item._id.toString(),
      title: item.jobId.title,
      sender: item.freelancerId.fullName,
      receiver: 'Your Company',
      date: new Date(item.createdAt).toISOString().split('T')[0],
      status: item.status as 'pending' | 'accepted' | 'rejected',
      viewed: item.viewedByReceiver,
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

  const handleAcceptProposal = (proposal: Proposal) => {
    setProposalData((prev) =>
      prev.map((item) =>
        item._id.toString() === proposal.id ? { ...item, status: 'accepted' } : item
      )
    );
    setFilteredProposals((prev) =>
      prev.map((p) => (p.id === proposal.id ? { ...p, status: 'accepted' } : p))
    );
    setIsModalOpen(false);
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
    </div>
  );
};

export default Proposals;