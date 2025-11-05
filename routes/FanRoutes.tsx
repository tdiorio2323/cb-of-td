import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { usePlatform } from '../App';
import BottomNav from '../components/BottomNav';
import AccessCodeModal from '../components/AccessCodeModal';
import { Creator } from '../types';
import { LogOut } from 'lucide-react';
import { BalanceIcon } from '../components/icons';

const FanRoutes: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const platformData = usePlatform();
  const { users, getTotalUnreadCount } = platformData;

  const [showAccessModalFor, setShowAccessModalFor] = useState<Creator | null>(null);

  // Get current user (first fan for demo)
  const currentUser = users.find(u => u.role === 'fan') || users[0];

  // Derive active view from URL path
  const getActiveView = () => {
    const path = location.pathname;
    if (path.includes('/fan/discover')) return 'discover';
    if (path.includes('/fan/messages')) return 'messages';
    if (path.includes('/fan/home')) return 'home';
    return 'home';
  };

  const handleNavigate = (view: string) => {
    const viewToPath: Record<string, string> = {
      'home': '/fan/home',
      'feed': '/fan/home', // Handle the BottomNav bug
      'discover': '/fan/discover',
      'messages': '/fan/messages',
    };
    navigate(viewToPath[view] || '/fan/home');
  };

  const handleSubscribe = (creatorId: string, enteredCode: string): boolean => {
    const success = platformData.subscribeCreator(currentUser.id, creatorId, enteredCode);
    return success;
  };

  const renderHeader = () => (
    <header className="sticky top-0 z-40 bg-dark-1/80 backdrop-blur-lg border-b border-dark-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div
            className="cursor-pointer"
            onClick={() => navigate('/fan/home')}
          >
            <img src="https://i.imgur.com/JRQ30XP.png" alt="CreatorHub Logo" className="h-8" />
          </div>
          <div className="flex items-center space-x-4 md:space-x-8">
            <button
              onClick={() => navigate('/fan/wallet')}
              className="flex items-center space-x-1.5 bg-dark-3 px-3 py-1.5 rounded-full hover:bg-dark-2 transition-colors"
            >
              <BalanceIcon />
              <span className="font-semibold text-sm text-light-1">{currentUser.balance.toFixed(2)}</span>
            </button>
            <button onClick={() => navigate('/auth/login')} className="text-light-3 hover:text-light-1 transition-colors">
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <div className="flex flex-col h-screen">
      {renderHeader()}
      <>
        <main className="pb-16">
          <Outlet context={{ setShowAccessModalFor }} />
        </main>
        <BottomNav />
      </>
      {showAccessModalFor && (
        <AccessCodeModal
          isOpen={!!showAccessModalFor}
          onClose={() => setShowAccessModalFor(null)}
          creator={showAccessModalFor}
          onSubmit={(code) => handleSubscribe(showAccessModalFor.id, code)}
        />
      )}
    </div>
  );
};

export default FanRoutes;
