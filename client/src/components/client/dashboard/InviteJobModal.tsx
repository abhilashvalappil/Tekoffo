
import { useEffect, useState } from 'react';
import { X, Briefcase, Calendar, Clock, Send, Tag, DollarSign, Search, Filter, Zap } from 'lucide-react';
import { fetchInvitationsSent } from '../../../api';
import { Job } from '../../../types/userTypes';
import { ProposalData } from '../../../types/proposalTypes';



interface InviteToJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  freelancerName: string;
  freelancerId: string;
  onSendInvite: (jobId: string, freelancerId: string) => void;
  jobs: Job[];
}

export default function InviteToJobModal({
  isOpen,
  onClose,
  freelancerName,
  freelancerId,
  onSendInvite,
  jobs
}: InviteToJobModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [invitedJobs, setInvitedJobs] = useState<string[]>([]);
  const [newlyInvitedJobs, setNewlyInvitedJobs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  console.log('console from invite job modalllllll', jobs);
  
  // Filter jobs based on search query and only show active jobs
  const filteredJobs = jobs
    .filter(job => job.status === "open")
    .filter(job => 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  useEffect(() => {
    const loadExistingInvitations = async () => {
      setIsLoading(true);
      try {
        const invitations: ProposalData[] = await fetchInvitationsSent();
        console.log('the existing invitations areeeeeeee ====>>>>>>', invitations);
        
        // Helper function to extract ID from nested object or string
        const extractId = (obj: { _id: string } | string): string => {
          if (typeof obj === 'string') return obj;
          if (obj && typeof obj === 'object' && obj._id) return obj._id;
          return '';
        };
        
        // Filter invitations for the current freelancer and extract job IDs
        const jobIdsInvitedTo = invitations
          .filter(invitation => {
            const invitationFreelancerId = extractId(invitation.freelancerId);
            console.log('Comparing freelancer IDs:', invitationFreelancerId, 'vs', freelancerId);
            return invitationFreelancerId === freelancerId;
          })
          .map(invitation => extractId(invitation.jobId));
        
        console.log('Job IDs already invited to for this freelancer:', jobIdsInvitedTo);
        setInvitedJobs(jobIdsInvitedTo);
      } catch (error) {
        console.error('Error fetching invitations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen && freelancerId) {
      loadExistingInvitations();
    }
  }, [isOpen, freelancerId]);

  // Reset newly invited jobs when modal opens
  useEffect(() => {
    if (isOpen) {
      setNewlyInvitedJobs([]);
    }
  }, [isOpen]);
  
  const handleInvite = (jobId: string) => {
    setNewlyInvitedJobs([...newlyInvitedJobs, jobId]);
    onSendInvite(jobId, freelancerId);
  };

  // Check if a job is invited (either from existing invitations or newly invited)
  const isJobInvited = (jobId: string) => {
    return invitedJobs.includes(jobId) || newlyInvitedJobs.includes(jobId);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30">
      <div className="bg-gradient-to-b from-white via-gray-50 to-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200/50 backdrop-blur-lg">
        {/* Animated Header */}
        <div className="relative p-8 border-b border-gray-200/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Zap className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Invite {freelancerName}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Select the perfect job for collaboration</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-3 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:rotate-90 group"
            >
              <X size={24} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          </div>
        </div>
        
        {/* Enhanced Search Bar */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by job title or category..."
              className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Jobs List with Loading State */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading your jobs...</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="p-6 space-y-4">
              {filteredJobs.map((job, index) => (
                <JobItem 
                  key={job._id} 
                  job={job} 
                  onInvite={handleInvite}
                  isInvited={isJobInvited(job._id)}
                  animationDelay={index * 100}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6">
                <Briefcase size={32} className="text-gray-400" />
              </div>
              <p className="text-xl font-semibold text-gray-600 mb-2">No active jobs found</p>
              <p className="text-sm text-gray-400">Create a new job post to start inviting freelancers</p>
            </div>
          )}
        </div>
        
        {/* Futuristic Footer */}
        <div className="p-6 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm text-gray-600 font-medium">
                {filteredJobs.length} jobs available
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface JobItemProps {
  job: Job;
  onInvite: (jobId: string) => void;
  isInvited: boolean;
  animationDelay: number;
}

function JobItem({ job, onInvite, isInvited, animationDelay }: JobItemProps) {
  return (
    <div 
      className="group relative p-6 bg-white rounded-2xl border border-gray-200/50 hover:border-blue-300/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 animate-fadeInUp"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative flex justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
              {job.title}
            </h3>
            <div className="ml-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Active
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{job.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50/80 border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Tag size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Category</p>
                <p className="text-sm font-medium text-gray-900">{job.category}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50/80 border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Budget</p>
                <p className="text-sm font-medium text-gray-900">${job.budget}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50/80 border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Clock size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                <p className="text-sm font-medium text-gray-900">{job.duration}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50/80 border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <Calendar size={16} className="text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Posted</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        {isInvited ? (
          <button 
            disabled
            className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-500 rounded-xl flex items-center gap-3 font-medium shadow-lg cursor-not-allowed"
          >
            <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span>Invited</span>
          </button>
        ) : (
          <button 
            onClick={() => onInvite(job._id)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center gap-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group"
          >
            <Send size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            <span>Send Invite</span>
          </button>
        )}
      </div>
    </div>
  );
}