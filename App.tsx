import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { usePlatformData } from './hooks/usePlatformData';
import { User } from './types';
import { DEMO_MODE } from '@/config';
import DemoSwitcher from '@/components/DemoSwitcher';
import DemoBanner from '@/components/DemoBanner';

// Auth components
import LoginScreen from './components/LoginScreen';
import LandingPage from './components/LandingPage';
import SignupPage from './components/SignupPage';
import PublicCreatorProfilePage from './components/PublicCreatorProfilePage';

// Public pages
import PricingPage from './components/pages/PricingPage';
import ExplorePage from './components/pages/ExplorePage';
import TermsPage from './components/pages/TermsPage';
import PrivacyPage from './components/pages/PrivacyPage';
import StatusPage from './components/pages/StatusPage';

// Route shells
import FanRoutes from './routes/FanRoutes';
import CreatorRoutes from './routes/CreatorRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ProtectedRoute from './components/ProtectedRoute';

// Fan pages
import FanHomePage from './components/pages/FanHomePage';
import FanDiscoverPage from './components/pages/FanDiscoverPage';
import FanMessagesPage from './components/pages/FanMessagesPage';
import FanSettingsPage from './components/pages/FanSettingsPage';
import FanWalletPage from './components/pages/FanWalletPage';
import FanNotificationsPage from './components/pages/FanNotificationsPage';
import FanSubscriptionsPage from './components/pages/FanSubscriptionsPage';
import FanPurchasesPage from './components/pages/FanPurchasesPage';
import FanAccountPage from './components/pages/FanAccountPage';
import FanSupportPage from './components/pages/FanSupportPage';

// Creator pages
import CreatorDashboardPage from './components/pages/CreatorDashboardPage';
import CreatorPostsPage from './components/pages/CreatorPostsPage';
import CreatorSettingsPage from './components/pages/CreatorSettingsPage';
import CreatorMessagesPage from './components/pages/CreatorMessagesPage';
import CreatorOnboardingPage from './components/pages/CreatorOnboardingPage';
import CreatorPricingPage from './components/pages/CreatorPricingPage';
import CreatorLibraryPage from './components/pages/CreatorLibraryPage';
import CreatorAnalyticsPage from './components/pages/CreatorAnalyticsPage';
import CreatorOffersPage from './components/pages/CreatorOffersPage';
import CreatorShopPage from './components/pages/CreatorShopPage';
import CreatorSubscribersPage from './components/pages/CreatorSubscribersPage';
import CreatorPayoutsPage from './components/pages/CreatorPayoutsPage';
import CreatorSupportPage from './components/pages/CreatorSupportPage';

// Admin pages
import AdminDashboardPage from './components/pages/AdminDashboardPage';
import AdminCreatorsPage from './components/pages/AdminCreatorsPage';
import AdminContentPage from './components/pages/AdminContentPage';
import AdminReportsPage from './components/pages/AdminReportsPage';

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
        {DEMO_MODE && <DemoBanner />}

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<LoginScreen onLogin={handleLogin} />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/@:handle" element={<PublicCreatorProfilePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/legal/terms" element={<TermsPage />} />
          <Route path="/legal/privacy" element={<PrivacyPage />} />
          <Route path="/status" element={<StatusPage />} />

          {/* Fan routes */}
          <Route element={<ProtectedRoute currentUser={currentUser} allowedRoles={['fan']} />}>
            <Route path="/fan" element={<FanRoutes />}>
              <Route path="home" element={<FanHomePage />} />
              <Route path="discover" element={<FanDiscoverPage />} />
              <Route path="messages" element={<FanMessagesPage />} />
              <Route path="messages/:conversationId" element={<FanMessagesPage />} />
              <Route path="settings" element={<FanSettingsPage />} />
              <Route path="wallet" element={<FanWalletPage />} />
              <Route path="notifications" element={<FanNotificationsPage />} />
              <Route path="subscriptions" element={<FanSubscriptionsPage />} />
              <Route path="purchases" element={<FanPurchasesPage />} />
              <Route path="account" element={<FanAccountPage />} />
              <Route path="support" element={<FanSupportPage />} />
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
              <Route path="onboarding" element={<CreatorOnboardingPage />} />
              <Route path="pricing" element={<CreatorPricingPage />} />
              <Route path="library" element={<CreatorLibraryPage />} />
              <Route path="analytics" element={<CreatorAnalyticsPage />} />
              <Route path="offers" element={<CreatorOffersPage />} />
              <Route path="shop" element={<CreatorShopPage />} />
              <Route path="subscribers" element={<CreatorSubscribersPage />} />
              <Route path="payouts" element={<CreatorPayoutsPage />} />
              <Route path="support" element={<CreatorSupportPage />} />
              <Route index element={<Navigate to="/creator/dashboard" replace />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute currentUser={currentUser} allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminRoutes />}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="creators" element={<AdminCreatorsPage />} />
              <Route path="content" element={<AdminContentPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {DEMO_MODE && <DemoSwitcher />}
      </div>
    </PlatformDataContext.Provider>
  );
};

export default App;
