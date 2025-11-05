import React, { useState, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { usePlatform } from '../App';
import CreatorSidebar from '../components/CreatorSidebar';
import BottomNav from '../components/BottomNav';
import CreatePostModal from '../components/CreatePostModal';
import { Post } from '../types';
import { LogOut } from 'lucide-react';

const CreatorRoutes: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const platformData = usePlatform();
  const { users, getCreatorByUserId, addPost, updatePost } = platformData;

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Get current user (first creator for demo)
  const currentUser = users.find(u => u.role === 'creator') || users[0];
  const creatorProfile = useMemo(() => getCreatorByUserId(currentUser.id), [currentUser.id, getCreatorByUserId]);

  if (!creatorProfile) {
    return <div className="text-center p-8">Could not load creator profile.</div>;
  }

  // Derive active view from URL path
  const getActiveView = () => {
    const path = location.pathname;
    if (path.includes('/creator/posts')) return 'posts';
    if (path.includes('/creator/settings')) return 'settings';
    if (path.includes('/creator/messages')) return 'messages';
    if (path.includes('/creator/dashboard')) return 'dashboard';
    return 'dashboard';
  };

  const handleNavigate = (view: string) => {
    const viewToPath: Record<string, string> = {
      'dashboard': '/creator/dashboard',
      'posts': '/creator/posts',
      'settings': '/creator/settings',
      'messages': '/creator/messages',
    };
    navigate(viewToPath[view] || '/creator/dashboard');
  };

  const handleSavePost = (data: { text: string; imageUrl: string | undefined; isPrivate: boolean; postId?: string }) => {
    if (data.postId) {
      updatePost(data.postId, {
        text: data.text,
        imageUrl: data.imageUrl,
        isPrivate: data.isPrivate,
      });
    } else {
      addPost(creatorProfile.id, data.text, data.imageUrl, data.isPrivate);
    }
  };

  const handleCloseModal = () => {
    setCreateModalOpen(false);
    setEditingPost(null);
  };

  const renderHeader = () => (
    <header className="sticky top-0 z-30 bg-dark-1/80 backdrop-blur-lg border-b border-dark-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div
            className="cursor-pointer"
            onClick={() => navigate('/creator/dashboard')}
          >
            <img src="https://i.imgur.com/JRQ30XP.png" alt="CreatorHub Logo" className="h-8" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm hidden sm:inline">Welcome, <span className="font-semibold">{creatorProfile.name}</span></span>
            <button onClick={() => navigate('/creator/dashboard')} className="transition-transform hover:scale-105">
              <img src={creatorProfile.avatarUrl} alt={creatorProfile.name} className="w-10 h-10 rounded-full border-2 border-dark-3" />
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
      <div className="flex flex-1 overflow-y-hidden">
        <CreatorSidebar
          activeView={getActiveView()}
          onNavigate={handleNavigate}
          currentUser={currentUser}
        />
        <>
          <main className="pb-16">
            <Outlet context={{ setCreateModalOpen, setEditingPost }} />
          </main>
          <BottomNav />
        </>
      </div>
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSavePost}
        creator={creatorProfile}
        postToEdit={editingPost}
      />
    </div>
  );
};

export default CreatorRoutes;
