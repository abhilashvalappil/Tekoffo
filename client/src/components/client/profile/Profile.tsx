

import React, { useEffect, useState } from 'react';
import { Globe, Lock, Mail, Pencil } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { Link, useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../../../redux/services/userService';
import { z } from 'zod';
import { profileFormSchema,ProfileFormData } from '../../../utils/validations/ProfileValidation';
import { fetchActiveJobPosts, fetchClientProfile } from '../../../api';
import { UserProfileResponse } from '../../../types/userTypes';
import ChangePasswordModal from './ChangePassword';

interface FormErrors {
  fullName?: string;
  companyName?: string;
  description?: string;
  country?: string;
  profilePicture?: string;
}

const DisplayProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [profileData,setProfileData] = useState<UserProfileResponse>();
  const [activeJobsCount, setActiveJobsCount] = useState<number>();
  const [completedJobsCount, setCompletedJobsCount] = useState<number>();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const hasProfile = !!user && !!user.fullName;

  // Initialize form data
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: user?.fullName || '',
    description: user?.description || '',
    country: user?.country || '',
    companyName: user?.companyName || '',
    profilePicture: null,
  });
  
  const userId = user._id;
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
            const { count, completed } = await fetchActiveJobPosts()
            setActiveJobsCount(count)
            setCompletedJobsCount(completed)
          }
          loadActiveProjects()
        },[])

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Handle profile picture upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({ ...prev, profilePicture: file || null }));
    setFormErrors((prev) => ({ ...prev, profilePicture: undefined }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  // Open modal with pre-filled data
  const handleEditClick = () => {
    setFormData({
      fullName: user?.fullName || '',
      description: user?.description || '',
      country: user?.country || '',
      companyName: user?.companyName || '',
      profilePicture: null,
    });
    setPreviewImage(user?.profilePicture || null);
    setFormErrors({});
    setServerError(null);
    setIsModalOpen(true);
  };

  // Handle form submission with Zod validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setFormErrors({});

    try {
      // Validate form data with Zod
      const validatedData = profileFormSchema.parse(formData);

      // Prepare FormData for API
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', validatedData.fullName);
      formDataToSend.append('description', validatedData.description);
      formDataToSend.append('country', validatedData.country);
      if (validatedData.companyName) {
        formDataToSend.append('companyName', validatedData.companyName);
      }
      if (validatedData.profilePicture) {
        formDataToSend.append('profilePicture', validatedData.profilePicture);
      }

      // Dispatch update profile action
      const result = await dispatch(updateUserProfile(formDataToSend));
      if (updateUserProfile.fulfilled.match(result)) {
        setIsModalOpen(false);
        navigate('/client/profile');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors: FormErrors = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof FormErrors;
          fieldErrors[field] = err.message;
        });
        setFormErrors(fieldErrors);
      } else if (error instanceof Error) {
        // Handle server errors
        setServerError(error.message || 'Failed to update profile');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white text-gray-800">
      <div className="container ml-60 mx-auto px-4 py-22">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            {hasProfile ? (
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex justify-between items-start mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">Profile Details</h1>
                  <div className="flex gap-3">
                    <button
                      onClick={handleEditClick}
                      className="flex items-center gap-2 bg-[#0A142F] text-white px-4 py-2 rounded-lg hover:bg-[#1a2b5f] transition"
                    >
                      <Pencil size={16} />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setIsChangePasswordOpen(true)}
                      className="flex items-center gap-2 border border-[#0A142F] text-[#0A142F] px-4 py-2 rounded-lg hover:bg-[#f0f4ff] transition"
                    >
                      <Lock size={16} />
                      Change Password
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-6 mb-8">
                  <img
                    src={user?.profilePicture || '/default-avatar.png'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#0A142F]"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{user?.fullName || 'Anonymous User'}</h2>
                    {user?.companyName && (
                      <p className="text-[#0A142F] flex items-center gap-1">Company: {user.companyName}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">Username</h3>
                      <p className="text-gray-600">{user?.username || 'No username provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">Bio</h3>
                      <p className="text-gray-600">{user?.description || 'No bio available'}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="text-[#0A142F]" size={20} />
                          <span className="text-gray-600">{user?.email || 'No email provided'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">Location</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Globe className="text-[#0A142F]" size={20} />
                          <span className="text-gray-600">{user?.country || 'No location provided'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
                <h1 className="text-2xl font-bold mb-4 text-gray-900">No Profile Found</h1>
                <p className="text-gray-600 mb-6">It looks like you haven't created a profile yet. Create one to showcase your details!</p>
                <Link
                  to="/client/createprofile"
                  className="inline-block bg-[#0A142F] text-white px-6 py-3 rounded-lg hover:bg-[#1a2b5f] transition"
                >
                  Create Profile
                </Link>
              </div>
            )}

            {hasProfile && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg">
                  <h4 className="text-[#0A142F] font-semibold">Completed Projects</h4>
                  <p className="text-3xl font-bold mt-2 text-gray-900">{completedJobsCount}</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg">
                  <h4 className="text-[#0A142F] font-semibold">Active Projects</h4>
                  <p className="text-3xl font-bold mt-2 text-gray-900">{activeJobsCount}</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg">
                  <h4 className="text-[#0A142F] font-semibold">Total Spent</h4>
                  <p className="text-3xl font-bold mt-2 text-gray-900">{profileData?.total_Spent}</p>
                </div>
              </div>
            )}

            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">Edit Profile</h2>
                  {serverError && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
                      {serverError}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full mt-1 p-2 border rounded-lg text-sm ${
                          formErrors.fullName ? 'border-red-500' : ''
                        }`}
                      />
                      {formErrors.fullName && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className={`w-full mt-1 p-2 border rounded-lg text-sm ${
                          formErrors.description ? 'border-red-500' : ''
                        }`}
                        rows={3}
                      />
                      {formErrors.description && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`w-full mt-1 p-2 border rounded-lg text-sm ${
                          formErrors.country ? 'border-red-500' : ''
                        }`}
                      />
                      {formErrors.country && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company Name</label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className={`w-full mt-1 p-2 border rounded-lg text-sm ${
                          formErrors.companyName ? 'border-red-500' : ''
                        }`}
                      />
                      {formErrors.companyName && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.companyName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleImageChange}
                        className={`w-full mt-1 p-2 border rounded-lg text-sm ${
                          formErrors.profilePicture ? 'border-red-500' : ''
                        }`}
                      />
                      {formErrors.profilePicture && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.profilePicture}</p>
                      )}
                      {previewImage && (
                        <img
                          src={previewImage}
                          alt="Profile Preview"
                          className="mt-2 w-20 h-20 rounded-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-3 py-1 text-gray-600 hover:text-gray-900 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-[#0A142F] text-white rounded-lg hover:bg-[#1a2b5f] text-sm"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
}

export default DisplayProfile;