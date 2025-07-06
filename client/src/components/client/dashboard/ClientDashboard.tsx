import React, { useEffect, useState } from 'react';
import {Briefcase,DollarSign, CheckCircle, Handshake} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../redux/store';
import { fetchActiveJobPosts, fetchClientProfile } from '../../../api';
import { JobDataType } from '../../../types/invitationTypes';
import { UserProfileResponse } from '../../../types/userTypes';
import { useFetchContracts } from '../../../hooks/customhooks/useFetchContracts';


const ClientDashboard = () => {
  const [activeJobsCount, setActiveJobsCount] = useState<number>();
  const [completedJobsCount, setCompletedJobsCount] = useState<number>();
  const [activeContractsCount,setActiveContractsCount] = useState<number>();
  const [aciveJobs, setActiveJobs] = useState<JobDataType[]>([]);
  const [profileData,setProfileData] = useState<UserProfileResponse>();

  const userId = useSelector((state: RootState) => state.auth.user?._id || null)
  const user = useSelector((state: RootState) => state.auth.user)

  const {contracts} = useFetchContracts();
  const navigate = useNavigate();

  const filteredActiveContracts = contracts
    ?.filter(contract => contract.contractStatus === 'active')
    .slice(0, 5);

    useEffect(() => {
      if (!userId) {
        navigate("/signin");  
      }
    }, [userId, navigate]);

    useEffect(() => {
      const getTotalSpent = async()=>{
        if (!userId) return;
        const profile = await fetchClientProfile(userId)
        setProfileData(profile)
      }
      getTotalSpent()
    },[userId])

    useEffect(() => {
      const loadActiveProjects = async() => {
        const { count, jobs, completed,activeContracts } = await fetchActiveJobPosts()
        setActiveJobsCount(count)
        setCompletedJobsCount(completed)
        setActiveJobs(jobs)
        setActiveContractsCount(activeContracts)
      }
      loadActiveProjects()
    },[])
 
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Main Content */}
      <main className="pt-20 p-4 md:ml-60">

        {/* Header */}
        <header className="max-w-7xl mx-auto mb-8">
          <h1 className="text-2xl font-bold text-[#0A142F]">Welcome back, {user?.username}!</h1>
          <p className="text-gray-600">Manage your projects and find top talent.</p>
        </header>

        <div className="max-w-7xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: <DollarSign className="h-6 w-6" />, label: 'Total Spent', value: profileData?.total_Spent, trend: '' },
              { icon: <Briefcase className="h-6 w-6" />, label: 'Active Projects', value: activeJobsCount, trend: '' },
              { icon: <CheckCircle className="h-6 w-6" />, label: 'Completed Projects', value: completedJobsCount, trend: '' },
              { icon: <Handshake className="h-6 w-6" />, label: 'Active Contracts', value: activeContractsCount, trend: '' },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
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
            {/* Active Projects */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#0A142F]">Active Projects</h2>
                {/* <button className="text-[#0A142F] hover:text-[#0A142F]/80 text-sm font-medium">View All</button> */}
              </div>
              
              <div className="space-y-6">
                {aciveJobs.length > 0 ? (
                  aciveJobs.map((job) => (
                    <div key={job._id} className="border-2 rounded-lg p-4 hover:border-[#0A142F] transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-[#0A142F]">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.category} / {job.subCategory}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-[#0A142F]">${job.budget}</p>
                          <p className="text-sm text-gray-600">{job.duration}</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-[#0A142F] h-2 rounded-full"
                          style={{ width: job.status === 'inprogress' ? '50%' : job.status === 'completed' ? '100%' : '0%' }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 capitalize">{job.status}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No active jobs found.</p>
                )}
              </div>
            </div>

        {/* contracts*/}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#0A142F] mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#0A142F]" />
              Active Contracts
            </h2>
            <div className="space-y-4">
              {/* <h2 className="text-xl font-bold mb-4">Active Contracts</h2> */}
        {filteredActiveContracts && filteredActiveContracts.length > 0 ? (
          <div className="space-y-4">
            {filteredActiveContracts.map(contract => (
              <div
                key={contract._id}
                className="border rounded-lg p-4 shadow hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">
                  {contract.job.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Freelancer: {contract.freelancer.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  Amount: ${contract.amount}
                </p>
                <p className="text-sm text-gray-600">
                  Started At: {new Date(contract.createdAt).toLocaleDateString()}
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
          onClick={() => navigate('/client/contracts')}
          className="mt-4 w-full py-2 bg-[#0A142F] text-white rounded-lg hover:bg-[#0A142F]/90 transition-colors text-sm font-medium">
            View All Contracts
          </button>
        </div>
              </div>
            </div>
          </main>
        </div>
      );
    }

  export default ClientDashboard;