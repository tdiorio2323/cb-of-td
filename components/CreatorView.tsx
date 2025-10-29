import React, { useState, useMemo } from 'react';
import { User, Creator } from '../types';
import CreatePostModal from './CreatePostModal';
import PostCard from './PostCard';
import ProfileHeader from './ProfileHeader';
import MessagingView from './MessagingView';
import BottomNav from './BottomNav';
// FIX: Import usePlatformData to resolve 'Cannot find name' error.
import { usePlatformData } from '../hooks/usePlatformData';

interface CreatorViewProps {
  currentUser: User;
  navigation: { view: string; params: any };
  onNavigate: (view: string, params?: any) => void;
  platformData: ReturnType<typeof usePlatformData>;
}

const CreatorView: React.FC<CreatorViewProps> = ({ currentUser, navigation, onNavigate, platformData }) => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  
  const { 
      getCreatorByUserId, 
      getPostsByCreatorId,
      addPost, 
      allUsersMap,
      getFollowerCount,
      updateCreatorProfile,
    } = platformData;
    
  const { view, params } = navigation;

  const creatorProfile = useMemo(() => getCreatorByUserId(currentUser.id), [currentUser.id, getCreatorByUserId]);

  if (!creatorProfile) {
    return <div className="text-center p-8">Could not load creator profile.</div>;
  }
  
  const handleAddPost = (text: string, imageUrl: string | undefined, isPrivate: boolean) => {
    addPost(creatorProfile.id, text, imageUrl, isPrivate);
  };
  
  const handleCreatorClick = (creatorId: string) => {
    onNavigate('profile', { userId: creatorId });
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
                onCreatorClick={() => onNavigate('profile', { userId: post.creatorId })}
            />
        ))}
    </div>
  );
  
  const SettingsPage: React.FC<{creator: Creator}> = ({ creator }) => {
    const [bio, setBio] = useState(creator.bio);
    const [price, setPrice] = useState(creator.subscriptionPrice.toString());
    const [accessCode, setAccessCode] = useState(creator.accessCode);
    const maxChars = 300;

    const handleSave = () => {
        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum < 0) {
            alert("Please enter a valid, non-negative price.");
            return;
        }
        if (!accessCode.trim()) {
            alert("Access code cannot be empty.");
            return;
        }
        updateCreatorProfile(creator.id, { 
            bio, 
            subscriptionPrice: priceNum, 
            accessCode: accessCode.trim().toUpperCase() 
        });
        alert("Profile saved!");
    };

    const parseMarkdown = (text: string) => {
        if (!text) return { __html: '' };
        let html = text
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-brand-primary hover:underline">$1</a>');
        return { __html: html };
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-dark-2 p-8 rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
            
            <div className="space-y-6">
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-light-3 mb-2">Your Bio (Supports Markdown)</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        maxLength={maxChars}
                        className="w-full bg-dark-3 p-3 rounded-lg text-light-1 focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-[150px]"
                        placeholder="Tell your fans a little about yourself..."
                    />
                    <p className={`text-sm mt-1 text-right ${bio.length >= maxChars ? 'text-red-400' : 'text-light-3'}`}>
                        {bio.length} / {maxChars}
                    </p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-light-3 mb-2">Live Preview</h3>
                    <div className="prose prose-invert bg-dark-3 p-4 rounded-lg min-h-[100px] text-light-2 max-w-none" dangerouslySetInnerHTML={parseMarkdown(bio)} />
                </div>
                
                 <div className="border-t border-dark-3 pt-6">
                    <h2 className="text-lg font-semibold mb-4">Subscription Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-light-3 mb-2">Monthly Price ($)</label>
                             <input
                                type="number"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                min="0"
                                step="0.01"
                                className="w-full bg-dark-3 p-3 rounded-lg text-light-1 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                placeholder="e.g., 5.00"
                            />
                        </div>
                        <div>
                             <label htmlFor="code" className="block text-sm font-medium text-light-3 mb-2">Access Code</label>
                             <input
                                type="text"
                                id="code"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                                className="w-full bg-dark-3 p-3 rounded-lg text-light-1 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                placeholder="e.g., SECRET"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-light-3 mt-2">Fans will need this code to subscribe to your content.</p>
                </div>

                 <div className="flex justify-end pt-4">
                    <button onClick={handleSave} className="bg-brand-primary text-dark-1 font-bold py-2 px-6 rounded-full transition-colors hover:bg-brand-secondary">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
  }
  
  const renderCreatorProfile = (creator: Creator) => {
    const posts = getPostsByCreatorId(creator.id);
    const isOwnProfile = creator.id === creatorProfile.id;
    const followerCount = getFollowerCount(creator.id);

    return (
      <div className="w-full max-w-3xl mx-auto">
        <ProfileHeader
          creator={creator}
          postCount={posts.length}
          followerCount={followerCount}
          isFollowing={false} // Creators don't follow other creators in this logic
          isOwnProfile={isOwnProfile}
          onFollowClick={() => {}} // N/A for creators
          onUnfollow={() => {}} // N/A
          onEditProfile={() => onNavigate('settings')}
          onMessageClick={() => onNavigate('messages', { initialConversationUserId: creator.id })}
        />
        <div className="px-4 md:px-0">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                creator={creator}
                onCreatorClick={() => {}}
              />
            ))}
        </div>
      </div>
    );
  };
  
  const renderFanProfile = (fanUser: User) => {
      const isOwnProfile = currentUser.id === fanUser.id;
      // Creators can't see a fan's subscription list for privacy
      return (
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-dark-2 p-8 rounded-lg text-center">
            <img src={fanUser.avatarUrl} alt={fanUser.name} className="w-32 h-32 rounded-full mx-auto border-4 border-dark-1"/>
            <h1 className="text-3xl font-bold mt-4">{fanUser.name}</h1>
            <p className="text-light-3 mt-1">Fan Account</p>
            {fanUser.bio && <p className="mt-4 max-w-xl mx-auto text-light-2">{fanUser.bio}</p>}
             {!isOwnProfile && (
                <button 
                    onClick={() => onNavigate('messages', { initialConversationUserId: fanUser.id })}
                    className="mt-6 bg-brand-primary text-dark-1 font-bold py-2 px-6 rounded-full transition-colors hover:bg-brand-secondary"
                >
                    Message
                </button>
             )}
          </div>
        </div>
      );
  };
  
  const renderContent = () => {
      switch (view) {
          case 'dashboard': return renderDashboard();
          case 'settings': return <SettingsPage creator={creatorProfile}/>;
          case 'profile':
            const profileUser = params.userId ? allUsersMap.get(params.userId) : null;
            if (!profileUser) return <div className="text-center p-8">User not found.</div>;
            
            if (profileUser.role === 'creator') {
                return renderCreatorProfile(profileUser as Creator);
            } else {
                return renderFanProfile(profileUser as User);
            }
          case 'messages': return <MessagingView currentUser={currentUser} initialConversationUserId={params.initialConversationUserId} platformData={platformData} onNavigate={onNavigate} />;
          default: return renderDashboard();
      }
  }
  
  return (
    <>
      <main className={`container mx-auto ${view === 'messages' ? 'h-[calc(100vh-8rem-1rem)] md:h-[calc(100vh-4rem-3rem)] p-0' : 'py-6 px-4 md:px-0 pb-24 md:pb-6'}`}>
        {renderContent()}
      </main>
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleAddPost}
        creator={creatorProfile}
      />
      <BottomNav role={currentUser.role} activeView={view} onNavigate={onNavigate} />
    </>
  );
};

export default CreatorView;