
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users } from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'client' | 'freelancer') => {
    navigate('/signup', { state: { role } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Choose Your Role
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => handleRoleSelect('client')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition duration-200 group"
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition duration-200">
                <Briefcase size={40} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Client</h2>
              <p className="text-gray-600 text-center">
                Post projects and hire talented freelancers
              </p>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect('freelancer')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition duration-200 group"
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition duration-200">
                <Users size={40} className="text-indigo-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Freelancer</h2>
              <p className="text-gray-600 text-center">
                Find work and showcase your skills
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;