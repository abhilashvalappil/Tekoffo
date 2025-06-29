import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { User } from '../../types/admin';
import { fetchUsers, getTotalUsersCountByRole, updateUserStatus } from '../../api';
import { handleApiError } from '../../utils/errors/errorHandler';
import { usePagination } from '../../hooks/customhooks/usePagination';
import { Search, Users } from 'lucide-react';
import { useDebounce } from '../../hooks/customhooks/useDebounce';


const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers,setTotalUsers] = useState<number>(0);
  const [totalClients, setTotalClients] = useState<number>(0);
  const [totalFreelancers, setTotalFreelancers] = useState<number>(0);
  const [loading,setLoading] = useState(false)
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const { pagination, handlePageChange, updateMeta }= usePagination({
      total: 0,
      page: 1,
      pages: 1,
      limit: 4,
    });
  const debouncedSearchTerm = useDebounce(search, 500);

  const toggleBlock = async(id: string, isBlocked: boolean) => {
    const newStatus = !isBlocked;
     try {
    const updatedUser = await updateUserStatus(id,newStatus)
    setUsers(prev =>
      prev.map(user =>
        user._id === updatedUser.userId ? { ...user, isBlocked: updatedUser.isBlocked } : user
      )
    );
     toast.success(
      `User ${updatedUser.isBlocked ? 'blocked' : 'unblocked'} successfully`
    );
  } catch (err) {
    const errMsg = handleApiError(err);
    toast.error(errMsg || 'Something went wrong');
    }
  };

    useEffect(() => {
      const getUsers = async () => {
        try {
          setLoading(true);
          const response = await fetchUsers(pagination.page, pagination.limit, debouncedSearchTerm);  
          setUsers(response.data);
          updateMeta(response.meta.total,  response.meta.pages);
          setTotalUsers(response.meta.total);
        } catch (err) {
          const errormessage = handleApiError(err)
          setError(errormessage);
        } finally {
          setLoading(false);
        }
      };
      getUsers();
    }, [pagination.page, pagination.limit,debouncedSearchTerm, updateMeta]);

    useEffect(() => {
      const fetchUsersCount = async() => {
        try {
          const { clientsCount, freelancersCount }  = await getTotalUsersCountByRole ()
          setTotalClients(clientsCount);
          setTotalFreelancers(freelancersCount);
        } catch (error) {
          handleApiError(error)
        }
      }
      fetchUsersCount()
    },[])
  
     if (loading) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Loading categories...</p>
    </div>
  );
}

if (error) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-red-500">{error}</p>
    </div>
  );
}

  return (
    // <div className="overflow-x-auto">
     <div className="min-h-screen bg-gray-300">
      <Toaster position="top-right" />
        {/* <Sidebar isOpen={isSidebarOpen}onToggle={toggleSidebar}/>      */}
        <div className="fixed top-0 w-full z-50 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          </div>
        </div>
      </div>
      <div className="pt-25">
        <div className="ml-8 mr-7">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#0A1529]">Total Users</h3>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#0066FF]" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-4 text-[#0A1529]">{totalUsers}</p>
              <p className="text-sm text-green-600 mt-2 flex items-center">
                {/* <span className="flex items-center">↑ +12%</span>
                <span className="text-gray-500 ml-1">from last month</span> */}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#0A1529]">Total Clients</h3>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#0066FF]" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-4 text-[#0A1529]">{totalClients}</p>
              <p className="text-sm text-green-600 mt-2 flex items-center">
                {/* <span className="flex items-center">↑ +8%</span>
                <span className="text-gray-500 ml-1">from last month</span> */}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#0A1529]">Total Freelancers</h3>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#0066FF]" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-4 text-[#0A1529]">{totalFreelancers}</p>
              <p className="text-sm text-red-600 mt-2 flex items-center">
              </p>
            </div>
          </div>
          </div>
          <div className="ml-8 mr-7 mb-6">
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </div>
  <div className="w-[95%] max-w-8xl mx-auto">
    <table className="w-full divide-y divide-gray-200 shadow-md rounded-xl overflow-hidden">
      <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
        <tr>
          <th className="px-4 py-3">Username</th>
          <th className="px-4 py-3">Role</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Action</th>
        </tr>
      </thead>
      <tbody className="bg-white text-sm text-gray-700">
        {users.map(user => (
          <tr key={user._id} className="border-t border-gray-200 border-[0.5px]">
            <td className="px-4 py-3">
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </td>
            <td className="px-4 py-3 capitalize">{user.role}</td>
            <td className="px-4 py-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isBlocked
                    ? 'bg-red-100 text-red-600'
                    : 'bg-green-100 text-green-600'
                }`}
              >
                {user.isBlocked ? 'Blocked' : 'Active'}
              </span>
            </td>
            <td className="px-4 py-3">
              <button
                onClick={() => toggleBlock(user._id, user.isBlocked)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg text-white ${
                  user.isBlocked
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {user.isBlocked ? 'Unblock' : 'Block'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <Stack spacing={2} alignItems="center" className="mt-4">
    <Pagination
      count={pagination.pages}
      page={pagination.page}
      onChange={(_, value) => handlePageChange(value)}
      color="primary"
    />
  </Stack>
</div>
  
</div>
  );
};

export default UserTable;
