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
};
