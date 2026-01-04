import { describe, it, expect, beforeEach } from "vitest";
import { Ape } from "../../src/ts/ape/index";

describe("Ape.results.add", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return success response", async () => {
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

describe("Ape.users.getNameAvailability", () => {
  it("should always return available", async () => {
    const response = await Ape.users.getNameAvailability();

    expect(response.status).toBe(200);
    expect(response.body.data.available).toBe(true);
  });
});

describe("Ape.users.getInbox", () => {
  it("should return empty inbox", async () => {
    const response = await Ape.users.getInbox();

    expect(response.status).toBe(200);
    expect(response.body.data.inbox).toEqual([]);
    expect(response.body.data.maxMail).toBe(0);
  });
});

describe("Ape.leaderboards.get", () => {
  it("should return empty data", async () => {
    const response = await Ape.leaderboards.get();

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
  });
});
