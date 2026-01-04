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
