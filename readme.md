# CreatorHub

## Core Concept

CreatorHub is a sophisticated front-end demonstration of a premium, private subscription platform designed for top-tier creators. It aims to foster a more intimate connection between creators and their fans by providing exclusive content, direct messaging, and role-based experiences for Fans, Creators, and Administrators. The application is fully interactive, using in-memory data to simulate a complete backend and leverages the Google Gemini API to power advanced AI features.

## Tech Stack

-   **Frontend**: React, TypeScript
-   **Styling**: Tailwind CSS
-   **AI**: Google Gemini API (`@google/genai`)
-   **Icons**: `lucide-react`

## Current File Structure

```
/
├── components/         # Reusable React components (PostCard, Header, Views, etc.)
├── hooks/              # Custom React hooks for state and logic (useAuth, usePlatformData)
├── services/           # Modules for external API calls (geminiService.ts)
├── types.ts            # Centralized TypeScript type definitions
├── App.tsx             # Main application component, handles routing and layout
├── index.html          # HTML entry point
├── index.tsx           # React application entry point
└── readme.md           # This file
```

## Implemented Features

### `hooks/usePlatformData.ts` (Simulated Backend)

-   **Mock Database**: In-memory data for users, creators, posts, and messages.
-   **Simulated User & Creator Data**: Full CRUD-like operations for managing platform data.
-   **Access-Code-Based Subscriptions**: Fans must provide a correct, creator-set access code and have sufficient balance to subscribe.
-   **Fan Tipping**: A system allowing fans to tip creators on their posts, deducting from the fan's balance.
-   **Post Liking**: Functionality to increment the 'like' count on posts.
-   **Dynamic Feeds**:
    -   **Main Feed**: Shows all posts from subscribed creators and public posts from non-subscribed creators.
    -   **Discover Feed**: Shows only public posts from creators the fan is not subscribed to.
-   **Full Messaging System**: Supports conversations, sending/receiving messages, read status, and unread counts.
-   **Admin Capabilities**: Functions for verifying creators and removing posts.

### `services/geminiService.ts` (AI Integration)

-   **AI Post Drafting**: Utilizes `gemini-2.5-pro` with a detailed system instruction to generate high-quality, engaging social media posts from a simple user topic.
-   **AI Suggested Replies (JSON)**: Leverages `gemini-2.5-flash` and JSON mode to analyze conversation history and provide three short, context-aware reply suggestions.
-   **Audio-to-Text Transcription**: Uses `gemini-2.5-flash`'s multimodal capabilities to transcribe audio recordings from a user's microphone into text for messaging.

### `App.tsx` & View Components

-   **Role-Based Routing**: The main `App.tsx` component dynamically renders the `FanView`, `CreatorView`, or `AdminView` based on the current user's role.
-   **Global State Management**: Uses React Context (`PlatformDataContext`) to provide all platform data and functions to the entire application, avoiding prop drilling.
-   **Fan Dashboard**: A complete UI for the fan experience, including the home feed, a discover page for new creators, creator profile pages, and the messaging interface.
-   **Creator Dashboard**: A functional UI for creators to manage posts, view stats, and edit their profile settings.
-   **Admin Dashboard**: A UI for administrators to manage creators (verify/unverify) and moderate content (remove posts).
-   **Persistent Header & Navigation**: A shared header component provides consistent navigation and user-switching capabilities across all views.
