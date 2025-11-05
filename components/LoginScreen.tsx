import React from 'react';

interface LoginScreenProps {
    onLogin: (userId: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-dark-1 text-white">
            <img src="https://i.imgur.com/JRQ30XP.png" alt="CreatorHub Logo" className="h-12 mb-8" />
            <div className="bg-dark-2 p-8 rounded-lg shadow-2xl border border-dark-3 w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-2 text-center">Welcome to CreatorHub</h1>
                <p className="mb-6 text-light-3 text-center">Select a user to log in as:</p>
                <div className="flex flex-col gap-4">
                    <button 
                    onClick={() => onLogin('user-fan-1')}
                    className="w-full px-4 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                    Log in as Fan (Brenda)
                    </button>
                    <button 
                    onClick={() => onLogin('user-creator-1')}
                    className="w-full px-4 py-3 bg-purple-600 rounded-lg hover:bg-purple-500 font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                    Log in as Creator (Alex)
                    </button>
                    <button 
                    onClick={() => onLogin('user-admin-1')}
                    className="w-full px-4 py-3 bg-red-600 rounded-lg hover:bg-red-500 font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                    Log in as Admin
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
