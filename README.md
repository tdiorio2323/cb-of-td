<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Dh3ODcumGyFJ-KA2vfx4tkoceWHHaIFS

## Setup

1. Copy environment template and fill in your values:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and set `GEMINI_API_KEY` to your Gemini API key from https://aistudio.google.com/app/apikey

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   App runs at http://localhost:3000

**Additional commands:**
- Type check: `npm run typecheck`
- Build: `npm run build`
- Clean build: `npm run build:clean`
