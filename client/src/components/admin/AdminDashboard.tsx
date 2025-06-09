 
import React, { useEffect, useState } from 'react';
import { Users, Briefcase, DollarSign, TrendingUp, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from './Sidebar';
import { fetchMonthlyRevenueStats, fetchPlatformRevenue, fetchTotalActiveJobsCount, fetchUsers } from '../../api';
// import { useJobs } from '../../hooks/customhooks/useJobs';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueData, setRevenueData] = useState([]);

   const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    const getusers = async () => {
      const response = await fetchUsers();
      setTotalCount(response.meta.total);
    }
    getusers()
  }, [])

  useEffect(() => {
    const totalActiveJobs = async () => {
      const count = await fetchTotalActiveJobsCount()
      setTotalJobs(count)
    }
    totalActiveJobs()
  }, [])

  useEffect(() => {
    const platformRevenu = async () => {
      const totalRevenue = await fetchPlatformRevenue()
      setTotalRevenue(totalRevenue)
    }
    platformRevenu()
  }, [])

  useEffect(() => {
    const loadRevenueStats = async () => {
      try {
        const stats = await fetchMonthlyRevenueStats();
        // Transform the API data to match the chart format
        const transformedData = stats.map(item => ({
          month: item.month,
          revenue: item.earnings || 0
        }));
        setRevenueData(transformedData);
      } catch (error) {
        console.error('Error loading revenue stats:', error);
        setRevenueData([]);
      }
    }
    loadRevenueStats();
  }, [])

  const stats = [
    { title: 'Total Users', value: totalCount, change: '+12%', icon: Users, color: 'bg-blue-500' },
    { title: 'Active Jobs', value: totalJobs, change: '+8%', icon: Briefcase, color: 'bg-green-500' },
    { title: 'Revenue', value: totalRevenue, change: '+23%', icon: DollarSign, color: 'bg-purple-500' },
    { title: 'Growth Rate', value: '18.2%', change: '+5%', icon: TrendingUp, color: 'bg-orange-500' }
  ];

  const recentJobs = [
    { id: 1, title: 'Full Stack Developer', client: 'TechCorp', budget: '$5,000', status: 'active' },
    { id: 2, title: 'UI/UX Designer', client: 'StartupXYZ', budget: '$2,500', status: 'pending' },
    { id: 3, title: 'Content Writer', client: 'BlogMedia', budget: '$800', status: 'completed' },
    { id: 4, title: 'Mobile App Developer', client: 'AppStudio', budget: '$8,000', status: 'active' }
  ];

  // const topFreelancers = [
  //   { name: 'Sarah Johnson', rating: 4.9, jobs: 127, earnings: '$45,230' },
  //   { name: 'Mike Chen', rating: 4.8, jobs: 98, earnings: '$38,950' },
  //   { name: 'Elena Rodriguez', rating: 4.9, jobs: 156, earnings: '$52,100' }
  // ];

  const StatCard = ({ stat }) => {
    const Icon = stat.icon;
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-green-600 text-sm">{stat.change} from last month</p>
          </div>
          <div className={`${stat.color} p-3 rounded-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen ml-64 bg-gray-300">
      {/* <Sidebar
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      /> */}
       <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />

       <div className="flex-1 ml-0  ">
    {/* Toggle button for mobile */}
    <button
      className="md:hidden m-4 p-2 bg-blue-600 text-white rounded"
      onClick={toggleSidebar}
    >
      Toggle Sidebar
    </button>

      <div className="fixed top-0 w-full z-50 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="pt-25 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
              <TrendingUp className="w-5 h-5 text-gray-500" />
            </div>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Loading revenue data...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
              <Eye className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{job.budget}</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
     </div> 
  );
};

export default AdminDashboard;