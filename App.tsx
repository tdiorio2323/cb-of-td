import React, { useState } from 'react';
import Header from './components/Header';
import { useAuth } from './hooks/useAuth';
import { UserRole } from './types';
import { usePlatformData } from './hooks/usePlatformData';

// Role-specific view components
import FanView from './components/FanView';
import CreatorView from './components/CreatorView';
import AdminView from './components/AdminView';

const getDefaultViewForRole = (role: UserRole) => {
    switch (role) {
        case 'fan': return 'feed';
        case 'creator': return 'dashboard';
        case 'admin': return 'dashboard';
        default: return 'feed';
    }
}

const App: React.FC = () => {
  const { currentUser, setCurrentUser, switchUser } = useAuth();
  const [navigation, setNavigation] = useState({ view: getDefaultViewForRole(currentUser.role), params: {} });
  
  const platformData = usePlatformData();

  const handleNavigation = (view: string, params = {}) => {
    setNavigation({ view, params });
  }

  const handleSwitchUser = (role: UserRole) => {
      switchUser(role);
      handleNavigation(getDefaultViewForRole(role));
  }
  
  const unreadMessagesCount = platformData.getTotalUnreadCount(currentUser.id);

  const renderAppForRole = () => {
    switch (currentUser.role) {
      case 'fan':
        return <FanView 
                    currentUser={currentUser} 
                    setCurrentUser={setCurrentUser}
                    navigation={navigation}
                    onNavigate={handleNavigation}
                    platformData={platformData}
                />;
      case 'creator':
        return <CreatorView 
                    currentUser={currentUser}
                    navigation={navigation}
                    onNavigate={handleNavigation}
                    platformData={platformData}
                />;
      case 'admin':
        return <AdminView 
                    currentUser={currentUser} 
                    platformData={platformData} 
                />;
      default:
        return <div>Error: Unknown user role.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-transparent font-sans">
      <Header 
        currentUser={currentUser} 
        switchUser={handleSwitchUser}
        onNavigate={handleNavigation}
        unreadMessages={unreadMessagesCount}
      />
      {renderAppForRole()}
    </div>
  );
};

export default App;