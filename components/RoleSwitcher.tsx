import React from 'react';
import { UserRole } from '../types';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onSwitch: (role: UserRole) => void;
}

const ROLES: UserRole[] = ['fan', 'creator', 'admin'];

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onSwitch }) => {
  return (
    <div className="flex items-center space-x-2 bg-dark-3 p-1 rounded-full">
      {ROLES.map(role => (
        <button
          key={role}
          onClick={() => onSwitch(role)}
          className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors capitalize ${
            currentRole === role
              ? 'bg-brand-primary text-dark-1'
              : 'text-light-2 hover:bg-dark-2'
          }`}
        >
          {role}
        </button>
      ))}
    </div>
  );
};

export default RoleSwitcher;
