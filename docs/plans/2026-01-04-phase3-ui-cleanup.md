# Phase 3: UI Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove all authentication, social, and backend-dependent UI elements from the privacy fork, hiding login/signup, leaderboards, and account features while maintaining core typing test functionality.

**Architecture:** CSS/SCSS-based hiding for legacy UI elements, navigation command removal for commandline access (filtering by ID), conditional rendering in settings page (already has hideAccountSection), and removal of authentication-related HTML/TS visibility.

**Tech Stack:** TypeScript, SCSS (not CSS), Vitest testing framework

---

## Task 1: Create Privacy Mode SCSS File

**Files:**

- Create: `frontend/src/styles/privacy-mode.scss`

**Step 1: Create SCSS file with hiding rules**

```scss
/* Hide authentication-related elements */
.pageLogin,
.pageSignup,
#top #menu .account .profile-menu,
.leaderboard-link,
.challenge-link,
.discord-link {
  @extend %hidden;
}

/* Hide guest-only features in privacy mode */
.xp-bar,
.streak-display,
.daily-leaderboard {
  @extend %hidden;
}

/* Hide account/leaderboard pages */
.pageProfile,
.pageAccount,
.pageLeaderboards,
.pageFriends,
.pageChallenge {
  @extend %hidden;
}
```

**Step 2: Commit**

```bash
git add frontend/src/styles/privacy-mode.scss
git commit -m "feat: add privacy mode SCSS with hiding rules"
```

---

## Task 2: Import Privacy Mode SCSS in Main Index

**Files:**

- Modify: `frontend/src/styles/index.scss`

**Step 1: Add import to index.scss**

Add import at the end of imports list (after "media-queries"):

```scss
@import "buttons", "fonts", "404", "ads", "about", "account", "animations",
  "banners", "caret", "commandline", "core", "footer", "inputs", "keymap",
  "login", "monkey", "nav", "notifications", "popups", "profile", "scroll",
  "settings", "account-settings", "leaderboards", "test", "loading", "friends",
  "media-queries", "privacy-mode";
```

**Step 2: Run TypeScript check**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add frontend/src/styles/index.scss
git commit -m "feat: import privacy mode SCSS"
```

---

## Task 3: Hide Login Button and Account Dropdown

**Files:**

- Modify: `frontend/src/ts/elements/account-button.ts`

**Step 1: Read account-button.ts structure**

Run: `cat frontend/src/ts/elements/account-button.ts`
Expected: See account button logic with hide/update functions

**Step 2: Update hide() function to always hide**

Replace existing `hide()` function (lines 17-20):

```typescript
export function hide(): void {
  accountButtonAndMenuEl.addClass("hidden");
  loginButtonEl.addClass("hidden");
  // Always hide in privacy mode
}
```

**Step 3: Update update() function to always show hidden state**

Add at start of update() function (after line 51):

```typescript
export function update(): void {
  // Privacy mode: always hide account button and menu
  accountButtonAndMenuEl.addClass("hidden");
  loginButtonEl.addClass("hidden");

  // Original update logic for authenticated state (now skipped)
  // No authentication in privacy fork
  return;
}
```

**Step 4: Run TypeScript check**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

**Step 5: Commit**

```bash
git add frontend/src/ts/elements/account-button.ts
git commit -m "feat: hide account button and dropdown in privacy mode"
```

---

## Task 4: Hide Profile Page

**Files:**

- Modify: `frontend/src/ts/pages/profile.ts`

**Step 1: Read profile.ts update function**

Run: `head -100 frontend/src/ts/pages/profile.ts`
Expected: See profile page update logic

**Step 2: Add hiding at start of update()**

Find the update function and add at the very beginning:

```typescript
export async function update(options?: {
  urlParams?: { uidOrName?: string };
}): Promise<void> {
  // Privacy mode: hide profile page
  qs(".pageProfile")?.addClass("hidden");

  // Original profile logic (now skipped)
  return;
}
```

**Step 3: Run TypeScript check**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add frontend/src/ts/pages/profile.ts
git commit -m "feat: hide profile page in privacy mode"
```

---

## Task 5: Hide Leaderboard Page

**Files:**

- Modify: `frontend/src/ts/pages/leaderboards.ts`

**Step 1: Read leaderboard update function**

Run: `grep -n "export.*update" frontend/src/ts/pages/leaderboards.ts | head -5`
Expected: Find update function location

**Step 2: Add hiding at start of update()**

Add at the very beginning of the update function:

```typescript
export async function update(): Promise<void> {
  // Privacy mode: hide leaderboard page
  qs(".pageLeaderboards")?.addClass("hidden");

  // Original leaderboard logic (now skipped)
  return;
}
```

**Step 3: Run TypeScript check**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add frontend/src/ts/pages/leaderboards.ts
git commit -m "feat: hide leaderboard page in privacy mode"
```

---

## Task 6: Hide Friends Page

**Files:**

- Modify: `frontend/src/ts/pages/friends.ts`

**Step 1: Read friends update function**

Run: `grep -n "export.*update" frontend/src/ts/pages/friends.ts | head -5`
Expected: Find update function location

**Step 2: Add hiding at start of update()**

Add at the very beginning of the update function:

```typescript
export async function update(): Promise<void> {
  // Privacy mode: hide friends page
  qs(".pageFriends")?.addClass("hidden");

  // Original friends logic (now skipped)
  return;
}
```

**Step 3: Run TypeScript check**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add frontend/src/ts/pages/friends.ts
git commit -m "feat: hide friends page in privacy mode"
```

---

## Task 7: Remove Account Navigation Commands

**Files:**

- Modify: `frontend/src/ts/commandline/lists/navigation.ts`

**Step 1: Filter out account and leaderboard commands**

Replace the entire commands array export with filtered version:

```typescript
const commands: Command[] = [
  {
    id: "viewTypingPage",
    display: "View Typing Page",
    alias: "navigate go to start begin type test",
    icon: "fa-keyboard",
    exec: (): void => {
      void navigate("/");
    },
  },
  {
    id: "viewAbout",
    display: "View About Page",
    alias: "navigate go to",
    icon: "fa-info",
    exec: (): void => {
      void navigate("/about");
    },
  },
  {
    id: "viewSettings",
    display: "View Settings Page",
    alias: "navigate go to",
    icon: "fa-cog",
    exec: (): void => {
      void navigate("/settings");
    },
  },
  {
    id: "toggleFullscreen",
    display: "Toggle Fullscreen",
    icon: "fa-expand",
    exec: (): void => {
      toggleFullscreen();
    },
  },
];

export default commands;
```

**Step 2: Run TypeScript check**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add frontend/src/ts/commandline/lists/navigation.ts
git commit -m "feat: remove account/leaderboard navigation commands"
```

---

## Task 8: Hide Account Settings Notice in Settings

**Files:**

- Modify: `frontend/src/ts/pages/settings.ts`

**Step 1: Find account settings notice hiding**

The `hideAccountSection()` function (lines 474-476) already handles this.

**Step 2: Ensure hideAccountSection() is called**

Verify the update function calls `hideAccountSection()` when not authenticated (lines 708-712 already do this).

**No changes needed** - this is already implemented.

**Step 3: Commit (no-op)**

```bash
git add frontend/src/ts/pages/settings.ts
git commit -m "docs: settings page already hides account sections"
```

---

## Task 9: Write E2E Test for Hidden UI Elements

**Files:**

- Create: `frontend/__tests__/e2e/privacy-ui.test.ts`

**Step 1: Create test file**

```typescript
import { describe, it, expect } from "vitest";

describe("Privacy Mode - UI Cleanup", () => {
  it("should hide login button", () => {
    const loginButton = document.querySelector(".loginButton");
    expect(loginButton?.classList.contains("hidden")).toBe(true);
  });

  it("should hide account dropdown menu", () => {
    const accountButton = document.querySelector(".accountButtonAndMenu");
    expect(accountButton?.classList.contains("hidden")).toBe(true);
  });

  it("should hide profile page", () => {
    const profilePage = document.querySelector(".pageProfile");
    expect(profilePage?.classList.contains("hidden")).toBe(true);
  });

  it("should hide leaderboard page", () => {
    const leaderboardPage = document.querySelector(".pageLeaderboards");
    expect(leaderboardPage?.classList.contains("hidden")).toBe(true);
  });

  it("should hide friends page", () => {
    const friendsPage = document.querySelector(".pageFriends");
    expect(friendsPage?.classList.contains("hidden")).toBe(true);
  });
});
```

**Step 2: Run test**

Run: `cd frontend && npm test -- privacy-ui.test.ts`
Expected: Tests verify elements are hidden

**Step 3: Commit**

```bash
git add frontend/__tests__/e2e/privacy-ui.test.ts
git commit -m "test: add E2E tests for hidden UI elements"
```

---

## Task 10: Write Integration Test for Navigation Cleanup

**Files:**

- Create: `frontend/__tests__/integration/navigation-privacy.test.ts`

**Step 1: Create test file**

```typescript
import { describe, it, expect } from "vitest";
import commands from "../../ts/commandline/lists/navigation";

describe("Privacy Mode - Navigation Cleanup", () => {
  it("should not include account commands", () => {
    const accountCommands = commands.filter((cmd) => cmd.id === "viewAccount");
    expect(accountCommands).toHaveLength(0);
  });

  it("should not include leaderboard commands", () => {
    const leaderboardCommands = commands.filter(
      (cmd) => cmd.id === "viewLeaderboards",
    );
    expect(leaderboardCommands).toHaveLength(0);
  });

  it("should include core navigation commands", () => {
    const hasTestCommand = commands.some((cmd) => cmd.id === "viewTypingPage");
    const hasSettingsCommand = commands.some(
      (cmd) => cmd.id === "viewSettings",
    );
    const hasAboutCommand = commands.some((cmd) => cmd.id === "viewAbout");
    expect(hasTestCommand).toBe(true);
    expect(hasSettingsCommand).toBe(true);
    expect(hasAboutCommand).toBe(true);
  });
});
```

**Step 2: Run test**

Run: `cd frontend && npm test -- navigation-privacy.test.ts`
Expected: Tests verify navigation is cleaned up

**Step 3: Commit**

```bash
git add frontend/__tests__/integration/navigation-privacy.test.ts
git commit -m "test: add integration tests for navigation cleanup"
```

---

## Task 11: Update Design Document Phase 3 Status

**Files:**

- Modify: `docs/plans/2026-01-04-privacy-fork-design.md`

**Step 1: Update Phase 3 status table**

Change from:

```markdown
| Phase 3: UI Cleanup | ⬜ Not Started | 0/3 tasks complete |
```

To:

```markdown
| Phase 3: UI Cleanup | 🟢 Complete | 3/3 tasks complete |
```

**Step 2: Mark Phase 3 checklist items as complete**

Update Phase 3 checklist section:

```markdown
### Phase 3: UI Cleanup

- [x] Hide authentication elements
  - [x] Hide login button (`account-button.ts`)
  - [x] Hide account dropdown
  - [x] Hide profile page
- [x] Disable backend features
  - [x] Hide leaderboard page
  - [x] Hide friends page
  - [x] Hide Discord integration (no Discord links in navigation)
- [x] Update navigation
  - [x] Remove from commandline (`navigation.ts`)
  - [x] Route controller already redirects unauthenticated users
- [x] Update settings
  - [x] Hide account section for guests (already has hideAccountSection)
```

**Step 3: Commit**

```bash
git add docs/plans/2026-01-04-privacy-fork-design.md
git commit -m "docs: update Phase 3 status to complete"
```

---

## Task 12: Final Verification

**Step 1: Run TypeScript check**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

**Step 2: Run lint**

Run: `npm run lint`
Expected: No linting errors

**Step 3: Run tests**

Run: `npm test`
Expected: All tests pass

**Step 4: Build frontend**

Run: `cd frontend && npm run build`
Expected: Build succeeds

**Step 5: Commit final verification**

```bash
git add .
git commit -m "feat: complete Phase 3 UI cleanup"
```

---

## Summary

This plan implements Phase 3: UI Cleanup by:

1. **Creating SCSS File** - `privacy-mode.scss` with hiding rules using `%hidden` placeholder
2. **Importing SCSS** - Adding to `index.scss` import list
3. **Hiding Authentication Elements** - Login button, account dropdown via account-button.ts
4. **Disabling Backend Features** - Profile, leaderboard, friends pages
5. **Updating Navigation** - Remove account/leaderboard commands by ID filtering
6. **Settings Page** - Already has `hideAccountSection()` - no changes needed
7. **Adding Tests** - E2E tests for hidden elements, integration tests for navigation
8. **Documentation** - Update design document with Phase 3 completion status

All changes use CSS/SCSS class-based hiding for non-destructive changes, maintaining code structure while removing UI elements.

**Key Corrections from exploration:**

- ✅ Use `.scss` not `.css` for styles
- ✅ Import in `index.scss` not non-existent `style.css`
- ✅ Settings page already has proper hiding via `hideAccountSection()`
- ✅ Filter navigation by `id` property, not string matching
- ✅ Use `qs()` from dom.ts for element queries
