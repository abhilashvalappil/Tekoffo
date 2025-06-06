import React, { useEffect, useState } from 'react';
import {Briefcase, Star, ChevronRight, DollarSign, Clock, Repeat } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import Navbar from '../shared/Navbar';
import { navItems } from '../shared/NavbarItems';
import Footer from '../../shared/Footer';
import { Gig } from '../../../types/gigTypes';
import { fetchGigs } from '../../../api';
import { useNavigate } from 'react-router-dom';
import EditGigModal from './EditGigModal';
import { createGigHandlers } from '../../../handlers/freelancerHandlers/gigHandlers';
import { useAuth } from '../../../hooks/customhooks/useAuth';


const MyGigs: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [activeTab, setActiveTab] = useState<string>('jobs');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [gigToDelete, setGigToDelete] = useState<Gig | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

   const { handleLogout } = useAuth();

  useEffect(() => {
    const loadGigs = async () => {
      const gigs = await fetchGigs();
      setGigs(gigs);
    };
    loadGigs();
  }, []);

  const openDeleteModal = (gig: Gig) => {
  setGigToDelete(gig);
  setIsDeleteModalOpen(true);
};
 
  const {
  handleEditGig,
  handleDeleteGig,
  handleSaveGig,
} = createGigHandlers({
  gigs,
  gigToDelete,
  setGigs,
  setIsModalOpen,
  setSelectedGig,
  setIsDeleteModalOpen,
  setGigToDelete,
  navigate,
});


  return (
    <div className="min-h-screen bg-white text-[#0A142F]">
      <Toaster position="top-center" reverseOrder={false} />
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
      <div className="pt-16 p-4 md:p-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-[#0A142F]">
                My Gigs
              </h1>
            </div>
          </div>
          <div className="grid gap-6">
            {gigs.length === 0 ? (
              <div className="text-center py-8 text-[#0A142F]/70">
                No gigs found
              </div>
            ) : (
              gigs.map((gig) => (
                <div
                  key={gig._id}
                  className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={user?.profilePicture}
                        alt="Freelancer"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h2 className="text-lg md:text-xl font-semibold text-[#0A142F] mb-2">
                          {gig.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#0A142F]/70 mb-3">
                          <div className="flex items-center gap-1">
                            <Briefcase size={16} />
                            <span>{gig.category}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star size={16} />
                            {/* <span>{gig.rating.toFixed(1)} ({gig.reviews} reviews)</span> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className="text-[#0A142F]/40 group-hover:text-[#0A142F] transition-colors"
                      size={24}
                    />
                  </div>
                  <p className="text-[#0A142F]/70 mb-4 line-clamp-2">
                    {gig.description}
                  </p>
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-[#0A142F] mb-2">
                      Skills:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {gig.skills.length > 0 ? (
                        gig.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-50 rounded-full text-sm text-[#0A142F]/70"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#0A142F]/70">No skills listed</span>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-[#0A142F] mb-2">
                      Requirements:
                    </h3>
                    {gig.requirements.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-sm text-[#0A142F]/70">
                        {gig.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[#0A142F]/70 text-sm">
                        No requirements listed
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between pt-4 border-t border-gray-100 gap-4 md:gap-0">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-[#0A142F]">
                        <DollarSign size={20} />
                        <span className="font-semibold">${gig.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#0A142F]">
                        <Repeat size={20} />
                        <span>{gig.revisions} Revisions</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#0A142F]">
                        <Clock size={20} />
                        <span>{gig.deliveryTime}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditGig(gig)}
                        className="w-full md:w-auto px-4 py-2 bg-[#0A142F] text-white hover:bg-[#0A142F]/90 rounded-lg transition-colors"
                      >
                        Edit Gig
                      </button>
                      <button
                      onClick={() => openDeleteModal(gig)}
                       className="w-full md:w-auto px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <EditGigModal
        gig={selectedGig}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGig}
      />
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-[#0A142F]">
              Confirm Deletion
            </h2>
            <p className="text-[#0A142F]/70 mb-6">
              Are you sure you want to delete "{gigToDelete?.title}"? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg text-[#0A142F] hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGig}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MyGigs;