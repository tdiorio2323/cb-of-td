# Repository Guidelines

## Project Structure & Module Organization
CreatorHub is a Vite + React 19 workspace organized by domain: `App.tsx` wires the Fan, Creator, and Admin shells, `components/` houses shared UI (with nested `pages/`), and `routes/` defines layout wrappers plus guarded navigation. Cross-cutting logic lives in `hooks/`, `services/`, and `state/`, while demo fixtures stay under `demo/` and `mocks/`. Generated assets (`dist/`, `route-gallery/`) stay untracked, helper utilities (e.g., `scripts/build-route-gallery.mjs`) sit in `scripts/`, and new features should live beside their owning route.

## Build, Test, and Development Commands
- `pnpm dev` launches the Vite dev server (default `http://localhost:5173`) using `.env.local`.
- `pnpm build` emits the production bundle into `dist/` for deployment checks.
- `pnpm preview` serves the `dist/` output locally to spot prod-only issues.
- `pnpm lint` and `pnpm typecheck` run ESLint (TS/React presets) and `tsc --noEmit`; keep both green before pushing.
- `pnpm routes:gallery` runs `scripts/build-route-gallery.mjs`, producing `route-gallery/gallery.html` with mobile/desktop snapshots for fast visual QA.

## Coding Style & Naming Conventions
Default to TypeScript + React function components and prefer hooks over classes. Use the `@/` alias (configured in `tsconfig.json`) for root-relative imports. Prettier enforces 100-character lines, double quotes, and semicolons; run `pnpm format` before committing. ESLint extends `eslint:recommended`, `@typescript-eslint`, `react`, and `react-hooks`; resolve warnings rather than disable rules. Name components with `PascalCase`, hooks with `useCamelCase`, and align file names with their primary export.

## Testing Guidelines
Coverage is currently manual: rely on `pnpm lint`, `pnpm typecheck`, Vite preview, and gallery snapshots before merging. When adding automated tests, colocate `*.spec.tsx` next to the component and reuse the same hooks/mocks for fixtures. Describe any manual verification (routes exercised, screenshots) in the PR to keep a record of coverage.

## Commit & Pull Request Guidelines
Recent history follows a lightweight Conventional Commits style (`feat:`, `chore:`, `docs:`). Keep subjects under 72 characters, describe the why in the body, and reference issue IDs when applicable. PRs should summarize functional changes, list the commands/tests run (or attach gallery shots), call out config/env edits, and mention rollout considerations. Bundle related work, and split Fan/Creator/Admin changes when they can ship independently.

## Environment & Configuration Tips
Runtime toggles live in `config.ts` and expect Vite-prefixed env vars: `VITE_DEMO_MODE` enables the demo banner, while `VITE_DEFAULT_PERSONA` (`fan|creator|admin`) sets the initial login target. Store overrides in `.env.local` (never commit it). When sharing recordings or gallery HTML, scrub demo data and regenerate after substantial route or layout edits.
