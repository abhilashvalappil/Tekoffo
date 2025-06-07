
import {
  User,
  Building2,
  Lock,
  LogOut,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Client {
  fullName: string;
  companyName?: string;
  profilePicture?: string;
}

interface Props {
  client: Client;
  activeTab?: string;
}

function ClientProfileSidebar({ client }: Props) {

  return (
    <div className="lg:w-1/4 sticky top-8 h-fit">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={client.profilePicture || 'https://via.placeholder.com/150'}
              alt={client.fullName}
              className="w-32 h-32 rounded-full object-cover border-4 border-[#0A142F]"
            />
            <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
          </div>
          <h2 className="mt-4 text-xl font-bold">{client.fullName}</h2>
          {client.companyName && (
            <p className="text-[#0A142F] flex items-center gap-1">
              <Building2 size={16} />
              {client.companyName}
            </p>
          )}
        </div>

        <nav className="mt-8">
          <ul className="space-y-2">
            <Link to="/client/profile" className="block">
              <li
                className={`${
                  location.pathname === '/client/profile'
                    ? 'bg-[#0A142F] text-white'
                    : 'hover:bg-gray-50 text-gray-700'
                } rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-colors`}
              >
                <User size={20} />
                <span>My Profile</span>
              </li>
            </Link>
            {/* <li
              onClick={() => setActiveTab('wallet')}
              className={`${
                activeTab === 'wallet'
                  ? 'bg-[#0A142F] text-white'
                  : 'hover:bg-gray-50 text-gray-700'
              } rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-colors`}
            >
              <Wallet size={20} />
              <span>Wallet</span>
            </li> */}
            
            {/* <li
              onClick={() => setActiveTab('password')}
              className={`${
                activeTab === 'password'
                  ? 'bg-[#0A142F] text-white'
                  : 'hover:bg-gray-50 text-gray-700'
              } rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-colors`}
            >
              <Lock size={20} />
              <span>Change Password</span>
            </li> */}
            <li>
            <Link
                to="/change-password"
                className={`${
                  location.pathname === '/change-password'
                    ? 'bg-[#0A142F] text-white'
                    : 'hover:bg-gray-50 text-gray-700'
                } rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-colors`}
              >
                <Lock size={20} />
                <span>Change Password</span>
              </Link>
              </li>
             
            {/* <li
              onClick={() => setActiveTab('notifications')}
              className={`${
                activeTab === 'notifications'
                  ? 'bg-[#0A142F] text-white'
                  : 'hover:bg-gray-50 text-gray-700'
              } rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-colors`}
            >
              <Bell size={20} />
              <span>Notifications</span>
            </li> */}
            <li className="hover:bg-red-50 text-red-500 rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-colors mt-8">
              <LogOut size={20} />
              <span>Logout</span>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default ClientProfileSidebar;
