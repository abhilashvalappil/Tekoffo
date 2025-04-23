import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import ProfileSidebar from './ProfileSidebar';  
import { changePassword } from '../../api/common';
// import { Passwords } from '../../types/auth';
import {Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordSchema,PasswordFormData } from '../../utils/validations/AuthValidation';

interface ChangePasswordProps {
  onCancel: () => void;
}
// interface Passwords {
//     currentPassword:string;
//     newPassword:string;
// }

function ChangePassword({ onCancel }: ChangePasswordProps) {
  const userProfile = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const client = {
    fullName: userProfile?.fullName || 'Anonymous User',
    companyName: userProfile?.companyName,
    profilePicture: userProfile?.profilePicture,
  };

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');

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
    } catch (err: any) {
      setServerError(err.message);
      console.error('Change password failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white text-gray-800">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileSidebar client={client} activeTab="password" />
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
                    onClick={onCancel}
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
    </div>
  );
}


export default ChangePassword;