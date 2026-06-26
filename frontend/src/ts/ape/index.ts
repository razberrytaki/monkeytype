import type { Configuration } from "@monkeytype/schemas/configuration";
import type { contract } from "@monkeytype/contracts";
import type { devContract } from "@monkeytype/contracts/dev";
import type { buildClient } from "./adapters/ts-rest-adapter";

/**
 * Privacy fork: backend API access is intentionally replaced with local/no-op
 * responses. This module preserves the ts-rest-like call shape expected by the
 * frontend while guaranteeing no network request is made from Ape.* calls.
 */
type ApiResponse<T = unknown> = {
  status: number;
  body: T;
  headers: Headers;
};

type SuccessBody<T = unknown> = {
  message: string;
  data: T;
};

const localConfiguration: Configuration = {
  maintenance: false,
  dev: { responseSlowdownMs: 0 },
  quotes: {
    reporting: { enabled: false, maxReports: 0, contentReportLimit: 0 },
    submissionsEnabled: false,
    maxFavorites: 1000,
  },
  results: {
    savingEnabled: false,
    objectHashCheckEnabled: false,
    filterPresets: { enabled: true, maxPresetsPerUser: 1000 },
    limits: { regularUser: 0, premiumUser: 0 },
    maxBatchSize: 0,
  },
  users: {
    signUp: false,
    lastHashesCheck: { enabled: false, maxHashes: 0 },
    autoBan: { enabled: false, maxCount: 0, maxHours: 0 },
    profiles: { enabled: false },
    discordIntegration: { enabled: false },
    xp: {
      enabled: false,
      funboxBonus: 0,
      gainMultiplier: 0,
      maxDailyBonus: 0,
      minDailyBonus: 0,
      streak: { enabled: false, maxStreakDays: 0, maxStreakMultiplier: 0 },
    },
    inbox: { enabled: false, maxMail: 0 },
    premium: { enabled: false },
  },
  admin: { endpointsEnabled: false },
  apeKeys: {
    endpointsEnabled: false,
    acceptKeys: false,
    maxKeysPerUser: 0,
    apeKeyBytes: 0,
    apeKeySaltRounds: 0,
  },
  rateLimiting: {
    badAuthentication: { enabled: false, penalty: 0, flaggedStatusCodes: [] },
  },
  dailyLeaderboards: {
    enabled: false,
    leaderboardExpirationTimeInDays: 0,
    maxResults: 0,
    validModeRules: [],
    scheduleRewardsModeRules: [],
    topResultsToAnnounce: 1,
    xpRewardBrackets: [],
  },
  leaderboards: {
    minTimeTyping: 0,
    weeklyXp: { enabled: false, expirationTimeInDays: 0, xpRewardBrackets: [] },
  },
  connections: { enabled: false, maxPerUser: 0 },
};

function logApiCall(path: string): void {
  if (import.meta.env.DEV) {
    console.warn(`[Privacy Fork] Ape.${path} called - returning local/no-op response`);
  }
}

function success<T>(data: T): ApiResponse<SuccessBody<T>> {
  return {
    status: 200,
    body: { message: "Success", data },
    headers: new Headers(),
  };
}

function dataFor(path: string): unknown {
  switch (path) {
    case "configuration.get":
      return localConfiguration;
    case "users.getNameAvailability":
      return { available: true };
    case "users.getProfile":
      return {
        uid: "guest",
        name: "Guest",
        bio: "",
        addedAt: Date.now(),
        badges: [],
        personalBests: {},
        typingStats: { timeTyping: 0, startedTests: 0, completedTests: 0 },
        streak: 0,
        maxStreak: 0,
      };
    case "users.getFriends":
    case "users.getCustomThemes":
    case "users.getTestActivity":
    case "users.getInbox":
    case "presets.get":
    case "connections.get":
    case "leaderboards.get":
    case "leaderboards.getDaily":
    case "leaderboards.getWeeklyXp":
      return [];
    case "public.getSpeedHistogram":
      return { histogram: [] };
    case "public.getTypingStats":
      return { timeTyping: 0, testsCompleted: 0, testsStarted: 0 };
    case "results.add":
      return {
        insertedId: null,
        xp: 0,
        xpBreakdown: { time: 0, words: 0, zen: 0, quote: 0, custom: 0 },
        streak: 0,
        isPb: false,
        dailyLeaderboardRank: undefined,
      };
    case "results.updateTags":
      return { tagPbs: [] };
    case "quotes.isSubmissionEnabled":
      return { isSubmissionEnabled: false };
    case "quotes.getRating":
      return { average: 0, count: 0, rating: null };
    default:
      return { success: true };
  }
}

function makeProxy(path: string[] = []): unknown {
  return new Proxy(() => undefined, {
    get(_target, prop) {
      if (typeof prop !== "string") return undefined;
      return makeProxy([...path, prop]);
    },
    async apply() {
      const method = path.join(".");
      logApiCall(method);
      return success(dataFor(method));
    },
  });
}

type MainClient = ReturnType<typeof buildClient<typeof contract>>;
type DevClient = ReturnType<typeof buildClient<typeof devContract>>;
type ApeClient = MainClient & { dev: DevClient };

const Ape = makeProxy() as ApeClient;

export default Ape;
export { Ape };
