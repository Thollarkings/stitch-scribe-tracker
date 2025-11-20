# TailorSuite — Stitch Scribe Tracker

A modern, offline-ready PWA for tailors to manage client measurements, jobs, and invoices. Built with React, TypeScript, shadcn/ui, Tailwind CSS, and Convex. Designed to run on web, install as a PWA, and package to mobile via Capacitor.

Developed by Thollarkings © 2025

---

## Highlights
- Client management with detailed body measurements (30+ fields)
- Job tracking with service charges, payments, balances, and due dates
- Invoice generation (PDF export) with your own logo
- Fast search and responsive UI
- Authentication (email/password) backed by Convex
- PWA features: installable, works offline, mobile-friendly
- Deployable to GitHub Pages or Vercel; Android packaging via Capacitor

## Screenshots
- public/screenshots/screenshot1-wide.png
- public/screenshots/screenshot2.png

## Tech Stack
- Vite + React + TypeScript
- shadcn/ui (Radix UI), Tailwind CSS
- React Router, React Query
- Convex (data + custom auth)
- Supabase (legacy, being phased out)
- Vite PWA tooling and a custom service worker
- Capacitor (Android packaging)

## Project Structure (selected)
- src/pages: main routes (Auth, Index, Invoice, NotFound)
- src/contexts/AuthContext.tsx: Convex-based auth provider
- src/hooks/useMeasurements.tsx: measurements + jobs UX/data logic
- convex/: Convex schema and server-side functions
- public/: static assets, PWA manifest, service worker

## Getting Started

Prerequisites:
- Node.js 18+ and npm

Install dependencies:
- npm install

Environment variables:
- cp .env.example .env
- Then set values accordingly (see Environment section below)

Run the app in development mode:
- npm run dev
- App will be served by Vite (the base path is controlled by VITE_BASE)

## Environment
The app reads its configuration from .env (Vite variables are prefixed with VITE_):
- VITE_BASE: Base path for the router and asset resolution. Use "/" locally; use "/stitch-scribe-tracker" when deploying to GitHub Pages under a project subpath. Used by BrowserRouter basename in src/App.tsx and manifest start_url/scope.
- VITE_CONVEX_URL: Public Convex deployment URL or local dev URL (e.g. from npx convex dev). Example: https://YOUR-DEPLOYMENT.convex.cloud
- VITE_USE_CONVEX: Set to true to use the Convex-backed data path. (Supabase references remain for migration history only.)

Example .env for local dev:
- VITE_BASE=/
- VITE_CONVEX_URL=http://localhost:3210
- VITE_USE_CONVEX=true

Example .env for GitHub Pages:
- VITE_BASE=/stitch-scribe-tracker
- VITE_CONVEX_URL=https://YOUR-DEPLOYMENT.convex.cloud
- VITE_USE_CONVEX=true

## Convex Backend
Convex powers authentication and data (measurements, jobs, sessions). See convex/schema.ts for the data model. The frontend creates a ConvexReactClient using VITE_CONVEX_URL at src/integrations/convex/client.ts.

Local development with Convex:
1) Install Convex CLI if needed: npm i -g convex
2) From the project root, run: npx convex dev (this starts a local Convex backend and prints a client URL)
3) Set VITE_CONVEX_URL to the printed dev URL in your .env

Deployment with Convex:
- Create a Convex project and deploy your functions/schema
- Set VITE_CONVEX_URL to the public Convex deployment URL in your runtime environment

## Authentication
- Email/password auth handled via custom Convex actions and sessions
- Frontend context: src/contexts/AuthContext.tsx (signUp, signIn, signOut)
- Protected routes use src/components/auth/ProtectedRoute.tsx

## Measurements and Jobs
- Main UI lives in src/pages/Index.tsx
- CRUD logic and caching via React Query + local state hooks in src/hooks/useMeasurements.tsx
- Jobs are attached to a measurement (client) and tracked with pricing/payment fields

## Invoices
- Invoices are generated in src/pages/Invoice.tsx
- PDF export via html2canvas and jsPDF/pdf-lib
- Include your logo via public/logo.png (customize as needed)

## PWA and Offline
- Manifest: public/manifest.json (name, icons, screenshots, start_url/scope)
- Service worker: public/service-worker.js (Workbox-based). Note: contains a TODO for an offline fallback page; customize offlineFallbackPage if you want a branded offline experience.
- Install prompt UX: src/components/pwa and src/hooks/usePWAInstall.tsx

## Android (Capacitor)

This project includes a full Android wrapper via Capacitor. The app has been successfully built and tested on physical devices.

### Quick Start
```bash
# Build for Android and sync
npm run android:build

# Open in Android Studio
npm run open:android

# Build release bundle for Play Store
npm run build:release
```

### Release to Play Store
**📱 Ready for Play Store submission!** See documentation:
- **Quick Start:** `QUICK_START_RELEASE.md` - Get started in 5 minutes
- **Complete Guide:** `RELEASE_GUIDE.md` - Comprehensive release process
- **Phase 5 Summary:** `PHASE5_SUMMARY.md` - Current status and action items
- **Asset Guide:** `PLAY_STORE_ASSETS.md` - Screenshots, graphics, descriptions
- **Checklist:** `RELEASE_CHECKLIST.md` - Track your progress
- **Status:** `STATUS.md` - Overall project status

**Current Version:** 1.0.0 (versionCode: 1)  
**Status:** Phase 5 configuration complete - Ready for keystore generation and asset creation

### Android Development
- **Config:** `capacitor.config.ts`
- **Build:** `android/app/build.gradle` (includes signing configuration)
- **Environment:** `.env.android.local` (gitignored)
- **Target SDK:** API 35 (Android 15)

For detailed Android development workflow, see `STATUS.md`.

## Routing and Base Path
- The BrowserRouter uses a basename derived from VITE_BASE (defaults to "/stitch-scribe-tracker" for GitHub Pages convenience). Adjust VITE_BASE to match your deployment path.
- The manifest start_url and scope are currently set to "/stitch-scribe-tracker/" for GitHub Pages. If deploying to root on Vercel, change those to "/".

## Build
- Production build: npm run build
- Preview build locally: npm run preview

## Deployment

GitHub Pages (gh-pages branch):
1) Update homepage in package.json to your repo URL if needed
2) Ensure VITE_BASE=/stitch-scribe-tracker in your environment (or adjust to your repo name)
3) npm run deploy (runs build then publishes dist/ to gh-pages branch via gh-pages)

Vercel:
- vercel.json is provided with a static build config and SPA fallback to index.html
- Set VITE_BASE=/ for root deployment
- Configure VITE_CONVEX_URL in Vercel project environment

## Legacy Supabase (Migration Notes)
- Supabase client code exists in src/integrations/supabase for migration history. The public anon key in the repo is for development/testing only—do not use in production.
- The active implementation uses Convex for auth and data (see MIGRATION_CONTEXT.md for background).

## Linting
- npm run lint

## Security and Secrets
- Never commit production secrets. Only VITE_ variables are exposed to the browser; server-only secrets must live in Convex or other secure backends.

## Contributing
- Fork and create a feature branch
- Make changes and run locally
- Submit a PR with a clear description and testing notes

## License
- Proprietary. All rights reserved unless otherwise specified by the author.

## Credits
- Developed by Thollarkings © 2025
- UI powered by shadcn/ui and Radix UI
- Data and auth by Convex

---

## Quick Commands

### Web Development
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Deploy to GitHub Pages: `npm run deploy`

### Android Development
- Build for Android: `npm run android:build`
- Sync to Android: `npm run cap:sync`
- Open Android Studio: `npm run open:android`

### Release to Play Store
- Generate keystore: `npm run generate-keystore`
- Setup signing: `npm run setup-keystore`
- Build release AAB: `npm run build:release`
- Build release APK (testing): `npm run android:release-apk`

**→ See `QUICK_START_RELEASE.md` for release workflow**
