import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatform } from '../../App';
import DiscoverPage from '../DiscoverPage';

const FanDiscoverPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { users, tipPost, creators } = usePlatform();

  const currentUser = users.find(u => u.role === 'fan') || users[0];

  const handleTip = (postId: string) => {
    const tipAmount = 1;
    if (currentUser.balance < tipAmount) {
      alert("You don't have enough funds to send a tip.");
      return;
    }
    tipPost(currentUser.id, postId, tipAmount);
  };

  const handleCreatorClick = (creatorId: string) => {
    const creator = creators.find(c => c.id === creatorId);
    if (creator) {
      navigate(`/@${creator.handle}`);
    }
  };

  return (
    <DiscoverPage
      currentUser={currentUser}
      onCreatorClick={handleCreatorClick}
      onTip={handleTip}
    />
  );
};

export default FanDiscoverPageWrapper;
