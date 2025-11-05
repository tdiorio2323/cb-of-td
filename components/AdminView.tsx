import React, { useState } from 'react';
import { User } from '../types';
import { usePlatform } from '../App';
// FIX: Imported icons from `lucide-react` and custom icon components from `./icons` separately to resolve import errors.
import { Shield, Users, FileText, LogOut } from 'lucide-react';
import { VerifiedIcon, UnverifiedIcon, DeleteIcon } from './icons';
import AdminDashboard from './AdminDashboard';

// --- PROPS ---
interface AdminViewProps {
  currentUser: User;
  onLogout: () => void;
}

// --- NAVIGATION ---
type AdminNavView = 'dashboard' | 'creators' | 'content';

export default function AdminView({ currentUser, onLogout }: AdminViewProps) {
  const [activeView, setActiveView] = useState<AdminNavView>('dashboard');

  // --- RENDER FUNCTIONS ---

  // 1. Render the Header
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
          onClick={onLogout}
          className="text-gray-400 hover:text-white transition-colors"
          title="Log Out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );

  // 2. Render the Sidebar Navigation
  const renderSidebar = () => (
    <nav className="hidden md:flex flex-col w-64 bg-dark-2 p-4">
      <NavItem 
        label="Dashboard"
        icon={<Shield size={20} />}
        isActive={activeView === 'dashboard'}
        onClick={() => setActiveView('dashboard')}
      />
      <NavItem 
        label="Creator Management"
        icon={<Users size={20} />}
        isActive={activeView === 'creators'}
        onClick={() => setActiveView('creators')}
      />
      <NavItem 
        label="Content Moderation"
        icon={<FileText size={20} />}
        isActive={activeView === 'content'}
        onClick={() => setActiveView('content')}
      />
    </nav>
  );

  // 3. Render the Main Content based on activeView
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'creators':
        return <CreatorManager />;
      case 'content':
        return <ContentModeration />;
      default:
        return <div className="p-6 text-white">Page not found.</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {renderHeader()}
      <div className="flex flex-1 overflow-hidden">
        {renderSidebar()}
        <main className="flex-1 bg-dark-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// --- Helper Components for Admin Sections ---

const CreatorManager = () => {
    const { creators, toggleCreatorVerification } = usePlatform();
    return <div>
        <h2 className="text-2xl font-bold mb-4 text-white">Creator Management</h2>
        <div className="bg-dark-2 rounded-lg overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-dark-3">
                    <tr>
                        <th className="p-4">Creator</th>
                        <th className="p-4">Handle</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {creators.map(creator => (
                        <tr key={creator.id} className="border-b border-dark-3 last:border-0">
                            <td className="p-4 flex items-center space-x-3">
                                <img src={creator.avatarUrl} alt={creator.name} className="w-10 h-10 rounded-full"/>
                                <span className="text-white">{creator.name}</span>
                            </td>
                            <td className="p-4 text-light-3">@{creator.handle}</td>
                            <td className="p-4 text-center">
                                {creator.isVerified ? <VerifiedIcon /> : <UnverifiedIcon />}
                            </td>
                            <td className="p-4 text-center">
                                <button 
                                    onClick={() => toggleCreatorVerification(creator.id)}
                                    className={`px-3 py-1 text-xs rounded-full ${creator.isVerified ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}
                                >
                                    {creator.isVerified ? 'Unverify' : 'Verify'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
}

const ContentModeration = () => {
    const { posts, removePost, getCreatorById } = usePlatform();
    return <div>
        <h2 className="text-2xl font-bold mb-4 text-white">Content Moderation</h2>
        <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
            {posts.map(post => {
                const creator = getCreatorById(post.creatorId);
                return (
                    <div key={post.id} className="bg-dark-2 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-3 flex-grow overflow-hidden">
                                {creator && (
                                    <img src={creator.avatarUrl} alt={creator.name} className="w-10 h-10 rounded-full flex-shrink-0 mt-1" />
                                )}
                                <div className="flex-grow overflow-hidden">
                                    <p className="text-sm font-semibold text-light-1 truncate">
                                        {creator ? creator.name : 'Unknown Creator'}
                                        <span className="text-light-3 font-normal ml-2">@{creator?.handle}</span>
                                    </p>
                                    <p className="mt-1 text-light-2 break-words">
                                        {post.text}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => removePost(post.id)} 
                                className="ml-4 text-light-3 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-full flex-shrink-0 transition-colors"
                                aria-label="Delete post"
                            >
                               <DeleteIcon />
                            </button>
                        </div>
                        {post.imageUrl && (
                            <div className="mt-3" style={{ paddingLeft: '3.25rem' }}>
                                <img src={post.imageUrl} alt="Post content" className="rounded-lg max-h-48 w-auto object-cover" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
}

// --- Helper Component for Navigation Items ---
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
          : 'text-gray-300 hover:bg-dark-3 hover:text-white'
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