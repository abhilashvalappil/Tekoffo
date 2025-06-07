import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import ClientProfileSidebar from './ProfileSidebar';  
import { changePassword } from '../../../api/common';
import ClientNavbar from '../shared/Navbar';
import { clientNavItems } from '../shared/NavbarItems';
import Footer from '../../shared/Footer';
import {Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordSchema,PasswordFormData } from '../../../utils/validations/AuthValidation';
import { handleApiError } from '../../../utils/errors/errorHandler';
import Navbar from '../../freelancer/shared/Navbar';
import { navItems } from '../../freelancer/shared/NavbarItems';
import { useAuth } from '../../../hooks/customhooks/useAuth';
import ProfileSidebar from '../../freelancer/profile/ProfileSidebar';

 

const ChangePassword: React.FC  = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  
  const user = useSelector((state: RootState) => state.auth.user);
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const client = {
    fullName: user?.fullName || 'Anonymous User',
    companyName: user?.companyName,
    profilePicture: user?.profilePicture,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordFormData) => {
    try {
      const result = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if (result.success) {
        toast.success('Password updated successfully');
        reset();
        setTimeout(() => {
          navigate('/client-dashboard');
        }, 1000);
      }
    } catch (err) {
      const errormessage = handleApiError(err)
      setServerError(errormessage);
      toast.error(serverError)
      console.error('Change password failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white text-gray-800">
      {user?.role === 'client' ? (
       <ClientNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navItems={clientNavItems}
      />
      ):(
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
      )
}
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto px-4 py-22">
        <div className="flex flex-col lg:flex-row gap-8">
          {user?.role === 'client' ? (
          <ClientProfileSidebar client={client} activeTab="password" />
          ):(
            <ProfileSidebar
            freelancer={{
              fullName: user?.fullName || "Anonymous User",
              profilePicture: user?.profilePicture,
            }}
          />
          )
          }
          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h1 className="text-3xl font-bold mb-6 text-gray-900">Change Password</h1>
              {serverError && (
                <div className="mb-4 text-red-500 text-sm">{serverError}</div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      id="currentPassword"
                      {...register('currentPassword')}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A142F] focus:border-transparent ${
                        errors.currentPassword ? 'border-red-500' : ''
                      }`}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.currentPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      {...register('newPassword')}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A142F] focus:border-transparent ${
                        errors.newPassword ? 'border-red-500' : ''
                      }`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      {...register('confirmPassword')}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A142F] focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-500' : ''
                      }`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#0A142F] text-white rounded-lg hover:bg-[#132347] transition-colors"
                  >
                    Update Password
                  </button>
                  <button
                    type="button"
                    // onClick={onCancel}
                    onClick={() => navigate('/')}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


export default ChangePassword;