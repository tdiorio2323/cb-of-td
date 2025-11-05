import React from 'react';
import { Creator, Post } from '../types';
import { usePlatform } from '../App';
import { Users, DollarSign, FileText } from 'lucide-react';
import PostCard from './PostCard';

// --- PROPS ---
interface CreatorDashboardProps {
  creator: Creator;
  onNavigate: (view: string, params?: any) => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  onCreatePost: () => void;
}

export default function CreatorDashboard({
  creator,
  onNavigate,
  onEditPost,
  onDeletePost,
  onCreatePost,
}: CreatorDashboardProps) {
  const { getFollowerCount, getTotalTipsByCreatorId, getPostsByCreatorId } =
    usePlatform();

  // --- 1. Fetch Stats ---
  const followerCount = getFollowerCount(creator.id);
  const totalTips = getTotalTipsByCreatorId(creator.id);
  const allPosts = getPostsByCreatorId(creator.id);
  const totalPosts = allPosts.length;
  const recentPosts = allPosts.slice(0, 5);

  // --- 2. Render Stats Cards ---
  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatCard
        label="Total Fans"
        value={followerCount.toLocaleString()}
        icon={<Users size={24} className="text-purple-400" />}
      />
      <StatCard
        label="Tips Received"
        value={`$${totalTips.toLocaleString()}`}
        icon={<DollarSign size={24} className="text-green-400" />}
      />
      <StatCard
        label="Total Posts"
        value={totalPosts.toLocaleString()}
        icon={<FileText size={24} className="text-blue-400" />}
      />
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center my-4">
            <h1 className="text-2xl font-bold px-4 md:px-0">Welcome, {creator.name.split(' ')[0]}!</h1>
            <button onClick={onCreatePost} className="bg-brand-primary text-dark-1 font-bold py-2 px-6 rounded-full transition-colors hover:bg-brand-secondary">Create Post</button>
        </div>
      
      {renderStats()}

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-white mb-4">
          Your Recent Posts
        </h3>
        <div className="flex flex-col gap-6">
          {recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                creator={creator}
                onCreatorClick={() => onNavigate('profile', { userId: creator.id })}
                canManage={true}
                onEdit={onEditPost}
                onDelete={onDeletePost}
              />
            ))
          ) : (
            <div className="text-center text-light-3 p-8 bg-dark-2 rounded-lg border border-dark-3">
              <h3 className="text-xl font-semibold">No posts yet.</h3>
              <p className="mt-2">
                Click "Create Post" to share something with your fans.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Helper Component for Stat Cards ---

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-dark-2 p-6 rounded-lg border border-dark-3 flex items-center gap-4">
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-dark-3 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-light-3 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
