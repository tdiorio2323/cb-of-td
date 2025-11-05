import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-1 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-md bg-dark-2 p-8 rounded-lg border border-dark-3">
        <img src="https://i.imgur.com/JRQ30XP.png" alt="CreatorHub Logo" className="h-12 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
        <p className="text-center text-light-3 mb-6">Sign up functionality coming soon...</p>
        <button
          onClick={() => navigate('/auth/login')}
          className="w-full bg-brand-primary text-dark-1 font-bold py-3 px-6 rounded-full hover:bg-brand-secondary transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
