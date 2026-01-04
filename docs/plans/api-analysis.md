# API Calls Analysis

This document lists all API calls in the frontend that need to be removed or replaced with localStorage operations.

## Direct API Client Usage

### Ape Client (frontend/src/ts/ape/index.ts)
Uses ts-rest client with backend URL from envConfig.

### Key API Contracts (packages/contracts)

#### Removed (Privacy Fork)
- **admin** - Admin functionality
- **apeKeys** - API keys management
- **connections** - Discord/GitHub connections
- **leaderboards** - Leaderboard data
- **psas** - Public service announcements
- **results** - Result submission (→ localStorage)
- **users** - User management and authentication
- **webhooks** - Webhook management

#### Replaced with localStorage
- **configs** - User configuration (→ localStorage)
- **public** - Public data (may need static files)

#### Retained (Static)
- **quotes** - Quote lists (static JSON)
- **presets** - Test presets (static JSON)
- **configuration** - Server configuration (may remove)
- **dev** - Development endpoints (remove)

## Firebase Integration

### Firebase Auth (frontend/src/ts/firebase.ts)
- `signInWithEmailAndPassword` - Email login
- `signInWithPopup` - Google/GitHub login
- `createUserWithEmailAndPassword` - Registration
- `signOut` - Logout
- `getIdToken` - Get auth token for API calls

### Firebase Analytics (frontend/src/ts/firebase.ts)
- `getAnalytics` - Analytics tracking

## Authentication State (frontend/src/ts/auth.ts)
- Login/logout UI handlers
- User profile data fetching
- Verification email sending
- Name change functionality

## Database Sync (frontend/src/ts/db.ts)
- IndexedDB sync with backend
- Configuration synchronization
- Result submission

## Frontend UI Elements Using API

### Login Page
- Email/password login form
- Social login buttons
- Registration form

### Account Page
- Profile data display
- Configuration sync
- Discord connection

### Results Page
- Result submission
- History fetching
- Statistics calculation

### Leaderboards
- Leaderboard data fetching
- Ranking display

## Required Actions

### Remove
1. Firebase SDK dependencies
2. All authentication UI
3. API client (Ape)
4. Backend configuration loading
5. Discord connection features
6. Leaderboard features
7. Admin features

### Replace with localStorage
1. Configuration persistence
2. Result history storage
3. Personal best tracking
4. Settings storage
5. Theme preferences

### Keep as static
1. Quote lists (from static/quotes)
2. Language data (from static/languages)
3. Themes (from static/themes)
4. Funbox configurations (from static/funbox)
