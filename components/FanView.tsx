import React, { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import MessagesDashboard from './MessagesDashboard';
import { User, Creator } from '../types';
import BottomNav from './BottomNav';
import AccessCodeModal from './AccessCodeModal';
import { usePlatform } from '../App';
import FanHomeFeed from './FanHomeFeed';
import DiscoverPage from './DiscoverPage';
import { LogOut } from 'lucide-react';
import { BalanceIcon } from './icons';
// FIX: Added missing import for PostCard.
import PostCard from './PostCard';


interface FanViewProps {
  currentUser: User;
  onLogout: () => void;
}

type FanNavView = 'home' | 'discover' | 'messages' | 'profile';

const FanView: React.FC<FanViewProps> = ({ currentUser, onLogout }) => {
  const [activeView, setActiveView] = useState<FanNavView>('home');
  const [viewParams, setViewParams] = useState<any>({});
  const [showAccessModalFor, setShowAccessModalFor] = useState<Creator | null>(null);

  const platformData = usePlatform();
  const {
    creators,
    getCreatorById,
    getPostsByCreatorId,
    subscribeCreator,
    unfollowCreator,
    getFollowerCount,
    allUsersMap,
    tipPost,
    getTotalTipsByCreatorId,
    getTotalUnreadCount,
  } = platformData;

  const handleNavigate = (view: FanNavView, params = {}) => {
    setActiveView(view);
    setViewParams(params);
  };
  
  const handleStartChat = (userId: string) => {
    handleNavigate('messages', { initialConversationUserId: userId });
  }

  const handleSubscribe = (creatorId: string, enteredCode: string): boolean => {
    const success = subscribeCreator(currentUser.id, creatorId, enteredCode);
    return success;
  };
  
  const handleTip = (postId: string) => {
    const tipAmount = 1;
    if (currentUser.balance < tipAmount) {
        alert("You don't have enough funds to send a tip.");
        return;
    }
    tipPost(currentUser.id, postId, tipAmount);
  };

  const renderHeader = () => (
    <header className="sticky top-0 z-40 bg-dark-1/80 backdrop-blur-lg border-b border-dark-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div 
            className="cursor-pointer"
            onClick={() => handleNavigate('home')}
          >
            <img src="https://i.imgur.com/JRQ30XP.png" alt="CreatorHub Logo" className="h-8" />
          </div>
          <div className="flex items-center space-x-4 md:space-x-8">
            <div className="flex items-center space-x-1.5 bg-dark-3 px-3 py-1.5 rounded-full">
                <BalanceIcon />
                <span className="font-semibold text-sm text-light-1">{currentUser.balance.toFixed(2)}</span>
            </div>
            <button onClick={onLogout} className="text-light-3 hover:text-light-1 transition-colors">
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  const renderCreatorProfile = (creator: Creator) => {
    const creatorPosts = getPostsByCreatorId(creator.id);
    const isFollowing = currentUser.subscribedTo.includes(creator.id);
    const followerCount = getFollowerCount(creator.id);
    const totalTips = getTotalTipsByCreatorId(creator.id);

    const visiblePosts = isFollowing ? creatorPosts : creatorPosts.filter(p => !p.isPrivate);
    const hasHiddenPosts = !isFollowing && creatorPosts.some(p => p.isPrivate);

    return (
      <div className="w-full max-w-3xl mx-auto">
        <ProfileHeader
          creator={creator}
          postCount={creatorPosts.length}
          followerCount={followerCount}
          isFollowing={isFollowing}
          isOwnProfile={false}
          onFollowClick={() => setShowAccessModalFor(creator)}
          // FIX: The onUnfollow prop expects a function that takes one argument (creatorId), but unfollowCreator expects two. This wraps it to pass the current user's ID correctly.
          onUnfollow={(creatorId) => unfollowCreator(currentUser.id, creatorId)}
          onEditProfile={() => {}}
          onMessageClick={() => handleStartChat(creator.id)}
          totalTips={totalTips}
        />
        <div className="px-4 md:px-0">
          {visiblePosts.length > 0 && visiblePosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                creator={creator}
                onCreatorClick={() => handleNavigate('profile', { userId: creator.id })}
                onTip={handleTip}
                canTip={true}
              />
            ))
          }
          
          {hasHiddenPosts && (
            <div className="text-center bg-dark-2 rounded-lg p-12 my-4 border border-dashed border-dark-3">
                <h2 className="text-2xl font-bold">Content Locked</h2>
                <p className="text-light-3 mt-2">Subscribe to {creator.name} to see all of their private posts.</p>
                <button onClick={() => setShowAccessModalFor(creator)} className="mt-6 bg-brand-primary text-dark-1 font-bold py-2 px-6 rounded-full transition-colors hover:bg-brand-secondary">
                    Subscribe
                </button>
            </div>
          )}

          {visiblePosts.length === 0 && !hasHiddenPosts && (
             <div className="text-center bg-dark-2 rounded-lg p-12">
                <h2 className="text-xl font-bold">No posts yet!</h2>
                <p className="text-light-3 mt-2">{creator.name} hasn't posted anything yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderContent = () => {
      switch (activeView) {
          case 'home': 
            return <FanHomeFeed 
                currentUser={currentUser} 
                onCreatorClick={(creatorId) => handleNavigate('profile', { userId: creatorId })} 
                onTip={handleTip} 
            />;
          case 'discover': 
            return <DiscoverPage 
                        currentUser={currentUser} 
                        onCreatorClick={(creatorId) => handleNavigate('profile', { userId: creatorId })} 
                        onTip={handleTip} 
                    />;
          case 'profile':
            const profileUser = viewParams.userId ? allUsersMap.get(viewParams.userId) : null;
            if (!profileUser) return <div className="text-center p-8">User not found.</div>;
            
            if ('role' in profileUser && profileUser.role === 'creator') {
                return renderCreatorProfile(profileUser as unknown as Creator);
            }
            // Add fan profile view if needed
            return <div className="text-center p-8">Fan profiles are private.</div>
          case 'messages': 
            return <MessagesDashboard 
              currentUser={currentUser} 
              initialConversationUserId={viewParams.initialConversationUserId} 
              onNavigate={(view, params) => handleNavigate(view as FanNavView, params)} 
            />;
          default: 
            return <FanHomeFeed 
                currentUser={currentUser} 
                onCreatorClick={(creatorId) => handleNavigate('profile', { userId: creatorId })} 
                onTip={handleTip} 
            />;
      }
  }

  return (
    <div className="flex flex-col h-screen">
      {renderHeader()}
      <main className={`container mx-auto ${activeView === 'messages' ? 'h-[calc(100vh-8rem-1rem)] md:h-[calc(100vh-4rem-3rem)] p-0' : 'py-6 px-4 md:px-0 pb-24 md:pb-6'}`}>
        {renderContent()}
      </main>
      <BottomNav role={currentUser.role} activeView={activeView} onNavigate={(v) => handleNavigate(v as FanNavView)} />
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

export default FanView;
