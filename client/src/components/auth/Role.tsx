 
import { BriefcaseIcon, UserIcon, Users2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../constants/types';

const RoleSelection = () => {
    const navigate = useNavigate();
    const handleRoleSelect = (role:UserRole | string) => {
        navigate('/signup',{state:{role}})
    }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center">
              <BriefcaseIcon className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Tekoffo</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Join Tekoffo as a
          </h1>
          <p className="text-lg text-gray-600 text-center mb-12">
            Choose how you want to use Tekoffo
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            {/* Client Card */}
            <button onClick={() => handleRoleSelect('client')}
             className="group p-8 bg-white rounded-xl shadow-sm border-2 border-transparent hover:border-blue-500 transition-all duration-200 text-left">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Users2 className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="ml-4 text-2xl font-semibold text-gray-900">Client</h2>
              </div>
              <p className="text-gray-600">
                I want to hire talented freelancers for my projects and get work done efficiently.
              </p>
              <div className="mt-6 flex items-center text-blue-600 font-medium">
                Join as Client
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Freelancer Card */}
            <button onClick={() => handleRoleSelect('freelancer')}
            className="group p-8 bg-white rounded-xl shadow-sm border-2 border-transparent hover:border-blue-500 transition-all duration-200 text-left">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <UserIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="ml-4 text-2xl font-semibold text-gray-900">Freelancer</h2>
              </div>
              <p className="text-gray-600">
                I want to offer my services, find exciting projects, and grow my freelance business.
              </p>
              <div className="mt-6 flex items-center text-blue-600 font-medium">
                Join as Freelancer
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Already have an account?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;