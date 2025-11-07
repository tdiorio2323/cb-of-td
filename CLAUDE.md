# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CreatorHub is a React/TypeScript demonstration of a premium subscription platform for creators. It simulates a complete backend using in-memory data and leverages Google Gemini API for AI-powered features.

**Tech Stack:**
- React 19.2.0 + TypeScript
- React Router v7.9.5 (client-side routing)
- Vite (dev server and build tool)
- Tailwind CSS for styling
- Google Gemini API (`@google/genai`) for AI features
- `lucide-react` for icons
- **Package manager:** pnpm (v10.20.0)

## Development Commands

**Install dependencies:**
```bash
pnpm install
```

**Start development server:**
```bash
pnpm dev
```
Runs on http://localhost:3000 (configured in vite.config.ts with host '0.0.0.0')

**Build for production:**
```bash
pnpm build
```

**Preview production build:**
```bash
pnpm preview
```

**Type checking:**
```bash
tsc --noEmit
```

**Generate route gallery:**
```bash
pnpm routes:gallery
```
Creates `route-gallery/gallery.html` with previews of all application routes at mobile and desktop widths.

## Architecture

### File Structure

The project uses a **flat structure** with source files at the root level:
- `App.tsx`, `types.ts`, `index.tsx` — core app files
- `components/` — all React components including page components
- `hooks/` — React hooks (notably `usePlatformData.ts`)
- `routes/` — route shell components (`FanRoutes.tsx`, `CreatorRoutes.tsx`, `AdminRoutes.tsx`)
- `services/` — external service integrations (Gemini API)

### State Management & Data Flow

The application uses React Context for global state management:

1. **`hooks/usePlatformData.ts`**: The single source of truth for all app data
   - Maintains in-memory databases for users, creators, posts, messages, and transactions
   - Provides all CRUD operations and business logic
   - Handles subscriptions (with access code verification), tipping, liking, messaging
   - Manages dynamic feeds (main feed vs discover feed based on subscription status)
   - Tracks wallet balances and transaction history

2. **`App.tsx`**: Root component that provides platform data to all child components
   - Creates `PlatformDataContext.Provider` wrapping the entire app
   - Any component can access platform data via `usePlatform()` hook
   - Defines all application routes using React Router
   - Manages authentication state (currentUserId)

3. **Access pattern**: Import `usePlatform()` from `App.tsx` in any component to access the full platform data and functions. Never create additional contexts—extend `usePlatformData.ts` instead.

### Routing Architecture

The app uses React Router with nested routes and protected route components:

**Public routes:**
- `/` — Landing page (unauthenticated users)
- `/auth/login` — Login screen
- `/auth/signup` — Signup page
- `/@:handle` — Public creator profile pages (accessible without auth)

**Protected routes** (using `ProtectedRoute` wrapper):
- `/fan/*` — Fan routes wrapped in `FanRoutes` shell
  - `/fan/home` — Home feed
  - `/fan/discover` — Discover new creators
  - `/fan/messages` — Message inbox
  - `/fan/messages/:conversationId` — Specific conversation
  - `/fan/wallet` — Wallet and transaction history
  - `/fan/settings` — Fan settings
- `/creator/*` — Creator routes wrapped in `CreatorRoutes` shell
  - `/creator/dashboard` — Creator dashboard with stats
  - `/creator/posts` — Post management
  - `/creator/settings` — Profile settings
  - `/creator/messages` — Creator message inbox
  - `/creator/messages/:conversationId` — Specific conversation
- `/admin/*` — Admin routes wrapped in `AdminRoutes` shell
  - `/admin/dashboard` — Admin overview
  - `/admin/creators` — Creator verification management
  - `/admin/content` — Content moderation

**Route shells** (`routes/FanRoutes.tsx`, `CreatorRoutes.tsx`, `AdminRoutes.tsx`):
- Provide shared layout (header, bottom navigation)
- Handle role-specific logic
- Use `<Outlet />` to render child routes
- Pass context data to child pages via `<Outlet context={...} />`

### AI Integration (`services/geminiService.ts`)

Three main AI capabilities powered by Gemini:

1. **Post Drafting**: Uses `gemini-2.5-pro` to generate engaging social media posts from topics
2. **Suggested Replies**: Uses `gemini-2.5-flash` with JSON mode to analyze conversation history and suggest contextual replies
3. **Audio Transcription**: Uses `gemini-2.5-flash` multimodal capabilities to transcribe audio recordings to text

**All AI calls must go through `services/geminiService.ts`**—never call the Gemini SDK directly from components.

### Environment Configuration

The app requires a Gemini API key for AI features:
- Create a `.env` or `.env.local` file at the project root with: `GEMINI_API_KEY=your_api_key_here`
- Vite config (`vite.config.ts:14-15`) exposes this as `process.env.API_KEY` and `process.env.GEMINI_API_KEY` via `loadEnv()`
- **Note:** This project uses a custom `define` in vite.config.ts instead of the standard `VITE_*` prefix convention
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
- Subscription logic is in `usePlatformData.ts`

### Post Privacy
- Posts have an `isPrivate` boolean field
- Private posts only visible to subscribed fans
- Public posts visible to everyone (used in discover feed)

### Messaging System
- Full bidirectional messaging between users
- Tracks read/unread status
- Maintains unread counts per conversation
- See `usePlatformData.ts` for messaging functions

### Wallet & Transactions
- Users have a `balance` field tracked in their User object
- All tips and subscriptions create Transaction records
- Transactions include type ('tip' | 'subscription'), amount, timestamp, and involved parties
- Fan wallet page shows transaction history

### In-Memory Data
All data resets on page refresh. Initial data is defined in `usePlatformData.ts`:
- `USERS_DB` — users with different roles
- `CREATORS_DB` — creator profiles with access codes
- `POSTS_DB` — sample posts with privacy settings
- `MESSAGES_DB` — initial message threads

## Code Conventions & Patterns

### Component Development
- **Single access hook**: Always use `usePlatformData()` (or `usePlatform()` from App.tsx) instead of creating new contexts. If you need new data access, add a selector to the hook.
- **Route shells own layout**: Add new screens inside the appropriate shell (`FanRoutes`, `CreatorRoutes`, `AdminRoutes`). Never import shell chrome inside a leaf screen—let `<Outlet/>` provide it.
- **Service boundaries**: Network or AI calls must live in `services/*`. Components should remain presentational + event wiring only.
- **Type exports**: All shared types must be exported from `types.ts`. Avoid ad-hoc inline types that duplicate shared ones.
- **File naming**: Use `PascalCase` for components, `camelCase` for hooks and utilities.

### Adding New Features

**When adding new screens:**
1. Create the component in `components/pages/`
2. Export a **default component** from your screen file
3. Register it under the correct shell route in `App.tsx`
4. Do not bypass the route shells
5. Pass data via `<Outlet context={...} />` from the shell, not via props

**When adding AI features:**
1. Add new functions to `services/geminiService.ts` (e.g., `generateCaption(input)`)
2. Validate inputs in the service function
3. Read API key from `process.env.GEMINI_API_KEY` (exposed via vite.config.ts)
4. Return typed results defined in `types.ts`
5. Components call these service functions and handle loading/error UI only

### Data Access Patterns
- Treat `hooks/usePlatformData.ts` as the single source of truth for app-wide data
- If you need to derive data for multiple screens, implement a memoized selector in the hook and type it in `types.ts`
- For persistence across refreshes, add a single localStorage layer inside the hook rather than per-component implementations

## Development Notes

- TypeScript strict mode is not fully enabled; `allowJs: true` is set
- Using experimental decorators (`experimentalDecorators: true`)
- Vite dev server runs on port 3000 with `host: '0.0.0.0'` for network access
- No testing framework is currently configured
- No linting configuration present
- Authentication is simulated; the app uses a hardcoded `currentUserId` in `App.tsx` that can be changed via the login screen
- Flat project structure: source files live at root level, not in a `src/` directory
