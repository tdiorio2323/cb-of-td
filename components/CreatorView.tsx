import React, { useState, useMemo } from 'react';
import { User, Creator } from '../types';
import { usePlatformData } from '../hooks/usePlatformData';
import CreatePostModal from './CreatePostModal';
import PostCard from './PostCard';
import ProfileHeader from './ProfileHeader';
import MessagingView from './MessagingView';

interface CreatorViewProps {
  currentUser: User;
  view: string;
  setView: (view: string) => void;
  activeConversationUserId: string | null;
}

const CreatorView: React.FC<CreatorViewProps> = ({ currentUser, view, setView, activeConversationUserId }) => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  
  const { 
      getCreatorByUserId, 
      getPostsByCreatorId,
      addPost, 
      updateCreatorAccessCode 
    } = usePlatformData();

  const creatorProfile = useMemo(() => getCreatorByUserId(currentUser.id), [currentUser.id, getCreatorByUserId]);

  if (!creatorProfile) {
    return <div className="text-center p-8">Could not load creator profile.</div>;
  }
  
  const handleAddPost = (text: string, imageUrl?: string) => {
    addPost(creatorProfile.id, text, imageUrl);
  };

  const creatorPosts = getPostsByCreatorId(creatorProfile.id);

  const renderDashboard = () => (
    <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center my-4">
            <h1 className="text-2xl font-bold px-4 md:px-0">Dashboard</h1>
            <button onClick={() => setCreateModalOpen(true)} className="bg-brand-primary text-dark-1 font-bold py-2 px-6 rounded-full transition-colors hover:bg-brand-secondary">Create Post</button>
        </div>
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-dark-2 p-6 rounded-lg"><p className="text-light-3 text-sm">Total Fans</p><p className="text-3xl font-bold">1,234</p></div>
            <div className="bg-dark-2 p-6 rounded-lg"><p className="text-light-3 text-sm">Monthly Earnings</p><p className="text-3xl font-bold">$12,345</p></div>
            <div className="bg-dark-2 p-6 rounded-lg"><p className="text-light-3 text-sm">Total Earnings</p><p className="text-3xl font-bold">$150,678</p></div>
        </div>
        
        <h2 className="text-xl font-bold mb-4">Your Recent Posts</h2>
         {creatorPosts.map(post => (
            <PostCard 
                key={post.id} 
                post={post} 
                creator={creatorProfile}
                onCreatorClick={() => {}}
            />
        ))}
    </div>
  );
  
  const SettingsPage: React.FC<{creator: Creator}> = ({ creator }) => {
    const [accessCode, setAccessCode] = useState(creator.accessCode);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        updateCreatorAccessCode(creator.id, accessCode);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }
    
    return (
        <div className="w-full max-w-2xl mx-auto bg-dark-2 p-8 rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            
            <div className="space-y-4">
                <div>
                    <label htmlFor="accessCode" className="block text-sm font-medium text-light-3 mb-1">Your Fan Access Code</label>
                    <input 
                        type="text" 
                        id="accessCode" 
                        value={accessCode} 
                        onChange={e => setAccessCode(e.target.value.toUpperCase())}
                        className="w-full bg-dark-3 p-3 rounded-lg text-light-1 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                    <p className="text-xs text-light-3 mt-1">Fans will use this code to subscribe to you.</p>
                </div>
                {/* Add more settings here */}
            </div>

             <div className="mt-6 flex items-center space-x-4">
                <button onClick={handleSave} className="bg-brand-primary text-dark-1 font-bold py-2 px-6 rounded-full transition-colors hover:bg-brand-secondary">Save Changes</button>
                {saved && <p className="text-green-400">Saved!</p>}
            </div>
        </div>
    )
  }
  
  const renderContent = () => {
      switch (view) {
          case 'dashboard': return renderDashboard();
          case 'settings': return <SettingsPage creator={creatorProfile}/>;
          case 'messages': return <MessagingView currentUser={currentUser} initialConversationUserId={activeConversationUserId} />;
          default: return renderDashboard();
      }
  }
  
  return (
    <>
      <main className="container mx-auto py-6 px-4 md:px-0 pb-24 md:pb-6">
        {renderContent()}
      </main>
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleAddPost}
        creator={creatorProfile}
      />
    </>
  );
};

export default CreatorView;