# Privacy Fork Design

## Overview

This document outlines the design for a privacy-focused fork of Monkeytype that removes all backend functionality and user tracking, enabling the application to run entirely in the browser using localStorage for data persistence.

## Goals

- Remove all backend infrastructure (Express, MongoDB, Redis)
- Eliminate user tracking and external communication
- Maintain core typing test functionality
- Persist user data using localStorage
- Comply with GPL-3.0 license requirements

## Architecture

### Removed Components

- `backend/` directory (Express server, MongoDB, Redis, API endpoints)
- `packages/contracts` (API contracts)
- `packages/schemas` (backend schemas)
- All Firebase SDKs and integrations

### Retained Components

- `frontend/` directory (main application)
- `static/` (static resources: languages, themes, layouts, quotes)
- `packages/typescript-config` (build tools)
- `packages/tsup-config` (build configuration)

### New Components

- `packages/local-storage-manager` - localStorage abstraction layer
- `frontend/src/utils/local-api` - API routing layer to localStorage

## Data Persistence

### Storage Locations

All data stored in browser localStorage with the following keys:

- `mt_settings` - User preferences (themes, sounds, fonts, test modes)
- `mt_history` - Typing history (WPM, accuracy, date, test metadata)
- `mt_personal_best` - Personal best records
- `mt_tags` - Tags and associated statistics (if applicable)

### Data Structures

```typescript
interface StorageData {
  settings: UserSettings;
  history: TypedResult[];
  personalBest: Record<string, number>;
}
```

### localStorage Manager

The `localStorage-manager` package provides:

- JSON serialization/deserialization
- Storage quota management (~5-10MB limit)
- Migration support (for schema changes)
- Optional encryption support

## API Routing

The `local-api` layer intercepts all API calls and routes them to localStorage:

| Original Endpoint   | Local Handling                     |
| ------------------- | ---------------------------------- |
| `GET /config`       | Return settings from localStorage  |
| `POST /result`      | Add result to localStorage history |
| `GET /results`      | Retrieve history from localStorage |
| All other endpoints | Disabled or hidden                 |

## Backend Dependency Removal

### Removed API Endpoints

- Authentication: `/login`, `/signup`, `/logout`, `/forgotPassword`
- Results: `/results`, `/result`
- User data: `/user/...`, `/account`
- Leaderboard: `/leaderboard`
- Discord integration: `/discord`
- Challenges: `/challenge/...`

### Firebase Removal

- Firebase SDK initialization
- Firebase Auth
- Firebase Analytics/Performance

### State Management Changes

- Remove `user` state from Redux/Context
- Remove auth state checking logic
- Remove backend connection status checking

### UI Changes

- Hide authentication UI elements (login/signup buttons)
- Convert user profile section to "guest" mode
- Remove leaderboard functionality
- Remove challenge features

## Error Handling

### localStorage Errors

- Automatic cleanup of old history when quota exceeded
- Clear user notifications for storage issues
- Fallback to in-memory storage if localStorage unavailable

### Network Errors

- All API calls routed locally, so no network errors expected
- Graceful degradation for static resource load failures (language packs, etc.)

## Testing Strategy

### Unit Tests

- `localStorage-manager` package tests
- `local-api` layer tests

### Integration Tests

- Typing test functionality works end-to-end
- Settings save/load correctly
- History persists to localStorage

### E2E Tests

- Complete user flow: configure → type test → view history

## License Compliance (GPL-3.0)

1. Keep original license file
2. Add modification notices to all modified files
3. Add fork information and modifications to README.md
4. Maintain copyright notices and GPL-3.0 license display

## Implementation Checklist

- [ ] Create `packages/local-storage-manager`
- [ ] Create `frontend/src/utils/local-api`
- [ ] Identify and remove all API calls
- [ ] Remove Firebase SDKs
- [ ] Remove authentication state management
- [ ] Update UI to hide auth elements
- [ ] Implement localStorage data persistence
- [ ] Add error handling for localStorage
- [ ] Update documentation
- [ ] Run tests
- [ ] Create privacy-fork branch
