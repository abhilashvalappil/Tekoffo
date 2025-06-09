import React, { useState, useEffect } from 'react';
import { Briefcase, FileText, FolderTree, ScrollText, DollarSign, Clock} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import ClientNavbar from '../shared/Navbar';
import { clientNavItems } from '../shared/NavbarItems';
import { createJob } from '../../../api';
import { JobFormSchema, JobFormData } from '../../../utils/validations/JobFormValidation';
import { fetchListedCategories } from '../../../api';
import { useNavigate } from 'react-router-dom';
import Footer from '../../shared/Footer';
import { Category } from '../../../types/jobTypes';


// type FormErrors = Partial<Record<keyof JobFormData, string>>;
type FormErrors = Partial<Record<keyof JobFormData, string>> & { general?: string };


const PostJob: React.FC = () => {
  const [activeTab, setActiveTab] = useState('post');
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    category: '',
    subCategory: '',
    requirements: [],
    description: '',
    budget: 0,
    duration: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const navigate = useNavigate()

  const loadCategories = async () => {
    try {
      const fetchedCategories = await fetchListedCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  useEffect(() => {
    loadCategories();
    const interval = setInterval(() => {
      loadCategories();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (field: keyof JobFormData, value: string | number | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for the field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Reset subCategory when category changes
    if (field === 'category') {
      setFormData((prev) => ({ ...prev, subCategory: '' }));
      setErrors((prev) => ({ ...prev, subCategory: undefined }));
    }
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ''],
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData((prev) => {
      const newRequirements = [...prev.requirements];
      newRequirements[index] = value;
      return { ...prev, requirements: newRequirements };
    });
    // Clear requirements error when updating
    if (errors.requirements) {
      setErrors((prev) => ({ ...prev, requirements: undefined }));
    }
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
    // Validate requirements after removal
    const result = JobFormSchema.safeParse(formData);
    if (!result.success) {
      const requirementsError = result.error.issues.find((issue) => issue.path[0] === 'requirements')?.message;
      setErrors((prev) => ({ ...prev, requirements: requirementsError }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form data
    const result = JobFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof JobFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      const message = await createJob(formData);
      toast.success(message)
      setTimeout(() => {
        navigate('/client/myjobs')
      },1000)
      console.log('Job posted:', formData);
      setFormData({
        title: '',
        category: '',
        subCategory: '',
        requirements: [],
        description: '',
        budget: 0,
        duration: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Failed to post job:', error);
      setErrors({ general:'Failed to post job. Please try again.' });
    }
  };

  return (
    <>
      <ClientNavbar navItems={clientNavItems} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#0A142F] mb-2">Post a New Job</h1>
        <p className="text-gray-600 mb-8">Fill in the details below to post your job and find the perfect freelancer.</p>

        {errors.general && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{errors.general}</div>
        )}

        <div className="bg-[#0A142F] rounded-t-2xl p-6">
          <div className="flex items-center gap-3">
            <Briefcase className="text-[#4A6CF7] w-7 h-7" />
            <h2 className="text-white text-2xl font-semibold">Job Details</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-b-2xl shadow-lg p-8 space-y-6">
          <div className="space-y-2">
          <Toaster position="top-center" reverseOrder={false} />
            <label htmlFor="title" className="block text-sm font-medium text-[#0A142F]">
              Job Title
            </label>
            <div className="relative flex flex-col"> 
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="title"
                placeholder="E.g., 'Frontend Developer for E-commerce Website'"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:border-[#4A6CF7] focus:ring-1 focus:ring-[#4A6CF7]`}
              />
              </div>
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-[#0A142F]">
                Category
              </label>
              <div className="relative flex flex-col">
              <div className="relative">
                <FolderTree className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:border-[#4A6CF7] focus:ring-1 focus:ring-[#4A6CF7]`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.catId} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                </div>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subCategory" className="block text-sm font-medium text-[#0A142F]">
                Sub-category
              </label>
              <div className="relative flex flex-col">
              <div className="relative">
                <FolderTree className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  id="subCategory"
                  value={formData.subCategory}
                  onChange={(e) => handleChange('subCategory', e.target.value)}
                  disabled={!formData.category}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.subCategory ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:border-[#4A6CF7] focus:ring-1 focus:ring-[#4A6CF7] disabled:opacity-50`}
                >
                  <option value="">Select a sub-category</option>
                  {categories
                    .find((cat) => cat.name === formData.category)
                    ?.subCategories.map((sub, index) => (
                      <option key={index} value={sub}>
                        {sub}
                      </option>
                    ))}
                </select>
                </div>
                {errors.subCategory && (
                  <p className="text-red-500 text-sm mt-1">{errors.subCategory}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-[#0A142F]">
              Job Description
            </label>
            <div className="relative">
              <ScrollText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                id="description"
                placeholder="Describe the job in detail. What needs to be done? What are the goals?"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:border-[#4A6CF7] focus:ring-1 focus:ring-[#4A6CF7] resize-y min-h-[150px]`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#0A142F]">Requirements</label>
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => updateRequirement(index, e.target.value)}
                  placeholder="Enter a requirement"
                  className={`w-full pl-4 pr-4 py-2 rounded-lg border ${
                    errors.requirements && req.length === 0 ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:border-[#4A6CF7] focus:ring-1 focus:ring-[#4A6CF7]`}
                />
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            {errors.requirements && (
              <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>
            )}
            <button
              type="button"
              onClick={addRequirement}
              className="text-[#4A6CF7] hover:text-[#3b5de7]"
            >
              + Add Requirement
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="budget" className="block text-sm font-medium text-[#0A142F]">
                Budget
              </label>
              <div className="relative flex flex-col">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', Number(e.target.value))}
                  placeholder="e.g., 5000"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.budget ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:border-[#4A6CF7] focus:ring-1 focus:ring-[#4A6CF7]`}
                />
                </div>
                {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="duration" className="block text-sm font-medium text-[#0A142F]">
                Duration
              </label>
              <div className="flex gap-2">
              <div className="flex-1 flex flex-col">
                <div className="relative  ">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleChange('duration', e.target.value)}
                    placeholder="e.g., 30"
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      errors.duration ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:border-[#4A6CF7] focus:ring-1 focus:ring-[#4A6CF7]`}
                  />
                  </div>
                  {errors.duration && (
                    <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-[#0A142F] hover:bg-[#152347] text-white px-8 py-2 rounded-lg transition-colors"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
       <Footer />
    </>
  );
};

export default PostJob;