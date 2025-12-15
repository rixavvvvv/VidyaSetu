import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FiBook, FiCheckCircle, FiClock, FiTrendingUp, FiAward, FiActivity } from 'react-icons/fi';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const MyProgress = () => {
  const [progress, setProgress] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProgressData();
  }, [filter]);

  const fetchProgressData = async () => {
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const [progressRes, analyticsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/progress${params}`),
        axios.get(`${import.meta.env.VITE_API_URL}/progress/analytics?period=30`)
      ]);
      
      setProgress(progressRes.data.data || []);
      setAnalytics(analyticsRes.data.data || {});
    } catch (error) {
      console.error("Error fetching progress:", error);
      toast.error("Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'not-started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  const totalLessons = progress.length;
  const completed = progress.filter(p => p.status === 'completed').length;
  const inProgress = progress.filter(p => p.status === 'in-progress').length;
  const totalTimeSpent = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold dark:text-gray-100">My Learning Progress 📊</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Lessons</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalLessons}</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <FiBook className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{completed}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0}% done
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <FiCheckCircle className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{inProgress}</p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-lg">
                <FiActivity className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Time Spent</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{totalTimeSpent}m</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <FiClock className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {analytics?.quizPerformance && analytics.quizPerformance.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-bold dark:text-gray-100 mb-4">Quiz Performance Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.quizPerformance.slice(-10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="submittedAt" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="percentage" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold dark:text-gray-100 mb-4">Subject Performance</h2>
              {analytics?.subjectPerformance && analytics.subjectPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.subjectPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="averageScore" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                  No quiz data available
                </div>
              )}
            </div>
          </div>
        )}

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-gray-100">Content Progress</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'completed' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('in-progress')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'in-progress' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                In Progress
              </button>
            </div>
          </div>

          {progress.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Content</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Subject</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Progress</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Time Spent</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Last Accessed</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.map((item) => (
                    <tr key={item._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="p-3">
                        <Link 
                          to={`/content/${item.content?._id}`}
                          className="font-medium text-primary-600 hover:text-primary-700"
                        >
                          {item.content?.title}
                        </Link>
                      </td>
                      <td className="p-3 text-sm dark:text-gray-300">{item.content?.subject}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full" 
                              style={{ width: `${item.progressPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium dark:text-gray-300">{item.progressPercentage}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm dark:text-gray-300">{item.timeSpent || 0}m</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(item.lastAccessedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <FiBook className="mx-auto mb-3 text-gray-400 dark:text-gray-500" size={48} />
              <p>No progress data available</p>
              <Link to="/content" className="btn btn-primary mt-4">
                Start Learning
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyProgress;
