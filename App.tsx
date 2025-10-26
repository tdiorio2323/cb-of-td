import React, { useState } from 'react';
import Header from './components/Header';
import { useAuth } from './hooks/useAuth';
import { UserRole } from './types';

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
  const { currentUser, setCurrentUser, switchUser: switchAuthUser } = useAuth();
  const [view, setView] = useState(getDefaultViewForRole(currentUser.role));
  const [activeConversationUserId, setActiveConversationUserId] = useState<string | null>(null);

  const handleNavigation = (newView: string) => {
    setView(newView);
    setActiveConversationUserId(null); // Reset active chat when navigating away
  }
  
  const handleStartChat = (userId: string) => {
    setView('messages');
    setActiveConversationUserId(userId);
  }

  const handleSwitchUser = (role: UserRole) => {
      switchAuthUser(role);
      setView(getDefaultViewForRole(role));
      setActiveConversationUserId(null);
  }

  const renderAppForRole = () => {
    switch (currentUser.role) {
      case 'fan':
        return <FanView 
                    currentUser={currentUser} 
                    setCurrentUser={setCurrentUser}
                    view={view}
                    setView={setView}
                    onStartChat={handleStartChat}
                    activeConversationUserId={activeConversationUserId}
                />;
      case 'creator':
        return <CreatorView 
                    currentUser={currentUser}
                    view={view}
                    setView={setView}
                    activeConversationUserId={activeConversationUserId}
                />;
      case 'admin':
        return <AdminView currentUser={currentUser} />;
      default:
        return <div>Error: Unknown user role.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-dark-1 font-sans">
      <Header 
        currentUser={currentUser} 
        switchUser={handleSwitchUser}
        onNavigate={handleNavigation}
      />
      {renderAppForRole()}
    </div>
  );
};

export default App;