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
  },
};
