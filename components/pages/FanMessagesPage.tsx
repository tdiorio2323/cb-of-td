import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlatform } from '../../App';
import MessagesDashboard from '../MessagesDashboard';

const FanMessagesPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const { users } = usePlatform();

  const currentUser = users.find(u => u.role === 'fan') || users[0];

  const handleNavigate = (view: string, params: any = {}) => {
    // Handle navigation within messages (not used much in current impl)
    if (view === 'messages' && params.initialConversationUserId) {
      navigate(`/fan/messages/${params.initialConversationUserId}`);
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

export default FanMessagesPage;
