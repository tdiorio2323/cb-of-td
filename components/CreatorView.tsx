import React, { useState, useMemo } from 'react';
import { User, Creator, Post } from '../types';
import CreatePostModal from './CreatePostModal';
import MessagesDashboard from './MessagesDashboard';
import BottomNav from './BottomNav';
import { usePlatform } from '../App';
import CreatorSidebar from './CreatorSidebar';
import CreatorDashboard from './CreatorDashboard';
import PostManager from './PostManager';
import CreatorSettings from './CreatorSettings';
import { LogOut } from 'lucide-react';
import ProfileHeader from './ProfileHeader';
import PostCard from './PostCard';

interface CreatorViewProps {
  currentUser: User;
  onLogout: () => void;
}

type CreatorNavView = 'dashboard' | 'posts' | 'messages' | 'settings' | 'profile';

const CreatorView: React.FC<CreatorViewProps> = ({ currentUser, onLogout }) => {
  const [activeView, setActiveView] = useState<CreatorNavView>('dashboard');
  const [viewParams, setViewParams] = useState<any>({});

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  const platformData = usePlatform();
  const { 
      getCreatorByUserId, 
      addPost, 
      updatePost,
      removePost,
      getPostsByCreatorId,
      allUsersMap,
      getFollowerCount,
      getTotalTipsByCreatorId,
    } = platformData;
    
  const creatorProfile = useMemo(() => getCreatorByUserId(currentUser.id), [currentUser.id, getCreatorByUserId]);

  if (!creatorProfile) {
    return <div className="text-center p-8">Could not load creator profile.</div>;
  }
  
  const handleNavigate = (view: CreatorNavView, params = {}) => {
    setActiveView(view);
    setViewParams(params);
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
  
  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setCreateModalOpen(true);
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        removePost(postId);
    }
  };
  
  const handleCloseModal = () => {
    setCreateModalOpen(false);
    setEditingPost(null);
  }

  const renderHeader = () => (
     <header className="sticky top-0 z-30 bg-dark-1/80 backdrop-blur-lg border-b border-dark-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div 
            className="cursor-pointer"
            onClick={() => handleNavigate('dashboard')}
          >
             <img src="https://i.imgur.com/JRQ30XP.png" alt="CreatorHub Logo" className="h-8" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm hidden sm:inline">Welcome, <span className="font-semibold">{creatorProfile.name}</span></span>
            <button onClick={() => handleNavigate('profile', { userId: currentUser.id })} className="transition-transform hover:scale-105">
                <img src={creatorProfile.avatarUrl} alt={creatorProfile.name} className="w-10 h-10 rounded-full border-2 border-dark-3"/>
            </button>
            <button onClick={onLogout} className="text-light-3 hover:text-light-1 transition-colors">
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
  
   const renderCreatorProfile = (creator: Creator) => {
    const posts = getPostsByCreatorId(creator.id);
    const isOwnProfile = creator.id === creatorProfile.id;
    const followerCount = getFollowerCount(creator.id);
    const totalTips = getTotalTipsByCreatorId(creator.id);

    return (
      <div className="w-full max-w-3xl mx-auto">
        <ProfileHeader
          creator={creator}
          postCount={posts.length}
          followerCount={followerCount}
          isFollowing={false}
          isOwnProfile={isOwnProfile}
          onFollowClick={() => {}}
          onUnfollow={() => {}}
          onEditProfile={() => handleNavigate('settings')}
          onMessageClick={() => handleNavigate('messages', { initialConversationUserId: creator.id })}
          totalTips={totalTips}
        />
        <div className="px-4 md:px-0">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                creator={creator}
                onCreatorClick={() => {}}
                canManage={isOwnProfile}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            ))}
        </div>
      </div>
    );
  };
  
  const renderContent = () => {
      switch (activeView) {
          case 'dashboard': 
            return <CreatorDashboard 
                creator={creatorProfile} 
                onNavigate={(v, p) => handleNavigate(v as CreatorNavView, p)}
                onEditPost={handleEditPost}
                onDeletePost={handleDeletePost}
                onCreatePost={() => setCreateModalOpen(true)}
            />;
          case 'posts':
            return <PostManager
                creator={creatorProfile}
                onCreatePost={() => setCreateModalOpen(true)}
                onEditPost={handleEditPost}
                onDeletePost={handleDeletePost}
                onNavigate={(v, p) => handleNavigate(v as CreatorNavView, p)}
            />;
          case 'settings': return <CreatorSettings creator={creatorProfile}/>;
          case 'profile':
            const profileUser = viewParams.userId ? allUsersMap.get(viewParams.userId) : currentUser;
            if (!profileUser) return <div className="text-center p-8">User not found.</div>;
             if ('role' in profileUser && profileUser.role === 'creator') {
                return renderCreatorProfile(profileUser as unknown as Creator);
            }
            return <div>Viewing Fan Profiles is not supported.</div>;
          case 'messages': return <MessagesDashboard currentUser={currentUser} initialConversationUserId={viewParams.initialConversationUserId} onNavigate={(v, p) => handleNavigate(v as CreatorNavView, p)} />;
          default: 
            return <CreatorDashboard 
                creator={creatorProfile} 
                onNavigate={(v, p) => handleNavigate(v as CreatorNavView, p)}
                onEditPost={handleEditPost}
                onDeletePost={handleDeletePost}
                onCreatePost={() => setCreateModalOpen(true)}
            />;
      }
  }
  
  return (
    <div className="flex flex-col h-screen">
      {renderHeader()}
      <div className="flex flex-1 overflow-y-hidden">
        <CreatorSidebar 
            activeView={activeView} 
            onNavigate={(v, p) => handleNavigate(v as CreatorNavView, p)} 
            currentUser={currentUser}
        />
        <main className="flex-1 overflow-y-auto">
            <div className={activeView === 'messages' ? 'h-full' : 'py-6 px-4 md:px-8'}>
                {renderContent()}
            </div>
        </main>
      </div>
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSavePost}
        creator={creatorProfile}
        postToEdit={editingPost}
      />
      <BottomNav role={currentUser.role} activeView={activeView} onNavigate={(v) => handleNavigate(v as CreatorNavView)} />
    </div>
  );
};

export default CreatorView;
