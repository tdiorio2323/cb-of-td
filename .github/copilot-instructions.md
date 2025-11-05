# CreatorHub - AI Coding Instructions

## Project Overview
CreatorHub is a React/TypeScript demo of a premium creator subscription platform. It simulates a complete backend using in-memory data and integrates Google Gemini AI for content generation and chat features.

**Stack**: React 19 + TypeScript + React Router v7 + Vite + Tailwind + Google Gemini API

## Critical Architecture Patterns

### Global State via Context
- **Core pattern**: `usePlatformData()` hook in `hooks/usePlatformData.ts` acts as a simulated backend
- **Access**: Import `usePlatform()` from `App.tsx` in any component to access platform data
- **Data flow**: All CRUD operations, business logic, and in-memory databases live in `usePlatformData`
- **No external state libs**: Uses React Context exclusively

### Route Structure & Protection
- **Three role-based shells**: `routes/FanRoutes.tsx`, `CreatorRoutes.tsx`, `AdminRoutes.tsx`
- **Nested routing**: Each shell uses `<Outlet />` and passes context data via `<Outlet context={...} />`
- **Protection**: `ProtectedRoute` wrapper checks user roles before allowing access
- **Navigation**: Role-specific dashboards determined in `App.tsx` `handleLogin()` function

### In-Memory Data Simulation
- **Database**: All data in `USERS_DB`, `CREATORS_DB`, `POSTS_DB`, `MESSAGES_DB` arrays in `usePlatformData.ts`
- **Persistence**: Data resets on page refresh (no localStorage/backend)
- **Business logic**: Subscription system with access codes, messaging, posts privacy levels

## Development Workflow

### Environment Setup
```bash
# Required for AI features
echo "GEMINI_API_KEY=your_key_here" > .env

npm run dev    # http://localhost:3000
npm run build  # Production build
```

### Key Configuration
- **Path alias**: `@/` resolves to project root (configured in `vite.config.ts` and `tsconfig.json`)
- **API key exposure**: Vite exposes env vars as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`
- **Dev server**: Runs on port 3000 with `host: '0.0.0.0'` for network access

## AI Integration Patterns

### Gemini Service (`services/geminiService.ts`)
- **Post drafts**: `gemini-2.5-pro` for content generation from topics
- **Reply suggestions**: `gemini-2.5-flash` with structured JSON output for contextual chat replies  
- **Audio transcription**: Multimodal processing for voice messages
- **Graceful degradation**: All AI features check for API key availability

## Component Conventions

### Data Access Pattern
```typescript
// Standard pattern in components
import { usePlatform } from '@/App';

const Component = () => {
  const { users, creators, posts, subscribe, sendMessage } = usePlatform();
  // Component logic...
};
```

### Route Shell Pattern
- Shells provide: shared header, navigation, user context
- Pages receive data via `useOutletContext()` hook
- Bottom navigation (`BottomNav`) shows active route state

### Subscription Flow
- Access codes required for creator subscriptions (`Creator.accessCode`)
- Balance checking and deduction handled in `usePlatformData.subscribe()`
- `AccessCodeModal` component manages the subscription UX

## Component Organization
- **Pages**: `components/pages/` - Route-specific page components
- **Shells**: `routes/` - Role-based layout wrappers  
- **Reusable**: `components/` - Shared UI components (`PostCard`, `MessageInput`, etc.)
- **Hooks**: `hooks/` - Custom hooks for data access and business logic

## Development Notes
- TypeScript strict mode disabled (`allowJs: true`)
- No testing framework configured
- No linting setup present
- Authentication simulated via `currentUserId` state in `App.tsx`
- Mobile-first design with Tailwind responsive utilities