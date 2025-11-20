# Tailors Suite

**Professional tailoring business management app for Android**

Tailors Suite helps tailors and fashion designers manage client measurements, track jobs, and generate professional invoices. Built with React, TypeScript, and Capacitor, featuring offline-first architecture with real-time cloud sync.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/Thollarkings/stitch-scribe-tracker)
[![Platform](https://img.shields.io/badge/platform-Android-green.svg)](https://www.android.com)
[![Status](https://img.shields.io/badge/status-active-success.svg)](https://github.com/Thollarkings/stitch-scribe-tracker)

---

## ✨ Features

### Core Functionality
- 📏 **Measurement Management** - Store detailed client measurements with 30+ comprehensive fields
- 👔 **Job Tracking** - Track orders from start to finish with due dates and status updates
- 💰 **Payment & Invoicing** - Generate professional invoices with automatic balance calculations
- 📱 **Offline Support** - Works without internet connection, automatic cloud sync when online
- 🔒 **Secure & Private** - Encrypted data storage with cloud backup via Convex
- 🔄 **Real-time Sync** - Multi-device synchronization across web and mobile via WebSocket
- 🎨 **Custom Branding** - Add your business logo to invoices

### Technical Features
- **Progressive Web App (PWA)** - Installable, works offline with service worker
- **Native Android App** - Built with Capacitor 7.x
- **Modern UI** - Clean, responsive interface with Tailwind CSS and shadcn/ui
- **TypeScript** - Type-safe development for reliability
- **Real-time Database** - Convex backend with automatic synchronization

---

## 📱 Platform Support

- **Android:** API 23+ (Android 6.0+) - Native app available
- **Web:** Modern browsers with PWA support
- **Target SDK:** Android 15 (API 35)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- JDK 17 (for Android builds)
- Android Studio (optional, for Android development)

### Installation

```bash
# Clone the repository
git clone https://github.com/Thollarkings/stitch-scribe-tracker.git
cd stitch-scribe-tracker

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your Convex deployment URL
```

### Development

```bash
# Start web development server
npm run dev

# Build for production (web)
npm run build

# Preview production build
npm run preview
```

### Android Development

```bash
# Build for Android and sync
npm run android:build

# Open in Android Studio
npm run open:android

# Build release APK
npm run android:release-apk

# Build release bundle (AAB)
npm run android:release
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Base path (use "/" for local dev)
VITE_BASE=/

# Convex backend URL
VITE_CONVEX_URL=https://your-deployment.convex.cloud

# Enable Convex backend
VITE_USE_CONVEX=true
```

For Android builds, also configure `.env.android.local`:

```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
VITE_USE_CONVEX=true
```

### Convex Backend Setup

1. Install Convex CLI:
```bash
npm install -g convex
```

2. Initialize Convex project:
```bash
npx convex dev
```

3. Deploy to production:
```bash
npx convex deploy
```

4. Update `.env` with your Convex deployment URL

---

## 📁 Project Structure

```
├── android/                 # Capacitor Android project
│   ├── app/
│   │   └── src/main/
│   │       ├── java/        # Java source (MainActivity, SplashActivity)
│   │       └── res/         # Android resources (icons, splash screens)
├── convex/                  # Convex backend
│   ├── schema.ts           # Database schema
│   ├── auth_actions.ts     # Authentication logic
│   ├── measurements.ts     # Measurement queries/mutations
│   └── jobs.ts             # Job tracking logic
├── public/                  # Static assets
│   ├── icons/              # App icons
│   ├── logo.png            # Business logo for invoices
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/         # React components
│   ├── contexts/           # React contexts (AuthContext)
│   ├── hooks/              # Custom hooks (useMeasurements)
│   ├── integrations/       # External integrations (Convex client)
│   ├── pages/              # Main pages (Index, Invoice, Auth)
│   └── App.tsx             # Main app component
└── capacitor.config.ts     # Capacitor configuration
```

---

## 🎨 Tech Stack

### Frontend
- **React 18.3** - UI framework
- **TypeScript 5.6** - Type safety
- **Vite 5.4** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library (Radix UI)
- **React Router** - Navigation
- **React Query** - Data fetching and caching

### Backend
- **Convex** - Real-time database and backend
- **Custom Authentication** - Email/password auth via Convex

### Mobile
- **Capacitor 7.x** - Native mobile wrapper
- **Android SDK 35** - Target Android 15

### PWA
- **Vite PWA Plugin** - Service worker generation
- **Workbox** - Offline caching strategies

---

## 📖 Key Components

### Authentication
- Email/password authentication via Convex
- Session management with secure tokens
- Protected routes with AuthContext
- Location: `src/contexts/AuthContext.tsx`

### Measurements
- Comprehensive client measurement storage (30+ fields)
- Search and filter functionality
- CRUD operations with real-time sync
- Location: `src/hooks/useMeasurements.tsx`

### Jobs
- Order tracking with due dates
- Service charge and payment tracking
- Balance calculations
- Status management

### Invoices
- Professional invoice generation
- Custom logo support
- PDF export via html2canvas and jsPDF
- Location: `src/pages/Invoice.tsx`

---

## 🏗️ Building for Release

### Android Release

1. **Generate signing key:**
```bash
npm run generate-keystore
```

2. **Configure signing:**
```bash
npm run setup-keystore
```

3. **Build release:**
```bash
npm run build:release
```

Output files:
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

See `RELEASE_GUIDE.md` for detailed instructions.

---

## 📚 Documentation

Comprehensive documentation is available:

- `START_HERE.md` - Getting started guide
- `STATUS.md` - Project status and phases
- `RELEASE_GUIDE.md` - Complete release process
- `APKPURE_GUIDE.md` - APKPure submission guide
- `AMAZON_APPSTORE_GUIDE.md` - Amazon Appstore guide
- `DOCUMENTATION_INDEX.md` - Complete documentation index

---

## 🚀 Distribution

### Available Platforms

- **APKPure** - Free Android app distribution
- **Amazon Appstore** - Free, reaches 50+ million users
- **Google Play Store** - Future release (requires $25 registration)

Detailed submission guides available in the documentation.

---

## 🔄 Offline Mode

The app includes comprehensive offline support:

- **Service Worker** - Caches assets for offline use
- **Local Storage** - Temporary data storage when offline
- **Automatic Sync** - Data syncs automatically when connection restored
- **Offline Indicator** - Visual feedback for offline state

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Android
npm run android:build    # Build web + sync to Android
npm run cap:sync         # Sync web assets to Android
npm run open:android     # Open Android Studio
npm run android:release  # Build release AAB
npm run android:release-apk  # Build release APK

# Release
npm run generate-keystore    # Generate signing keystore
npm run setup-keystore       # Configure keystore
npm run build:release        # Full release build
```

### Code Quality

```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

---

## 🐛 Known Issues & Fixes

All major issues have been resolved:
- ✅ Measurement update validation - Fixed
- ✅ Database sync between web and mobile - Fixed
- ✅ Splash screen implementation - Complete
- ✅ Real-time synchronization - Working

See `BUG_FIX_REPORT.md` for details.

---

## 🤝 Contributing

This is a private project, but suggestions and feedback are welcome!

---

## 📄 License

Copyright © 2025 Thollarkings. All rights reserved.

---

## 👤 Author

**Thollarkings**
- GitHub: [@Thollarkings](https://github.com/Thollarkings)

---

## 🙏 Acknowledgments

Built with:
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Capacitor](https://capacitorjs.com)
- [Convex](https://www.convex.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

---

## 📞 Support

For issues and questions:
- Check the documentation in the `docs/` folder
- Review `STATUS.md` for project status
- See `RELEASE_GUIDE.md` for release help

---

**Version:** 1.0.0  
**Last Updated:** November 20, 2024  
**Status:** Active Development / Production Ready
