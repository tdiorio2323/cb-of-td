import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-1 flex flex-col items-center justify-center text-white">
      <div className="text-center">
        <img src="https://i.imgur.com/JRQ30XP.png" alt="CreatorHub Logo" className="h-16 mx-auto mb-8" />
        <h1 className="text-5xl font-bold mb-4">Welcome to CreatorHub</h1>
        <p className="text-xl text-light-3 mb-8">
          Premium subscription platform for creators
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/auth/login')}
            className="bg-brand-primary text-dark-1 font-bold py-3 px-8 rounded-full hover:bg-brand-secondary transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/auth/signup')}
            className="bg-dark-3 text-light-1 font-bold py-3 px-8 rounded-full hover:bg-dark-2 transition-colors border border-dark-3"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
