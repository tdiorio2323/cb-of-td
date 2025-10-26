import React, { useState } from 'react';
import PostCard from './PostCard';
import ProfileHeader from './ProfileHeader';
import AccessCodeModal from './AccessCodeModal';
import MessagingView from './MessagingView';
import { usePlatformData } from '../hooks/usePlatformData';
import { User, Creator } from '../types';

interface FanViewProps {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  view: string;
  setView: (view: string) => void;
  onStartChat: (userId: string) => void;
  activeConversationUserId: string | null;
}

const FanView: React.FC<FanViewProps> = ({ currentUser, setCurrentUser, view, setView, onStartChat, activeConversationUserId }) => {
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [isAccessModalOpen, setAccessModalOpen] = useState(false);

  const {
    creators,
    getCreatorById,
    getSubscribedPosts,
    getPostsByCreatorId,
    subscribeWithCode,
    unsubscribe,
  } = usePlatformData();
  
  const selectedCreator = selectedCreatorId ? getCreatorById(selectedCreatorId) : null;

  const handleCreatorClick = (creatorId: string) => {
    setSelectedCreatorId(creatorId);
    setView('profile');
  };

  const handleSubscribe = (code: string): boolean => {
    if (selectedCreator) {
      const success = subscribeWithCode(currentUser.id, selectedCreator.id, code);
      if(success) {
        // In a real app, you wouldn't mutate state like this directly.
        // This is a workaround for the demo to reflect subscription changes on the current user.
        setCurrentUser(prev => ({...prev, subscribedTo: [...prev.subscribedTo, selectedCreator.id]}));
      }
      return success;
    }
    return false;
  };
  
  const handleUnsubscribe = (creatorId: string) => {
    unsubscribe(currentUser.id, creatorId);
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

  const renderProfile = () => {
    if (!selectedCreator) return null;
    const creatorPosts = getPostsByCreatorId(selectedCreator.id);
    const isSubscribed = currentUser.subscribedTo.includes(selectedCreator.id);

    return (
      <div className="w-full max-w-3xl mx-auto">
        <ProfileHeader
          creator={selectedCreator}
          postCount={creatorPosts.length}
          isSubscribed={isSubscribed}
          isOwnProfile={false}
          onSubscribeClick={() => setAccessModalOpen(true)}
          onUnsubscribe={handleUnsubscribe}
          onEditProfile={() => {}}
          onMessageClick={() => onStartChat(selectedCreator.id)}
        />
        <div className="px-4 md:px-0">
          {isSubscribed ? (
            creatorPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                creator={selectedCreator}
                onCreatorClick={handleCreatorClick}
              />
            ))
          ) : (
            <div className="text-center bg-dark-2 rounded-lg p-12">
                <h2 className="text-2xl font-bold">Content Locked</h2>
                <p className="text-light-3 mt-2">Subscribe to {selectedCreator.name} to see all of their posts.</p>
                <button onClick={() => setAccessModalOpen(true)} className="mt-6 bg-brand-primary text-dark-1 font-bold py-2 px-6 rounded-full transition-colors hover:bg-brand-secondary">
                    {`Subscribe for $${selectedCreator.subscriptionPrice}/mo`}
                </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderContent = () => {
      switch (view) {
          case 'feed': return renderFeed();
          case 'discover': return renderDiscover();
          case 'profile': return renderProfile();
          case 'messages': return <MessagingView currentUser={currentUser} initialConversationUserId={activeConversationUserId} />;
          default: return renderFeed();
      }
  }

  return (
    <>
      <main className="container mx-auto py-6 px-4 md:px-0 pb-24 md:pb-6">
        {renderContent()}
      </main>
      {selectedCreator && (
         <AccessCodeModal 
            isOpen={isAccessModalOpen}
            onClose={() => setAccessModalOpen(false)}
            onSubmit={handleSubscribe}
            creator={selectedCreator}
        />
      )}
    </>
  );
};

export default FanView;