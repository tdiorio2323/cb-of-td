import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { usePlatform } from '../../App';
import PostManager from '../PostManager';
import { Post } from '../../types';

interface CreatorOutletContext {
  setCreateModalOpen: (open: boolean) => void;
  setEditingPost: (post: Post | null) => void;
}

const CreatorPostsPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCreateModalOpen, setEditingPost } = useOutletContext<CreatorOutletContext>();
  const { users, getCreatorByUserId, removePost } = usePlatform();

  const currentUser = users.find(u => u.role === 'creator') || users[0];
  const creatorProfile = getCreatorByUserId(currentUser.id);

  if (!creatorProfile) {
    return <div className="text-center p-8">Could not load creator profile.</div>;
  }

  const handleNavigate = (view: string) => {
    const viewToPath: Record<string, string> = {
      'dashboard': '/creator/dashboard',
      'posts': '/creator/posts',
      'settings': '/creator/settings',
      'messages': '/creator/messages',
    };
    navigate(viewToPath[view] || '/creator/dashboard');
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

  return (
    <PostManager
      creator={creatorProfile}
      onCreatePost={() => setCreateModalOpen(true)}
      onEditPost={handleEditPost}
      onDeletePost={handleDeletePost}
      onNavigate={handleNavigate}
    />
  );
};

export default CreatorPostsPage;
