import React, { useEffect, useState } from 'react';
import {Briefcase,Send,Star,ExternalLink,DollarSign, CheckCircle} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../redux/services/authService';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, persistor, RootState } from '../../../redux/store';
import Navbar from '../shared/Navbar'; 
import { navItems } from '../shared/NavbarItems';
import Footer from '../../shared/Footer';
import { IWallet } from '../../../types/wallet';
import { fetchActiveAndCompletedContracts, fetchAppliedProposalsByFreelancer, fetchWallet, submitProposal } from '../../../api';
import { handleApiError } from '../../../utils/errors/errorHandler';
import { JobDataType, useJobs } from '../../../hooks/customhooks/useJobs';
import { userENDPOINTS } from '../../../constants/endpointUrl';
import { useFetchContracts } from '../../../hooks/customhooks/useFetchContracts';
import { AppliedProposal } from '../../../types/proposalTypes';
 
function FreelancerHome() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
   const [wallet, setWallet] = useState<IWallet | null>(null);
   const [activeContractsCount, setActiveContractsCount] = useState<number>();
   const [completedJobsCount, setCompletedJobsCount] = useState<number>();
  //  const [isApplied, setIsApplied] = useState<boolean>(false);
   const [appliedProposals, setAppliedProposals] = useState<{ data: AppliedProposal[] }>({ data: [] });

  const userId = useSelector((state: RootState) => state.auth.user?._id || null);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { jobs, loading, error } = useJobs(userENDPOINTS.GET_POSTED_JOBS, 1, 4);

    const {contracts} = useFetchContracts();
  
    const filteredActiveContracts = contracts
      ?.filter(contract => contract.contractStatus === 'active')
      .slice(0, 5);

  useEffect(() => {
    if (!userId) {
      navigate('/signin');
    }
  }, [userId, navigate]);

   useEffect(() => {
      loadWallet();
      loadActiveAndCompletedContracts();
      loadProposals()
    }, []);

    const loadWallet = async() => {
      try {
        const data = await fetchWallet();
        setWallet(data);
      } catch (error) {
        handleApiError(error)
      }
    };

    const loadActiveAndCompletedContracts = async() => {
      try {
        const {activeContracts,completedContracts} = await fetchActiveAndCompletedContracts()
        setActiveContractsCount(activeContracts)
        setCompletedJobsCount(completedContracts)
      } catch (error) {
        handleApiError(error)
      }
    }

    const loadProposals = async() => {
      try {
        const appliedProposals = await fetchAppliedProposalsByFreelancer();
        console.log('console from applied proposals =======',appliedProposals)
        setAppliedProposals(appliedProposals)         
      } catch (error) {
        handleApiError(error)
      }
    }
        
    const appliedJobIds = appliedProposals.data.map(proposal => proposal.jobId);

       

  const handleLogout = async () => {
    try {
      if (userId) {
        const result = await dispatch(logout(userId)).unwrap();
        console.log('Logout successful:', result);
        persistor.purge();
        navigate('/signin');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleApply = async(job:JobDataType) => {
     try {
        // setIsApplied(true);
        const proposalDetails = new FormData()
        proposalDetails.append("jobId",job._id);
        proposalDetails.append("clientId",job.clientId._id) 
        proposalDetails.append('proposedBudget', job.budget.toString());
        proposalDetails.append('duration', job.duration);

       await submitProposal(proposalDetails);
       await loadProposals(); 
     } catch (error) {
      handleApiError(error)
     }
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Use the Navbar Component */}
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
      <main className="pt-20 p-8">
        {/* Header */}
        <header className="max-w-7xl mx-auto mb-8">
          <h1 className="text-2xl font-bold text-[#0A142F]">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600">Let's find your next opportunity.</p>
        </header>

        <div className="max-w-7xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: <DollarSign className="h-6 w-6" />, label: 'Available Balance', value: wallet?.currentBalance, trend: '+$850' },
              { icon: <Star className="h-6 w-6" />, label: 'Job Success Score', value: '98%', trend: '+2%' },
              { icon: <Send className="h-6 w-6" />, label: 'Active Contracts', value: activeContractsCount, trend: '+3' },
              { icon: <Briefcase className="h-6 w-6" />, label: 'Completed Jobs', value: completedJobsCount, trend: '+4' },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#0A142F] rounded-lg">
                    {React.cloneElement(stat.icon, { className: 'h-6 w-6 text-white' })}
                  </div>
                  <span className="text-green-500 text-sm font-medium">{stat.trend}</span>
                </div>
                <h3 className="text-gray-600 text-sm mb-1">{stat.label}</h3>
                <p className="text-2xl font-bold text-[#0A142F]">{stat.value}</p>
              </div>
            ))}
          </div>
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recommended Jobs */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#0A142F]">Recommended Jobs</h2>
                <button className="text-[#0A142F] hover:text-[#0A142F]/80 text-sm font-medium">
                  View All
                </button>
              </div>
              
     <div className="space-y-6">
      {jobs.map((job) => (
        <div
          key={job._id}
          className="border-2 rounded-lg p-4 hover:border-[#0A142F] transition-colors"
        >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-[#0A142F]">{job.title}</h3>
          <p className="text-sm text-gray-600">{job.category} / {job.subCategory}</p>
        </div>
        <div className="text-right">
          <p className="font-medium text-[#0A142F]">{job.budget || 'N/A'}</p>
        </div>
      </div>

      {/* {job.requirements?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {job.requirements.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-[#0A142F] text-white rounded-full text-[10px]"
            >
              {skill}
            </span>
          ))}
        </div>
      )} */}

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{job.createdAt ? new Date(job.createdAt).toLocaleString() : 'Recently posted'}</span>
        <button 
         onClick={() =>handleApply(job)}
        //  disabled={isApplied}
        disabled={appliedJobIds.includes(job._id)}
        className={`px-4 py-1 rounded-lg transition-colors text-sm font-medium flex items-center ${
  appliedJobIds.includes(job._id) ? 'bg-[#0A142F] text-white' : 'bg-[#0A142F] text-white hover:bg-[#0A142F]/90'
}`}
      >
       {appliedJobIds.includes(job._id) ? (
    <>
      Applied
      <CheckCircle className="h-4 w-4 ml-1" />
    </>
  ) : (
    <>
      Apply Now
      <ExternalLink className="h-4 w-4 ml-1" />
    </>
  )}
        </button>
      </div>
    </div>
  ))}
</div>
</div>

            {/* contracts */}
              <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-[#0A142F] mb-6 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-[#0A142F]" />
        Active Contracts
      </h2>
      <div className="space-y-4">
        {filteredActiveContracts && filteredActiveContracts.length > 0 ? (
          <div className="space-y-4">
            {filteredActiveContracts.map(contract => (
              <div
                key={contract._id}
                className="border rounded-lg p-4 shadow hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">
                  {contract.jobId?.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Client: {contract.clientId.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  Amount: ${contract.amount}
                </p>
                <p className="text-sm text-gray-600">
                  Started At: {new Date(contract.startedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  Status: {contract.contractStatus}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No active contracts found.</p>
        )}
      </div>
      <button
        onClick={() => navigate('/freelancer/contracts')}
        className="mt-4 w-full py-2 bg-[#0A142F] text-white rounded-lg hover:bg-[#0A142F]/90 transition-colors text-sm font-medium"
      >
        View All Contracts
      </button>
    </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default FreelancerHome;