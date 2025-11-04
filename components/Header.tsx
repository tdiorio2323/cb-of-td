import React from 'react';
import { HomeIcon, DiscoverIcon, DashboardIcon, SettingsIcon, MessagesIcon, BalanceIcon } from './icons';
import RoleSwitcher from './RoleSwitcher';
// FIX: Imported the `User` type to resolve the 'Cannot find name 'User'' error.
import { User, UserRole } from '../types';

interface HeaderProps {
    currentUser: User;
    switchUser: (role: UserRole) => void;
    onNavigate: (view: string, params?: any) => void;
    unreadMessages: number;
}

const Header: React.FC<HeaderProps> = ({ currentUser, switchUser, onNavigate, unreadMessages }) => {
  const role = currentUser.role;

  const FanNav = () => (
    <>
      <button onClick={() => onNavigate('feed')} className="flex items-center space-x-2 text-light-2 hover:text-brand-primary transition-colors">
        <HomeIcon/>
        <span>Home</span>
      </button>
      <button onClick={() => onNavigate('discover')} className="flex items-center space-x-2 text-light-2 hover:text-brand-primary transition-colors">
        <DiscoverIcon/>
        <span>Discover</span>
      </button>
      <button onClick={() => onNavigate('messages')} className="relative flex items-center space-x-2 text-light-2 hover:text-brand-primary transition-colors">
        <MessagesIcon/>
        <span>Messages</span>
        {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {unreadMessages > 9 ? '9+' : unreadMessages}
            </span>
        )}
      </button>
    </>
  );

  const CreatorNav = () => (
      <>
        <button onClick={() => onNavigate('dashboard')} className="flex items-center space-x-2 text-light-2 hover:text-brand-primary transition-colors">
          <DashboardIcon/>
          <span>Dashboard</span>
        </button>
         <button onClick={() => onNavigate('messages')} className="relative flex items-center space-x-2 text-light-2 hover:text-brand-primary transition-colors">
            <MessagesIcon/>
            <span>Messages</span>
             {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
            )}
        </button>
        <button onClick={() => onNavigate('settings')} className="flex items-center space-x-2 text-light-2 hover:text-brand-primary transition-colors">
            <SettingsIcon/>
            <span>Settings</span>
        </button>
      </>
  );

  const AdminNav = () => (
    <button onClick={() => onNavigate('dashboard')} className="flex items-center space-x-2 text-light-2 hover:text-brand-primary transition-colors">
      <DashboardIcon/>
      <span>Admin Panel</span>
    </button>
  );

  return (
    <header className="sticky top-0 z-40 bg-dark-1/80 backdrop-blur-lg border-b border-dark-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div 
            className="cursor-pointer"
            onClick={() => onNavigate(role === 'fan' ? 'feed' : 'dashboard')}
          >
            <img src="https://i.imgur.com/JRQ30XP.png" alt="CreatorHub Logo" className="h-8" />
          </div>
          <div className="flex items-center space-x-4 md:space-x-8">
            <nav className="hidden md:flex items-center space-x-8">
                {role === 'fan' && <FanNav />}
                {role === 'creator' && <CreatorNav />}
                {role === 'admin' && <AdminNav />}
            </nav>
            <RoleSwitcher currentRole={role} onSwitch={switchUser} />
             {currentUser.role === 'fan' && (
                <div className="hidden sm:flex items-center space-x-1.5 bg-dark-3 px-3 py-1.5 rounded-full">
                    <BalanceIcon />
                    <span className="font-semibold text-sm text-light-1">{currentUser.balance.toFixed(2)}</span>
                </div>
            )}
            <button onClick={() => onNavigate('profile', { userId: currentUser.id })} className="transition-transform hover:scale-105">
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full border-2 border-dark-3"/>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;