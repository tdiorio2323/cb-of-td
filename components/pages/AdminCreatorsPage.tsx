import React from 'react';
import { usePlatform } from '../../App';
import { VerifiedIcon, UnverifiedIcon } from '../icons';

const AdminCreatorsPage: React.FC = () => {
  const { creators, toggleCreatorVerification } = usePlatform();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Creator Management</h2>
      <div className="bg-dark-2 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-dark-3">
            <tr>
              <th className="p-4">Creator</th>
              <th className="p-4">Handle</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {creators.map(creator => (
              <tr key={creator.id} className="border-b border-dark-3 last:border-0">
                <td className="p-4 flex items-center space-x-3">
                  <img src={creator.avatarUrl} alt={creator.name} className="w-10 h-10 rounded-full" />
                  <span className="text-white">{creator.name}</span>
                </td>
                <td className="p-4 text-light-3">@{creator.handle}</td>
                <td className="p-4 text-center">
                  {creator.isVerified ? <VerifiedIcon /> : <UnverifiedIcon />}
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => toggleCreatorVerification(creator.id)}
                    className={`px-3 py-1 text-xs rounded-full ${creator.isVerified ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}
                  >
                    {creator.isVerified ? 'Unverify' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCreatorsPage;
