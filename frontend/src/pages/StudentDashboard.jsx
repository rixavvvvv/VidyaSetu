import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { 
  FiBook, FiFileText, FiTrendingUp, FiAward, 
  FiClock, FiTarget, FiActivity 
} from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/progress/dashboard/stats`);
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  const statCards = [
    {
      title: 'Total Lessons',
      value: stats?.overview?.totalLessons || 0,
      icon: FiBook,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Completed',
      value: stats?.overview?.completedLessons || 0,
      icon: FiTarget,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Quizzes Taken',
      value: stats?.overview?.totalQuizzes || 0,
      icon: FiFileText,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Average Score',
      value: `${stats?.overview?.averageScore || 0}%`,
      icon: FiAward,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Time Spent',
      value: `${stats?.overview?.totalTimeSpent || 0}m`,
      icon: FiClock,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600'
    },
    {
      title: 'In Progress',
      value: stats?.overview?.inProgressLessons || 0,
      icon: FiActivity,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Student! 📚</h1>
          <p className="text-primary-100">Continue your learning journey today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subject Progress */}
        {stats?.subjectProgress && stats.subjectProgress.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Subject-wise Progress</h2>
            <div className="space-y-4">
              {stats.subjectProgress.map((subject, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium dark:text-gray-200">{subject._id}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {subject.completed}/{subject.total} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all"
                      style={{ width: `${subject.avgProgress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Lessons */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-gray-100">Recent Lessons</h2>
              <Link to="/content" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {stats?.recentActivity?.recentProgress?.length > 0 ? (
                stats.recentActivity.recentProgress.slice(0, 5).map((item, index) => (
                  <Link
                    key={index}
                    to={`/content/${item.content?._id}`}
                    className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{item.content?.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.content?.subject} • Grade {item.content?.grade}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.status === 'completed' ? 'bg-green-100 text-green-800' :
                        item.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{item.progressPercentage}%</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>

          {/* Recent Quizzes */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-gray-100">Recent Quizzes</h2>
              <Link to="/quizzes" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {stats?.recentActivity?.recentQuizzes?.length > 0 ? (
                stats.recentActivity.recentQuizzes.slice(0, 5).map((result, index) => (
                  <div key={index} className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{result.quiz?.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{result.quiz?.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                        {result.percentage}%
                      </p>
                      <p className="text-xs text-gray-500">{result.passed ? 'Passed' : 'Failed'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No quizzes attempted yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/content" className="card hover:shadow-lg transition-shadow text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
            <FiBook className="mx-auto mb-3 text-blue-600 dark:text-blue-400" size={40} />
            <h3 className="font-bold text-lg mb-2 dark:text-gray-100">Browse Content</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Explore educational materials</p>
          </Link>
          
          <Link to="/quizzes" className="card hover:shadow-lg transition-shadow text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
            <FiFileText className="mx-auto mb-3 text-purple-600 dark:text-purple-400" size={40} />
            <h3 className="font-bold text-lg mb-2 dark:text-gray-100">Take Quiz</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Test your knowledge</p>
          </Link>
          
          <Link to="/progress" className="card hover:shadow-lg transition-shadow text-center p-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
            <FiTrendingUp className="mx-auto mb-3 text-green-600 dark:text-green-400" size={40} />
            <h3 className="font-bold text-lg mb-2 dark:text-gray-100">View Progress</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Track your learning</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
