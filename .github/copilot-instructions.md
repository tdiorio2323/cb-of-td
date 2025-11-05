# GitHub Copilot Instructions — cb-of-td

**Goal:** Make AI agents productive fast. Follow these repo-specific patterns and workflows. Keep changes small and testable.

## Architecture (big picture)
- **App shell:** React + TypeScript, built with **Vite** (`vite.config.ts`).
- **Routing:** **React Router** with three shells that render `<Outlet/>`:
  - `src/routes/FanRoutes.tsx` → `/fan/*`
  - `src/routes/CreatorRoutes.tsx` → `/creator/*`
  - `src/routes/AdminRoutes.tsx` → `/admin/*`
  Public unauth routes live under `/` and `/auth/*`.
- **App entry:** `App.tsx` wires the route tree and shared layout.
- **State/data:** Centralized read layer via `hooks/usePlatformData.ts` and `types.ts`. Treat it as the single source of truth for app-wide data access.
- **AI services:** `services/geminiService.ts` encapsulates model calls. Do not call model SDKs from components.

## Conventions
- **Single access hook:** Use `usePlatformData()` (or exported selectors) instead of creating new contexts. If a selector is missing, add it to the hook.
- **Route shells own layout:** Add screens inside the appropriate shell. Do not import shell chrome inside a leaf screen—let `<Outlet/>` provide it.
- **Typed props only:** Export shared types from `types.ts`. Avoid ad-hoc inline types that duplicate shared ones.
- **Service boundaries:** Network or AI calls live in `services/*`. Components remain presentational + event wiring.
- **File naming:** `PascalCase` for components, `camelCase` for hooks and utilities.

## Environment & secrets
- Vite exposes only `VITE_*` variables. For client usage of Gemini, set **`VITE_GEMINI_API_KEY`** in `.env.local`. Prefer server proxies for real secrets.
- Never hardcode keys. Import from `import.meta.env`.

## Developer workflows
- **Install:** `pnpm i` (or `npm i` if pnpm not available)
- **Dev:** `pnpm dev` → Vite dev server
- **Typecheck:** `pnpm typecheck` (if script exists) or `tsc --noEmit`
- **Lint:** `pnpm lint` (fix with `pnpm lint --fix`)
- **Build:** `pnpm build`
- **Preview:** `pnpm preview`
- If a command is missing, add a script in `package.json` rather than invoking tools directly from components.

## Routing rules (examples)
- Public:
  - `/` → temporary landing
  - `/auth/login`, `/auth/signup`
- Fan:
  - `/fan/home`, `/fan/discover`, `/fan/messages`, `/fan/messages/:conversationId`
  - `/@:handle` → `PublicCreatorProfile` (public creator profile pattern)
- Creator:
  - `/creator/dashboard`, `/creator/posts`, `/creator/settings`, `/creator/messages`, `/creator/messages/:conversationId`
- Admin:
  - `/admin/dashboard`, `/admin/creators`, `/admin/content`

When adding a screen, export a **default component** and register it under the correct shell route. Do not bypass shells.

## AI integration pattern (Gemini)
- Use `services/geminiService.ts` as the single integration point. Add new functions there (e.g., `generateCaption(input)`) that:
  1) validate inputs,
  2) read `import.meta.env.VITE_GEMINI_API_KEY`,
  3) return typed results defined in `types.ts`.
- Components call these service functions and handle loading/error UI only.

## Data flow & testing hooks
- Treat `usePlatformData.ts` as the in-memory read model. If you need to derive data for multiple screens, implement a memoized selector there and type it in `types.ts`.
- If data resets on refresh, persist through a single point (e.g., localStorage layer inside the hook) rather than per-component hacks.

## What to change vs. avoid
- **Change:** Add new screens inside shells, new selectors in `usePlatformData.ts`, new typed DTOs in `types.ts`, new AI helpers in `services/geminiService.ts`.
- **Avoid:** New global state providers, direct model SDK calls from UI, re-implementing routing outside `App.tsx`, duplicate types, or `.env` access in components.

## PR checklist (agent)
1. Route registered under the correct shell and path.
2. Types live in `types.ts`; no duplicate inline types.
3. New service calls live in `services/*`, not in components.
4. Env reads use `import.meta.env.VITE_*`.
5. `pnpm build && pnpm preview` succeeds; no TS errors; lints clean.