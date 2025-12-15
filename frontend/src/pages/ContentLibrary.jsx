import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { FiSearch, FiFilter, FiBook, FiDownload, FiHeart, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ContentLibrary = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: '',
    grade: '',
    contentType: '',
    search: ''
  });

  useEffect(() => {
    fetchContent();
  }, [filters]);

  const fetchContent = async () => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/content?${params}`);
      setContents(response.data.data);
    } catch (error) {
      toast.error('Error fetching content');
    } finally {
      setLoading(false);
    }
  };

  const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Computer Science', 'General Knowledge'];
  const contentTypes = ['video', 'audio', 'pdf', 'text', 'image'];

  const getContentIcon = (type) => {
    const icons = {
      video: '🎥',
      audio: '🎵',
      pdf: '📄',
      text: '📝',
      image: '🖼️'
    };
    return icons[type] || '📚';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold dark:text-gray-100">Content Library</h1>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search content..."
                className="input"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            
            <select
              className="input"
              value={filters.subject}
              onChange={(e) => setFilters({...filters, subject: e.target.value})}
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            
            <select
              className="input"
              value={filters.grade}
              onChange={(e) => setFilters({...filters, grade: e.target.value})}
            >
              <option value="">All Grades</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
              ))}
            </select>
            
            <select
              className="input"
              value={filters.contentType}
              onChange={(e) => setFilters({...filters, contentType: e.target.value})}
            >
              <option value="">All Types</option>
              {contentTypes.map(type => (
                <option key={type} value={type} className="capitalize">{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((content) => (
              <Link
                key={content._id}
                to={`/content/${content._id}`}
                className="card hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{getContentIcon(content.contentType)}</span>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                    {content.subject}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg mb-2 line-clamp-2 dark:text-gray-100">{content.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{content.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <FiEye className="mr-1" size={14} />
                    {content.views}
                  </span>
                  <span className="dark:text-gray-300">Grade {content.grade}</span>
                  <span className="flex items-center">
                    <FiHeart className="mr-1" size={14} />
                    {content.likes?.length || 0}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && contents.length === 0 && (
          <div className="text-center py-12">
            <FiBook className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
            <p className="text-gray-500 dark:text-gray-400">No content found matching your filters</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ContentLibrary;
