import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Code2,
  Globe2,
  Layout,
  MessageSquare,
  PenTool,
  Search,
  Star,
  TrendingUp,
  Users,
  Menu,
  X,
  Briefcase,
  Shield,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Globe2 className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 text-transparent bg-clip-text">
                Strive
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Find Work</a>
              <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Browse Freelancers</a>
              <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">How it Works</a>
              <button onClick={() => navigate('/signup-as')} className="btn-primary">
                Sign Up Free
              </button>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute w-full bg-white shadow-lg animate-slide-up">
            <div className="px-4 pt-2 pb-3 space-y-2">
              <a href="#" className="block px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200">
                Find Work
              </a>
              <a href="#" className="block px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200">
                Browse Freelancers
              </a>
              <a href="#" className="block px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200">
                How it Works
              </a>
              <button className="w-full btn-primary mt-2">
                Sign Up Free
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary-50 via-white to-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 pt-14 pb-8 sm:pt-16 sm:pb-16 md:pt-20 lg:pt-28 lg:pb-28 xl:pt-32 xl:pb-32">
            <main className="mx-auto max-w-7xl">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                  <span className="block">Find the perfect</span>
                  <span className="block mt-2 bg-gradient-to-r from-primary-600 to-primary-500 text-transparent bg-clip-text">
                    freelance talent
                  </span>
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-500 sm:text-xl md:text-2xl">
                  Connect with top freelancers, bring your ideas to life, and grow your business with confidence.
                </p>
                <div className="mt-8 max-w-3xl mx-auto">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-white shadow-sm
                               placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
                               text-base transition-all duration-200"
                      placeholder="Try 'mobile app development' or 'logo design'"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary py-2">
                      Search
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-gray-500">
                    Popular: 
                    <a href="#" className="text-primary-600 hover:text-primary-700">Website Design</a> •
                    <a href="#" className="text-primary-600 hover:text-primary-700">Content Writing</a> •
                    <a href="#" className="text-primary-600 hover:text-primary-700">Digital Marketing</a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <StatCard number="10M+" label="Freelancers" />
            <StatCard number="95%" label="Client Satisfaction" />
            <StatCard number="$1.2B" label="Paid to Freelancers" />
            <StatCard number="150+" label="Countries" />
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Explore Popular Categories
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Find the perfect match for your project needs
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <CategoryCard
              icon={<Code2 />}
              title="Development & IT"
              count="20k+ jobs"
              skills={['Web Development', 'Mobile Apps', 'DevOps']}
            />
            <CategoryCard
              icon={<PenTool />}
              title="Design & Creative"
              count="15k+ jobs"
              skills={['UI/UX Design', 'Graphic Design', 'Branding']}
            />
            <CategoryCard
              icon={<Layout />}
              title="Digital Marketing"
              count="12k+ jobs"
              skills={['SEO', 'Social Media', 'Content Marketing']}
            />
            <CategoryCard
              icon={<MessageSquare />}
              title="Writing & Translation"
              count="8k+ jobs"
              skills={['Copywriting', 'Technical Writing', 'Translation']}
            />
          </div>
        </div>
      </div>

      {/* Featured Freelancers */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Top Rated Freelancers</h2>
            <p className="mt-4 text-xl text-gray-500">Work with the best talent from around the world</p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FreelancerCard
              name="Sarah Johnson"
              title="UI/UX Designer"
              rating={5}
              reviews={127}
              hourlyRate="$65"
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
              skills={['Figma', 'Adobe XD', 'Prototyping']}
            />
            <FreelancerCard
              name="Michael Chen"
              title="Full Stack Developer"
              rating={5}
              reviews={89}
              hourlyRate="$85"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
              skills={['React', 'Node.js', 'PostgreSQL']}
            />
            <FreelancerCard
              name="Emily Davis"
              title="Digital Marketing Expert"
              rating={5}
              reviews={156}
              hourlyRate="$55"
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
              skills={['SEO', 'Google Ads', 'Analytics']}
            />
          </div>
          <div className="mt-12 text-center">
            <button className="btn-secondary inline-flex items-center">
              View All Freelancers
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">How Strive Works</h2>
            <p className="mt-4 text-xl text-gray-500">Simple steps to find the perfect freelancer</p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <ProcessCard
              icon={<Briefcase />}
              title="Post a Job"
              description="Create a detailed job posting describing your project requirements and budget."
              step="1"
            />
            <ProcessCard
              icon={<Users />}
              title="Review Proposals"
              description="Receive proposals from skilled freelancers and review their profiles and portfolios."
              step="2"
            />
            <ProcessCard
              icon={<Shield />}
              title="Work Safely"
              description="Use our secure platform for communication, payments, and project management."
              step="3"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block text-primary-200">Join thousands of satisfied clients.</span>
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Sign up now and connect with top freelancers from around the world.
            </p>
          </div>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-4">
            <button className="btn-secondary">
              Learn More
            </button>
            <button className="btn-primary bg-white text-primary-600 hover:bg-primary-50">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-white rounded-xl shadow-sm card-hover">
      <div className="text-3xl font-bold text-primary-600">{number}</div>
      <div className="mt-2 text-sm text-gray-500">{label}</div>
    </div>
  );
}

function CategoryCard({ icon, title, count, skills }: {
  icon: React.ReactNode;
  title: string;
  count: string;
  skills: string[];
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm card-hover border border-gray-100">
      <div className="text-primary-600 w-12 h-12 flex items-center justify-center bg-primary-50 rounded-lg mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{count}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function FreelancerCard({ name, title, rating, reviews, hourlyRate, image, skills }: {
  name: string;
  title: string;
  rating: number;
  reviews: number;
  hourlyRate: string;
  image: string;
  skills: string[];
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm card-hover border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center">
          <img
            className="h-16 w-16 rounded-full object-cover ring-2 ring-primary-50"
            src={image}
            alt={name}
          />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{title}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
            ))}
            <span className="ml-2 text-sm text-gray-500">{reviews} reviews</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-gray-900">{hourlyRate}/hr</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
        <button className="mt-4 w-full btn-primary">
          View Profile
        </button>
      </div>
    </div>
  );
}

function ProcessCard({ icon, title, description, step }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  step: string;
}) {
  return (
    <div className="relative p-6 bg-white rounded-xl shadow-sm card-hover border border-gray-100">
      <div className="absolute -top-4 left-6 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
        {step}
      </div>
      <div className="mt-4">
        <div className="text-primary-600 w-12 h-12 flex items-center justify-center bg-primary-50 rounded-lg mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export default App;