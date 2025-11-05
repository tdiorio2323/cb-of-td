import React from 'react';
import { Creator, Post } from '../types';
import { usePlatform } from '../App';
import PostCard from './PostCard';

// --- PROPS ---
interface PostManagerProps {
  creator: Creator;
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  onCreatePost: () => void;
  onNavigate: (view: string, params?: any) => void;
}

const PostManager: React.FC<PostManagerProps> = ({ creator, onEditPost, onDeletePost, onCreatePost, onNavigate }) => {
  const { getPostsByCreatorId } = usePlatform();

  // --- 1. Fetch Posts ---
  const creatorPosts = getPostsByCreatorId(creator.id);

  return (
    <div className="w-full max-w-3xl mx-auto">
        <div className="flex justify-between items-center my-4">
             <h1 className="text-2xl font-bold px-4 md:px-0">Manage Your Posts</h1>
             <button onClick={onCreatePost} className="bg-brand-primary text-dark-1 font-bold py-2 px-6 rounded-full transition-colors hover:bg-brand-secondary">
                Create New Post
            </button>
        </div>

        <div className="mt-6 flex flex-col gap-6">
          {creatorPosts.length > 0 ? (
            creatorPosts.map((post) => (
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
              <h3 className="text-xl font-semibold">You haven't posted anything yet.</h3>
              <p className="mt-2">
                Click "Create New Post" to share your first piece of content with your fans.
              </p>
            </div>
          )}
        </div>
    </div>
  );
};

export default PostManager;
