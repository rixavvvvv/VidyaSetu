import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { FiFileText, FiClock, FiAward, FiTrendingUp } from 'react-icons/fi';

const QuizLibrary = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: '',
    grade: '',
    difficulty: ''
  });

  useEffect(() => {
    fetchQuizzes();
  }, [filters]);

  const fetchQuizzes = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.subject) params.append('subject', filters.subject);
      if (filters.grade) params.append('grade', filters.grade);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/quizzes?${params}`);
      setQuizzes(response.data.data || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      toast.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold dark:text-gray-100">Quiz Library 📝</h1>
        </div>

        <div className="card">
          <h2 className="font-bold dark:text-gray-100 mb-4">Filter Quizzes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Subject</label>
              <select
                className="input"
                value={filters.subject}
                onChange={(e) => setFilters({...filters, subject: e.target.value})}
              >
                <option value="">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Social Studies">Social Studies</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>

            <div>
              <label className="label">Grade</label>
              <select
                className="input"
                value={filters.grade}
                onChange={(e) => setFilters({...filters, grade: e.target.value})}
              >
                <option value="">All Grades</option>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Difficulty</label>
              <select
                className="input"
                value={filters.difficulty}
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FiFileText className="text-purple-600" size={24} />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </div>

                <h3 className="font-bold text-lg mb-2 dark:text-gray-100">{quiz.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{quiz.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subject:</span>
                    <span className="font-medium dark:text-gray-200">{quiz.subject}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Grade:</span>
                    <span className="font-medium dark:text-gray-200">{quiz.grade}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Questions:</span>
                    <span className="font-medium dark:text-gray-200">{quiz.questions?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="font-medium dark:text-gray-200 flex items-center gap-1">
                      <FiClock size={14} />
                      {quiz.duration} min
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Passing Score:</span>
                    <span className="font-medium dark:text-gray-200 flex items-center gap-1">
                      <FiAward size={14} />
                      {quiz.passingScore}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Attempts:</span>
                    <span className="font-medium dark:text-gray-200 flex items-center gap-1">
                      <FiTrendingUp size={14} />
                      {quiz.attempts || 0}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/quizzes/${quiz._id}/attempt`}
                  className="btn btn-primary w-full text-center"
                >
                  Start Quiz
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <FiFileText className="mx-auto mb-4 text-gray-400 dark:text-gray-500" size={64} />
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No Quizzes Found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or check back later</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QuizLibrary;
