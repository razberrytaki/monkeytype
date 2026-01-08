import storageManager, {
  type TypedResult,
} from "@monkeytype/local-storage-manager";
import type { ResultFilters } from "@monkeytype/schemas/users";

/* oxlint-disable-next-line no-unused-vars */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- type needed for stub response */

function logApiCall(method: string): void {
  if (import.meta.env.DEV) {
    console.warn(
      `[Privacy Fork] Ape.${method} called - using localStorage/no-op`,
    );
  }
}

function createSuccessResponse<T>(
  data: T,
  message = "Success",
): {
  status: 200;
  body: {
    message: string;
    data: T;
  };
} {
  return {
    status: 200,
    body: {
      message,
      data,
    },
  };
}

// oxlint-disable-next-line no-unused-vars
function createErrorResponse(
  statusCode: number,
  message: string,
): { status: number; body: { message: string; data: null } } {
  return {
    status: statusCode,
    body: {
      message,
      data: null,
    },
  };
}

export const Ape = {
  results: {
    add: async (params: { body: { result: TypedResult } }) => {
      logApiCall("results.add");
      storageManager.addResult(params.body.result);
      return createSuccessResponse({
        insertedId: null,
        xp: 0,
        xpBreakdown: {
          time: 0,
          words: 0,
          zen: 0,
          quote: 0,
          custom: 0,
        },
        streak: 0,
        isPb: false,
        dailyLeaderboardRank: undefined,
      });
    },

    updateTags: async (_params: { body: { tags: string[] } }) => {
      logApiCall("results.updateTags");
      const tags = storageManager.getTags();
      const tagPbs = Object.entries(tags).map(([name, tag]) => ({
        tag: name,
        wpm: tag.stats?.wpm60 ?? 0,
        acc: 95,
      }));
      return createSuccessResponse({ tagPbs });
    },
  },

  users: {
    getNameAvailability: async () => {
      logApiCall("users.getNameAvailability");
      return createSuccessResponse({ available: true });
    },

    getProfile: async (params?: {
      params?: { uid?: string; uidOrName?: string };
    }) => {
      logApiCall("users.getProfile");
      const _pb = storageManager.getPersonalBest() ?? {};
      const _createEmptyPb = (): unknown[] => [];
      return createSuccessResponse({
        name: "Guest",
        bio: "",
        joined: Date.now(),
        badges: [],
        personalBests: {
          time: {},
          words: {},
          quote: {},
          zen: {},
          custom: {},
        },
        uid: params?.params?.uid ?? "guest",
        streak: 0,
        addedAt: Date.now(),
        typingStats: {
          timeTyping: 0,
          startedTests: 0,
          completedTests: 0,
        },
        maxStreak: 0,
      });
    },

    updateProfile: async (_params: {
      body: {
        bio?: string;
        keyboard?: string;
        socialProfiles?: unknown;
        selectedBadgeId?: number;
      };
    }) => {
      logApiCall("users.updateProfile");
      return createSuccessResponse({
        bio: _params.body.bio,
        keyboard: _params.body.keyboard,
        socialProfiles: _params.body.socialProfiles as
          | {
              github?: string;
              twitter?: string;
              website?: string;
            }
          | undefined,
        showActivityOnPublicProfile: false,
      });
    },

    getFriends: async () => {
      logApiCall("users.getFriends");
      return createSuccessResponse([]);
    },

    revokeAllTokens: async () => {
      logApiCall("users.revokeAllTokens");
      return createSuccessResponse({ success: true });
    },

    create: async (_params: { body: { name: string; captcha?: string } }) => {
      logApiCall("users.create");
      return createSuccessResponse({ uid: "guest" });
    },

    updateName: async (_params: { body: { name: string } }) => {
      logApiCall("users.updateName");
      return createSuccessResponse({ success: true });
    },

    updateEmail: async (_params: { body: { email: string } }) => {
      logApiCall("users.updateEmail");
      return createSuccessResponse({ success: true });
    },

    updatePassword: async (_params: { body: { newPassword: string } }) => {
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

    forgotPasswordEmail: async (_params: {
      body: { email: string; captcha?: string };
    }) => {
      logApiCall("users.forgotPasswordEmail");
      return createSuccessResponse({ success: true });
    },

    linkDiscord: async (_params?: { body?: unknown }) => {
      logApiCall("users.linkDiscord");
      return createSuccessResponse({
        success: true,
        discordId: "",
        discordAvatar: "",
      });
    },

    unlinkDiscord: async (_params?: { body?: unknown }) => {
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

    updateInbox: async (_params: {
      body: { mailIdsToMarkRead?: string[]; mailIdsToDelete?: string[] };
    }) => {
      logApiCall("users.updateInbox");
      return createSuccessResponse({ success: true });
    },

    report: async (_params: { body: unknown }) => {
      logApiCall("users.report");
      return createSuccessResponse({ success: true });
    },

    optOutOfLeaderboards: async (_params?: { body?: unknown }) => {
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

    updateTagsForResult: async (_params: { body: { tags: string[] } }) => {
      logApiCall("users.updateTagsForResult");
      return createSuccessResponse({ success: true });
    },

    addQuoteToFavorites: async (params: {
      body: { quoteId: string; language?: string };
    }) => {
      logApiCall("users.addQuoteToFavorites");
      const favorites = JSON.parse(
        localStorage.getItem("mt_favorites") ?? "[]",
      ) as string[];
      if (!favorites.includes(params.body.quoteId)) {
        favorites.push(params.body.quoteId);
        localStorage.setItem("mt_favorites", JSON.stringify(favorites));
      }
      return createSuccessResponse({ success: true });
    },

    removeQuoteFromFavorites: async (params: {
      body: { quoteId: string; language?: string };
    }) => {
      logApiCall("users.removeQuoteFromFavorites");
      const favorites = JSON.parse(
        localStorage.getItem("mt_favorites") ?? "[]",
      ) as string[];
      const filtered = favorites.filter(
        (id: string) => id !== params.body.quoteId,
      );
      localStorage.setItem("mt_favorites", JSON.stringify(filtered));
      return createSuccessResponse({ success: true });
    },

    createTag: async (params: { body: { name: string } }) => {
      logApiCall("users.createTag");
      const tags = storageManager.getTags() ?? {};
      if (tags[params.body.name]) {
        return createErrorResponse(400, "Tag already exists");
      }
      tags[params.body.name] = { name: params.body.name, stats: {} };
      storageManager.setTags(tags);
      return createSuccessResponse({
        success: true,
        name: params.body.name,
        _id: params.body.name,
      });
    },

    editTag: async (params: {
      params: { tag: string };
      body: { newName: string };
    }) => {
      logApiCall("users.editTag");
      const tags = storageManager.getTags() ?? {};
      const oldTag = tags[params.params.tag];
      if (!oldTag) {
        return createErrorResponse(404, "Tag not found");
      }
      const { [params.params.tag]: _removed, ...rest } = tags;
      rest[params.body.newName] = {
        name: params.body.newName,
        stats: oldTag.stats ?? {},
      };
      storageManager.setTags(rest);
      return createSuccessResponse({
        success: true,
        name: params.body.newName,
      });
    },

    deleteTag: async (params: { params: { tag: string } }) => {
      logApiCall("users.deleteTag");
      const tags = storageManager.getTags() ?? {};
      const { [params.params.tag]: _removed, ...rest } = tags;
      storageManager.setTags(rest);
      return createSuccessResponse({ success: true });
    },

    deleteTagPersonalBest: async (params: { params: { tag: string } }) => {
      logApiCall("users.deleteTagPersonalBest");
      const tags = storageManager.getTags() ?? {};
      const tag = tags[params.params.tag];
      if (tag) {
        tag.stats = {};
        storageManager.setTags(tags);
      }
      return createSuccessResponse({ success: true });
    },

    addResultFilterPreset: async (params: {
      body: { name: string; filter: ResultFilters };
    }) => {
      logApiCall("users.addResultFilterPreset");
      const filters = JSON.parse(
        localStorage.getItem("mt_result_filters") ?? "{}",
      ) as Record<string, ResultFilters>;
      filters[params.body.name] = params.body.filter;
      localStorage.setItem("mt_result_filters", JSON.stringify(filters));
      return createSuccessResponse(params.body.name);
    },

    removeResultFilterPreset: async (params: {
      params: { presetId: string };
    }) => {
      logApiCall("users.removeResultFilterPreset");
      const filters = JSON.parse(
        localStorage.getItem("mt_result_filters") ?? "{}",
      ) as Record<string, unknown>;
      const { [params.params.presetId]: _removed, ...rest } = filters;
      localStorage.setItem("mt_result_filters", JSON.stringify(rest));
      return createSuccessResponse({ success: true });
    },
  },

  quotes: {
    get: async () => {
      logApiCall("quotes.get");
      return createSuccessResponse([]);
    },

    add: async (_params: {
      body: {
        text: string;
        source: string;
        language: string;
        captcha?: unknown;
      };
    }) => {
      logApiCall("quotes.add");
      return createSuccessResponse({ success: true });
    },

    approveSubmission: async (_params: {
      params: { quoteId: string; editText?: string; editSource?: string };
    }) => {
      logApiCall("quotes.approveSubmission");
      return createSuccessResponse({ success: true });
    },

    rejectSubmission: async (_params: { params: { quoteId: string } }) => {
      logApiCall("quotes.rejectSubmission");
      return createSuccessResponse({ success: true });
    },

    isSubmissionEnabled: async () => {
      logApiCall("quotes.isSubmissionEnabled");
      return createSuccessResponse({ enabled: false });
    },

    report: async (_params: { body: unknown }) => {
      logApiCall("quotes.report");
      return createSuccessResponse({ success: true });
    },

    getRating: async (_params: {
      params: { quoteId: string; language?: string };
    }) => {
      logApiCall("quotes.getRating");
      return createSuccessResponse({ rating: 0, count: 0 });
    },

    addRating: async (params: {
      body: { quoteId: string; rating: number; language?: string };
    }) => {
      logApiCall("quotes.addRating");
      const ratings = JSON.parse(
        localStorage.getItem("mt_quote_ratings") ?? "{}",
      ) as Record<string, number>;
      ratings[params.body.quoteId] = params.body.rating;
      localStorage.setItem("mt_quote_ratings", JSON.stringify(ratings));
      return createSuccessResponse({ success: true });
    },
  },

  presets: {
    add: async (params: { body: { name: string; config: unknown } }) => {
      logApiCall("presets.add");
      const presets = JSON.parse(
        localStorage.getItem("mt_presets") ?? "{}",
      ) as Record<string, unknown>;
      presets[params.body.name] = params.body.config;
      localStorage.setItem("mt_presets", JSON.stringify(presets));
      return createSuccessResponse({ success: true });
    },

    save: async (params: { body: { name: string; config: unknown } }) => {
      logApiCall("presets.save");
      const presets = JSON.parse(
        localStorage.getItem("mt_presets") ?? "{}",
      ) as Record<string, unknown>;
      presets[params.body.name] = params.body.config;
      localStorage.setItem("mt_presets", JSON.stringify(presets));
      return createSuccessResponse({ success: true });
    },

    delete: async (params: { body: { name: string } }) => {
      logApiCall("presets.delete");
      const presets = JSON.parse(
        localStorage.getItem("mt_presets") ?? "{}",
      ) as Record<string, unknown>;
      const { [params.body.name]: _removed, ...rest } = presets;
      localStorage.setItem("mt_presets", JSON.stringify(rest));
      return createSuccessResponse({ success: true });
    },
  },

  connections: {
    get: async (params?: { params?: { type?: string; query?: string } }) => {
      logApiCall("connections.get");
      if (params?.params?.type === "blocked") {
        return createSuccessResponse([]);
      }
      return createSuccessResponse([]);
    },

    delete: async (_params: { params: { connectionId: string } }) => {
      logApiCall("connections.delete");
      return createSuccessResponse({ success: true });
    },

    create: async (params: { body: { receiverName: string } }) => {
      logApiCall("connections.create");
      return createSuccessResponse({
        _id: "temp-id",
        initiatorUid: "guest",
        initiatorName: "Guest",
        receiverUid: "guest",
        receiverName: params.body.receiverName,
        status: "pending" as const,
        lastModified: Date.now(),
      });
    },

    update: async (_params: {
      params?: { connectionId?: string };
      body: { status: string };
    }) => {
      logApiCall("connections.update");
      return createSuccessResponse({ success: true });
    },
  },

  leaderboards: {
    get: async (_params: {
      query: {
        language: string;
        mode: string;
        mode2: string;
        page: number;
        pageSize: number;
        friendsOnly?: boolean;
      };
    }) => {
      logApiCall("leaderboards.get");
      return createSuccessResponse({
        entries: [],
        count: 0,
        pageSize: _params.query.pageSize,
      });
    },

    getDaily: async (_params: {
      query: {
        language: string;
        mode: string;
        mode2: string;
        page: number;
        pageSize: number;
        friendsOnly?: boolean;
        daysBefore?: number;
      };
    }) => {
      logApiCall("leaderboards.getDaily");
      return createSuccessResponse({
        entries: [],
        count: 0,
        pageSize: _params.query.pageSize,
        minWpm: 0,
      });
    },

    getDailyRank: async (_params: {
      query: {
        language: string;
        mode: string;
        mode2: string;
        friendsOnly?: boolean;
        daysBefore?: number;
      };
    }) => {
      logApiCall("leaderboards.getDailyRank");
      return createSuccessResponse(null);
    },

    getWeeklyXp: async (_params: {
      query: {
        page: number;
        pageSize: number;
        friendsOnly?: boolean;
        weeksBefore?: number;
      };
    }) => {
      logApiCall("leaderboards.getWeeklyXp");
      return createSuccessResponse({
        entries: [],
        count: 0,
        pageSize: _params.query.pageSize,
      });
    },

    getWeeklyXpRank: async (_params: {
      query: {
        friendsOnly?: boolean;
        weeksBefore?: number;
      };
    }) => {
      logApiCall("leaderboards.getWeeklyXpRank");
      return createSuccessResponse({
        uid: "",
        name: "",
        lastActivityTimestamp: 0,
        timeTypedSeconds: 0,
        totalXp: 0,
        rank: 0,
      } as {
        uid: string;
        name: string;
        lastActivityTimestamp: number;
        timeTypedSeconds: number;
        totalXp: number;
        rank: number;
        discordId?: string;
        discordAvatar?: string;
        badgeId?: number;
        isPremium?: boolean;
        friendsRank?: number;
      } | null);
    },

    getRank: async (_params: {
      query: {
        language: string;
        mode: string;
        mode2: string;
        friendsOnly?: boolean;
      };
    }) => {
      logApiCall("leaderboards.getRank");
      return createSuccessResponse(null);
    },
  },

  apeKeys: {
    get: async () => {
      logApiCall("apeKeys.get");
      const keys = JSON.parse(
        localStorage.getItem("mt_ape_keys") ?? "{}",
      ) as Record<
        string,
        {
          name: string;
          key: string;
          enabled: boolean;
          createdOn: number;
          modifiedOn: number;
          lastUsedOn: number | -1;
        }
      >;
      return createSuccessResponse(keys);
    },

    add: async (params: { body: { name: string; enabled: boolean } }) => {
      logApiCall("apeKeys.add");
      const keys = JSON.parse(
        localStorage.getItem("mt_ape_keys") ?? "{}",
      ) as Record<string, unknown>;
      const id = Date.now().toString();
      const apeKey = {
        ...params.body,
        key: `mk_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        createdOn: Date.now(),
        modifiedOn: Date.now(),
        lastUsedOn: -1,
      };
      keys[id] = apeKey;
      localStorage.setItem("mt_ape_keys", JSON.stringify(keys));
      return createSuccessResponse({ success: true, apeKey });
    },

    save: async (params: {
      params: { apeKeyId: string };
      body?: { name?: string; enabled?: boolean };
    }) => {
      logApiCall("apeKeys.save");
      const keys = JSON.parse(
        localStorage.getItem("mt_ape_keys") ?? "{}",
      ) as Record<string, unknown>;
      const existingKey = keys[params.params.apeKeyId] as {
        name: string;
        key: string;
        enabled: boolean;
        createdOn: number;
        modifiedOn: number;
        lastUsedOn: number | -1;
      };
      if (existingKey !== undefined) {
        keys[params.params.apeKeyId] = {
          ...existingKey,
          ...(params.body?.name !== undefined
            ? { name: params.body.name }
            : {}),
          ...(params.body?.enabled !== undefined
            ? { enabled: params.body.enabled }
            : {}),
          modifiedOn: Date.now(),
        };
      }
      localStorage.setItem("mt_ape_keys", JSON.stringify(keys));
      return createSuccessResponse({ success: true });
    },

    delete: async (params: { params: { apeKeyId: string } }) => {
      logApiCall("apeKeys.delete");
      const keys = JSON.parse(
        localStorage.getItem("mt_ape_keys") ?? "{}",
      ) as Record<string, unknown>;
      const { [params.params.apeKeyId]: _removed, ...rest } = keys;
      localStorage.setItem("mt_ape_keys", JSON.stringify(rest));
      return createSuccessResponse({ success: true });
    },
  },

  dev: {
    generateData: async (_params: {
      body: {
        minTestsPerDay?: number;
        maxTestsPerDay?: number;
        startDate?: number;
      };
    }) => {
      logApiCall("dev.generateData");
      return createSuccessResponse({ success: true });
    },
  },

  public: {
    getSpeedHistogram: async (_params: { query: unknown }) => {
      logApiCall("public.getSpeedHistogram");
      return createSuccessResponse({} as Record<string, number>);
    },

    getTypingStats: async () => {
      logApiCall("public.getTypingStats");
      return createSuccessResponse({
        testsCompleted: 0,
        testsStarted: 0,
        timeTyping: 0,
      });
    },
  },

  psas: {
    get: async () => {
      logApiCall("psas.get");
      return createSuccessResponse([]);
    },
  },
};
