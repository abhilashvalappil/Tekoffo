import React, { useEffect, useState } from 'react';
import { MapPin, Tags, Mail, Globe, ChevronRight, Filter, Search, X } from 'lucide-react';
import { getAllFreelancers } from '../../../api';  
import Navbar from '../shared/Navbar';  
import { clientNavItems } from '../shared/NavbarItems';
import Footer from '../../shared/Footer';
import { handleApiError } from '../../../utils/errors/errorHandler';

interface Freelancer {
  id: string;
  fullName: string;
  description: string;
  email: string;
  profilePicture: string;
  country: string;
  skills: string[];
  preferredJobFields: string[];
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
}

interface NavItem {
  icon: JSX.Element;
  label: string;
  id: string;
  path?: string;
}

const Freelancers = () => {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedJobField, setSelectedJobField] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('freelancers');

  useEffect(() => {
    const loadFreelancers = async () => {
      try {
        setLoading(true);
        const data = await getAllFreelancers();
        const mappedFreelancers: Freelancer[] = data.map((freelancer: any) => ({
          id: freelancer._id,
          fullName: freelancer.fullName,
          description: freelancer.description,
          email: freelancer.email,
          profilePicture: freelancer.profilePicture,
          country: freelancer.country,
          skills: freelancer.skills[0]
            ?.split(',')
            .map((skill: string) => skill.trim())
            .filter((skill: string) => skill) || [],
          preferredJobFields: freelancer.preferredJobFields || [],
          linkedinUrl: freelancer.linkedinUrl,
          githubUrl: freelancer.githubUrl,
          portfolioUrl: freelancer.portfolioUrl,
        }));
        setFreelancers(mappedFreelancers);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    loadFreelancers();
  }, []);

  // Get unique countries and job fields for filters
  const countries = [...new Set(freelancers.map(freelancer => freelancer.country))];
  const jobFields = [...new Set(freelancers.flatMap(freelancer => freelancer.preferredJobFields))];

  // Filter freelancers based on search term and filters
  const filteredFreelancers = freelancers.filter(freelancer => {
    const matchesSearch = 
      freelancer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCountry = !selectedCountry || freelancer.country === selectedCountry;
    const matchesJobField = !selectedJobField || freelancer.preferredJobFields.includes(selectedJobField);

    return matchesSearch && matchesCountry && matchesJobField;
  });

  const resetFilters = () => {
    setSelectedCountry('');
    setSelectedJobField('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <Navbar navItems={clientNavItems} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content with padding to account for fixed navbar */}
      <div className="pt-16 text-[#0A142F] p-4 md:p-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-[#0A142F]">
                Available Freelancers
              </h1>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <Filter size={20} className="text-[#0A142F]" />
                <span className="text-[#0A142F]">Filter Freelancers</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search freelancers by name, bio, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A142F]/20"
              />
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold">Filters</h2>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-[#0A142F]/70 hover:text-[#0A142F] flex items-center gap-1"
                  >
                    <X size={16} />
                    Reset
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg"
                    >
                      <option value="">All Countries</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Job Field</label>
                    <select
                      value={selectedJobField}
                      onChange={(e) => setSelectedJobField(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg"
                    >
                      <option value="">All Job Fields</option>
                      {jobFields.map(field => (
                        <option key={field} value={field}>{field}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Freelancers Grid */}
          <div className="grid gap-6">
            {loading ? (
              <div className="text-center py-8 text-[#0A142F]/70">Loading freelancers...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : filteredFreelancers.length === 0 ? (
              <div className="text-center py-8 text-[#0A142F]/70">
                No freelancers found matching your criteria
              </div>
            ) : (
              filteredFreelancers.map(freelancer => (
                <div
                  key={freelancer.id}
                  className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={freelancer.profilePicture}
                        alt={freelancer.fullName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h2 className="text-lg md:text-xl font-semibold text-[#0A142F] mb-2">{freelancer.fullName}</h2>
                        <div className="flex flex-wrap md:flex-nowrap items-center gap-4 text-sm text-[#0A142F]/70 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin size={16} />
                            <span>{freelancer.country}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail size={16} />
                            <span>{freelancer.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tags size={16} />
                            <span>{freelancer.preferredJobFields.length > 0 ? freelancer.preferredJobFields.join(', ') : 'Not specified'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ChevronRight 
                      className="text-[#0A142F]/40 group-hover:text-[#0A142F] transition-colors" 
                      size={24} 
                    />
                  </div>

                  <p className="text-[#0A142F]/70 mb-4 line-clamp-2">{freelancer.description}</p>

                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-[#0A142F] mb-2">Skills:</h3>
                    <div className="flex flex-wrap gap-2">
                      {freelancer.skills.length > 0 ? (
                        freelancer.skills.map((skill, index) => (
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
                    <h3 className="text-sm font-semibold text-[#0A142F] mb-2">Links:</h3>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {freelancer.linkedinUrl ? (
                        <a
                          href={freelancer.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0A142F]/70 hover:text-[#0A142F] underline"
                        >
                          LinkedIn
                        </a>
                      ) : (
                        <span className="text-[#0A142F]/70">No LinkedIn</span>
                      )}
                      {freelancer.githubUrl ? (
                        <a
                          href={freelancer.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0A142F]/70 hover:text-[#0A142F] underline"
                        >
                          GitHub
                        </a>
                      ) : (
                        <span className="text-[#0A142F]/70">No GitHub</span>
                      )}
                      {freelancer.portfolioUrl ? (
                        <a
                          href={freelancer.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0A142F]/70 hover:text-[#0A142F] underline"
                        >
                          Portfolio
                        </a>
                      ) : (
                        <span className="text-[#0A142F]/70">No Portfolio</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between pt-4 border-t border-gray-100 gap-4 md:gap-0">
                    <div className="flex items-center gap-2 text-[#0A142F]">
                      <Globe size={20} />
                      <span>
                        Available for {freelancer.preferredJobFields.length > 0 ? freelancer.preferredJobFields.join(' & ') : 'various projects'}
                      </span>
                    </div>
                    <button className="w-full md:w-auto px-4 py-2 bg-[#0A142F] text-white hover:bg-[#0A142F]/90 rounded-lg transition-colors">
                      Contact Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
       <Footer />
    </div>
  );
};

export default Freelancers;