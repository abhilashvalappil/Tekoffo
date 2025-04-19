import React, { useState } from 'react';
import {
  Clock,
  Briefcase,
  Tags,
  DollarSign,
  Calendar,
  ChevronRight,
  Filter,
  Search,
  X,
  LayoutDashboard,
  Send,
  MessageSquare,
  Wallet,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/services/authService';
import { persistor, RootState } from '../../redux/store';
import { useJobs } from '../../hooks/useJobs';
import Navbar from './Navbar'; // Adjust the path based on your file structure
import { userENDPOINTS } from '../../constants/endpointUrl';

// Utility function to calculate "posted" time
const getPostedTime = (createdAt: string): string => {
  const now = new Date();
  const posted = new Date(createdAt);
  const diffMs = now.getTime() - posted.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

// Map category IDs to human-readable names (adjust based on your backend)
const categoryMap: { [key: string]: string } = {
  '1744261565186': 'Web Development',
  '1744261537338': 'UI/UX Design',
  '1744261489814': 'Frontend Development',
};

const AvailableJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [budgetRange, setBudgetRange] = useState({ min: '', max: '' });
  const [activeTab, setActiveTab] = useState('jobs');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { jobs: rawJobs, loading, error } = useJobs(userENDPOINTS.GET_POSTED_JOBS);

  // Transform API data to match UI expectations
  const jobs = rawJobs.map((job: any) => ({
    id: job._id,
    title: job.title || 'Untitled Job', // Fallback for empty title
    category: categoryMap[job.category] || 'Unknown Category', // Map ID to name
    subcategory: job.subCategory, // Rename to match UI
    description: job.description,
    // requirements: job.requirements.split(',').map((req: string) => req.trim()), // Parse string to array
    requirements: job.requirements,
    budget: job.budget.toString(), // Ensure string for filtering
    duration: job.duration,
    posted: getPostedTime(job.created_At),
  }));

  // Get unique categories and subcategories for filters
  const categories = [...new Set(jobs.map((job) => job.category))];
  const subcategories = [...new Set(jobs.map((job) => job.subcategory))];

  if (loading) return <p className="text-center py-8">Loading jobs...</p>;
  if (error) return <p className="text-center py-8 text-red-500">Error: {error}</p>;

  // Filter jobs based on search term and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || job.category === selectedCategory;
    const matchesSubcategory = !selectedSubcategory || job.subcategory === selectedSubcategory;
    const matchesBudget =
      (!budgetRange.min || parseInt(job.budget) >= parseInt(budgetRange.min)) &&
      (!budgetRange.max || parseInt(job.budget) <= parseInt(budgetRange.max));

    return matchesSearch && matchesCategory && matchesSubcategory && matchesBudget;
  });

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setBudgetRange({ min: '', max: '' });
  };

  const handleLogout = async () => {
    try {
      if (user?._id) {
        const result = await dispatch(logout(user._id)).unwrap();
        console.log('Logout successful:', result);
        persistor.purge();
        navigate('/signin');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', id: 'overview', path: '/freelancer-dashboard' },
    { icon: <Briefcase className="h-5 w-5" />, label: 'Find Jobs', id: 'jobs', path: '/freelancer/jobs' },
    { icon: <Send className="h-5 w-5" />, label: 'Proposals', id: 'proposals' },
    { icon: <Clock className="h-5 w-5" />, label: 'Active Jobs', id: 'active' },
    { icon: <MessageSquare className="h-5 w-5" />, label: 'Messages', id: 'messages' },
    { icon: <Wallet className="h-5 w-5" />, label: 'Earnings', id: 'earnings' },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0A142F]">
      {/* Navbar */}
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
      <main className="pt-20 p-4 md:p-20 bg-[#F8FAFC] z-10 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-[#0A142F]">
                Available Jobs
              </h1>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <Filter size={20} className="text-[#0A142F]" />
                <span className="text-[#0A142F]">Filter Jobs</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search jobs by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A142F]/20"
              />
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold">Filters</h2>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-[#0A142F]/70 hover:text-[#0A142F] flex items-center gap-1"
                  >
                    <X size={16} />
                    Reset
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subcategory</label>
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg"
                    >
                      <option value="">All Subcategories</option>
                      {subcategories.map((subcategory) => (
                        <option key={subcategory} value={subcategory}>
                          {subcategory}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Budget Range</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={budgetRange.min}
                        onChange={(e) =>
                          setBudgetRange((prev) => ({ ...prev, min: e.target.value }))
                        }
                        className="w-1/2 p-2 border border-gray-200 rounded-lg"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={budgetRange.max}
                        onChange={(e) =>
                          setBudgetRange((prev) => ({ ...prev, max: e.target.value }))
                        }
                        className="w-1/2 p-2 border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Jobs Grid */}
          <div className="grid gap-6">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-8 text-[#0A142F]/70">
                No jobs found matching your criteria
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg md:text-xl font-semibold text-[#0A142F] mb-2">
                        {job.title}
                      </h2>
                      <div className="flex flex-wrap md:flex-nowrap items-center gap-4 text-sm text-[#0A142F]/70 mb-3">
                        <div className="flex items-center gap-1">
                          <Briefcase size={16} />
                          <span>{job.category}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tags size={16} />
                          <span>{job.subcategory}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{job.posted}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className="text-[#0A142F]/40 group-hover:text-[#0A142F] transition-colors"
                      size={24}
                    />
                  </div>

                  <p className="text-[#0A142F]/70 mb-4 line-clamp-2">{job.description}</p>

                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-[#0A142F] mb-2">Requirements:</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-50 rounded-full text-sm text-[#0A142F]/70"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between pt-4 border-t border-gray-100 gap-4 md:gap-0">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-[#0A142F]">
                        <DollarSign size={20} />
                        <span className="font-semibold">${job.budget}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#0A142F]">
                        <Calendar size={20} />
                        <span>{job.duration}</span>
                      </div>
                    </div>
                    <button className="w-full md:w-auto px-4 py-2 bg-[#0A142F] text-white hover:bg-[#0A142F]/90 rounded-lg transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AvailableJobs;