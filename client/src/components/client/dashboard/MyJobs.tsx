import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Briefcase, Tags, DollarSign, Calendar, ChevronRight, Filter, Search, X, Trash2, Home, FileText, PlusCircle } from 'lucide-react';
import { updateJobPost, deleteJobPost, fetchJobs } from '../../../api';
import Navbar from '../shared/Navbar';
import { navItems } from '../shared/NavbarItems';
import { JobFormSchema, JobFormData } from '../../../utils/validations/JobFormValidation';
import { handleApiError } from '../../../utils/errors/errorHandler';
import { usePagination } from '../../../hooks/customhooks/usePagination';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Footer from '../../shared/Footer';

interface JobPost {
  id: string;
  title: string;
  category: string;
  subCategory: string;
  description: string;
  requirements: string[];
  budget: number;
  duration: string;
  status?: string;
}

interface NavItem {
  icon: JSX.Element;
  label: string;
  id: string;
  path?: string;
}

const MyJobPosts = () => {
  const [myJobPosts, setMyJobPosts] = useState<JobPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('my-jobs');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const {
    pagination,
    handlePageChange,
    updateMeta,
  } = usePagination({ total: 0, page: 1, pages: 1, limit: 4 });

  const categoryMap: { [key: string]: string } = {
    '1744261565186': 'Data Analysis',
    'Design': 'Design',
  };

  // const navItems: NavItem[] = [
  //   { id: 'dashboard', label: 'Dashboard', icon: <Home size={16} />, path: '/client-dashboard' },
  //   { id: 'my-jobs', label: 'My Jobs', icon: <FileText size={16} />, path: '/client/jobs' },
  //   { id: 'post-job', label: 'Post a Job', icon: <PlusCircle size={16} />, path: '/client/post-job' },
  // ];

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const  paginatedResponse   = await fetchJobs(pagination.page, pagination.limit);
        // const jobsArray = Array.isArray(data?.result?.jobs) ? data.result.jobs : [];
        const jobsArray = Array.isArray(paginatedResponse.data) ? paginatedResponse.data : [];
        const mappedJobs: JobPost[] = jobsArray.map((job: any) => ({
          id: job._id || '',
          title: job.title || 'Untitled Job',
          category: categoryMap[job.category] || job.category || 'Uncategorized',
          subCategory: job.subCategory || 'Not specified',
          description: job.description || 'No description provided',
          requirements: typeof job.requirements === 'string'
            ? job.requirements.split('\n').filter(req => req.trim() !== '')
            : Array.isArray(job.requirements)
            ? job.requirements
            : [],
          budget: job.budget || 0,
          duration: job.duration || 'Not specified',
          status: job.status || 'open',
        }));
        setMyJobPosts(mappedJobs);
         updateMeta(paginatedResponse.meta.total,  paginatedResponse.meta.pages);
      } catch (err) {
        const errormessage = handleApiError(err)
        setError(errormessage);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, [pagination.page, pagination.limit]);

  const categories = [...new Set(myJobPosts.map(job => job.category))];
  const subCategories = [...new Set(myJobPosts.map(job => job.subCategory))];
  const statuses = [...new Set(myJobPosts.map(job => job.status))];

  const handleDeleteJob = async(id: string) => {
    if (window.confirm('Are you sure you want to delete this job post?')) {
      setMyJobPosts(myJobPosts.filter(job => job.id !== id));
    }
    try {
      await deleteJobPost(id)
      setMyJobPosts(myJobPosts.filter(job => job.id !== id));
      toast.success('Job post deleted successfully!');
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  const handleEditJob = (job: JobPost) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleSaveJob = async (updatedJob: JobPost) => {
    try {
      await updateJobPost(updatedJob);
      setMyJobPosts(myJobPosts.map(job => (job.id === updatedJob.id ? updatedJob : job)));
      setIsModalOpen(false);
      setSelectedJob(null);
      toast.success('Job post updated successfully!');
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

   

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const filteredJobs = myJobPosts.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || job.category === selectedCategory;
    const matchesSubCategory = !selectedSubCategory || job.subCategory === selectedSubCategory;
    const matchesStatus = !selectedStatus || job.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesSubCategory && matchesStatus;
  });

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSelectedStatus('');
  };

  const EditJobModal = ({ job, onSave, onClose }: { job: JobPost; onSave: (job: JobPost) => void; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      title: job.title,
      category: job.category,
      subCategory: job.subCategory,
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : job.requirements,
      budget: job.budget.toString(),
      duration: job.duration,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      // Clear error for the field when user starts typing
      setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      // Prepare data for validation
      const validationData: JobFormData = {
        ...formData,
        budget: parseFloat(formData.budget),
        requirements: formData.requirements.split('\n').filter(req => req.trim() !== ''),
      };

      // Validate with Zod
      const result = JobFormSchema.safeParse(validationData);

      if (!result.success) {
        // Extract errors
        const fieldErrors: Partial<Record<keyof JobFormData, string>> = {};
        result.error.issues.forEach(issue => {
          const field = issue.path[0] as keyof JobFormData;
          fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
        toast.error('Please fix the form errors before submitting.');
        return;
      }

      // If validation passes, prepare the updated job
      const updatedJob: JobPost = {
        ...job,
        ...result.data,
        requirements: result.data.requirements,
      };

      onSave(updatedJob);
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#0A142F]">Edit Job Post</h2>
            <button onClick={onClose} className="text-[#0A142F]/70 hover:text-[#0A142F]">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.title ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.category ? 'border-red-500' : 'border-gray-200'}`}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Subcategory</label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.subCategory ? 'border-red-500' : 'border-gray-200'}`}
              >
                <option value="">Select Subcategory</option>
                {subCategories.map(subCategory => (
                  <option key={subCategory} value={subCategory}>{subCategory}</option>
                ))}
              </select>
              {errors.subCategory && <p className="text-red-500 text-sm mt-1">{errors.subCategory}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
                rows={4}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Requirements (one per line)</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.requirements ? 'border-red-500' : 'border-gray-200'}`}
                rows={4}
              />
              {errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Budget</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.budget ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.duration ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-[#0A142F] rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0A142F] text-white rounded-lg hover:bg-[#0A142F]/90"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-[#0A142F]">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Navbar navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="pt-16 p-4 md:p-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-[#0A142F]">
                My Job Posts
              </h1>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <Filter size={20} className="text-[#0A142F]" />
                <span className="text-[#0A142F]">Filter Jobs</span>
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search your job posts by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A142F]/20"
              />
            </div>
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
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subcategory</label>
                    <select
                      value={selectedSubCategory}
                      onChange={(e) => setSelectedSubCategory(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg"
                    >
                      <option value="">All Subcategories</option>
                      {subCategories.map(subCategory => (
                        <option key={subCategory} value={subCategory}>{subCategory}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg"
                    >
                      <option value="">All Statuses</option>
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="grid gap-6">
            {loading ? (
              <div className="text-center py-8 text-[#0A142F]/70">Loading job posts...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-8 text-[#0A142F]/70">
                No job posts found matching your criteria
              </div>
            ) : (
              filteredJobs.map(job => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg md:text-xl font-semibold text-[#0A142F] mb-2">{job.title}</h2>
                      <div className="flex flex-wrap md:flex-nowrap items-center gap-4 text-sm text-[#0A142F]/70 mb-3">
                        <div className="flex items-center gap-1">
                          <Briefcase size={16} />
                          <span>{job.category} {job.subCategory ? `| ${job.subCategory}` : ''}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tags size={16} />
                          <span>{job.status?.charAt(0).toUpperCase() + (job.status?.slice(1) || '')}</span>
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
                      {Array.isArray(job.requirements) && job.requirements.length > 0 ? (
                        job.requirements.map((req, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-50 rounded-full text-sm text-[#0A142F]/70"
                          >
                            {req}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#0A142F]/70">No requirements listed</span>
                      )}
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditJob(job)}
                        className="w-full md:w-auto px-4 py-2 bg-[#0A142F] text-white hover:bg-[#0A142F]/90 rounded-lg transition-colors"
                      >
                        Edit Job
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="w-full md:w-auto px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} className="inline mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <Stack spacing={2} alignItems="center" className="mt-4">
            <Pagination
              count={pagination.pages}
              page={pagination.page}
              onChange={(_, value) => handlePageChange(value)}
              color="primary"
            />
          </Stack>
      </div>
      {isModalOpen && selectedJob && (
        <EditJobModal job={selectedJob} onSave={handleSaveJob} onClose={handleCloseModal} />
      )}
       <Footer />
    </div>
  );
};

export default MyJobPosts;