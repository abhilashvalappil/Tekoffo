import React from 'react';
import {
  Users,
  Briefcase,
  MessageSquare,
  Settings,
  BarChart3,
  Bell,
  Search,
  Menu,
} from 'lucide-react';

function DashboardApp() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600">Tekoffo</h1>
          <p className="text-sm text-gray-500">Admin Dashboard</p>
        </div>
        <nav className="mt-4">
          <a href="#" className="flex items-center px-6 py-3 text-gray-700 bg-indigo-50 border-r-4 border-indigo-600">
            <Users className="w-5 h-5 mr-3" />
            Users
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50">
            <Briefcase className="w-5 h-5 mr-3" />
            Jobs
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50">
            <MessageSquare className="w-5 h-5 mr-3" />
            Messages
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50">
            <BarChart3 className="w-5 h-5 mr-3" />
            Analytics
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-8 py-5">
            <div className="flex items-center gap-4">
              <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-full">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Admin"
                className="w-10 h-10 rounded-full border-2 border-indigo-600"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="text-3xl font-bold mt-4">2,543</p>
              <p className="text-sm text-green-600 mt-2">+12% from last month</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-700">Active Jobs</h3>
                <Briefcase className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="text-3xl font-bold mt-4">1,234</p>
              <p className="text-sm text-green-600 mt-2">+8% from last month</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-700">Messages</h3>
                <MessageSquare className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="text-3xl font-bold mt-4">892</p>
              <p className="text-sm text-red-600 mt-2">-3% from last month</p>
            </div>
          </div>

          {/* Recent Users Table */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Recent Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    {
                      name: 'John Doe',
                      email: 'john@example.com',
                      role: 'Freelancer',
                      status: 'Active',
                      joined: 'Mar 12, 2024',
                      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                    },
                    {
                      name: 'Sarah Smith',
                      email: 'sarah@example.com',
                      role: 'Client',
                      status: 'Pending',
                      joined: 'Mar 10, 2024',
                      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                    },
                    {
                      name: 'Michael Johnson',
                      email: 'michael@example.com',
                      role: 'Freelancer',
                      status: 'Active',
                      joined: 'Mar 8, 2024',
                      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                    }
                  ].map((user, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.joined}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardApp;