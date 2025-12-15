import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  FiBook, FiFileText, FiUsers, FiUpload, 
  FiEdit, FiTrash2, FiEye, FiCheckCircle, FiXCircle,
  FiVideo, FiHeadphones, FiFile, FiImage
} from 'react-icons/fi';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [myContent, setMyContent] = useState([]);
  const [myQuizzes, setMyQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    subject: 'Mathematics',
    grade: '10',
    contentType: 'video',
    difficulty: 'intermediate',
    tags: ''
  });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [contentRes, quizzesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/content?createdBy=${user?.id}`),
        axios.get(`${import.meta.env.VITE_API_URL}/quizzes?createdBy=${user?.id}`)
      ]);
      
      setMyContent(contentRes.data.data || []);
      setMyQuizzes(quizzesRes.data.data || []);
      
      const totalContent = contentRes.data.data?.length || 0;
      const publishedContent = contentRes.data.data?.filter(c => c.isPublished).length || 0;
      const totalQuizzes = quizzesRes.data.data?.length || 0;
      const totalViews = contentRes.data.data?.reduce((sum, c) => sum + (c.views || 0), 0) || 0;
      
      setStats({
        totalContent,
        publishedContent,
        totalQuizzes,
        totalViews
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    
    if (!uploadFile && uploadData.contentType !== 'text') {
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    
    Object.keys(uploadData).forEach(key => {
      formData.append(key, uploadData[key]);
    });
    
    if (uploadFile) {
      formData.append('file', uploadFile);
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/content`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success("Content uploaded successfully!");
      setShowUploadModal(false);
      setUploadData({
        title: '',
        description: '',
        subject: 'Mathematics',
        grade: '10',
        contentType: 'video',
        difficulty: 'intermediate',
        tags: ''
      });
      setUploadFile(null);
      fetchDashboardData();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload content");
    } finally {
      setUploading(false);
    }
  };

  const togglePublish = async (contentId, currentStatus) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/content/${contentId}/publish`);
      toast.success(currentStatus ? "Content unpublished" : "Content published");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to update content status");
    }
  };

  const deleteContent = async (contentId) => {
    if (!window.confirm("Are you sure you want to delete this content?")) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/content/${contentId}`);
      toast.success("Content deleted successfully");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to delete content");
    }
  };

  const deleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/quizzes/${quizId}`);
      toast.success("Quiz deleted successfully");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to delete quiz");
    }
  };

  const getContentIcon = (type) => {
    switch(type) {
      case 'video': return <FiVideo className="text-red-500" />;
      case 'audio': return <FiHeadphones className="text-purple-500" />;
      case 'pdf': return <FiFile className="text-blue-500" />;
      case 'image': return <FiImage className="text-green-500" />;
      default: return <FiFileText className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👨‍🏫</h1>
          <p className="text-green-100">Manage your educational content and track student engagement</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Content</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats?.totalContent || 0}</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <FiBook className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Published</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats?.publishedContent || 0}</p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <FiCheckCircle className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Quizzes</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats?.totalQuizzes || 0}</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <FiFileText className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Views</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats?.totalViews || 0}</p>
              </div>
              <div className="bg-orange-500 p-3 rounded-lg">
                <FiEye className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowUploadModal(true)}
            className="card hover:shadow-lg transition-shadow text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 cursor-pointer"
          >
            <FiUpload className="mx-auto mb-3 text-blue-600 dark:text-blue-400" size={40} />
            <h3 className="font-bold text-lg mb-2 dark:text-gray-100">Upload Content</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Add new educational materials</p>
          </button>

          <Link
            to="/quizzes/create"
            className="card hover:shadow-lg transition-shadow text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800"
          >
            <FiFileText className="mx-auto mb-3 text-purple-600 dark:text-purple-400" size={40} />
            <h3 className="font-bold text-lg mb-2 dark:text-gray-100">Create Quiz</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Design interactive assessments</p>
          </Link>

          <Link
            to="/content"
            className="card hover:shadow-lg transition-shadow text-center p-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800"
          >
            <FiUsers className="mx-auto mb-3 text-green-600 dark:text-green-400" size={40} />
            <h3 className="font-bold text-lg mb-2 dark:text-gray-100">Browse All Content</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">View all platform content</p>
          </Link>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-gray-100">My Content</h2>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn btn-primary text-sm"
            >
              <FiUpload className="inline mr-2" />
              Upload New
            </button>
          </div>

          {myContent.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Content</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Type</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Subject</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Views</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myContent.map((content) => (
                    <tr key={content._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {getContentIcon(content.contentType)}
                          <div>
                            <p className="font-medium dark:text-gray-100">{content.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Grade {content.grade}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-sm dark:text-gray-300 capitalize">{content.contentType}</td>
                      <td className="p-3 text-sm dark:text-gray-300">{content.subject}</td>
                      <td className="p-3 text-sm dark:text-gray-300">{content.views || 0}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          content.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {content.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => togglePublish(content._id, content.isPublished)}
                            className="text-blue-600 hover:text-blue-800"
                            title={content.isPublished ? "Unpublish" : "Publish"}
                          >
                            {content.isPublished ? <FiXCircle size={18} /> : <FiCheckCircle size={18} />}
                          </button>
                          <Link
                            to={`/content/${content._id}`}
                            className="text-green-600 hover:text-green-800"
                            title="View"
                          >
                            <FiEye size={18} />
                          </Link>
                          <button
                            onClick={() => deleteContent(content._id)}
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
              <FiBook className="mx-auto mb-3 text-gray-400 dark:text-gray-500" size={48} />
              <p>No content uploaded yet</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn btn-primary mt-4"
              >
                Upload Your First Content
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-gray-100">My Quizzes</h2>
            <Link to="/quizzes/create" className="btn btn-primary text-sm">
              <FiFileText className="inline mr-2" />
              Create New
            </Link>
          </div>

          {myQuizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myQuizzes.map((quiz) => (
                <div key={quiz._id} className="border dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg dark:text-gray-100">{quiz.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      quiz.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {quiz.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{quiz.description}</p>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span>{quiz.subject}</span>
                    <span>Grade {quiz.grade}</span>
                    <span>{quiz.questions?.length || 0} Questions</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/quizzes/${quiz._id}`}
                      className="btn btn-secondary text-xs flex-1"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => deleteQuiz(quiz._id)}
                      className="btn btn-danger text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FiFileText className="mx-auto mb-3 text-gray-400 dark:text-gray-500" size={48} />
              <p>No quizzes created yet</p>
              <Link to="/quizzes/create" className="btn btn-primary mt-4">
                Create Your First Quiz
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold dark:text-gray-100">Upload Content</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="label">Title *</label>
                  <input
                    type="text"
                    className="input"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="label">Description *</label>
                  <textarea
                    className="input"
                    rows="3"
                    value={uploadData.description}
                    onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Subject *</label>
                    <select
                      className="input"
                      value={uploadData.subject}
                      onChange={(e) => setUploadData({...uploadData, subject: e.target.value})}
                    >
                      <option>Mathematics</option>
                      <option>Science</option>
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Social Studies</option>
                      <option>Computer Science</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Grade *</label>
                    <select
                      className="input"
                      value={uploadData.grade}
                      onChange={(e) => setUploadData({...uploadData, grade: e.target.value})}
                    >
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Content Type *</label>
                    <select
                      className="input"
                      value={uploadData.contentType}
                      onChange={(e) => setUploadData({...uploadData, contentType: e.target.value})}
                    >
                      <option value="video">Video</option>
                      <option value="audio">Audio</option>
                      <option value="pdf">PDF Document</option>
                      <option value="image">Image</option>
                      <option value="text">Text/Notes</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Difficulty *</label>
                    <select
                      className="input"
                      value={uploadData.difficulty}
                      onChange={(e) => setUploadData({...uploadData, difficulty: e.target.value})}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="algebra, equations, math"
                    value={uploadData.tags}
                    onChange={(e) => setUploadData({...uploadData, tags: e.target.value})}
                  />
                </div>

                {uploadData.contentType !== 'text' && (
                  <div>
                    <label className="label">Upload File *</label>
                    <input
                      type="file"
                      className="input"
                      onChange={(e) => setUploadFile(e.target.files[0])}
                      accept={
                        uploadData.contentType === 'video' ? 'video/*' :
                        uploadData.contentType === 'audio' ? 'audio/*' :
                        uploadData.contentType === 'pdf' ? '.pdf' :
                        uploadData.contentType === 'image' ? 'image/*' : '*'
                      }
                      required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Max file size: 50MB</p>
                  </div>
                )}

                {uploadData.contentType === 'text' && (
                  <div>
                    <label className="label">Text Content *</label>
                    <textarea
                      className="input"
                      rows="6"
                      placeholder="Enter your text content here..."
                      value={uploadData.textContent || ''}
                      onChange={(e) => setUploadData({...uploadData, textContent: e.target.value})}
                      required
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload Content'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="btn btn-secondary"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default TeacherDashboard;
