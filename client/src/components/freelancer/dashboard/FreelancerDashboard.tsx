import React, { useEffect, useState } from 'react';
import {Briefcase,Send,Wallet,Search,Star,CheckCircle,Filter,ExternalLink,DollarSign} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../redux/services/authService';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, persistor, RootState } from '../../../redux/store';
import Navbar from '../shared/Navbar'; 
import { navItems } from '../shared/NavbarItems';
import Footer from '../../shared/Footer';

function FreelancerHome() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const userId = useSelector((state: RootState) => state.auth.user?._id || null);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/signin');
    }
  }, [userId, navigate]);

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

  const notifications = [
    { id: 1, type: 'job', text: 'New job match: React Developer needed', time: '5m ago' },
    { id: 2, type: 'proposal', text: 'Proposal shortlisted for Web App Project', time: '1h ago' },
    { id: 3, type: 'payment', text: 'Payment received: $850.00', time: '2h ago' },
  ];

  const recommendedJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'Tech Innovators',
      budget: '$3000-$5000',
      type: 'Fixed Price',
      skills: ['React', 'TypeScript', 'Node.js'],
      posted: '2h ago',
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'Digital Solutions',
      budget: '$50/hr',
      type: 'Hourly',
      skills: ['React', 'Tailwind CSS', 'REST API'],
      posted: '4h ago',
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'StartUp Vision',
      budget: '$4000-$6000',
      type: 'Fixed Price',
      skills: ['React', 'Node.js', 'MongoDB'],
      posted: '5h ago',
    },
  ];

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
      <main className="pt-16 p-8">
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
              { icon: <DollarSign className="h-6 w-6" />, label: 'Available Balance', value: '$2,450', trend: '+$850' },
              { icon: <Star className="h-6 w-6" />, label: 'Job Success Score', value: '98%', trend: '+2%' },
              { icon: <Send className="h-6 w-6" />, label: 'Active Proposals', value: '12', trend: '+3' },
              { icon: <Briefcase className="h-6 w-6" />, label: 'Completed Jobs', value: '156', trend: '+4' },
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

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for jobs..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A142F] focus:border-transparent"
                />
              </div>
              <button className="flex items-center px-4 py-2 text-[#0A142F] border-2 border-[#0A142F] rounded-lg hover:bg-[#0A142F] hover:text-white transition-colors">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </button>
            </div>
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
                {recommendedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="border-2 rounded-lg p-4 hover:border-[#0A142F] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-[#0A142F]">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#0A142F]">{job.budget}</p>
                        <p className="text-sm text-gray-600">{job.type}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#0A142F] text-white rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{job.posted}</span>
                      <button className="px-4 py-1 bg-[#0A142F] text-white rounded-lg hover:bg-[#0A142F]/90 transition-colors text-sm font-medium flex items-center">
                        Apply Now
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#0A142F] mb-6">Recent Updates</h2>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start space-x-3 p-3 hover:bg-[#0A142F]/5 rounded-lg transition-colors"
                  >
                    {notification.type === 'job' && (
                      <Briefcase className="h-5 w-5 text-[#0A142F]" />
                    )}
                    {notification.type === 'proposal' && (
                      <CheckCircle className="h-5 w-5 text-[#0A142F]" />
                    )}
                    {notification.type === 'payment' && (
                      <Wallet className="h-5 w-5 text-[#0A142F]" />
                    )}
                    <div>
                      <p className="text-sm text-[#0A142F]">{notification.text}</p>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2 bg-[#0A142F] text-white rounded-lg hover:bg-[#0A142F]/90 transition-colors text-sm font-medium">
                View All Updates
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