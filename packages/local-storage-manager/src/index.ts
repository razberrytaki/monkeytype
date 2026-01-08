import type {
  StorageData,
  StorageError,
  TagData,
  TypedResult,
  AverageEntry,
} from "./types.js";
import { StorageKey, StorageDataSchema, createStorageError } from "./types.js";

const MAX_HISTORY_SIZE = 500;
let showNotification: (
  message: string,
  level: number,
  options?: { important?: boolean; customTitle?: string; duration?: number },
) => void = (_message, _level, _options) => {
  // No-op by default until setNotificationHandler is called
};

export function setNotificationHandler(
  handler: (
    message: string,
    level: number,
    options?: { important?: boolean; customTitle?: string; duration?: number },
  ) => void,
): void {
  showNotification = handler;
}

class LocalStorageManager {
  private isAvailable: boolean = false;
  private memoryFallback: Map<string, string> = new Map();
  private hasShownStorageWarning: boolean = false;

  constructor() {
    this.checkAvailability();
  }

  private checkAvailability(): void {
    try {
      const testKey = "__mt_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      this.isAvailable = true;
    } catch (error) {
      console.warn("localStorage not available:", error);
      this.isAvailable = false;

      if (!this.hasShownStorageWarning) {
        showNotification(
          "Storage unavailable - data will be lost on page refresh",
          0,
          { important: true, customTitle: "Warning", duration: 0 },
        );
        this.hasShownStorageWarning = true;
      }
    }
  }

  public getAvailable(): boolean {
    return this.isAvailable;
  }

  public get(key: string): string | null {
    if (this.isAvailable) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn(`Failed to read ${key}:`, error);
        return this.memoryFallback.get(key) ?? null;
      }
    }
    return this.memoryFallback.get(key) ?? null;
  }

  public set(key: string, value: string): void {
    if (this.isAvailable) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        if (this.isQuotaError(error)) {
          this.handleQuotaExceeded();
          try {
            localStorage.setItem(key, value);
          } catch (retryError) {
            console.warn(`Failed to write ${key} after cleanup:`, retryError);
            this.memoryFallback.set(key, value);
          }
        } else {
          console.warn(`Failed to write ${key}:`, error);
          this.memoryFallback.set(key, value);
        }
      }
    } else {
      this.memoryFallback.set(key, value);
    }
  }

  public remove(key: string): void {
    if (this.isAvailable) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Failed to remove ${key}:`, error);
      }
    }
    this.memoryFallback.delete(key);
  }

  public clear(): void {
    if (this.isAvailable) {
      try {
        const keys = Object.keys(localStorage);
        for (const key of keys) {
          if (key.startsWith("mt_")) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        console.warn("Failed to clear storage:", error);
      }
    }
    this.memoryFallback.clear();
  }

  public getStorageSize(): number {
    if (!this.isAvailable) {
      return this.memoryFallback.size;
    }

    let size = 0;
    for (const key in localStorage) {
      if (key.startsWith("mt_")) {
        const value = localStorage.getItem(key);
        size += (value?.length ?? 0) + key.length;
      }
    }
    return size;
  }

  private isQuotaError(error: unknown): boolean {
    return (
      error instanceof DOMException &&
      (error.name === "QuotaExceededError" ||
        error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
        error.name === "QuotaExceededError")
    );
  }

  private handleQuotaExceeded(): void {
    console.warn("Storage quota exceeded, cleaning up old data");

    const history = this.getHistory();

    if (history.length === 0) {
      console.warn("History is empty, cannot clean up");
      return;
    }

    if (history.length > MAX_HISTORY_SIZE) {
      const trimmedHistory = history.slice(-MAX_HISTORY_SIZE);
      this.setHistory(trimmedHistory);
      console.log(`Trimmed history to ${MAX_HISTORY_SIZE} results`);
      return;
    }

    const removeCount = Math.floor(history.length * 0.5);
    const trimmedHistory = history.slice(removeCount);
    this.setHistory(trimmedHistory);
    console.log(`Emergency cleanup: removed ${removeCount} oldest results`);

    showNotification(
      `Storage quota exceeded. Removed ${removeCount} old results to free space.`,
      0,
      { important: true, customTitle: "Storage Warning", duration: 5 },
    );
  }

  public getVersion(): number {
    const version = this.get(StorageKey.VERSION);
    if (version === null || version === "") return 0;
    return parseInt(version, 10);
  }

  public setVersion(version: number): void {
    this.set(StorageKey.VERSION, version.toString());
  }

  public getSettings(): unknown {
    const data = this.get(StorageKey.SETTINGS);
    if (data === null || data === "") return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  public setSettings(settings: unknown): void {
    try {
      this.set(StorageKey.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      throw createStorageError("WRITE_FAILED", "Failed to save settings");
    }
  }

  public getHistory(): TypedResult[] {
    const data = this.get(StorageKey.HISTORY);
    if (data === null || data === "") return [];
    try {
      const parsed = JSON.parse(data) as TypedResult[];
      return StorageDataSchema.shape.history.parse(parsed);
    } catch (error) {
      console.warn("Failed to parse history:", error);
      return [];
    }
  }

  public setHistory(history: TypedResult[]): void {
    const limitedHistory = history.slice(-MAX_HISTORY_SIZE);
    try {
      this.set(StorageKey.HISTORY, JSON.stringify(limitedHistory));
    } catch (error) {
      if (this.isQuotaError(error)) {
        const trimmedHistory = history.slice(-(MAX_HISTORY_SIZE / 2));
        this.set(StorageKey.HISTORY, JSON.stringify(trimmedHistory));
      }
      throw createStorageError("WRITE_FAILED", "Failed to save history");
    }
  }

  public getResults(): TypedResult[] {
    return this.getHistory();
  }

  public addResult(result: TypedResult): void {
    const history = this.getHistory();
    history.push(result);
    this.setHistory(history);
  }

  public getPersonalBest(): Record<string, number> {
    const data = this.get(StorageKey.PERSONAL_BEST);
    if (data === null || data === "") return {};
    try {
      return JSON.parse(data) as Record<string, number>;
    } catch (error) {
      console.warn("Failed to parse personal best:", error);
      return {};
    }
  }

  public setPersonalBest(pb: Record<string, number>): void {
    try {
      this.set(StorageKey.PERSONAL_BEST, JSON.stringify(pb));
    } catch (error) {
      throw createStorageError("WRITE_FAILED", "Failed to save personal best");
    }
  }

  public updatePersonalBest(key: string, wpm: number): void {
    const pb = this.getPersonalBest();
    const current = pb[key];
    if (current === undefined || wpm > current) {
      pb[key] = wpm;
      this.setPersonalBest(pb);
    }
  }

  public getTags(): Record<string, TagData> {
    const data = this.get(StorageKey.TAGS);
    if (data === null || data === "") return {};
    try {
      return JSON.parse(data) as Record<string, TagData>;
    } catch (error) {
      console.warn("Failed to parse tags:", error);
      return {};
    }
  }

  public setTags(tags: Record<string, TagData>): void {
    try {
      this.set(StorageKey.TAGS, JSON.stringify(tags));
    } catch (error) {
      throw createStorageError("WRITE_FAILED", "Failed to save tags");
    }
  }

  public getAverages(): Record<string, AverageEntry> {
    const data = this.get(StorageKey.AVERAGES);
    if (data === null || data === "") return {};
    try {
      return JSON.parse(data) as Record<string, AverageEntry>;
    } catch (error) {
      console.warn("Failed to parse averages:", error);
      return {};
    }
  }

  public setAverages(averages: Record<string, AverageEntry>): void {
    try {
      this.set(StorageKey.AVERAGES, JSON.stringify(averages));
    } catch (error) {
      throw createStorageError("WRITE_FAILED", "Failed to save averages");
    }
  }

  public updateAverage(
    key: string,
    wpm: number,
    acc: number,
    count: number = 1,
  ): void {
    const averages = this.getAverages();
    const current = averages[key];

    if (current === undefined) {
      averages[key] = { wpm, acc, count };
      this.setAverages(averages);
      return;
    }

    averages[key] = {
      wpm: Math.round(wpm),
      acc: Math.round(acc),
      count: current.count + count,
    };
    this.setAverages(averages);
  }

  public exportData(): string {
    const data: StorageData = {
      settings: this.getSettings(),
      history: this.getHistory(),
      personalBest: this.getPersonalBest(),
      averages: this.getAverages(),
      tags: this.getTags(),
    };
    return JSON.stringify(data, null, 2);
  }

  public importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData) as StorageData;
      const validated = StorageDataSchema.parse(data);

      if (typeof validated.settings !== "undefined") {
        this.setSettings(validated.settings);
      }
      this.setHistory(validated.history);
      this.setPersonalBest(validated.personalBest);
      this.setAverages(validated.averages);
      this.setTags(validated.tags);
    } catch (error) {
      throw createStorageError("READ_FAILED", "Failed to import data");
    }
  }
}

const manager = new LocalStorageManager();

export default manager;
export { LocalStorageManager };
export type {
  StorageData,
  StorageError,
  StorageKey,
  TagData,
  TypedResult,
  AverageEntry,
};
