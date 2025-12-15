import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ContentLibrary from './pages/ContentLibrary';
import ContentView from './pages/ContentView';
import QuizLibrary from './pages/QuizLibrary';
import QuizAttempt from './pages/QuizAttempt';
import QuizResult from './pages/QuizResult';
import MyProgress from './pages/MyProgress';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } />
            
            <Route path="/content" element={
              <ProtectedRoute>
                <ContentLibrary />
              </ProtectedRoute>
            } />
            
            <Route path="/content/:id" element={
              <ProtectedRoute>
                <ContentView />
              </ProtectedRoute>
            } />
            
            <Route path="/quizzes" element={
              <ProtectedRoute>
                <QuizLibrary />
              </ProtectedRoute>
            } />
            
            <Route path="/quizzes/:id/attempt" element={
              <ProtectedRoute>
                <QuizAttempt />
              </ProtectedRoute>
            } />
            
            <Route path="/quizzes/:id/result" element={
              <ProtectedRoute>
                <QuizResult />
              </ProtectedRoute>
            } />
            
            <Route path="/progress" element={
              <ProtectedRoute>
                <MyProgress />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Dashboard Router - redirects based on role
const DashboardRouter = () => {
  const userRole = localStorage.getItem('userRole');
  
  if (userRole === 'admin') {
    return <AdminDashboard />;
  } else if (userRole === 'teacher') {
    return <TeacherDashboard />;
  } else {
    return <StudentDashboard />;
  }
};

export default App;
