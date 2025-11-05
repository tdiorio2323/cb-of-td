import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { usePlatform } from '../App';
import BottomNav from '../components/BottomNav';
import { Shield, Users, FileText, LogOut } from 'lucide-react';

const AdminRoutes: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { users } = usePlatform();

  // Get current user (first admin for demo)
  const currentUser = users.find(u => u.role === 'admin') || users[0];

  // Derive active view from URL path
  const getActiveView = () => {
    const path = location.pathname;
    if (path.includes('/admin/creators')) return 'creators';
    if (path.includes('/admin/content')) return 'content';
    if (path.includes('/admin/dashboard')) return 'dashboard';
    return 'dashboard';
  };

  const handleNavigate = (view: string) => {
    const viewToPath: Record<string, string> = {
      'dashboard': '/admin/dashboard',
      'creators': '/admin/creators',
      'content': '/admin/content',
    };
    navigate(viewToPath[view] || '/admin/dashboard');
  };

  const renderHeader = () => (
    <header className="bg-dark-2 border-b border-dark-3 p-4 flex justify-between items-center text-white">
      <div>
        <h1 className="text-xl font-bold text-red-400">CreatorHub (Admin)</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">
          Welcome, <span className="font-semibold">{currentUser.name}</span>
        </span>
        <img
          src={currentUser.avatarUrl}
          alt={currentUser.name}
          className="w-10 h-10 rounded-full border-2 border-red-400"
        />
        <button
          onClick={() => navigate('/auth/login')}
          className="text-gray-400 hover:text-white transition-colors"
          title="Log Out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );

  const renderSidebar = () => (
    <nav className="hidden md:flex flex-col w-64 backdrop-blur-md bg-white/5 border-r border-white/10 p-4">
      <NavItem
        label="Dashboard"
        icon={<Shield size={20} />}
        isActive={getActiveView() === 'dashboard'}
        onClick={() => handleNavigate('dashboard')}
      />
      <NavItem
        label="Creator Management"
        icon={<Users size={20} />}
        isActive={getActiveView() === 'creators'}
        onClick={() => handleNavigate('creators')}
      />
      <NavItem
        label="Content Moderation"
        icon={<FileText size={20} />}
        isActive={getActiveView() === 'content'}
        onClick={() => handleNavigate('content')}
      />
    </nav>
  );

  return (
    <div className="flex flex-col h-screen">
      {renderHeader()}
      <div className="flex flex-1 overflow-hidden">
        {renderSidebar()}
        <>
          <main className="pb-16">
            <Outlet />
          </main>
          <BottomNav />
        </>
      </div>
    </div>
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
          ? 'bg-red-600 text-white font-semibold'
          : 'text-gray-300 hover:bg-white/10 hover:text-white'
        }
      `}
    >
      {icon}
      <span>{label}</span>
      {badgeCount > 0 && (
        <span className="ml-auto bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {badgeCount}
        </span>
      )}
    </button>
  );
}

export default AdminRoutes;
