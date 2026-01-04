import storageManager, {
  type TypedResult,
} from "@monkeytype/local-storage-manager";

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
): { status: 200; body: { message: string; data: T } } {
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
        streak: 0,
        isPb: false,
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

    addQuoteToFavorites: async (params: { body: { quoteId: string } }) => {
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

    removeQuoteFromFavorites: async (params: { body: { quoteId: string } }) => {
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
      return createSuccessResponse({ success: true });
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
      return createSuccessResponse({ success: true });
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
      body: { name: string; filter: unknown };
    }) => {
      logApiCall("users.addResultFilterPreset");
      const filters = JSON.parse(
        localStorage.getItem("mt_result_filters") ?? "{}",
      ) as Record<string, unknown>;
      filters[params.body.name] = params.body.filter;
      localStorage.setItem("mt_result_filters", JSON.stringify(filters));
      return createSuccessResponse({ success: true });
    },

    removeResultFilterPreset: async (params: { body: { name: string } }) => {
      logApiCall("users.removeResultFilterPreset");
      const filters = JSON.parse(
        localStorage.getItem("mt_result_filters") ?? "{}",
      ) as Record<string, unknown>;
      const { [params.body.name]: _removed, ...rest } = filters;
      localStorage.setItem("mt_result_filters", JSON.stringify(rest));
      return createSuccessResponse({ success: true });
    },
  },

  quotes: {
    get: async () => {
      logApiCall("quotes.get");
      return createSuccessResponse([]);
    },

    add: async () => {
      logApiCall("quotes.add");
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
    get: async (params?: { params?: { type: string } }) => {
      logApiCall("connections.get");
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

  leaderboards: {
    get: async () => {
      logApiCall("leaderboards.get");
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

  apeKeys: {
    get: async () => {
      logApiCall("apeKeys.get");
      const keys = JSON.parse(
        localStorage.getItem("mt_ape_keys") ?? "[]",
      ) as Array<{
        name: string;
        key: string;
        created: number;
        lastUsed: number | null;
      }>;
      return createSuccessResponse(keys);
    },

    add: async (params: { body: { name: string; key: string } }) => {
      logApiCall("apeKeys.add");
      const keys = JSON.parse(
        localStorage.getItem("mt_ape_keys") ?? "[]",
      ) as Array<{
        name: string;
        key: string;
        created: number;
        lastUsed: number | null;
      }>;
      keys.push({ ...params.body, created: Date.now(), lastUsed: null });
      localStorage.setItem("mt_ape_keys", JSON.stringify(keys));
      return createSuccessResponse({ success: true });
    },

    save: async (params: {
      body: { name: string; key: string; useCount: number };
    }) => {
      logApiCall("apeKeys.save");
      const keys = JSON.parse(
        localStorage.getItem("mt_ape_keys") ?? "[]",
      ) as Array<{
        name: string;
        key: string;
        created: number;
        lastUsed: number | null;
      }>;
      const existingKey = keys.find(
        (k: { name: string }) => k.name === params.body.name,
      );
      if (existingKey) {
        const index = keys.indexOf(existingKey);
        keys[index] = {
          name: params.body.name,
          key: params.body.key,
          created: existingKey.created,
          lastUsed: Date.now(),
        };
      }
      localStorage.setItem("mt_ape_keys", JSON.stringify(keys));
      return createSuccessResponse({ success: true });
    },

    delete: async (params: { body: { name: string } }) => {
      logApiCall("apeKeys.delete");
      const keys = JSON.parse(
        localStorage.getItem("mt_ape_keys") ?? "[]",
      ) as Array<{
        name: string;
        key: string;
        created: number;
        lastUsed: number | null;
      }>;
      const filtered = keys.filter(
        (k: { name: string }) => k.name !== params.body.name,
      );
      localStorage.setItem("mt_ape_keys", JSON.stringify(filtered));
      return createSuccessResponse({ success: true });
    },
  },
};
