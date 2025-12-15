import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold dark:text-gray-100">My Profile</h1>
        
        <div className="card">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-20 w-20 rounded-full bg-primary-600 flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold dark:text-gray-100">{user?.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="label">Email</label>
              <p className="text-gray-900 dark:text-gray-100">{user?.email}</p>
            </div>
            
            {user?.grade && (
              <div>
                <label className="label">Grade</label>
                <p className="text-gray-900 dark:text-gray-100">Grade {user.grade}</p>
              </div>
            )}
            
            {user?.school && (
              <div>
                <label className="label">School</label>
                <p className="text-gray-900 dark:text-gray-100">{user.school}</p>
              </div>
            )}
            
            {user?.location && (
              <div>
                <label className="label">Location</label>
                <p className="text-gray-900 dark:text-gray-100">{user.location}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
