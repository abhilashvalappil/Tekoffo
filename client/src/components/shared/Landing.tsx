import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Briefcase, Users, Trophy, ChevronRight, Code, PenTool, Calculator, GraduationCap, Scale, Menu, X } from 'lucide-react';

function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <Briefcase className="h-8 w-8 text-[#0A142F]" />
                <span className="ml-2 text-xl font-bold">Tekoffo</span>
              </a>
              <div className="hidden md:flex items-center ml-10 space-x-8">
                <a href="#" className="text-gray-700 hover:text-[#0A142F]">Find Freelancers</a>
                <a href="#" className="text-gray-700 hover:text-[#0A142F]">Find Jobs</a>
                <a href="#" className="text-gray-700 hover:text-[#0A142F]">About</a>
                <div className="relative group">
                  <button className="text-gray-700 hover:text-[#0A142F] flex items-center">
                    Solutions
                    <ChevronRight className="w-4 h-4 ml-1 transform group-hover:rotate-90 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button className="bg-[#0A142F] text-white px-6 py-2 rounded-lg hover:bg-[#0A142F]/90 font-medium">
                Post a Job
              </button>
              <button className="text-gray-700 hover:text-[#0A142F] font-medium">
              <Link to="/signup-as">Sign Up</Link>
                </button>
              <button className="text-gray-700 hover:text-[#0A142F] font-medium">
              <Link to="/signin">Log In</Link>
                </button>
            </div>
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6 text-[#0A142F]" /> : <Menu className="h-6 w-6 text-[#0A142F]" />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">Find Freelancers</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">Find Jobs</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">About</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">Solutions</a>
              <div className="border-t pt-4 pb-3">
                <button className="w-full bg-[#0A142F] text-white px-4 py-2 rounded-lg hover:bg-[#0A142F]/90 mb-2">
                  Post a Job
                </button>
                {/* <button className="w-full text-gray-700 px-4 py-2 hover:bg-gray-50 mb-2">Sign Up</button> */}
                {/* <button className="w-full text-gray-700 px-4 py-2 hover:bg-gray-50">Log In</button> */}
                <Link
                  to="/signup-as"
                  className="block w-full text-left text-gray-700 px-4 py-2 hover:bg-gray-50 mb-2"
                >
                  Sign Up
                </Link>
                <Link
                  to="/signin"
                  className="block w-full text-left text-gray-700 px-4 py-2 hover:bg-gray-50"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-[#0A142F] text-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Find Top Freelancers
              </h1>
              <p className="text-gray-300 mb-8 text-lg">
                Work with the best freelance talent from around the world on our secure, flexible and cost-effective platform.
              </p>
              {/* <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="What skill are you looking for?"
                  className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#0A142F]">
                  <Search className="w-5 h-5" />
                </button>
              </div> */}
              <div className="flex flex-wrap gap-2">
                {['Design', 'Writing', 'Data Entry', 'Web Development', 'Graphic Design'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800"
                alt="Freelancer working"
                className="rounded-lg w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Find Top Freelancers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Code className="w-12 h-12 text-[#0A142F]" />, title: 'Programming & Development', count: '286,705 Freelancers' },
              { icon: <PenTool className="w-12 h-12 text-[#0A142F]" />, title: 'Writing & Translation', count: '212,263 Freelancers' },
              { icon: <Users className="w-12 h-12 text-[#0A142F]" />, title: 'Design & Art', count: '196,065 Freelancers' },
              { icon: <Briefcase className="w-12 h-12 text-[#0A142F]" />, title: 'Administrative & Secretarial', count: '86,282 Freelancers' },
              { icon: <Trophy className="w-12 h-12 text-[#0A142F]" />, title: 'Sales & Marketing', count: '77,205 Freelancers' },
              { icon: <Calculator className="w-12 h-12 text-[#0A142F]" />, title: 'Engineering & Architecture', count: '50,792 Freelancers' },
              { icon: <Calculator className="w-12 h-12 text-[#0A142F]" />, title: 'Business & Finance', count: '45,725 Freelancers' },
              { icon: <GraduationCap className="w-12 h-12 text-[#0A142F]" />, title: 'Education & Training', count: '10,155 Freelancers' },
              { icon: <Scale className="w-12 h-12 text-[#0A142F]" />, title: 'Legal', count: '5,724 Freelancers' },
            ].map((category, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="flex justify-center mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-600">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Tekoffo Works For You</h2>
            <p className="text-gray-600">Get your job done in 4 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '01', title: 'Create Account', description: 'Sign up for free and complete your profile' },
              { number: '02', title: 'Search Jobs', description: 'Browse and find the perfect job match' },
              { number: '03', title: 'Submit Proposal', description: 'Send your best proposal to potential clients' },
              { number: '04', title: 'Get Hired', description: 'Start working and earn money' },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-[#0A142F]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#0A142F] font-bold text-xl">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0A142F] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Tekoffo</h3>
              <p className="text-gray-400">
                The #1 platform for freelancers and businesses to connect and collaborate.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Freelancers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Browse Jobs</li>
                <li>Submit Proposals</li>
                <li>Profile Settings</li>
                <li>Payment Methods</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Post a Job</li>
                <li>Find Freelancers</li>
                <li>Payment Methods</li>
                <li>How it Works</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Tekoffo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;