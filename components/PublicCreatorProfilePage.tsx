import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlatform } from '../App';
import ProfileHeader from './ProfileHeader';
import PostCard from './PostCard';
import AccessCodeModal from './AccessCodeModal';
import { Creator, User } from '../types';
import { LogOut } from 'lucide-react';
import { BalanceIcon } from './icons';

const PublicCreatorProfilePage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const platformData = usePlatform();
  const {
    creators,
    getPostsByCreatorId,
    subscribeCreator,
    unfollowCreator,
    getFollowerCount,
    getTotalTipsByCreatorId,
    tipPost,
    users,
  } = platformData;

  const [showAccessModalFor, setShowAccessModalFor] = useState<Creator | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Find creator by handle
  const creator = creators.find(c => c.handle === handle?.replace('@', ''));

  // For demo purposes, get current user (first fan user)
  const currentUser = users.find(u => u.role === 'fan') || users[0];

  if (!creator) {
    return (
      <div className="min-h-screen bg-dark-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Creator not found</h2>
          <p className="text-light-3">The creator @{handle} does not exist.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-brand-primary text-dark-1 font-bold py-2 px-6 rounded-full hover:bg-brand-secondary transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const creatorPosts = getPostsByCreatorId(creator.id);
  const isFollowing = currentUser?.subscribedTo?.includes(creator.id) || false;
  const followerCount = getFollowerCount(creator.id);
  const totalTips = getTotalTipsByCreatorId(creator.id);

  const visiblePosts = isFollowing ? creatorPosts : creatorPosts.filter(p => !p.isPrivate);
  const hasHiddenPosts = !isFollowing && creatorPosts.some(p => p.isPrivate);

  const handleSubscribe = () => {
    setIsSubscribed(true);
  };

  const handleTip = (postId: string) => {
    if (!currentUser) return;
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
            onClick={() => navigate('/')}
          >
            <img src="https://i.imgur.com/JRQ30XP.png" alt="CreatorHub Logo" className="h-8" />
          </div>
          {currentUser && (
            <div className="flex items-center space-x-4 md:space-x-8">
              <div className="flex items-center space-x-1.5 bg-dark-3 px-3 py-1.5 rounded-full">
                <BalanceIcon />
                <span className="font-semibold text-sm text-light-1">{currentUser.balance.toFixed(2)}</span>
              </div>
              <button onClick={() => navigate('/auth/login')} className="text-light-3 hover:text-light-1 transition-colors">
                <LogOut size={22} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen w-full flex flex-col text-white bg-black">
      <div className="relative w-full h-[80vh] flex items-end justify-center">
        <img
          src={creator.profileImage}
          alt={creator.displayName}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <div className="relative z-10 text-center mb-16">
          <h1 className="text-4xl font-semibold tracking-wide">{creator.displayName}</h1>
          <p className="text-gray-300 text-sm mt-2 max-w-md mx-auto">{creator.bio}</p>

          <div className="mt-6 flex flex-col items-center gap-3">
            {isSubscribed ? (
              <div className="flex items-center gap-2 text-green-400 font-medium">
                <span className="w-3 h-3 rounded-full" style={{ background: "var(--chrome-accent)" }}/>
                Subscribed
              </div>
            ) : (
              <button onClick={handleSubscribe} className="btn-chrome">
                Subscribe for ${creator.price.toFixed(2)}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] my-8" style={{ background: "var(--chrome-accent)" }} />

      <div className={`${isSubscribed ? "fade-unlock" : ""} grid grid-cols-2 sm:grid-cols-3 gap-2 px-4 pb-20`}>
        {creatorPosts.map((post) => (
          <div key={post.id} className="relative w-full aspect-square bg-black card-chrome">
            {post.isLocked && !isSubscribed && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-sm border border-white/10 transition-opacity duration-500">
                <span className="text-xs font-medium tracking-wide uppercase">Locked</span>
              </div>
            )}
            <img src={post.image} className={`w-full h-full object-cover ${isSubscribed ? "fade-unlock" : ""}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicCreatorProfilePage;
