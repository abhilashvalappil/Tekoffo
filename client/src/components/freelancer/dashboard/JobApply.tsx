import React, { useState } from 'react';
import { submitProposal } from '../../../api';  

interface JobDetails {
  id: string;
  // clientId:string;
  clientId:{
    _id:string;
    fullName:string;
    profilePicture?:string;
    companyName?:string;
    country:string;
  }
  title: string;
  clientName: string;
  clientLocation: string;
  clientRating: number;
  postedDate: string;
  description: string;
  requirements: string[];
  budget: string;
  duration: string;
}

interface Client {
    fullName: string;
    email: string;
    description:string;
    companyName?:string;
    country:string;
  }

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // job: JobDetails | null;
  job: JobDetails;
  client: Client | null;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ isOpen, onClose, job }) => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [expectedBudget, setExpectedBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [isCustomDuration, setIsCustomDuration] = useState(false);

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      setIsCustomDuration(true);
      setDuration('');
    } else {
      setIsCustomDuration(false);
      setDuration(value);
    }
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    console.log({ cvFile, message, expectedBudget, duration });

    const proposalDetails = new FormData()
    console.log('job apply deta propoooooooooo',proposalDetails)

    proposalDetails.append("jobId",job.id);
    proposalDetails.append("clientId",job.clientId._id) 

    if(cvFile){
      proposalDetails.append("attachments",cvFile)
    }
    if(message){
      proposalDetails.append("coverLetter",message)
    }
    proposalDetails.append('proposedBudget', expectedBudget || job.budget);
    proposalDetails.append('duration', duration || job.duration);
 
    console.log('FormData contents:', Object.fromEntries(proposalDetails.entries()));
    try {
      await submitProposal(proposalDetails);
    } catch (error) {
      console.log(error)
    }
    onClose();
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A142F] to-[#1a2a5f] p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{job.title}</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Client Details */}
          {/* <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#0A142F]">Client Details</h3>
            <div className="mt-2 space-y-2">
              <p className="text-[#0A142F]/70"><span className="font-medium">Name:</span> {client?.fullName}</p>
              <p className="text-[#0A142F]/70"><span className="font-medium">Location:</span> {client?.country}</p>
              <p className="text-[#0A142F]/70"><span className="font-medium">Rating:</span> {job.clientRating} / 5</p>
              <p className="text-[#0A142F]/70"><span className="font-medium">Posted:</span> {job.postedDate}</p>
              <button className="mt-2 inline-block bg-[#0A142F] text-white px-4 py-2 rounded-lg hover:bg-[#0A142F]/90 transition">
                View Profile
              </button>
            </div>
          </div> */}

          {/* Job Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#0A142F]">Job Description</h3>
            <p className="mt-2 text-[#0A142F]/70">{job.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#0A142F]">Requirements</h3>
            <ul className="mt-2 list-disc list-inside text-[#0A142F]/70">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#0A142F]">Budget</h3>
            <p className="mt-2 text-[#0A142F]/70">${job.budget}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#0A142F]">Duration</h3>
            <p className="mt-2 text-[#0A142F]/70">{job.duration}</p>
          </div>

          {/* Freelancer Application Form */}
          <div>
            <h3 className="text-lg font-semibold text-[#0A142F]">Apply for this Job</h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0A142F]">Upload CV (Optional)</label>
                <div className="mt-1 flex items-center space-x-4">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleCvUpload}
                    className="block w-full text-sm text-[#0A142F]/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0A142F]/10 file:text-[#0A142F] hover:file:bg-[#0A142F]/20"
                  />
                </div>
                {cvFile && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center space-x-3">
                    <svg className="w-6 h-6 text-[#0A142F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-[#0A142F]">{cvFile.name}</p>
                      <p className="text-xs text-[#0A142F]/70">{(cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCvFile(null)}
                      className="ml-auto text-[#0A142F]/70 hover:text-[#0A142F]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0A142F]">Message to Client (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-[#0A142F] focus:ring-[#0A142F]/20"
                  rows={4}
                  placeholder="Write a message to the client..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0A142F]">Expected Budget (Optional)</label>
                <div className="mt-1 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#0A142F]/70">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={expectedBudget}
                    onChange={(e) => setExpectedBudget(e.target.value)}
                    className="block w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 shadow-sm focus:border-[#0A142F] focus:ring-2 focus:ring-[#0A142F]/20 hover:border-[#0A142F]/50 transition-colors"
                    placeholder="500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0A142F]">Expected Duration (Optional)</label>
                <div className="mt-1">
                  <select
                    value={isCustomDuration ? 'custom' : duration}
                    onChange={handleDurationChange}
                    className="block w-full rounded-lg border border-gray-200 shadow-sm py-2 px-3 focus:border-[#0A142F] focus:ring-2 focus:ring-[#0A142F]/20 hover:border-[#0A142F]/50 transition-colors"
                  >
                    <option value="" disabled>Select duration</option>
                    <option value="1 week">1 week</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="3 months">3 months</option>
                    <option value="custom">Custom</option>
                  </select>
                  {isCustomDuration && (
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="mt-2 block w-full rounded-lg border border-gray-200 shadow-sm py-2 px-3 focus:border-[#0A142F] focus:ring-2 focus:ring-[#0A142F]/20 hover:border-[#0A142F]/50 transition-colors"
                      placeholder="Enter custom duration (e.g., 10 days)"
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0A142F] text-white px-6 py-3 rounded-lg hover:bg-[#0A142F]/90 transition"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;