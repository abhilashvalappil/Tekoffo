 

import { Clock, DollarSign, Eye, Check, X, Briefcase } from 'lucide-react';
import { JobInvitationView } from '../../../../types/proposalTypes';  
import { Rating } from '@mui/material';

// StatusBadge component (unchanged)
const StatusBadge = ({ status }: { status: 'invited' | 'pending' | 'accepted' | 'rejected' }) => {
  const statusStyles = {
    invited: 'bg-blue-100 text-blue-800',
    pending: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const statusText = {
    invited: 'invited',
    pending: 'Pending',
    accepted: 'Accepted',
    rejected: 'Rejected',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {statusText[status]}
    </span>
  );
};

// JobCard component 
export const JobCard = ({ 
  invitation, 
  onAccept, 
  onReject,
  onViewProfile,
  onViewDetails,
  onViewReviews // Add this prop
}: { 
  invitation: JobInvitationView; 
  onAccept: (id: string) => void; 
  onReject: (id: string) => void;
  onViewProfile: (clientId: string) => void;
  onViewDetails: (id: string) => void;
  onViewReviews: (clientId: string) => void; // Add this type
}) => {
  return (
    <div className="bg-grey-50 rounded-lg shadow-sm border border-gray-100 hover:border-gray-200 transition-all duration-200 mb-4 p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={invitation.client.profilePicture} 
              alt={invitation.client.fullName} 
              className="w-12 h-12 rounded-full mr-3" 
            />
            <div>
              <div className="flex items-center">
                <h3 className="font-medium text-lg">{invitation.client.fullName}</h3>
              </div>

              {/* Ratings and View Button on the same row */}
              <div className="flex items-center text-yellow-500 gap-3">
                <div className="flex items-center">
                  <Rating
                    name="read-only-rating"
                    value={invitation.averageRating}
                    precision={0.5}
                    size="medium"
                    readOnly
                  />
                  <span className="ml-1 text-sm text-black">{invitation.averageRating}</span>
                </div>
                <button 
                  onClick={() => onViewReviews(invitation.client._id)} // Fixed function call
                  className="text-[#0A142F]/70 hover:text-[#0A142F] underline text-sm transition-colors"
                >
                  View Ratings & Reviews
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <button 
              onClick={() => onViewProfile(invitation.client._id)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm flex items-center mr-3"
            >
              <Eye size={16} className="mr-2" />
              View Profile
            </button>
            <StatusBadge status={invitation.status} />
          </div>
        </div>
        <div className="flex items-center text-lg font-semibold text-gray-800">
          <Briefcase size={18} className="text-blue-500 mr-2" />
          {invitation.job.title}
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center text-gray-600">
            <DollarSign size={18} className="text-gray-500 mr-1" />
            <span>USD {invitation.proposedBudget.toLocaleString()}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock size={18} className="text-gray-500 mr-1" />
            <span>{invitation.duration}</span>
          </div>
        </div>
        <div className="flex mt-4 justify-between">
          <button 
            onClick={() => onViewDetails(invitation.job._id)}
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Eye size={18} className="mr-2" />
            View Job Details
          </button>
          
          {invitation.status === 'invited' ? (
            <div className="flex space-x-3">
              <button 
                onClick={() => onReject(invitation._id)}
                className="px-6 py-2 border border-gray-200 rounded-lg flex items-center text-red-600 hover:bg-red-50 transition-colors"
              >
                <X size={18} className="mr-2" />
                Decline
              </button>
              <button 
                onClick={() => onAccept(invitation._id)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
              >
                <Check size={18} className="mr-2" />
                Accept
              </button>
            </div>
          ) : (
            <StatusBadge status={invitation.status} />
          )}
        </div>
      </div>
    </div>
  );
};