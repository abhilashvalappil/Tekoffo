import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  MessageSquare,
  ExternalLink,
  DollarSign,
  Users,
  FileText,
  Clock,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {logout} from '../../../redux/services/authService'
import { AppDispatch, RootState } from '../../../redux/store';
import Navbar from './Navbar';

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
 

  const navItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', id: 'overview' },
    // { icon: <Briefcase className="h-5 w-5" />, label: 'Post a Job', id: 'post' },
    { icon: <Briefcase className="h-5 w-5" />, label: 'Post a Job', id: 'post', path: '/client/post-job' },
    { icon: <ClipboardList className="h-5 w-5" />, label: 'My Job Posts', id: 'my-jobs', path: '/client/myjobs' },
    { icon: <Users className="h-5 w-5" />, label: 'Talent', id: 'talent', path: '/client/freelancers'  },
    { icon: <FileText className="h-5 w-5" />, label: 'Proposals', id: 'proposals', path: '/client/proposals' },
    // { icon: <FileText className="h-5 w-5" />, label: 'Projects', id: 'projects' },
    { icon: <MessageSquare className="h-5 w-5" />, label: 'Messages', id: 'messages' },
  ];

  const userId = useSelector((state: RootState) => state.auth.user?._id || null)
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

    useEffect(() => {
      if (!userId) {
        navigate("/signin");  
      }
    }, [userId, navigate]);

     const handleLogout = async() => {
        try {
          if(userId){
            const result = await dispatch(logout(userId)).unwrap();
            console.log("Logout successful:", result);
            // persistor.purge(); 
            navigate("/signin");
          }
          
        } catch (error) {
          console.error("Logout failed:", error);
        }
      }

  const activeProjects = [
    {
      id: 1,
      title: 'E-commerce Website Development',
      freelancer: 'Sarah Johnson',
      progress: 75,
      deadline: '2 weeks left',
      budget: '$4,500',
    },
    {
      id: 2,
      title: 'Mobile App UI Design',
      freelancer: 'Michael Chen',
      progress: 40,
      deadline: '1 month left',
      budget: '$2,800',
    },
    {
      id: 3,
      title: 'Backend API Development',
      freelancer: 'Alex Rodriguez',
      progress: 90,
      deadline: '3 days left',
      budget: '$3,200',
    },
  ];

  const topTalent = [
    {
      id: 1,
      name: 'Emma Wilson',
      role: 'Full Stack Developer',
      rating: 4.9,
      hourlyRate: '$65/hr',
      skills: ['React', 'Node.js', 'MongoDB'],
    },
    {
      id: 2,
      name: 'David Kim',
      role: 'UI/UX Designer',
      rating: 4.8,
      hourlyRate: '$55/hr',
      skills: ['Figma', 'Adobe XD', 'Webflow'],
    },
    {
      id: 3,
      name: 'Lisa Chen',
      role: 'Frontend Developer',
      rating: 4.9,
      hourlyRate: '$60/hr',
      skills: ['React', 'Vue.js', 'Tailwind'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation Bar */}
      <Navbar navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="pt-16 p-8">
        {/* Header */}
        <header className="max-w-7xl mx-auto mb-8">
          <h1 className="text-2xl font-bold text-[#0A142F]">Welcome back, {user?.username}!</h1>
          <p className="text-gray-600">Manage your projects and find top talent.</p>
        </header>

        <div className="max-w-7xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: <DollarSign className="h-6 w-6" />, label: 'Total Spent', value: '$24,500', trend: '$3,500 this month' },
              { icon: <Briefcase className="h-6 w-6" />, label: 'Active Projects', value: '8', trend: '+2 new' },
              { icon: <Users className="h-6 w-6" />, label: 'Hired Talent', value: '12', trend: '+3 this month' },
              { icon: <Clock className="h-6 w-6" />, label: 'Avg. Completion', value: '12 days', trend: '-2 days' },
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
                <button className="text-[#0A142F] hover:text-[#0A142F]/80 text-sm font-medium">View All</button>
              </div>
              <div className="space-y-6">
                {activeProjects.map((project) => (
                  <div key={project.id} className="border-2 rounded-lg p-4 hover:border-[#0A142F] transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-[#0A142F]">{project.title}</h3>
                        <p className="text-sm text-gray-600">by {project.freelancer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#0A142F]">{project.budget}</p>
                        <p className="text-sm text-gray-600">{project.deadline}</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className="bg-[#0A142F] h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{project.progress}% Complete</span>
                      <button className="px-4 py-1 bg-[#0A142F] text-white rounded-lg hover:bg-[#0A142F]/90 transition-colors text-sm font-medium flex items-center">
                        View Details
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Talent */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#0A142F] mb-6">Recommended Talent</h2>
              <div className="space-y-4">
                {topTalent.map((talent) => (
                  <div key={talent.id} className="p-4 border-2 rounded-lg hover:border-[#0A142F] transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-[#0A142F]">{talent.name}</h3>
                        <p className="text-sm text-gray-600">{talent.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#0A142F]">{talent.hourlyRate}</p>
                        <p className="text-sm text-yellow-500">★ {talent.rating}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {talent.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-[#0A142F]/10 text-[#0A142F] rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2 bg-[#0A142F] text-white rounded-lg hover:bg-[#0A142F]/90 transition-colors text-sm font-medium">
                Browse All Talent
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ClientDashboard;