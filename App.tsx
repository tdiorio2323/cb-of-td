import React, { useState, createContext, useContext } from 'react';
import { usePlatformData } from './hooks/usePlatformData';
import { User } from './types';

// Role-specific view components
import FanView from './components/FanView';
import CreatorView from './components/CreatorView';
import AdminView from './components/AdminView';
import LoginScreen from './components/LoginScreen';

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
  const platformData = usePlatformData();
  const [currentUserId, setCurrentUserId] = useState<string | null>('user-fan-1');
  const currentUser = platformData.users.find(u => u.id === currentUserId);

  const handleLogout = () => {
    setCurrentUserId(null); 
  };
  
  const handleLogin = (userId: string) => {
    setCurrentUserId(userId);
  };

  const renderView = () => {
    if (!currentUser) {
      return <LoginScreen onLogin={handleLogin} />;
    }
    
    switch (currentUser.role) {
      case 'fan':
        return <FanView currentUser={currentUser} onLogout={handleLogout} />;
      case 'creator':
        return <CreatorView currentUser={currentUser} onLogout={handleLogout} />;
      case 'admin':
        return <AdminView currentUser={currentUser} onLogout={handleLogout} />;
      default:
        return <div>Error: Unknown role. Please log out and try again.</div>;
    }
  };

  return (
    <PlatformDataContext.Provider value={platformData}>
      <div className="min-h-screen bg-dark-1 font-sans">
        {renderView()}
      </div>
    </PlatformDataContext.Provider>
  );
};

export default App;
