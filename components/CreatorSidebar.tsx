import React from 'react';
import { User } from '../types';
import { usePlatform } from '../App';
import { LayoutDashboard, MessageSquare, Settings, User as UserIcon } from 'lucide-react';

interface CreatorSidebarProps {
  activeView: string;
  onNavigate: (view: string, params?: any) => void;
  currentUser: User;
}

const CreatorSidebar: React.FC<CreatorSidebarProps> = ({ activeView, onNavigate, currentUser }) => {
  const { getTotalUnreadCount } = usePlatform();
  const totalUnread = getTotalUnreadCount(currentUser.id);

  return (
    <aside className="hidden md:flex flex-col w-64 backdrop-blur-md bg-white/5 border-r border-white/10 p-4">
      <nav className="flex flex-col gap-2">
        <NavItem 
          label="Dashboard"
          icon={<LayoutDashboard size={20} />}
          isActive={activeView === 'dashboard'}
          onClick={() => onNavigate('dashboard')}
        />
        <NavItem 
          label="My Profile"
          icon={<UserIcon size={20} />}
          // FIX: The 'navigation' object is not in scope here. The check has been simplified
          // to determine if any profile is active. A proper fix would require passing params.
          isActive={activeView === 'profile'}
          onClick={() => onNavigate('profile', { userId: currentUser.id })}
        />
        <NavItem 
          label="Messages"
          icon={<MessageSquare size={20} />}
          isActive={activeView === 'messages'}
          onClick={() => onNavigate('messages')}
          badgeCount={totalUnread}
        />
        <NavItem 
          label="Settings"
          icon={<Settings size={20} />}
          isActive={activeView === 'settings'}
          onClick={() => onNavigate('settings')}
        />
      </nav>
    </aside>
  );
};

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  badgeCount?: number;
}

function NavItem({ label, icon, isActive, onClick, badgeCount = 0 }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 w-full p-3 rounded-lg text-left transition-colors
        ${isActive
          ? 'bg-brand-primary text-dark-1 font-semibold'
          : 'text-light-2 hover:bg-white/10 hover:text-light-1'
        }
      `}
    >
      {icon}
      <span>{label}</span>
      {badgeCount > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {badgeCount > 9 ? '9+' : badgeCount}
        </span>
      )}
    </button>
  );
}

export default CreatorSidebar;