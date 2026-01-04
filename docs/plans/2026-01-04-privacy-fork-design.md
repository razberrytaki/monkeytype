# Privacy Fork Design

## Status

| Phase                           | Status         | Progress           |
| ------------------------------- | -------------- | ------------------ |
| Phase 1: Core Infrastructure    | 🟡 In Progress | 2/4 tasks complete |
| Phase 2: Test Logic Integration | ⬜ Not Started | 0/3 tasks complete |
| Phase 3: UI Cleanup             | ⬜ Not Started | 0/3 tasks complete |
| Phase 4: Polish & Testing       | ⬜ Not Started | 0/3 tasks complete |

**Last Updated**: 2026-01-04

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
  averages: Record<string, AverageEntry>;
  tags: Record<string, TagData>;
}

interface AverageEntry {
  wpm: number;
  acc: number;
  count: number;
}

interface TagData {
  name: string;
  stats: {
    time?: number;
    tests?: number;
    wpm10?: number;
    wpm60?: number;
  };
}
```

### Storage Keys

- `mt_settings` - User configuration (themes, sounds, fonts, test modes)
- `mt_history` - Typing test history (max 500 entries)
- `mt_personal_best` - Personal best WPM records by mode
- `mt_averages` - Rolling averages for different mode combinations
- `mt_tags` - Custom tags and their statistics
- `mt_version` - Storage schema version for migration

### localStorage Manager

The `localStorage-manager` package provides:

- JSON serialization/deserialization
- Storage quota management (~5-10MB limit)
- Migration support (for schema changes)
- Optional encryption support

## API Routing

### Strategy: Stub Pattern

Replace `Ape` API client with a stub that:

1. Returns mock data for read operations
2. Performs no-op for write operations
3. Throws errors for unsupported features

### Implementation: Create `frontend/src/ts/ape/index.ts`

```typescript
/**
 * @deprecated API client removed in privacy fork
 * All functionality moved to localStorage
 */
export default {
  results: {
    add: async () => ({ status: 200, body: { data: { insertedId: null } } }),
    get: async () => ({ status: 200, body: { data: [] } }),
    updateTags: async () => ({
      status: 200,
      body: { data: { success: true } },
    }),
  },
  users: {
    getProfile: async () => ({
      status: 404,
      body: { message: "Not available" },
    }),
    updateProfile: async () => ({
      status: 200,
      body: { data: { success: true } },
    }),
    // All other user methods: no-op
  },
  leaderboards: {
    get: async () => ({ status: 200, body: { data: [] } }),
    getRank: async () => ({ status: 200, body: { data: { rank: null } } }),
  },
  // All other endpoints: return 404 or mock data
};
```

### Firebase Stub Strategy

Modify `frontend/src/ts/firebase.ts`:

```typescript
/**
 * @deprecated Authentication removed in privacy fork
 * Always returns false/guest state
 */
export function isAuthenticated(): boolean {
  return false;
}

export function getAuthenticatedUser(): null {
  return null;
}

export function signOut(): Promise<void> {
  return Promise.resolve();
}

export const authPromise = Promise.resolve();
export const isAuthAvailable = (): boolean => false;
```

### API Endpoint Mapping

| Original Endpoint   | Local Handling                     |
| ------------------- | ---------------------------------- |
| `Ape.results.add()` | Call `storageManager.addResult()`  |
| `Ape.results.get()` | Call `storageManager.getHistory()` |
| Authentication APIs | Always return false/guest          |
| User profile APIs   | Return mock data (guest mode)      |
| Leaderboard APIs    | Return empty data                  |
| All other endpoints | No-op or return 404                |

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

#### Elements to Hide

| UI Element            | Location                                     | Method             |
| --------------------- | -------------------------------------------- | ------------------ |
| Login button          | `frontend/src/ts/elements/account-button.ts` | Add `hidden` class |
| Signup button         | `#pageLogin` or login modal                  | Add `hidden` class |
| User profile dropdown | Header navigation                            | Replace with guest |
| Leaderboard link      | `frontend/src/ts/pages/leaderboards.ts`      | Show empty state   |
| Challenge features    | Various modals                               | Add `hidden` class |
| XP bar                | `frontend/src/ts/elements/xp-bar.ts`         | Hide element       |
| Streak display        | Various locations                            | Hide element       |

#### CSS Selector Updates

Add to `frontend/src/html/style.css`:

```css
/* Hide authentication-related elements */
.pageLogin,
.pageSignup,
#top #menu .account .profile-menu,
.leaderboard-link,
.challenge-link {
  display: none !important;
}

/* Hide guest-only features in privacy mode */
.xp-bar,
.streak-display,
.daily-leaderboard {
  display: none !important;
}
```

#### Navigation Changes

**File: `frontend/src/ts/commandline/lists/navigation.ts`**

```typescript
// Remove profile and leaderboard commands
export function getNavCommands(): Command[] {
  return [
    // Remove: navigate("/account")
    // Remove: navigate("/leaderboard")
    // Keep: navigate("/test"), navigate("/settings")
  ];
}
```

#### Settings Page Modifications

**File: `frontend/src/ts/pages/settings.ts`**

```typescript
// Hide account section when not authenticated
export function update(): void {
  if (!isAuthenticated()) {
    $(".section.account").addClass("hidden");
    return;
  }
  // Original code for authenticated users
}
```

## Error Handling

### localStorage Errors

#### Quota Exceeded Handling

**File: `packages/local-storage-manager/src/index.ts`**

```typescript
public addResult(result: TypedResult): void {
  const history = this.getHistory();

  // If quota exceeded, remove oldest 20% of entries
  if (history.length >= MAX_HISTORY_SIZE) {
    const removeCount = Math.floor(MAX_HISTORY_SIZE * 0.2);
    history.splice(0, removeCount);
  }

  try {
    history.push(result);
    this.setHistory(history);
  } catch (error) {
    if (isStorageError(error) && error.code === "QUOTA_EXCEEDED") {
      // Emergency cleanup: remove half of history
      const emergencyRemove = Math.floor(history.length * 0.5);
      history.splice(0, emergencyRemove);
      this.setHistory(history);
      this.addResult(result); // Retry
    } else {
      throw error;
    }
  }
}
```

#### Storage Unavailable Fallback

```typescript
class LocalStorageManager {
  private storageAvailable: boolean = true;

  constructor() {
    // Test localStorage availability
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
    } catch {
      this.storageAvailable = false;
      console.warn("localStorage unavailable, using in-memory fallback");
    }
  }

  public get(key: string): string | null {
    if (!this.storageAvailable) {
      return this.inMemoryStorage.get(key) ?? null;
    }
    return localStorage.getItem(key);
  }

  private inMemoryStorage: Map<string, string> = new Map();
}
```

### Network Errors

All API calls are now local, so network errors are not expected. However, handle static resource failures:

**File: `frontend/src/ts/utils/json-data.ts`**

```typescript
export async function getLanguage(language: string): Promise<Language | null> {
  try {
    const response = await fetch(`static/languages/${language}.json`);
    if (!response.ok) throw new Error("Language pack not found");
    return await response.json();
  } catch (error) {
    console.error(`Failed to load language ${language}:`, error);
    // Fallback to English
    return await getLanguage("english");
  }
}
```

### User Notifications

**File: `frontend/src/ts/elements/notifications.ts`**

```typescript
export function showStorageWarning(): void {
  if (!isStorageAvailable()) {
    Notifications.add(
      "Storage unavailable - data will be lost on page refresh",
      -1,
      { duration: 0, important: true, customTitle: "Warning" },
    );
  }
}
```

## Testing Strategy

### Unit Tests

#### Local Storage Manager

**File: `packages/local-storage-manager/__tests__/index.test.ts`**

```typescript
import { describe, it, expect } from "vitest";
import storageManager from "../src/index";

describe("LocalStorageManager", () => {
  beforeEach(() => {
    localStorage.clear();
    storageManager.clear();
  });

  it("should save and retrieve history", () => {
    const result = {
      id: "1",
      wpm: 80,
      acc: 95,
      mode: "time",
      mode2: "60",
      timestamp: Date.now(),
      testDuration: 60,
      characters: 400,
      consistency: 90,
      rawWpm: 82,
    };

    storageManager.addResult(result);
    const history = storageManager.getHistory();

    expect(history).toHaveLength(1);
    expect(history[0].wpm).toBe(80);
  });

  it("should update personal best", () => {
    const key = "time_60_false_false_english_normal_false";
    storageManager.updatePersonalBest(key, 80);
    storageManager.updatePersonalBest(key, 90);

    const pb = storageManager.getPersonalBest();
    expect(pb[key]).toBe(90);
  });

  it("should calculate rolling averages", () => {
    const key = "time_60_false_false_english_normal";
    storageManager.updateAverage(key, 80, 95, 1);
    storageManager.updateAverage(key, 90, 96, 1);

    const averages = storageManager.getAverages();
    expect(averages[key]?.wpm).toBe(85);
    expect(averages[key]?.acc).toBe(96);
  });

  it("should handle quota exceeded error", () => {
    // Fill localStorage to near capacity
    for (let i = 0; i < 1000; i++) {
      storageManager.addResult({
        id: `${i}`,
        wpm: 80,
        acc: 95,
        mode: "time",
        mode2: "60",
        timestamp: Date.now(),
        testDuration: 60,
        characters: 400,
        consistency: 90,
        rawWpm: 82,
      });
    }

    // Should not throw, should automatically clean old entries
    const history = storageManager.getHistory();
    expect(history.length).toBeLessThanOrEqual(500); // MAX_HISTORY_SIZE
  });
});
```

#### API Stub Tests

```typescript
describe("Ape Stub", () => {
  it("should return mock response for results.add", async () => {
    const response = await Ape.results.add({
      body: { result: mockCompletedEvent },
    });

    expect(response.status).toBe(200);
    expect(response.body.data.insertedId).toBeNull();
  });

  it("should return empty data for leaderboards", async () => {
    const response = await Ape.leaderboards.get({
      params: { mode: "time", mode2: "60" },
    });

    expect(response.body.data).toEqual([]);
  });
});
```

### Integration Tests

#### Test Logic

```typescript
describe("Test Logic with localStorage", () => {
  it("should save result to localStorage on test complete", async () => {
    await TestLogic.finish();

    const history = storageManager.getHistory();
    expect(history).toHaveLength(1);
    expect(history[0]).toBeDefined();
  });

  it("should update personal best when beating previous", async () => {
    // Complete test with WPM 90
    const completedEvent = buildCompletedEvent(stats, rawPerSecond);
    completedEvent.wpm = 90;

    await TestLogic.saveResult(completedEvent, false);

    const pb = await DB.getLocalPB(
      "time",
      "60",
      false,
      false,
      "english",
      "normal",
      false,
      [],
    );

    expect(pb).toBe(90);
  });
});
```

### E2E Tests

#### Complete User Flow

**File: `frontend/__tests__/e2e/privacy-mode.test.ts`**

```typescript
import { describe, it, expect } from "vitest";

describe("Privacy Fork E2E", () => {
  it("should allow guest to configure settings", () => {
    navigate("/settings");
    setConfigValue("theme", "serika");
    expect(localStorage.getItem("mt_settings")).toContain("serika");
  });

  it("should complete typing test as guest", async () => {
    navigate("/test");
    configureTest({ mode: "time", mode2: "15" });
    startTest();

    // Type test text
    await typeWords(testWords);

    expect(isTestComplete()).toBe(true);
    expect(storageManager.getHistory()).toHaveLength(1);
  });

  it("should hide authentication elements", () => {
    navigate("/test");
    expect($("login-button").hasClass("hidden")).toBe(true);
    expect($("signup-button").hasClass("hidden")).toBe(true);
  });

  it("should show empty state for leaderboard", () => {
    navigate("/leaderboard");
    expect($(".empty-state").isVisible()).toBe(true);
    expect($(".leaderboard-entries").children()).toHaveLength(0);
  });

  it("should persist data across page refresh", async () => {
    navigate("/test");
    completeTest();

    const history1 = storageManager.getHistory();
    page.reload();

    const history2 = storageManager.getHistory();
    expect(history1).toEqual(history2);
  });
});
```

### Manual Testing Checklist

- [ ] Complete typing test with WPM 50-100
- [ ] Verify result appears in history
- [ ] Check personal best is updated
- [ ] Verify average is calculated correctly
- [ ] Change settings (theme, sound, mode)
- [ ] Refresh page and verify settings persist
- [ ] Check login/signup buttons are hidden
- [ ] Verify leaderboard shows empty state
- [ ] Test quota handling (fill history to 500 entries)
- [ ] Test with localStorage disabled (in private mode)
- [ ] Export/import data functionality
- [ ] Clear data functionality

## License Compliance (GPL-3.0)

1. Keep original license file
2. Add modification notices to all modified files
3. Add fork information and modifications to README.md
4. Maintain copyright notices and GPL-3.0 license display

## Implementation Priority

### Phase 1: Core Infrastructure (Required for functionality)

1. **Create local-storage-manager package** ✅
   - Implement storage abstraction
   - Add data serialization
   - Add error handling

2. **Create Ape stub** ⬜
   - Replace all API calls with no-ops
   - Ensure no runtime errors
   - Type-safe responses

3. **Create Firebase stub** ⬜
   - Make `isAuthenticated()` always return `false`
   - Make `getAuthenticatedUser()` return `null`
   - Remove auth initialization code

4. **Update DB stub** ✅
   - Implement `getUserAverage10()` using localStorage
   - Implement `getLocalPB()` using localStorage

### Phase 2: Test Logic Integration (Core feature)

5. **Modify test-logic.ts** ⬜
   - Replace `Ape.results.add()` with `storageManager.addResult()`
   - Update PB checking logic
   - Update average calculation logic
   - Remove backend error handling

6. **Update result display** ⬜
   - Modify `test/result.ts` to use local data
   - Remove XP/streak/daily leaderboard display

### Phase 3: UI Cleanup (Visual polish)

7. **Hide authentication elements** ⬜
   - Hide login/signup buttons
   - Hide account dropdown
   - Hide profile page

8. **Disable backend features** ⬜
   - Hide leaderboard
   - Hide challenges
   - Hide social features

9. **Update navigation** ⬜
   - Remove account/leaderboard from commandline
   - Update route controller

### Phase 4: Polish & Testing (Quality assurance)

10. **Add error handling** ⬜
    - Storage quota errors
    - localStorage unavailable fallback
    - User notifications

11. **Write tests** ⬜
    - Unit tests for storage manager
    - Integration tests for test flow
    - E2E tests for key features

12. **Update documentation** ⬜
    - README with privacy fork info
    - Update package.json description
    - Add modification notices

## Implementation Checklist

### Phase 1: Core Infrastructure

- [x] Create `packages/local-storage-manager`
  - [x] Storage abstraction layer
  - [x] Data serialization/deserialization
  - [x] History management (max 500 entries)
  - [x] Personal best tracking
  - [x] Average calculation
  - [x] Error handling (quota, unavailable)
- [ ] Create Ape API stub
  - [ ] Replace all Ape methods with no-ops
  - [ ] Ensure type-safe responses
  - [ ] Handle all 73+ API call sites
- [ ] Create Firebase stub
  - [ ] Update `isAuthenticated()` to return `false`
  - [ ] Update `getAuthenticatedUser()` to return `null`
  - [ ] Remove auth initialization
  - [ ] Remove Firebase SDK imports
- [x] Update DB stub
  - [x] Implement `getUserAverage10()`
  - [x] Implement `getLocalPB()`
  - [ ] Update stub for all 90+ callsites

### Phase 2: Test Logic Integration

- [ ] Modify `test-logic.ts`
  - [ ] Replace `Ape.results.add()` with `storageManager.addResult()`
  - [ ] Remove `AccountButton.loading()`
  - [ ] Remove `ConnectionState.get()`
  - [ ] Update PB checking with localStorage
  - [ ] Update average calculation
  - [ ] Remove retry saving logic
- [ ] Update `test/result.ts`
  - [ ] Remove XP bar display
  - [ ] Remove streak display
  - [ ] Remove daily leaderboard
  - [ ] Update quote favorites handling
- [ ] Update `utils/results.ts`
  - [ ] Remove `Ape.results.add()`
  - [ ] Update export functionality

### Phase 3: UI Cleanup

- [ ] Hide authentication elements
  - [ ] Hide login button (`account-button.ts`)
  - [ ] Hide signup button
  - [ ] Hide account dropdown
  - [ ] Hide profile page
  - [ ] Hide forgot password modal
- [ ] Disable backend features
  - [ ] Hide leaderboard page
  - [ ] Hide challenge features
  - [ ] Hide friends page
  - [ ] Hide Discord integration
- [ ] Update navigation
  - [ ] Remove from commandline (`navigation.ts`)
  - [ ] Remove from route controller
  - [ ] Update footer links
- [ ] Update settings
  - [ ] Hide account section for guests
  - [ ] Disable premium features
  - [ ] Remove API key settings

### Phase 4: Polish & Testing

- [ ] Add error handling
  - [ ] Storage quota exceeded cleanup
  - [ ] localStorage unavailable fallback
  - [ ] User notifications for storage issues
  - [ ] Static resource failure handling
- [ ] Write tests
  - [ ] localStorage-manager unit tests
  - [ ] Ape stub tests
  - [ ] Integration tests for test flow
  - [ ] E2E tests for key features
- [ ] Update documentation
  - [ ] Add fork info to README
  - [ ] Update package.json description
  - [ ] Add modification notices to files
  - [ ] Update privacy policy
- [ ] Run full test suite
  - [ ] `npm run test`
  - [ ] `npm run lint`
  - [ ] `npm run build`

### Branch & Release

- [x] Create `privacy-fork` branch
- [ ] Create PR (if contributing upstream)
- [ ] Tag release (v1.0.0-privacy)
- [ ] Create release notes

## Additional Resources

### Key Files to Modify

| File Path                                    | Changes Required                    |
| -------------------------------------------- | ----------------------------------- |
| `frontend/src/ts/test/test-logic.ts`         | Replace Ape calls with localStorage |
| `frontend/src/ts/test/result.ts`             | Hide XP, streak, leaderboard        |
| `frontend/src/ts/ape/index.ts`               | Create stub (new file)              |
| `frontend/src/ts/firebase.ts`                | Already stubbed, verify all usages  |
| `frontend/src/ts/db.ts`                      | Already partially stubbed           |
| `frontend/src/ts/pages/leaderboards.ts`      | Show empty state                    |
| `frontend/src/ts/commandline/lists.ts`       | Remove auth/leaderboard commands    |
| `frontend/src/ts/elements/account-button.ts` | Hide login/signup                   |

### File Count by API Usage

| API Category     | Approx. Files Affected | Priority |
| ---------------- | ---------------------- | -------- |
| Authentication   | 15+                    | High     |
| Results          | 5                      | High     |
| User Profile     | 10+                    | Medium   |
| Leaderboards     | 3                      | Medium   |
| Quotes           | 5                      | Low      |
| Social (friends) | 4                      | Low      |

### Testing Commands

```bash
# Run all tests
npm run test

# Run frontend tests only
cd frontend && npm run test

# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build

# E2E tests (if configured)
npm run e2e
```

### Known Limitations

1. **Storage Limit**: localStorage limited to ~5-10MB
   - Mitigation: Automatic cleanup when quota exceeded
   - Warning shown when nearing limit

2. **No Synchronization**: Data only on single device
   - User must manually export/import for backup
   - No cross-device data sharing

3. **No Collaboration**: Leaderboard disabled
   - No competitive features
   - Solo experience only

4. **Quote Management**: No user submissions
   - Only built-in quotes available
   - No rating/reporting system

### Future Enhancements (Post-v1.0)

- [ ] Import/export data to/from JSON file
- [ ] Optional browser storage extension (for larger quota)
- [ ] Local quote management system
- [ ] Basic statistics dashboard
- [ ] Custom theme sharing (via JSON import/export)

## Troubleshooting

### Common Issues & Solutions

#### Issue: "Ape is not defined" error

**Cause**: Ape stub not created or not imported correctly

**Solution**:

```bash
# Create Ape stub
touch frontend/src/ts/ape/index.ts
# Add stub code (see Implementation above)
```

#### Issue: `isAuthenticated()` returns `true` after stub

**Cause**: Firebase initialization code still running

**Solution**: Check `frontend/src/ts/firebase.ts` and ensure:

```typescript
export function isAuthenticated(): boolean {
  return false; // Always false in privacy mode
}
```

#### Issue: Results not saving to localStorage

**Cause**: `test-logic.ts` still calling `Ape.results.add()`

**Solution**:

1. Find all `Ape.results.add()` calls
2. Replace with `storageManager.addResult()`
3. Update related logic (PB, averages)

#### Issue: Personal best not updating

**Cause**: `getLocalPB()` not using localStorage correctly

**Solution**: Check `frontend/src/ts/db.ts`:

```typescript
export async function getLocalPB(...): Promise<number | null> {
  return storageManager.getPersonalBest()?.[key] ?? null;
}
```

#### Issue: TypeScript errors after changes

**Cause**: Type mismatches in stub implementations

**Solution**: Ensure stub responses match expected types:

```typescript
// Ape.results.add() expects this response
interface AddResultResponse {
  status: 200;
  body: {
    data: {
      insertedId: string | null;
      xp?: number;
      streak?: number;
      isPb?: boolean;
    };
  };
}
```

#### Issue: Build fails with module not found

**Cause**: local-storage-manager not built

**Solution**:

```bash
cd packages/local-storage-manager
npm run build
cd ../..
npm run build
```

### Debug Mode

Enable debug logging in localStorage-manager:

```typescript
class LocalStorageManager {
  private debug = false; // Set to true for debugging

  public get(key: string): string | null {
    if (this.debug) console.log(`Get: ${key}`);
    return localStorage.getItem(key);
  }
}
```

### Data Recovery

If data is accidentally lost:

1. Check browser developer tools → Application → Local Storage
2. Export keys: `mt_history`, `mt_personal_best`, `mt_averages`
3. Import into clean browser session

---

**Document Version**: 2.0
**Last Updated**: 2026-01-04
**Maintainer**: Privacy Fork Team
