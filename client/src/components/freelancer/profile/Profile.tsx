import React, { useState, useEffect } from 'react';
import { Globe, Mail, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProfileSidebar from './ProfileSidebar';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { updateFreelancerProfile } from '../../../redux/services/userService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { freelancerProfileSchema, FreelancerProfileFormData } from '../../../utils/validations/ProfileValidation';

function FreelancerProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(user?.profilePicture || null);

  const hasProfile = user && (user.description || user.skills?.length > 0 || user.country);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FreelancerProfileFormData>({
    resolver: zodResolver(freelancerProfileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      description: user?.description || '',
      skills: user?.skills?.join(', ') || '',
      preferredJobFields: user?.preferredJobFields?.join(', ') || '',
      country: user?.country || '',
      linkedinUrl: user?.linkedinUrl || '',
      githubUrl: user?.githubUrl || '',
      portfolioUrl: user?.portfolioUrl || '',
      profilePicture: null,
    },
  });

  useEffect(() => {
    // Update form values when user data changes
    reset({
      fullName: user?.fullName || '',
      description: user?.description || '',
      skills: user?.skills?.join(', ') || '',
      preferredJobFields: user?.preferredJobFields?.join(', ') || '',
      country: user?.country || '',
      linkedinUrl: user?.linkedinUrl || '',
      githubUrl: user?.githubUrl || '',
      portfolioUrl: user?.portfolioUrl || '',
      profilePicture: null,
    });
  }, [user, reset]);

  const onSubmit = async (data: FreelancerProfileFormData) => {
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('description', data.description);
    formData.append(
      'skills',
      JSON.stringify(data.skills.split(',').map((skill) => skill.trim()).filter(Boolean))
    );
    formData.append(
      'preferredJobFields',
      JSON.stringify(data.preferredJobFields.split(',').map((field) => field.trim()).filter(Boolean))
    );
    formData.append('country', data.country);
    formData.append('linkedinUrl', data.linkedinUrl || '');
    formData.append('githubUrl', data.githubUrl || '');
    formData.append('portfolioUrl', data.portfolioUrl || '');
    if (data.profilePicture) {
      formData.append('profilePicture', data.profilePicture);
    }

    await dispatch(updateFreelancerProfile(formData));
    setIsModalOpen(false);
    if (profilePicturePreview) {
      URL.revokeObjectURL(profilePicturePreview);
      setProfilePicturePreview(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue('profilePicture', file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">No Profile Found</h1>
            <p className="text-gray-600 mb-6">It looks like you haven't created a profile yet. Create one to showcase your details!</p>
            <Link
              to="/freelancer/createprofile"
              className="inline-block bg-[#0A142F] text-white px-6 py-3 rounded-lg hover:bg-[#1a2b5f] transition"
            >
              Create Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <ProfileSidebar
            freelancer={{
              fullName: user?.fullName || 'Anonymous User',
              profilePicture: user?.profilePicture,
            }}
          />

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[#0A142F]">Profile Details</h1>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#0A142F] text-white px-4 py-2 rounded-lg hover:bg-[#1a2b5f] transition"
                >
                  Edit Profile
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-[#0A142F]">Bio</h3>
                    <p className="text-gray-600">{user?.description || 'No bio provided'}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-[#0A142F]">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {(user?.skills || []).map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="bg-[#0A142F]/10 text-[#0A142F] px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-[#0A142F]">Preferred Job Fields</h3>
                    <div className="flex flex-wrap gap-2">
                      {(user?.preferredJobFields || []).map((field: string, index: number) => (
                        <span
                          key={index}
                          className="bg-[#0A142F]/10 text-[#0A142F] px-3 py-1 rounded-full text-sm"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-[#0A142F]">Location</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Globe className="text-[#0A142F]" size={20} />
                        <span className="text-gray-600">{user?.country || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-[#0A142F]">Contact & Professional Links</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="text-[#0A142F]" size={20} />
                        <a
                          href={`mailto:${user?.email}`}
                          className="text-gray-600 hover:text-[#0A142F]"
                        >
                          {user?.email || 'Not provided'}
                        </a>
                      </div>
                      {user?.linkedinUrl && (
                        <div className="flex items-center gap-3">
                          <Globe className="text-[#0A142F]" size={20} />
                          <a
                            href={user.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-[#0A142F]"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                      {user?.githubUrl && (
                        <div className="flex items-center gap-3">
                          <Globe className="text-[#0A142F]" size={20} />
                          <a
                            href={user.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-[#0A142F]"
                          >
                            GitHub Profile
                          </a>
                        </div>
                      )}
                      {user?.portfolioUrl && (
                        <div className="flex items-center gap-3">
                          <Globe className="text-[#0A142F]" size={20} />
                          <a
                            href={user.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-[#0A142F]"
                          >
                            Portfolio
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg">
                <h4 className="text-[#0A142F] font-semibold">Projects Completed</h4>
                <p className="text-3xl font-bold mt-2 text-[#0A142F]">
                  {user?.projectsCompleted || 0}
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg">
                <h4 className="text-[#0A142F] font-semibold">Average Rating</h4>
                <p className="text-3xl font-bold mt-2 text-[#0A142F]">
                  {user?.averageRating || 'N/A'}
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg">
                <h4 className="text-[#0A142F] font-semibold">Total Earned</h4>
                <p className="text-3xl font-bold mt-2 text-[#0A142F]">
                  {user?.total_Earnings ? `$${user?.total_Earnings}` : '$0'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[70vh] overflow-y-auto relative shadow-lg">
            <button
              onClick={() => {
                setIsModalOpen(false);
                if (profilePicturePreview) {
                  URL.revokeObjectURL(profilePicturePreview);
                  setProfilePicturePreview(null);
                }
              }}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900">Edit Profile</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  {...register('fullName')}
                  className={`mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#0A142F] focus:border-[#0A142F] ${errors.fullName ? 'border-red-500' : ''}`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  {...register('description')}
                  className={`mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#0A142F] focus:border-[#0A142F] ${errors.description ? 'border-red-500' : ''}`}
                  rows={3}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                <input
                  {...register('skills')}
                  className={`mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#0A142F] focus:border-[#0A142F] ${errors.skills ? 'border-red-500' : ''}`}
                  placeholder="e.g., JavaScript, Python, React"
                />
                {errors.skills && (
                  <p className="mt-1 text-sm text-red-500">{errors.skills.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Job Fields (comma-separated)</label>
                <input
                  {...register('preferredJobFields')}
                  className={`mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#0A142F] focus:border-[#0A142F] ${errors.preferredJobFields ? 'border-red-500' : ''}`}
                  placeholder="e.g., Web Development, Data Science"
                />
                {errors.preferredJobFields && (
                  <p className="mt-1 text-sm text-red-500">{errors.preferredJobFields.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  {...register('country')}
                  className={`mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#0A142F] focus:border-[#0A142F] ${errors.country ? 'border-red-500' : ''}`}
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                <input
                  {...register('linkedinUrl')}
                  className={`mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#0A142F] focus:border-[#0A142F] ${errors.linkedinUrl ? 'border-red-500' : ''}`}
                />
                {errors.linkedinUrl && (
                  <p className="mt-1 text-sm text-red-500">{errors.linkedinUrl.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
                <input
                  {...register('githubUrl')}
                  className={`mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#0A142F] focus:border-[#0A142F] ${errors.githubUrl ? 'border-red-500' : ''}`}
                />
                {errors.githubUrl && (
                  <p className="mt-1 text-sm text-red-500">{errors.githubUrl.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Portfolio URL</label>
                <input
                  {...register('portfolioUrl')}
                  className={`mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#0A142F] focus:border-[#0A142F] ${errors.portfolioUrl ? 'border-red-500' : ''}`}
                />
                {errors.portfolioUrl && (
                  <p className="mt-1 text-sm text-red-500">{errors.portfolioUrl.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className={`mt-1 w-full p-2 border border-gray-300 rounded-lg ${errors.profilePicture ? 'border-red-500' : ''}`}
                  accept="image/jpeg,image/png,image/jpg"
                />
                {errors.profilePicture && (
                  <p className="mt-1 text-sm text-red-500">{errors.profilePicture.message}</p>
                )}
                {profilePicturePreview && (
                  <img
                    src={profilePicturePreview}
                    alt="Profile preview"
                    className="mt-2 w-24 h-24 object-cover rounded-full"
                  />
                )}
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    if (profilePicturePreview) {
                      URL.revokeObjectURL(profilePicturePreview);
                      setProfilePicturePreview(null);
                    }
                  }}
                  className="px-3 py-1.5 text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#0A142F] text-white rounded-lg hover:bg-[#1a2b5f] transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FreelancerProfile;