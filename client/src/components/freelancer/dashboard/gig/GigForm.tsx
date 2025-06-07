import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from '../../shared/Navbar';
import { navItems } from '../../shared/NavbarItems';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useNavigate } from 'react-router-dom';
import { GigFormData,GigFormSchema } from '../../../../utils/validations/GigFormValidation';
import Footer from '../../../shared/Footer';
import { createGig, fetchListedCategories } from '../../../../api';
import { useAuth } from '../../../../hooks/customhooks/useAuth';
import { handleApiError } from '../../../../utils/errors/errorHandler';

interface Category {
  _id?: string;
  name: string;
  subCategories: string[];
  isListed: boolean;
}

type FormErrors = Partial<Record<keyof GigFormData, string>>;

const CreateGig: React.FC = () => {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<string>('jobs');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<GigFormData>({
      title: '',
      description: '',
      category: '',
      price: 0,
      revisions:0,
      deliveryTime: '',
      skills:[],
      requirements: [],
    });

  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

     const [errors, setErrors] = useState<FormErrors>({});

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

      const handleChange = (field: keyof GigFormData, value: string | number | string[]) => {
          setFormData((prev) => ({
            ...prev,
            [field]: value,
          }));
      
          // Clear error for the field when user starts typing
          if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
          }
        }

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

     const result = GigFormSchema.safeParse(formData);

  if (!result.success) {
    const fieldErrors: FormErrors = {};
    result.error.errors.forEach((err) => {
      const field = err.path[0] as keyof GigFormData;
      fieldErrors[field] = err.message;
    });
    setErrors(fieldErrors);
    return;
  }
  try {
     console.log('console form gigform.tsx',formData)
     const message = await createGig(formData)
     toast.success(message)
     setTimeout(() => {
        navigate('/freelancer/gigs')
      },1000)
  } catch (error) {
    toast.error(handleApiError(error));
  }
}

  return (
    <>
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
    <div className="min-h-screen pt-25 bg-gray-100  ">
      
      <div className="max-w-3xl mx-auto p-8 pt-5 py-8 mb-16 bg-white shadow-2xl rounded-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create Gig</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
           <Toaster position="top-center" reverseOrder={false} />
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gig Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g., I will build a full-stack web app"
                  className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                   value={formData.description}
                   onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe your gig in detail..."
                  className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                 id="category"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                   {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                 {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', Number(e.target.value))}
                  min={5}
                  placeholder="e.g., 150"
                  className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Revisions <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.revisions}
                  onChange={(e) => handleChange('revisions', Number(e.target.value))}
                  min={0}
                  placeholder="e.g., 2"
                  className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.revisions && <p className="text-red-500 text-sm mt-1">{errors.revisions}</p>}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Delivery Time (in days) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.deliveryTime}
                  onChange={(e) => handleChange('deliveryTime', e.target.value)}
                  placeholder="e.g., 7days"
                  className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.deliveryTime && (<p className="text-red-500 text-sm mt-1">{errors.deliveryTime}</p>)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Skills <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                   value={formData.skills.join(', ')}
                    onChange={(e) => handleChange('skills', e.target.value.split(',').map(skill => skill.trim()))}
                  placeholder="e.g., React, Node.js, MongoDB"
                  className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Requirements from Buyer <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                   value={formData.requirements.join('\n')}
                    onChange={(e) => handleChange('requirements', e.target.value.split('\n'))}
                  placeholder="Mention what you need from the buyer to get started..."
                  className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                {errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>}
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-xl hover:bg-gray-400 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                  Submit Gig
                </button>
              </div>
            </>
          )}
        </form>
      </div>
       <Footer />
    </div>
    </>
  );
};

export default CreateGig;
