import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { usePlatformData } from './hooks/usePlatformData';
import { User } from './types';

// Auth components
import LoginScreen from './components/LoginScreen';
import LandingPage from './components/LandingPage';
import SignupPage from './components/SignupPage';
import PublicCreatorProfilePage from './components/PublicCreatorProfilePage';

// Route shells
import FanRoutes from './routes/FanRoutes';
import CreatorRoutes from './routes/CreatorRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ProtectedRoute from './components/ProtectedRoute';

// Page components
import FanHomePage from './components/pages/FanHomePage';
import FanDiscoverPage from './components/pages/FanDiscoverPage';
import FanMessagesPage from './components/pages/FanMessagesPage';
import CreatorDashboardPage from './components/pages/CreatorDashboardPage';
import CreatorPostsPage from './components/pages/CreatorPostsPage';
import CreatorSettingsPage from './components/pages/CreatorSettingsPage';
import CreatorMessagesPage from './components/pages/CreatorMessagesPage';
import AdminDashboardPage from './components/pages/AdminDashboardPage';
import AdminCreatorsPage from './components/pages/AdminCreatorsPage';
import AdminContentPage from './components/pages/AdminContentPage';

// --- Setup Platform Data Context ---
type PlatformDataContextType = ReturnType<typeof usePlatformData> | null;
const PlatformDataContext = createContext<PlatformDataContextType>(null);

/**
 * Custom hook to easily access the platform data from any component.
 */
export const usePlatform = () => {
  const context = useContext(PlatformDataContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformDataProvider');
  }
  return context;
};
// --- End Context Setup ---

const App: React.FC = () => {
  const navigate = useNavigate();
  const platformData = usePlatformData();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const currentUser = platformData.users.find(u => u.id === currentUserId);

  const handleLogin = (userId: string) => {
    setCurrentUserId(userId);

    // Find the user and navigate to their dashboard
    const user = platformData.users.find(u => u.id === userId);
    if (user) {
      switch (user.role) {
        case 'fan':
          navigate('/fan/home');
          break;
        case 'creator':
          navigate('/creator/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    }
  };

  return (
    <PlatformDataContext.Provider value={platformData}>
      <div className="min-h-screen font-sans">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<LoginScreen onLogin={handleLogin} />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/@:handle" element={<PublicCreatorProfilePage />} />

          {/* Fan routes */}
          <Route element={<ProtectedRoute currentUser={currentUser} allowedRoles={['fan']} />}>
            <Route path="/fan" element={<FanRoutes />}>
              <Route path="home" element={<FanHomePage />} />
              <Route path="discover" element={<FanDiscoverPage />} />
              <Route path="messages" element={<FanMessagesPage />} />
              <Route path="messages/:conversationId" element={<FanMessagesPage />} />
              <Route index element={<Navigate to="/fan/home" replace />} />
            </Route>
          </Route>

          {/* Creator routes */}
          <Route element={<ProtectedRoute currentUser={currentUser} allowedRoles={['creator']} />}>
            <Route path="/creator" element={<CreatorRoutes />}>
              <Route path="dashboard" element={<CreatorDashboardPage />} />
              <Route path="posts" element={<CreatorPostsPage />} />
              <Route path="settings" element={<CreatorSettingsPage />} />
              <Route path="messages" element={<CreatorMessagesPage />} />
              <Route path="messages/:conversationId" element={<CreatorMessagesPage />} />
              <Route index element={<Navigate to="/creator/dashboard" replace />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute currentUser={currentUser} allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminRoutes />}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="creators" element={<AdminCreatorsPage />} />
              <Route path="content" element={<AdminContentPage />} />
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </PlatformDataContext.Provider>
  );
};

export default App;
