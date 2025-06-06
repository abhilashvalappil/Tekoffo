import React, { useRef, useState } from 'react';
import { Camera, MapPin, Settings, Upload } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppDispatch } from '../../../redux/store';
import { createFreelancerProfile } from '../../../redux/services/userService';
import { freelancerProfileSchema, FreelancerProfileFormData } from '../../../utils/validations/ProfileValidation';
import { handleApiError } from '../../../utils/errors/errorHandler';

function CreateFreelancerProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop'
  );
  const [serverError, setServerError] = useState<string | null>(null);

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FreelancerProfileFormData>({
    resolver: zodResolver(freelancerProfileSchema),
    defaultValues: {
      fullName: '',
      description: '',
      country: '',
      skills: '',
      preferredJobFields: '',
      linkedinUrl: '',
      githubUrl: '',
      portfolioUrl: '',
      profilePicture: null,
    },
  });

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      setValue('profilePicture', file, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: FreelancerProfileFormData) => {
    setServerError(null);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', data.fullName);
      formDataToSend.append('description', data.description);
      formDataToSend.append('country', data.country);
      formDataToSend.append('skills', data.skills);
      formDataToSend.append('preferredJobFields', data.preferredJobFields);
      if (data.linkedinUrl) formDataToSend.append('linkedinUrl', data.linkedinUrl);
      if (data.githubUrl) formDataToSend.append('githubUrl', data.githubUrl);
      if (data.portfolioUrl) formDataToSend.append('portfolioUrl', data.portfolioUrl);
      if (data.profilePicture instanceof File) {
        formDataToSend.append('profilePicture', data.profilePicture);
      }

      const result = await dispatch(createFreelancerProfile(formDataToSend));
      if (createFreelancerProfile.fulfilled.match(result)) {
        navigate('/freelancer-dashboard');
      } else {
        throw new Error(result.error.message || 'Failed to create profile');
      }
    } catch (error) {
      const err = handleApiError(error)
      setServerError(err || 'An error occurred while creating the profile');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A142F]/5">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0A142F]">Create Your Freelancer Profile</h1>
          <p className="text-[#0A142F]/60 mt-2">
            Complete your profile to showcase your skills and attract clients on Tekoffo
          </p>
        </div>

        {serverError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{serverError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-[#0A142F]/10">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group cursor-pointer" onClick={handleImageClick}>
              <img
                src={previewUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#0A142F] bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-[#0A142F] p-2 rounded-full text-white hover:bg-[#0A142F]/80 transition shadow-lg"
              >
                <Camera size={20} />
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/jpeg,image/png,image/jpg"
              className="hidden"
            />
            <p className="text-sm text-[#0A142F]/60">Upload a professional photo (JPEG, PNG, JPG, max 5MB)</p>
            {errors.profilePicture && (
              <p className="text-sm text-red-600">{errors.profilePicture.message}</p>
            )}
          </div>

          {/* Personal Information */}
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-[#0A142F]">
              Full Name *
            </label>
            <input
              id="fullName"
              {...register('fullName')}
              className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#0A142F]/30 focus:border-[#0A142F]/30 ${
                errors.fullName ? 'border-red-500' : 'border-[#0A142F]/20'
              }`}
              placeholder="Enter your full name"
            />
            {errors.fullName && <p className="text-sm text-red-600">{errors.fullName.message}</p>}
          </div>

          {/* Bio Section */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-[#0A142F]">
              Bio *
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#0A142F]/30 focus:border-[#0A142F]/30 ${
                errors.description ? 'border-red-500' : 'border-[#0A142F]/20'
              }`}
              placeholder="Tell us about yourself and your expertise"
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          {/* Skills and Preferred Job Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="skills" className="block text-sm font-medium text-[#0A142F]">
                Skills *
              </label>
              <input
                id="skills"
                {...register('skills')}
                className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#0A142F]/30 focus:border-[#0A142F]/30 ${
                  errors.skills ? 'border-red-500' : 'border-[#0A142F]/20'
                }`}
                placeholder="e.g., JavaScript, Python, UI/UX Design"
              />
              {errors.skills && <p className="text-sm text-red-600">{errors.skills.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="preferredJobFields" className="block text-sm font-medium text-[#0A142F]">
                Preferred Job Fields *
              </label>
              <input
                id="preferredJobFields"
                {...register('preferredJobFields')}
                className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#0A142F]/30 focus:border-[#0A142F]/30 ${
                  errors.preferredJobFields ? 'border-red-500' : 'border-[#0A142F]/20'
                }`}
                placeholder="e.g., Web Development, Data Science, Graphic Design"
              />
              {errors.preferredJobFields && (
                <p className="text-sm text-red-600">{errors.preferredJobFields.message}</p>
              )}
            </div>
          </div>

          {/* Professional Networks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="linkedinUrl" className="block text-sm font-medium text-[#0A142F]">
                LinkedIn Profile URL (Optional)
              </label>
              <input
                id="linkedinUrl"
                {...register('linkedinUrl')}
                className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#0A142F]/30 focus:border-[#0A142F]/30 ${
                  errors.linkedinUrl ? 'border-red-500' : 'border-[#0A142F]/20'
                }`}
                placeholder="https://linkedin.com/in/yourprofile"
              />
              {errors.linkedinUrl && <p className="text-sm text-red-600">{errors.linkedinUrl.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="githubUrl" className="block text-sm font-medium text-[#0A142F]">
                GitHub Profile URL (Optional)
              </label>
              <input
                id="githubUrl"
                {...register('githubUrl')}
                className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#0A142F]/30 focus:border-[#0A142F]/30 ${
                  errors.githubUrl ? 'border-red-500' : 'border-[#0A142F]/20'
                }`}
                placeholder="https://github.com/yourusername"
              />
              {errors.githubUrl && <p className="text-sm text-red-600">{errors.githubUrl.message}</p>}
            </div>
          </div>

          {/* Portfolio/Other Professional URL */}
          <div className="space-y-2">
            <label htmlFor="portfolioUrl" className="block text-sm font-medium text-[#0A142F]">
              Portfolio or Other Professional URL (Optional)
            </label>
            <input
              id="portfolioUrl"
              {...register('portfolioUrl')}
              className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#0A142F]/30 focus:border-[#0A142F]/30 ${
                errors.portfolioUrl ? 'border-red-500' : 'border-[#0A142F]/20'
              }`}
              placeholder="https://yourportfolio.com"
            />
            {errors.portfolioUrl && <p className="text-sm text-red-600">{errors.portfolioUrl.message}</p>}
          </div>

          {/* Country Selection */}
          <div className="space-y-2">
            <label htmlFor="country" className="block text-sm font-medium text-[#0A142F]">
              Country *
            </label>
            <div className="relative">
              <input
                id="country"
                {...register('country')}
                className={`w-full px-4 py-2.5 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#0A142F]/30 focus:border-[#0A142F]/30 ${
                  errors.country ? 'border-red-500' : 'border-[#0A142F]/20'
                }`}
                placeholder="Enter your country"
              />
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-[#0A142F]/40" />
            </div>
            {errors.country && <p className="text-sm text-red-600">{errors.country.message}</p>}
          </div>

          {/* Profile Settings */}
          <div className="border-t border-[#0A142F]/10 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-[#0A142F]/60" />
                <span className="text-sm font-medium text-[#0A142F]">Profile Settings</span>
              </div>
              <button
                type="button"
                className="text-sm text-[#0A142F] hover:text-[#0A142F]/80 font-medium"
              >
                Configure
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              className="px-6 py-2.5 border border-[#0A142F]/20 rounded-lg text-[#0A142F] hover:bg-[#0A142F]/5 transition shadow-sm"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 bg-[#0A142F] text-white rounded-lg transition flex items-center space-x-2 shadow-md ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0A142F]/90'
              }`}
            >
              <Upload className="h-5 w-5" />
              <span>{isSubmitting ? 'Creating...' : 'Create Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateFreelancerProfile;