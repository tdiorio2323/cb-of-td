import React, { useState } from 'react';
import { Creator } from '../types';
import { CloseIcon } from './icons';

interface AccessCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => boolean;
  creator: Creator;
}

const AccessCodeModal: React.FC<AccessCodeModalProps> = ({ isOpen, onClose, onSubmit, creator }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onSubmit(code);
    if (success) {
      onClose();
      setCode('');
    } else {
      setError('Invalid access code. Please try again.');
    }
  };
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
        onClick={handleOverlayClick}
    >
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg w-full max-w-sm p-8 relative animate-fade-in-up text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-light-3 hover:text-light-1">
          <CloseIcon />
        </button>
        <img src={creator.avatarUrl} alt={creator.name} className="w-24 h-24 rounded-full mx-auto -mt-20 border-4 border-dark-2"/>
        <h2 className="text-2xl font-bold mt-4">Subscribe to {creator.name}</h2>
        <p className="text-light-3 mt-2">Enter the access code to unlock exclusive content for ${creator.subscriptionPrice}/month.</p>
        
        <form onSubmit={handleSubmit} className="mt-6">
            <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ACCESS CODE"
                className="w-full backdrop-blur-md bg-white/5 border border-white/10 p-3 rounded-lg text-light-1 text-center font-bold tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            <button
                type="submit"
                disabled={!code.trim()}
                className="w-full mt-4 bg-brand-primary text-dark-1 font-bold py-3 px-6 rounded-full disabled:bg-dark-3 disabled:text-light-3 transition-colors"
            >
                Subscribe
            </button>
        </form>
      </div>
    </div>
  );
};

export default AccessCodeModal;