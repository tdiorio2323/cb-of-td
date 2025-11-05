import React from 'react';
import { usePlatform } from '../../App';
import CreatorSettings from '../CreatorSettings';

const CreatorSettingsPage: React.FC = () => {
  const { users, getCreatorByUserId } = usePlatform();

  const currentUser = users.find(u => u.role === 'creator') || users[0];
  const creatorProfile = getCreatorByUserId(currentUser.id);

  if (!creatorProfile) {
    return <div className="text-center p-8">Could not load creator profile.</div>;
  }

  return <CreatorSettings creator={creatorProfile} />;
};

export default CreatorSettingsPage;
