 
import { X } from "lucide-react";
import { useEffect } from "react";
import { UserProfileResponse } from "../../../../types/userTypes";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfileResponse | null;
}

export default function UserProfileModal({ isOpen, onClose, userProfile }: UserProfileModalProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !userProfile) return null;

  // Format the member since date
  const formatMemberSince = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="max-w-2xl w-full mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 relative max-h-screen overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={userProfile.profilePicture || "/api/placeholder/128/128"}
            alt={userProfile.fullName}
            className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {userProfile.fullName}
              </h2>
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full shadow capitalize">
                {userProfile.role}
              </span>
            </div>
            
            {userProfile.companyName && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1 font-medium">
                {userProfile.companyName}
              </p>
            )}
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {userProfile.country}
            </p>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span className="font-medium">@{userProfile.username}</span>
            </p>
            
            {userProfile.description && (
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {userProfile.description}
              </p>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300 mb-4">
              <div>
                <strong className="block text-gray-900 dark:text-white">Total Spent:</strong>
                ${userProfile.total_Spent?.toLocaleString() || 0}
              </div>
              <div>
                <strong className="block text-gray-900 dark:text-white">Member Since:</strong>
                {formatMemberSince(userProfile.createdAt)}
              </div>
            </div>
            
            <div className="flex gap-4">
              {userProfile.linkedinUrl && (
                <a
                  href={userProfile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {userProfile.portfolioUrl && (
                <a
                  href={userProfile.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm transition-colors"
                >
                  Portfolio
                </a>
              )}
              {userProfile.githubUrl && (
                <a
                  href={userProfile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm transition-colors"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}