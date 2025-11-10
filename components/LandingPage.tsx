import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-1 text-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center">
        {/* Hero Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://i.imgur.com/3ouTVTu.jpg"
            alt="CreatorHub Hero"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-1/50 via-dark-1/70 to-dark-1"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <img src="https://i.imgur.com/JRQ30XP.png" alt="CreatorHub Logo" className="h-16 mx-auto mb-8" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to CreatorHub</h1>
          <p className="text-xl md:text-2xl text-light-3 mb-8">
            Premium subscription platform for creators
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
    </div>
  );
};

export default LandingPage;
