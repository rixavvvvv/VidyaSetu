import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { FiUsers, FiBook, FiFileText, FiActivity, FiTrash2, FiEdit, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/users/admin/statistics`),
        axios.get(`${import.meta.env.VITE_API_URL}/users`)
      ]);
      
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data || []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${userId}`);
      toast.success("User deleted successfully");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    return user.role === filter;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard 👑</h1>
          <p className="text-purple-100">Manage users and platform settings</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats?.users?.total || 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stats?.users?.active || 0} active</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <FiUsers className="text-white" size={24} />
              </div>
            </div>
          </div>
          
          <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Content</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats?.content?.total || 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stats?.content?.published || 0} published</p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <FiBook className="text-white" size={24} />
              </div>
            </div>
          </div>
          
          <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Quizzes</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats?.quizzes?.total || 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stats?.quizzes?.attempts || 0} attempts</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <FiFileText className="text-white" size={24} />
              </div>
            </div>
          </div>
          
          <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Students</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats?.users?.students || 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stats?.users?.teachers || 0} teachers</p>
              </div>
              <div className="bg-orange-500 p-3 rounded-lg">
                <FiActivity className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-gray-100">User Management</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                All ({users.length})
              </button>
              <button
                onClick={() => setFilter('student')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'student' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                Students
              </button>
              <button
                onClick={() => setFilter('teacher')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'teacher' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                Teachers
              </button>
            </div>
          </div>

          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">User</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Email</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Role</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Grade</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium dark:text-gray-100">{user.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.location || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-sm dark:text-gray-300">{user.email}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3 text-sm dark:text-gray-300">{user.grade || '-'}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FiUsers className="mx-auto mb-3 text-gray-400 dark:text-gray-500" size={48} />
              <p>No users found</p>
            </div>
          )}
        </div>

        {stats?.content?.byType && (
          <div className="card">
            <h2 className="text-xl font-bold dark:text-gray-100 mb-4">Content by Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {stats.content.byType.map((type, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{type.count}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{type._id}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
