import React, { useState } from 'react';
import PostCard from './PostCard';
import ProfileHeader from './ProfileHeader';
import MessagingView from './MessagingView';
import { usePlatformData } from '../hooks/usePlatformData';
import { User, Creator } from '../types';
import BottomNav from './BottomNav';
import AccessCodeModal from './AccessCodeModal';

interface FanViewProps {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  navigation: { view: string; params: any };
  onNavigate: (view: string, params?: any) => void;
  platformData: ReturnType<typeof usePlatformData>;
}

const FanView: React.FC<FanViewProps> = ({ currentUser, setCurrentUser, navigation, onNavigate, platformData }) => {
  const [showAccessModalFor, setShowAccessModalFor] = useState<Creator | null>(null);

  const {
    creators,
    getCreatorById,
    getSubscribedPosts,
    getPostsByCreatorId,
    followCreator,
    unfollowCreator,
    getFollowerCount,
    allUsersMap,
  } = platformData;
  
  const { view, params } = navigation;

  const handleCreatorClick = (creatorId: string) => {
    onNavigate('profile', { userId: creatorId });
  };
  
  const handleStartChat = (userId: string) => {
    onNavigate('messages', { initialConversationUserId: userId });
  }

  const handleSubscribe = (creatorId: string, enteredCode: string): boolean => {
    const creator = getCreatorById(creatorId);
    if (creator && creator.accessCode.toUpperCase() === enteredCode.toUpperCase()) {
      followCreator(currentUser.id, creatorId);
      setCurrentUser(prev => ({...prev, subscribedTo: [...prev.subscribedTo, creatorId]}));
      return true;
    }
    return false;
  };
  
  const handleUnfollow = (creatorId: string) => {
    unfollowCreator(currentUser.id, creatorId);
    setCurrentUser(prev => ({...prev, subscribedTo: prev.subscribedTo.filter(id => id !== creatorId)}));
  };

  const renderFeed = () => (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold my-4 px-4 md:px-0">Your Feed</h1>
      {getSubscribedPosts(currentUser).map(post => (
        <PostCard
          key={post.id}
          post={post}
          creator={getCreatorById(post.creatorId)}
          onCreatorClick={handleCreatorClick}
        />
      ))}
    </div>
  );

  const renderDiscover = () => (
    <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold my-4 px-4 md:px-0">Discover Creators</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators.map(creator => (
                <div key={creator.id} onClick={() => handleCreatorClick(creator.id)} className="bg-dark-2 rounded-lg overflow-hidden cursor-pointer group">
                    <img src={creator.bannerUrl} alt={creator.name} className="h-32 w-full object-cover"/>
                    <div className="p-4 relative">
                        <img src={creator.avatarUrl} alt={creator.name} className="w-20 h-20 rounded-full absolute -top-10 border-4 border-dark-2 group-hover:scale-105 transition-transform"/>
                        <div className="pt-10">
                            <h3 className="font-bold text-lg">{creator.name}</h3>
                            <p className="text-sm text-light-3">@{creator.handle}</p>
                            <p className="text-sm mt-2 text-light-2 h-10 overflow-hidden">{creator.bio}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  const renderCreatorProfile = (creator: Creator) => {
    const creatorPosts = getPostsByCreatorId(creator.id);
    const isFollowing = currentUser.subscribedTo.includes(creator.id);
    const followerCount = getFollowerCount(creator.id);

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
          onUnfollow={handleUnfollow}
          onEditProfile={() => {}}
          onMessageClick={() => handleStartChat(creator.id)}
        />
        <div className="px-4 md:px-0">
          {visiblePosts.length > 0 && visiblePosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                creator={creator}
                onCreatorClick={handleCreatorClick}
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
  
  const renderFanProfile = (fanUser: User) => {
      const followedCreators = creators.filter(c => fanUser.subscribedTo.includes(c.id));
      const isOwnProfile = currentUser.id === fanUser.id;

      return (
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-dark-2 p-8 rounded-lg text-center">
            <img src={fanUser.avatarUrl} alt={fanUser.name} className="w-32 h-32 rounded-full mx-auto border-4 border-dark-1"/>
            <h1 className="text-3xl font-bold mt-4">{fanUser.name}</h1>
            <p className="text-light-3 mt-1">Fan Account</p>
            {fanUser.bio && <p className="mt-4 max-w-xl mx-auto text-light-2">{fanUser.bio}</p>}
          </div>

          {isOwnProfile && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 px-4 md:px-0">Following</h2>
              {followedCreators.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {followedCreators.map(creator => (
                    <div key={creator.id} onClick={() => handleCreatorClick(creator.id)} className="bg-dark-2 p-4 rounded-lg flex items-center space-x-4 cursor-pointer hover:bg-dark-3 transition-colors">
                      <img src={creator.avatarUrl} alt={creator.name} className="w-12 h-12 rounded-full" />
                      <div>
                        <p className="font-bold">{creator.name}</p>
                        <p className="text-sm text-light-3">@{creator.handle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-dark-2 p-8 rounded-lg text-center">
                    <p className="text-light-3">You haven't followed any creators yet.</p>
                    <button onClick={() => onNavigate('discover')} className="mt-4 text-brand-primary font-semibold">
                        Discover Creators
                    </button>
                </div>
              )}
            </div>
          )}
        </div>
      );
  };
  
  const renderContent = () => {
      switch (view) {
          case 'feed': return renderFeed();
          case 'discover': return renderDiscover();
          case 'profile':
            const profileUser = params.userId ? allUsersMap.get(params.userId) : null;
            if (!profileUser) return <div className="text-center p-8">User not found.</div>;
            
            if (profileUser.role === 'creator') {
                return renderCreatorProfile(profileUser as Creator);
            } else {
                return renderFanProfile(profileUser as User);
            }
          case 'messages': return <MessagingView currentUser={currentUser} initialConversationUserId={params.initialConversationUserId} platformData={platformData} onNavigate={onNavigate} />;
          default: return renderFeed();
      }
  }

  return (
    <>
      <main className={`container mx-auto ${view === 'messages' ? 'h-[calc(100vh-8rem-1rem)] md:h-[calc(100vh-4rem-3rem)] p-0' : 'py-6 px-4 md:px-0 pb-24 md:pb-6'}`}>
        {renderContent()}
      </main>
      <BottomNav role={currentUser.role} activeView={view} onNavigate={onNavigate} />
       {showAccessModalFor && (
          <AccessCodeModal
            isOpen={!!showAccessModalFor}
            onClose={() => setShowAccessModalFor(null)}
            creator={showAccessModalFor}
            onSubmit={(code) => handleSubscribe(showAccessModalFor.id, code)}
          />
      )}
    </>
  );
};

export default FanView;