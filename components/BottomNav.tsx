import React from 'react';
import { UserRole } from '../types';
import { HomeIcon, DiscoverIcon, MessagesIcon, DashboardIcon, SettingsIcon } from './icons';

interface BottomNavProps {
  role: UserRole;
  activeView: string;
  onNavigate: (view: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ role, activeView, onNavigate }) => {

  const NavItem = ({ view, label, icon }: { view: string, label: string, icon: React.ReactNode }) => (
    <button
      onClick={() => onNavigate(view)}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
        activeView === view ? 'text-brand-primary' : 'text-light-3'
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );

  const FanNav = () => (
    <>
      <NavItem view="feed" label="Home" icon={<HomeIcon />} />
      <NavItem view="discover" label="Discover" icon={<DiscoverIcon />} />
      <NavItem view="messages" label="Messages" icon={<MessagesIcon />} />
    </>
  );

  const CreatorNav = () => (
    <>
      <NavItem view="dashboard" label="Dashboard" icon={<DashboardIcon />} />
      <NavItem view="messages" label="Messages" icon={<MessagesIcon />} />
      <NavItem view="settings" label="Settings" icon={<SettingsIcon />} />
    </>
  );

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-dark-2/80 backdrop-blur-lg border border-dark-3 rounded-2xl shadow-lg z-40">
      <div className="flex justify-around items-center h-full">
        {role === 'fan' && <FanNav />}
        {role === 'creator' && <CreatorNav />}
      </div>
    </nav>
  );
};

export default BottomNav;
