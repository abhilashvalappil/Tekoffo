 

import React from 'react';
import { Client } from '../../types/userTypes';

interface ClientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

const ClientProfileModal: React.FC<ClientProfileModalProps> = ({ isOpen, onClose, client }) => {
  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#0A142F] to-[#1a2a5f] p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{client.fullName}</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Avatar */}
          <div className="absolute -bottom-20 left-6">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
              <img
                src={client.profilePicture || 'https://via.placeholder.com/150'}
                alt={client.fullName}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-20 max-h-[70vh] overflow-y-auto">
          {/* Client Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#0A142F]">Client Details</h3>
            <div className="mt-2 space-y-2">
              <p className="text-[#0A142F]/70">
                <span className="font-medium">Name:</span> {client.fullName}
              </p>
              <p className="text-[#0A142F]/70">
                <span className="font-medium">Location:</span> {client.country || 'Not provided'}
              </p>
              {client.companyName && (
                <p className="text-[#0A142F]/70">
                  <span className="font-medium">Company:</span> {client.companyName}
                </p>
              )}
              <p className="text-[#0A142F]/70">
                <span className="font-medium">Email:</span>{' '}
                <a
                  href={`mailto:${client.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {client.email}
                </a>
              </p>
            </div>
          </div>

          {/* About */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#0A142F]">About</h3>
            <p className="mt-2 text-[#0A142F]/70">
              {client.description || 'No description provided'}
            </p>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#0A142F]">Contact</h3>
            <div className="mt-2 space-y-2">
              <p className="text-[#0A142F]/70">
                <span className="font-medium">Email:</span>{' '}
                <a
                  href={`mailto:${client.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {client.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfileModal;