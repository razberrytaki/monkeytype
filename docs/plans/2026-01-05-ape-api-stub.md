# Ape API Stub Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create complete Ape API stub with 48 methods across 12 categories, replacing all backend calls with localStorage, no-ops, or hidden functionality.

**Architecture:** Create comprehensive stub in `frontend/src/ts/ape/index.ts` that intercepts all 48 API method calls. Use categorized strategy: localStorage for data persistence (results, tags, presets), no-op with mock data for optional features, and hide for admin/social features. Add environment-aware logging for development.

**Tech Stack:** TypeScript, localStorage API, Vitest testing framework

---

## Task 1: Create Ape Stub File Structure

**Files:**

- Create: `frontend/src/ts/ape/index.ts`

**Step 1: Import dependencies and storage manager**

```typescript
import storageManager from "@local-storage-manager/local-storage-manager";

function logApiCall(method: string): void {
  if (import.meta.env.DEV) {
    console.warn(
      `[Privacy Fork] Ape.${method} called - using localStorage/no-op`,
    );
  }
}
```

**Step 2: Create mock response helper**

```typescript
function createSuccessResponse<T>(data: T, message = "Success") {
  return {
    status: 200,
    body: {
      message,
      data,
    },
  };
}
```

**Step 3: Create mock error helper**

```typescript
function createErrorResponse(statusCode: number, message: string) {
  return {
    status: statusCode,
    body: {
      message,
      data: null,
    },
  };
}
```

**Step 4: Commit**

```bash
git add frontend/src/ts/ape/index.ts
git commit -m "feat: create Ape API stub file structure with helper functions"
```

---

## Task 2: Implement Results API (Critical - 2 methods)

**Files:**

- Modify: `frontend/src/ts/ape/index.ts`

**Step 1: Add Results API stub**

```typescript
export const Ape = {
  results: {
    add: async (params: { body: { result: any } }) => {
      logApiCall("results.add");
      storageManager.addResult(params.body.result);
      return createSuccessResponse({
        insertedId: null,
        xp: 0,
        streak: 0,
        isPb: false,
      });
    },

    updateTags: async (params: { body: { tags: string[] } }) => {
      logApiCall("results.updateTags");
      // Tags are already stored by storageManager
      const tags = storageManager.getTags();
      const tagPbs = Object.entries(tags).map(([name, tag]) => ({
        tag: name,
        wpm: tag.stats?.wpm60 ?? 0,
        acc: 95,
      }));
      return createSuccessResponse({ tagPbs });
    },
  },
};
```

**Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add frontend/src/ts/ape/index.ts
git commit -m "feat: implement Results API stub (add, updateTags)"
```

---

## Task 3: Implement Users - Profile API (19 methods)

**Files:**

- Modify: `frontend/src/ts/ape/index.ts`

**Step 1: Add Profile methods**

```typescript
export const Ape = {
  // ... existing results API ...

  users: {
    getNameAvailability: async () => {
      logApiCall("users.getNameAvailability");
      return createSuccessResponse({ available: true });
    },

    getProfile: async (params: { params?: { uid?: string } }) => {
      logApiCall("users.getProfile");
      return createSuccessResponse({
        name: "Guest",
        bio: "",
        joined: Date.now(),
        badges: [],
        personalBests: storageManager.getPersonalBest() ?? {},
        uid: params?.params?.uid ?? "guest",
      });
    },

    updateProfile: async () => {
      logApiCall("users.updateProfile");
      // Optimistic update - already handled by UI
      return createSuccessResponse({ success: true });
    },

    create: async () => {
      logApiCall("users.create");
      return createSuccessResponse({ uid: "guest" });
    },

    updateName: async () => {
      logApiCall("users.updateName");
      return createSuccessResponse({ success: true });
    },

    updateEmail: async () => {
      logApiCall("users.updateEmail");
      return createSuccessResponse({ success: true });
    },

    updatePassword: async () => {
      logApiCall("users.updatePassword");
      return createSuccessResponse({ success: true });
    },

    delete: async () => {
      logApiCall("users.delete");
      return createSuccessResponse({ success: true });
    },

    reset: async () => {
      logApiCall("users.reset");
      return createSuccessResponse({ success: true });
    },

    forgotPasswordEmail: async () => {
      logApiCall("users.forgotPasswordEmail");
      return createSuccessResponse({ success: true });
    },

    linkDiscord: async () => {
      logApiCall("users.linkDiscord");
      return createSuccessResponse({ success: true });
    },

    unlinkDiscord: async () => {
      logApiCall("users.unlinkDiscord");
      return createSuccessResponse({ success: true });
    },

    getInbox: async () => {
      logApiCall("users.getInbox");
      return createSuccessResponse({
        inbox: [],
        maxMail: 0,
      });
    },

    updateInbox: async () => {
      logApiCall("users.updateInbox");
      return createSuccessResponse({ success: true });
    },

    report: async () => {
      logApiCall("users.report");
      return createSuccessResponse({ success: true });
    },

    optOutOfLeaderboards: async () => {
      logApiCall("users.optOutOfLeaderboards");
      return createSuccessResponse({ success: true });
    },

    deletePersonalBests: async () => {
      logApiCall("users.deletePersonalBests");
      storageManager.setPersonalBest({});
      return createSuccessResponse({ success: true });
    },

    setStreakHourOffset: async () => {
      logApiCall("users.setStreakHourOffset");
      return createSuccessResponse({ success: true });
    },
  },
};
```

**Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add frontend/src/ts/ape/index.ts
git commit -m "feat: implement Users Profile API stub (19 methods)"
```

---

## Task 4: Implement Users - Quotes API (2 methods)

**Files:**

- Modify: `frontend/src/ts/ape/index.ts`

**Step 1: Add Quote favorite methods to users object**

```typescript
// Inside the users object:

addQuoteToFavorites: async (params: { body: { quoteId: string } }) => {
  logApiCall("users.addQuoteToFavorites");
  const favorites = JSON.parse(localStorage.getItem("mt_favorites") || "[]");
  if (!favorites.includes(params.body.quoteId)) {
    favorites.push(params.body.quoteId);
    localStorage.setItem("mt_favorites", JSON.stringify(favorites));
  }
  return createSuccessResponse({ success: true });
},

removeQuoteFromFavorites: async (params: { body: { quoteId: string } }) => {
  logApiCall("users.removeQuoteFromFavorites");
  const favorites = JSON.parse(localStorage.getItem("mt_favorites") || "[]");
  const filtered = favorites.filter((id: string) => id !== params.body.quoteId);
  localStorage.setItem("mt_favorites", JSON.stringify(filtered));
  return createSuccessResponse({ success: true });
},
```

**Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add frontend/src/ts/ape/index.ts
git commit -m "feat: implement Users Quotes API stub (add/remove favorites)"
```

---

## Task 5: Implement Users - Tags API (4 methods)

**Files:**

- Modify: `frontend/src/ts/ape/index.ts`

**Step 1: Add Tag CRUD methods to users object**

```typescript
// Inside the users object:

createTag: async (params: { body: { name: string } }) => {
  logApiCall("users.createTag");
  const tags = storageManager.getTags() ?? {};
  if (tags[params.body.name]) {
    return createErrorResponse(400, "Tag already exists");
  }
  tags[params.body.name] = { name: params.body.name, stats: {} };
  storageManager.setTags(tags);
  return createSuccessResponse({ success: true });
},

editTag: async (params: { params: { tag: string }; body: { newName: string } }) => {
  logApiCall("users.editTag");
  const tags = storageManager.getTags() ?? {};
  if (!tags[params.params.tag]) {
    return createErrorResponse(404, "Tag not found");
  }
  const oldTag = tags[params.params.tag];
  delete tags[params.params.tag];
  tags[params.body.newName] = { ...oldTag, name: params.body.newName };
  storageManager.setTags(tags);
  return createSuccessResponse({ success: true });
},

deleteTag: async (params: { params: { tag: string } }) => {
  logApiCall("users.deleteTag");
  const tags = storageManager.getTags() ?? {};
  delete tags[params.params.tag];
  storageManager.setTags(tags);
  return createSuccessResponse({ success: true });
},

deleteTagPersonalBest: async (params: { params: { tag: string } }) => {
  logApiCall("users.deleteTagPersonalBest");
  const tags = storageManager.getTags() ?? {};
  if (tags[params.params.tag]) {
    tags[params.params.tag].stats = {};
    storageManager.setTags(tags);
  }
  return createSuccessResponse({ success: true });
},
```

**Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add frontend/src/ts/ape/index.ts
git commit -m "feat: implement Users Tags API stub (4 methods)"
```

---

## Task 6: Implement Quotes API (8 methods)

**Files:**

- Modify: `frontend/src/ts/ape/index.ts`

**Step 1: Add Quotes API stub**

```typescript
export const Ape = {
  // ... existing APIs ...

  quotes: {
    get: async () => {
      logApiCall("quotes.get");
      // Return empty - quote submission/admin hidden
      return createSuccessResponse([]);
    },

    add: async () => {
      logApiCall("quotes.add");
      // No-op - submission hidden
      return createSuccessResponse({ success: true });
    },

    approveSubmission: async () => {
      logApiCall("quotes.approveSubmission");
      return createSuccessResponse({ success: true });
    },

    rejectSubmission: async () => {
      logApiCall("quotes.rejectSubmission");
      return createSuccessResponse({ success: true });
    },

    isSubmissionEnabled: async () => {
      logApiCall("quotes.isSubmissionEnabled");
      return createSuccessResponse({ enabled: false });
    },

    report: async () => {
      logApiCall("quotes.report");
      return createSuccessResponse({ success: true });
    },

    getRating: async () => {
      logApiCall("quotes.getRating");
      return createSuccessResponse({ rating: 0, count: 0 });
    },

    addRating: async (params: {
      body: { quoteId: string; rating: number };
    }) => {
      logApiCall("quotes.addRating");
      const ratings = JSON.parse(
        localStorage.getItem("mt_quote_ratings") || "{}",
      );
      ratings[params.body.quoteId] = params.body.rating;
      localStorage.setItem("mt_quote_ratings", JSON.stringify(ratings));
      return createSuccessResponse({ success: true });
    },
  },
};
```

**Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add frontend/src/ts/ape/index.ts
git commit -m "feat: implement Quotes API stub (8 methods)"
```

---

## Task 7: Implement Presets API (3 methods)

**Files:**

- Modify: `frontend/src/ts/ape/index.ts`

**Step 1: Add Presets API stub**

```typescript
export const Ape = {
  // ... existing APIs ...

  presets: {
    add: async (params: { body: { name: string; config: any } }) => {
      logApiCall("presets.add");
      const presets = JSON.parse(localStorage.getItem("mt_presets") || "{}");
      presets[params.body.name] = params.body.config;
      localStorage.setItem("mt_presets", JSON.stringify(presets));
      return createSuccessResponse({ success: true });
    },

    save: async (params: { body: { name: string; config: any } }) => {
      logApiCall("presets.save");
      const presets = JSON.parse(localStorage.getItem("mt_presets") || "{}");
      presets[params.body.name] = params.body.config;
      localStorage.setItem("mt_presets", JSON.stringify(presets));
      return createSuccessResponse({ success: true });
    },

    delete: async (params: { body: { name: string } }) => {
      logApiCall("presets.delete");
      const presets = JSON.parse(localStorage.getItem("mt_presets") || "{}");
      delete presets[params.body.name];
      localStorage.setItem("mt_presets", JSON.stringify(presets));
      return createSuccessResponse({ success: true });
    },
  },
};
```

**Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add frontend/src/ts/ape/index.ts
git commit -m "feat: implement Presets API stub (3 methods)"
```

---

## Task 8: Implement Result Filters API (2 methods)

**Files:**

- Modify: `frontend/src/ts/ape/index.ts`

**Step 1: Add Result Filter methods to users object**

```typescript
// Inside the users object:

addResultFilterPreset: async (params: { body: { name: string; filter: any } }) => {
  logApiCall("users.addResultFilterPreset");
  const filters = JSON.parse(localStorage.getItem("mt_result_filters") || "{}");
  filters[params.body.name] = params.body.filter;
  localStorage.setItem("mt_result_filters", JSON.stringify(filters));
  return createSuccessResponse({ success: true });
},

removeResultFilterPreset: async (params: { body: { name: string } }) => {
  logApiCall("users.removeResultFilterPreset");
  const filters = JSON.parse(localStorage.getItem("mt_result_filters") || "{}");
  delete filters[params.body.name];
  localStorage.setItem("mt_result_filters", JSON.stringify(filters));
  return createSuccessResponse({ success: true });
},
```

**Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add frontend/src/ts/ape/index.ts
git commit -m "feat: implement Result Filters API stub (2 methods)"
```

---

## Task 9: Implement Connections API (4 methods)

**Files:**

- Modify: `frontend/src/ts/ape/index.ts`

**Step 1: Add Connections API stub**

```typescript
export const Ape = {
  // ... existing APIs ...

  connections: {
    get: async (params?: { params?: { type: string } }) => {
      logApiCall("connections.get");
      // Return empty - social features hidden
      if (params?.params?.type === "blocked") {
        return createSuccessResponse([]);
      }
      return createSuccessResponse([]);
    },

    delete: async () => {
      logApiCall("connections.delete");
      return createSuccessResponse({ success: true });
    },

    create: async () => {
      logApiCall("connections.create");
      return createSuccessResponse({ success: true });
    },

    update: async () => {
      logApiCall("connections.update");
      return createSuccessResponse({ success: true });
    },
  },
};
```

**Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add frontend/src/ts/ape/index.ts
git commit -m "feat: implement Connections API stub (4 methods)"
```

---

## Task 10: Implement Leaderboards API (5 methods)

**Files:**

- Modify: `frontend/src/ts/ape/index.ts`

**Step 1: Add Leaderboards API stub**

```typescript
export const Ape = {
  // ... existing APIs ...

  leaderboards: {
    get: async () => {
      logApiCall("leaderboards.get");
      // Return empty - leaderboard hidden
      return createSuccessResponse([]);
    },

    getDaily: async () => {
      logApiCall("leaderboards.getDaily");
      return createSuccessResponse([]);
    },

    getDailyRank: async () => {
      logApiCall("leaderboards.getDailyRank");
      return createSuccessResponse({ rank: null });
    },

    getWeeklyXp: async () => {
      logApiCall("leaderboards.getWeeklyXp");
      return createSuccessResponse([]);
    },

    getRank: async () => {
      logApiCall("leaderboards.getRank");
      return createSuccessResponse({ rank: null });
    },
  },
};
```

**Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add frontend/src/ts/ape/index.ts
git commit -m "feat: implement Leaderboards API stub (5 methods)"
```

---

## Task 11: Implement APE Keys API (4 methods)

**Files:**

- Modify: `frontend/src/ts/ape/index.ts`

**Step 1: Add APE Keys API stub**

```typescript
export const Ape = {
  // ... existing APIs ...

  apeKeys: {
    get: async () => {
      logApiCall("apeKeys.get");
      const keys = JSON.parse(localStorage.getItem("mt_ape_keys") || "[]");
      return createSuccessResponse(keys);
    },

    add: async (params: { body: { name: string; key: string } }) => {
      logApiCall("apeKeys.add");
      const keys = JSON.parse(localStorage.getItem("mt_ape_keys") || "[]");
      keys.push({ ...params.body, created: Date.now(), lastUsed: null });
      localStorage.setItem("mt_ape_keys", JSON.stringify(keys));
      return createSuccessResponse({ success: true });
    },

    save: async (params: {
      body: { name: string; key: string; useCount: number };
    }) => {
      logApiCall("apeKeys.save");
      const keys = JSON.parse(localStorage.getItem("mt_ape_keys") || "[]");
      const index = keys.findIndex((k: any) => k.name === params.body.name);
      if (index !== -1) {
        keys[index] = { ...keys[index], ...params.body, lastUsed: Date.now() };
      }
      localStorage.setItem("mt_ape_keys", JSON.stringify(keys));
      return createSuccessResponse({ success: true });
    },

    delete: async (params: { body: { name: string } }) => {
      logApiCall("apeKeys.delete");
      const keys = JSON.parse(localStorage.getItem("mt_ape_keys") || "[]");
      const filtered = keys.filter((k: any) => k.name !== params.body.name);
      localStorage.setItem("mt_ape_keys", JSON.stringify(filtered));
      return createSuccessResponse({ success: true });
    },
  },
};
```

**Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add frontend/src/ts/ape/index.ts
git commit -m "feat: implement APE Keys API stub (4 methods)"
```

---

## Task 12: Implement Public API (2 methods)

**Files:**

- Modify: `frontend/src/ts/ape/index.ts`

**Step 1: Add Public API stub**

```typescript
export const Ape = {
  // ... existing APIs ...

  public: {
    getSpeedHistogram: async () => {
      logApiCall("public.getSpeedHistogram");
      // Return empty or static mock - public stats hidden
      return createSuccessResponse([]);
    },

    getTypingStats: async () => {
      logApiCall("public.getTypingStats");
      // Return empty - public stats hidden
      return createSuccessResponse({
        testsCompleted: 0,
        timeTyping: 0,
      });
    },
  },
};
```

**Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add frontend/src/ts/ape/index.ts
git commit -m "feat: implement Public API stub (2 methods)"
```

---

## Task 13: Implement PSAs API (1 method)

**Files:**

- Modify: `frontend/src/ts/ape/index.ts`

**Step 1: Add PSAs API stub**

```typescript
export const Ape = {
  // ... existing APIs ...

  psas: {
    get: async () => {
      logApiCall("psas.get");
      // Return empty - PSA banner hidden
      return createSuccessResponse([]);
    },
  },
};
```

**Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add frontend/src/ts/ape/index.ts
git commit -m "feat: implement PSAs API stub (1 method)"
```

---

## Task 14: Write Unit Tests for Ape Stub

**Files:**

- Create: `frontend/src/ts/ape/__tests__/index.test.ts`

**Step 1: Create test file with imports**

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { Ape } from "../index";
import storageManager from "@local-storage-manager/local-storage-manager";
```

**Step 2: Write test for Results.add**

```typescript
describe("Ape.results.add", () => {
  beforeEach(() => {
    localStorage.clear();
    storageManager.clear();
  });

  it("should save result and return success response", async () => {
    const mockResult = {
      id: "test-1",
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

    const response = await Ape.results.add({ body: { result: mockResult } });

    expect(response.status).toBe(200);
    expect(response.body.data.insertedId).toBeNull();
    expect(response.body.data.xp).toBe(0);
    expect(response.body.data.streak).toBe(0);
    expect(response.body.data.isPb).toBe(false);
  });
});
```

**Step 3: Run test**

Run: `cd frontend && npm test -- ape/__tests__/index.test.ts`
Expected: PASS

**Step 4: Write test for Users.getNameAvailability**

```typescript
describe("Ape.users.getNameAvailability", () => {
  it("should always return available", async () => {
    const response = await Ape.users.getNameAvailability({});

    expect(response.status).toBe(200);
    expect(response.body.data.available).toBe(true);
  });
});
```

**Step 5: Write test for Users.getInbox**

```typescript
describe("Ape.users.getInbox", () => {
  it("should return empty inbox", async () => {
    const response = await Ape.users.getInbox({});

    expect(response.status).toBe(200);
    expect(response.body.data.inbox).toEqual([]);
    expect(response.body.data.maxMail).toBe(0);
  });
});
```

**Step 6: Write test for Leaderboards.get**

```typescript
describe("Ape.leaderboards.get", () => {
  it("should return empty data", async () => {
    const response = await Ape.leaderboards.get({});

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
  });
});
```

**Step 7: Run all tests**

Run: `cd frontend && npm test -- ape/__tests__/index.test.ts`
Expected: All PASS

**Step 8: Commit**

```bash
git add frontend/src/ts/ape/__tests__/index.test.ts
git commit -m "test: add unit tests for Ape API stub"
```

---

## Task 15: Verify All API Methods Present

**Files:**

- Modify: `frontend/src/ts/ape/index.ts`

**Step 1: Verify all 48 methods are implemented**

Check that the following methods exist in the Ape object:

Results (2):

- results.add
- results.updateTags

Users - Profile (19):

- users.getNameAvailability
- users.getProfile
- users.updateProfile
- users.create
- users.updateName
- users.updateEmail
- users.updatePassword
- users.delete
- users.reset
- users.forgotPasswordEmail
- users.linkDiscord
- users.unlinkDiscord
- users.getInbox
- users.updateInbox
- users.report
- users.optOutOfLeaderboards
- users.deletePersonalBests
- users.setStreakHourOffset

Users - Quotes (2):

- users.addQuoteToFavorites
- users.removeQuoteFromFavorites

Users - Tags (4):

- users.createTag
- users.editTag
- users.deleteTag
- users.deleteTagPersonalBest

Users - Result Filters (2):

- users.addResultFilterPreset
- users.removeResultFilterPreset

Quotes (8):

- quotes.get
- quotes.add
- quotes.approveSubmission
- quotes.rejectSubmission
- quotes.isSubmissionEnabled
- quotes.report
- quotes.getRating
- quotes.addRating

Presets (3):

- presets.add
- presets.save
- presets.delete

Connections (4):

- connections.get
- connections.delete
- connections.create
- connections.update

Leaderboards (5):

- leaderboards.get
- leaderboards.getDaily
- leaderboards.getDailyRank
- leaderboards.getWeeklyXp
- leaderboards.getRank

APE Keys (4):

- apeKeys.get
- apeKeys.add
- apeKeys.save
- apeKeys.delete

Public (2):

- public.getSpeedHistogram
- public.getTypingStats

PSAs (1):

- psas.get

**Step 2: Run TypeScript check**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

**Step 3: Run tests**

Run: `cd frontend && npm test -- ape/__tests__/`
Expected: All PASS

**Step 4: Commit final verification**

```bash
git add frontend/src/ts/ape/
git commit -m "feat: complete Ape API stub with all 48 methods"
```

---

## Task 16: Update Design Document

**Files:**

- Modify: `docs/plans/2026-01-04-privacy-fork-design.md`

**Step 1: Update Phase 1 status**

Update the status table at the top of the document:

```markdown
| Phase                           | Status         | Progress           |
| ------------------------------- | -------------- | ------------------ |
| Phase 1: Core Infrastructure    | 🟢 Complete    | 4/4 tasks complete |
| Phase 2: Test Logic Integration | ⬜ Not Started | 0/3 tasks complete |
| Phase 3: UI Cleanup             | ⬜ Not Started | 0/3 tasks complete |
| Phase 4: Polish & Testing       | ⬜ Not Started | 0/3 tasks complete |
```

**Step 2: Update checklist**

Mark Phase 1 tasks as complete:

```markdown
- [x] Create Ape API stub (Critical - 48 methods, 27 files)
  - [x] Implement Results API stubs (2 methods)
    - [x] `Ape.results.add()` - localStorage + mock response
    - [x] `Ape.results.updateTags()` - localStorage + mock response
  - [x] Implement Users API stubs (19 methods)
    - [x] Profile: getProfile, updateProfile, updateName, updateEmail, updatePassword
    - [x] Auth: create, delete, reset, forgotPasswordEmail, getNameAvailability
    - [x] Social: linkDiscord, unlinkDiscord, report
    - [x] Inbox: getInbox, updateInbox
    - [x] Settings: optOutOfLeaderboards, deletePersonalBests, setStreakHourOffset
  - [x] Implement Quotes API stubs (8 methods)
    - [x] Admin: get, add, approveSubmission, rejectSubmission, isSubmissionEnabled, report, getRating
    - [x] User: addRating (localStorage)
  - [x] Implement Presets API stubs (3 methods)
    - [x] add, save, delete (localStorage)
  - [x] Implement Result Filters API stubs (2 methods)
    - [x] addResultFilterPreset, removeResultFilterPreset (localStorage)
  - [x] Implement Connections API stubs (4 methods)
    - [x] get (blocked), delete (unblock), create (friend request), update (accept/reject)
  - [x] Implement Leaderboards API stubs (5 methods)
    - [x] get, getDaily, getDailyRank, getWeeklyXp, getRank (no-op, return empty)
  - [x] Implement APE Keys API stubs (4 methods)
    - [x] get, add, save, delete (localStorage)
  - [x] Implement Public API stubs (2 methods)
    - [x] getSpeedHistogram, getTypingStats (hide or static mock)
  - [x] Implement PSAs API stub (1 method)
    - [x] get (hide)
  - [x] Ensure type-safe responses for all methods
  - [x] Add environment-aware logging (dev only)
```

**Step 3: Commit**

```bash
git add docs/plans/2026-01-04-privacy-fork-design.md
git commit -m "docs: update Phase 1 status to complete in design document"
```

---

## Summary

This plan implements all 48 Ape API methods across 12 categories:

- Results API (2 methods) - localStorage for test results
- Users Profile API (19 methods) - no-op with mock data
- Users Quotes API (2 methods) - localStorage for favorites
- Users Tags API (4 methods) - localStorage for tag management
- Users Result Filters (2 methods) - localStorage for filter presets
- Quotes API (8 methods) - hide/no-op for quote management
- Presets API (3 methods) - localStorage for test presets
- Connections API (4 methods) - no-op for social features
- Leaderboards API (5 methods) - no-op returning empty data
- APE Keys API (4 methods) - localStorage for API keys
- Public API (2 methods) - no-op for public statistics
- PSAs API (1 method) - hide for announcement banner

All methods include environment-aware logging in development mode and type-safe responses matching the original API contracts.
