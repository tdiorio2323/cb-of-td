/*
    DEPRECATED: This component has been refactored and is no longer in use.

    The functionality of this monolithic MessagingView has been broken down into
    three more modular and maintainable components:
    - components/MessagesDashboard.tsx (Main layout and conversation list)
    - components/ChatWindow.tsx (Displays the active chat messages)
    - components/MessageInput.tsx (Handles text input and AI features)

    This file is kept for historical purposes but can be safely removed.
*/
import React from 'react';

const DeprecatedMessagingView: React.FC = () => {
    return (
        <div className="p-8 text-center text-light-3">
            <h1 className="text-2xl font-bold">This component is deprecated.</h1>
            <p className="mt-2">Please use MessagesDashboard instead.</p>
        </div>
    );
};

export default DeprecatedMessagingView;
