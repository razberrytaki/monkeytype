import type { TypedResult } from "@monkeytype/local-storage-manager";
import storageManager from "@monkeytype/local-storage-manager";
import * as Notifications from "../../ts/elements/notifications";
import { createErrorMessage } from "../../ts/utils/misc";

type ApiResponse<T = unknown> = {
  status: number;
  body: T;
  headers: Headers;
};

type GetConfigResponse = {
  config: Record<string, unknown>;
};

type GetResultsResponse = {
  results: TypedResult[];
};

type GetPersonalBestResponse = {
  personalBest: Record<string, number>;
};

export async function getConfig(): Promise<ApiResponse<GetConfigResponse>> {
  try {
    const config = storageManager.getSettings();
    return {
      status: 200,
      body: { config: (config ?? {}) as Record<string, unknown> },
      headers: new Headers(),
    };
  } catch (error) {
    return handleError<GetConfigResponse>(error);
  }
}

export async function saveConfig(
  config: Record<string, unknown>,
): Promise<ApiResponse<void>> {
  try {
    storageManager.setSettings(config);
    return {
      status: 200,
      body: undefined,
      headers: new Headers(),
    };
  } catch (error) {
    return handleError<void>(error);
  }
}

export async function submitResult(
  result: TypedResult,
): Promise<ApiResponse<{ success: boolean; resultId: string }>> {
  try {
    storageManager.addResult(result);

    const key = `${result.mode}_${result.mode2}`;
    storageManager.updatePersonalBest(key, result.wpm);

    return {
      status: 200,
      body: {
        success: true,
        resultId: result.id,
      },
      headers: new Headers(),
    };
  } catch (error) {
    return handleError<{ success: boolean; resultId: string }>(error);
  }
}

export async function getResults(): Promise<ApiResponse<GetResultsResponse>> {
  try {
    const history = storageManager.getHistory();
    return {
      status: 200,
      body: { results: history },
      headers: new Headers(),
    };
  } catch (error) {
    return handleError<GetResultsResponse>(error);
  }
}

export async function getPersonalBest(): Promise<
  ApiResponse<GetPersonalBestResponse>
> {
  try {
    const pb = storageManager.getPersonalBest();
    return {
      status: 200,
      body: { personalBest: pb },
      headers: new Headers(),
    };
  } catch (error) {
    return handleError<GetPersonalBestResponse>(error);
  }
}

export async function clearHistory(): Promise<ApiResponse<void>> {
  try {
    storageManager.setHistory([]);
    return {
      status: 200,
      body: undefined,
      headers: new Headers(),
    };
  } catch (error) {
    return handleError<void>(error);
  }
}

export async function exportData(): Promise<ApiResponse<{ data: string }>> {
  try {
    const data = storageManager.exportData();
    return {
      status: 200,
      body: { data },
      headers: new Headers(),
    };
  } catch (error) {
    return handleError<{ data: string }>(error);
  }
}

export async function importData(jsonData: string): Promise<ApiResponse<void>> {
  try {
    storageManager.importData(jsonData);
    Notifications.add("Data imported successfully", 1, { duration: 3 });
    return {
      status: 200,
      body: undefined,
      headers: new Headers(),
    };
  } catch (error) {
    const message = createErrorMessage(error, "Failed to import data");
    Notifications.add(message, -1, { duration: 3 });
    return handleError<void>(error);
  }
}

export async function getStorageInfo(): Promise<
  ApiResponse<{ size: number; available: boolean }>
> {
  try {
    const size = storageManager.getStorageSize();
    const available = storageManager.getAvailable();
    return {
      status: 200,
      body: { size, available },
      headers: new Headers(),
    };
  } catch (error) {
    return handleError<{ size: number; available: boolean }>(error);
  }
}

function handleError<T>(error: unknown): ApiResponse<T> {
  console.error("LocalApi error:", error);
  const message = error instanceof Error ? error.message : "Unknown error";
  return {
    status: 500,
    body: { message } as T,
    headers: new Headers(),
  };
}
