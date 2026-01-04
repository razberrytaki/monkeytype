import { describe, it, expect, vi } from "vitest";
import commands from "../../src/ts/commandline/lists/navigation";

vi.mock("../../src/ts/controllers/route-controller", () => ({
  navigate: vi.fn(),
}));

vi.mock("../../src/ts/utils/misc", () => ({
  toggleFullscreen: vi.fn(),
}));

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
