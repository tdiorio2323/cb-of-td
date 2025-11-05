import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlatform } from '../../App';
import MessagesDashboard from '../MessagesDashboard';

const CreatorMessagesPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const { users } = usePlatform();

  const currentUser = users.find(u => u.role === 'creator') || users[0];

  const handleNavigate = (view: string, params: any = {}) => {
    if (view === 'messages' && params.initialConversationUserId) {
      navigate(`/creator/messages/${params.initialConversationUserId}`);
    }
  };

  return (
    <MessagesDashboard
      currentUser={currentUser}
      initialConversationUserId={conversationId}
      onNavigate={handleNavigate}
    />
  );
};

export default CreatorMessagesPage;
