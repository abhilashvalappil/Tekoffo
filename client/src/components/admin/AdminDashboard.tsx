import React, { useState, useRef, useEffect } from 'react';
import {
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  Search,
  Menu,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';
import { useDispatch,useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import {fetchUsers,updateUserStatus} from '../../api/admin'
import {logout} from '../../redux/services/authService'
import { useNavigate } from 'react-router-dom';
import { persistor } from '../../redux/store'
import Table from './Table';
import Sidebar from './Sidebar';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  isBlocked?: boolean;
}

function AdminDash() {
  const [selectedItem, setSelectedItem] = useState('users');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  
  // const navItems = [
  //   { id: 'users', label: 'Users', icon: Users },
  //   { id: 'category-management', label: 'Category Management', icon: Tag },
  //   { id: 'jobs', label: 'Jobs', icon: Briefcase },
  //   { id: 'messages', label: 'Messages', icon: MessageSquare },
  //   { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  //   { id: 'settings', label: 'Settings', icon: Settings },
  // ];

 
  // const userId = useSelector((state) => state.auth.user?._id || null)
  const userId = useSelector((state:RootState) => state.auth.user?._id || null)
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // const { users, loading, error, totalCount } = useSelector(
  //   (state: RootState) => state.users
  // );
  const [users, setUsers] = useState<User[]>([]); 
  const [totalCount,setTotalCount] = useState(0);
  const [loading,setLoading] = useState(false)
  const [error, setError] = useState('');

   
  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        const response = await fetchUsers();  
        setUsers(response.users);
        setTotalCount(response.totalCount);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  const handleToggleBlock = async(userId: string, isBlocked: boolean) => {
    try {
      const newStatus = !isBlocked; 
      const updatedUser = await updateUserStatus(userId,newStatus)
       setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser.userId ? { ...user, isBlocked: updatedUser.isBlocked } : user
        )
      );
    } catch (error: any) {
      console.error("Error updating user status:", error.message);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = async() => {
    try {
          if(userId){
            const result = await dispatch(logout(userId)).unwrap();
            console.log("Logout successful:", result);
            persistor.purge(); 
            navigate("/signin");
          }
          
        } catch (error) {
          console.error("Logout failed:", error);
        }
  };

 
  interface Column {
    header: string;
    accessor: keyof User;
    cell?: (user: User) => JSX.Element;
  }
 
  // Define columns
  const columns: Column[] = [
    {
      header: "User",
      accessor: "username",
      cell: (user) => (
        <div className="flex items-center">
          <div className="ml-4">
            <div className="text-sm font-medium text-[#0A1529]">
              {user.username}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
    },
    { header: "Role", accessor: "role" },
    {
      header: "Status",
      accessor: "status",
      cell: (user) => (
        // <span
        //   className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-lg ${
        //     user.status === "Active"
        //       ? "bg-green-50 text-green-700"
        //       : "bg-yellow-50 text-yellow-700"
        //   }`}
        // >
        //   {/* {user.status} */}
        //   {user.status || "Active"}
        // </span>
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-lg ${
            user.isBlocked ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}
        >
          {user.isBlocked ? "Blocked" : "Active"}
        </span>
      ),
    },
    // { header: "Joined", accessor: "joined" },
    {
      header: "Action",
      accessor: "_id", // Using _id as a key for the action
      cell: (user) => (
        // <button
        //   onClick={() => handleToggleBlock(user._id)}
        //   className={`px-3 py-1 text-xs font-semibold rounded-lg text-white ${
        //     user.status === "blocked" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
        //   }`}
        // >
        //   {user.status === "blocked" ? "Unblock" : "Block"}
        // </button>
        <button
          onClick={() => handleToggleBlock(user._id, user.isBlocked)}
          className={`px-3 py-1 text-xs font-semibold rounded-lg text-white ${
            user.isBlocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {user.isBlocked ? "Unblock" : "Block"}
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-5 gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button 
                onClick={toggleMobileMenu}
                className="p-1.5 hover:bg-gray-100 rounded-lg md:hidden"
              >
                <Menu className="w-6 h-6 text-[#0A1529]" />
              </button>
              <div className="relative flex-1 md:flex-none">
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-full">
                <Bell className="w-6 h-6 text-[#0A1529]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  className="flex items-center gap-3 focus:outline-none"
                >
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-[#0A1529]">John Doe</p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Admin"
                    className="w-10 h-10 rounded-lg border-2 border-[#0066FF]"
                  />
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        // Handle profile click
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#0A1529]">Total Users</h3>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#0066FF]" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-4 text-[#0A1529]">{totalCount}</p>
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <span className="flex items-center">↑ +12%</span>
                <span className="text-gray-500 ml-1">from last month</span>
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#0A1529]">Active Jobs</h3>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-[#0066FF]" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-4 text-[#0A1529]">1,234</p>
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <span className="flex items-center">↑ +8%</span>
                <span className="text-gray-500 ml-1">from last month</span>
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#0A1529]">Messages</h3>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-[#0066FF]" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-4 text-[#0A1529]">892</p>
              <p className="text-sm text-red-600 mt-2 flex items-center">
                <span className="flex items-center">↓ -3%</span>
                <span className="text-gray-500 ml-1">from last month</span>
              </p>
            </div>
          </div>

          {/* Recent Users Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-[#0A1529]">Recent Users</h2>
            </div>
            {/* <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F9FB]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1529] uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1529] uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1529] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1529] uppercase tracking-wider">Joined</th>
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
                          <img className="h-10 w-10 rounded-lg" src={user.avatar} alt="" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[#0A1529]">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#0A1529]">{user.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-lg ${
                          user.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
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
            </div> */}
             <Table data={users} columns={columns} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDash;