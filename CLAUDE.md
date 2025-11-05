# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CreatorHub is a React/TypeScript front-end demonstration of a premium subscription platform for creators. It simulates a complete backend using in-memory data and leverages Google Gemini API for AI-powered features.

**Tech Stack:**
- React 19.2.0 + TypeScript
- React Router v7.9.5 (client-side routing)
- Vite (dev server and build tool)
- Tailwind CSS for styling
- Google Gemini API (`@google/genai`) for AI features
- `lucide-react` for icons

## Development Commands

**Start development server:**
```bash
npm run dev
```
Runs on http://localhost:3000 (configured in vite.config.ts)

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## Architecture

### State Management & Data Flow

The application uses React Context for global state management via `PlatformDataContext`:

1. **`hooks/usePlatformData.ts`**: The core data layer that acts as a simulated backend
   - Maintains in-memory databases for users, creators, posts, and messages
   - Provides all CRUD operations and business logic
   - Handles subscriptions (with access code verification), tipping, liking, messaging
   - Manages dynamic feeds (main feed vs discover feed based on subscription status)

2. **`App.tsx`**: Root component that provides platform data to all child components
   - Creates `PlatformDataContext.Provider` wrapping the entire app
   - Any component can access platform data via `usePlatform()` hook
   - Defines all application routes using React Router
   - Manages authentication state (currentUserId)

3. **Access pattern**: Import `usePlatform()` from `App.tsx` in any component to access the full platform data and functions

### Routing Architecture

The app uses React Router with nested routes and protected route components:

**Public routes:**
- `/` - Landing page (unauthenticated users)
- `/auth/login` - Login screen
- `/auth/signup` - Signup page
- `/@:handle` - Public creator profile pages (accessible without auth)

**Protected routes** (using `ProtectedRoute` wrapper):
- `/fan/*` - Fan routes wrapped in `FanRoutes` shell
  - `/fan/home` - Home feed
  - `/fan/discover` - Discover new creators
  - `/fan/messages` - Message inbox
  - `/fan/messages/:conversationId` - Specific conversation
- `/creator/*` - Creator routes wrapped in `CreatorRoutes` shell
  - `/creator/dashboard` - Creator dashboard with stats
  - `/creator/posts` - Post management
  - `/creator/settings` - Profile settings
  - `/creator/messages` - Creator message inbox
- `/admin/*` - Admin routes wrapped in `AdminRoutes` shell
  - `/admin/dashboard` - Admin overview
  - `/admin/creators` - Creator verification management
  - `/admin/content` - Content moderation

**Route shells** (`routes/FanRoutes.tsx`, `CreatorRoutes.tsx`, `AdminRoutes.tsx`):
- Provide shared layout (header, bottom navigation)
- Handle role-specific logic
- Use `<Outlet />` to render child routes
- Pass context data to child pages via `<Outlet context={...} />`

### Role-Based Views

Each role has its own route shell and page components in `components/pages/`:

- **Fan pages**: `FanHomePage`, `FanDiscoverPage`, `FanMessagesPage`
- **Creator pages**: `CreatorDashboardPage`, `CreatorPostsPage`, `CreatorSettingsPage`, `CreatorMessagesPage`
- **Admin pages**: `AdminDashboardPage`, `AdminCreatorsPage`, `AdminContentPage`

### AI Integration (`services/geminiService.ts`)

Three main AI capabilities powered by Gemini:

1. **Post Drafting**: Uses `gemini-2.5-pro` to generate engaging social media posts from topics
2. **Suggested Replies**: Uses `gemini-2.5-flash` with JSON mode to analyze conversation history and suggest contextual replies
3. **Audio Transcription**: Uses `gemini-2.5-flash` multimodal capabilities to transcribe audio recordings to text

### Environment Configuration

The app requires a Gemini API key for AI features:
- Create a `.env` file at the project root with: `GEMINI_API_KEY=your_api_key_here`
- Vite config (`vite.config.ts:14-15`) exposes this as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`
- If no API key is set, AI features will gracefully degrade (check `geminiService.ts`)
- Get a free API key at: https://aistudio.google.com/app/apikey

### Import Aliases

The project uses `@/*` path alias (configured in `tsconfig.json` and `vite.config.ts`) to reference files from the root:
```typescript
import { User } from '@/types';
import { usePlatform } from '@/App';
```

## Key Concepts

### Subscription System
- Fans must provide the correct access code (set by creator) to subscribe
- Subscription requires sufficient balance in fan's account
- Access codes are stored in `Creator.accessCode` field
- Check `usePlatformData.ts` for subscription logic

### Post Privacy
- Posts have an `isPrivate` boolean field
- Private posts only visible to subscribed fans
- Public posts visible to everyone (used in discover feed)

### Messaging System
- Full bidirectional messaging between users
- Tracks read/unread status
- Maintains unread counts per conversation
- See `usePlatformData.ts` for messaging functions

### In-Memory Data
All data resets on page refresh. Initial data is defined in:
- `USERS_DB` (users with different roles)
- `CREATORS_DB` (creator profiles with access codes)
- `POSTS_DB` (sample posts with privacy settings)
- `MESSAGES_DB` (initial message threads)

## Key Components

### Navigation & Layout
- **`BottomNav`**: Mobile-first navigation bar that appears at bottom on mobile, shows active view
- **`ProtectedRoute`**: Route wrapper that checks user role and redirects unauthorized users
- **Route shells**: Provide consistent header, navigation, and layout for each role

### Reusable UI Components
- **`PostCard`**: Displays individual posts with like/tip functionality
- **`AccessCodeModal`**: Modal for entering creator access codes during subscription
- **`MessageInput`**: Rich message input with audio recording and AI reply suggestions
- **`ChatWindow`**: Real-time chat interface with message history

## Development Notes

- TypeScript strict mode is not fully enabled; `allowJs: true` is set
- Using experimental decorators (`experimentalDecorators: true`)
- Vite dev server runs on port 3000 with `host: '0.0.0.0'` for network access
- No testing framework is currently configured
- No linting configuration present
- Authentication is simulated; the app uses a hardcoded `currentUserId` in `App.tsx` that can be changed via the login screen
