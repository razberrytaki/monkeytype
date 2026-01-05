/**
 * @deprecated Database sync removed in privacy fork
 * This file is a stub to prevent build errors.
 * Data is now persisted using localStorage.
 */

import storageManager from "@monkeytype/local-storage-manager";

type Tag = {
  name: string;
  stats?: Record<string, unknown>;
};

type Preset = Record<string, unknown>;

type CustomTheme = Record<string, unknown>;

type FilterPreset = {
  _id: string;
  name: string;
  pb: { no: boolean; yes: boolean };
  difficulty: Partial<Record<"expert" | "master" | "normal", boolean>>;
  mode: Partial<Record<"custom" | "quote" | "time" | "words" | "zen", boolean>>;
  words: Partial<Record<"custom" | "10" | "25" | "50" | "100", boolean>>;
  time: Partial<Record<"custom" | "15" | "30" | "60" | "120", boolean>>;
  quoteLength: Partial<
    Record<"all" | "short" | "medium" | "long" | "thousand", boolean>
  >;
  punctuation: { on: boolean; off: boolean };
  numbers: { on: boolean; off: boolean };
  date: Partial<Record<string, boolean>>;
  funbox: Partial<Record<string, boolean>>;
};

type Snapshot = {
  isPremium: boolean;
  typingStats: {
    completedTests: number;
  };
  tags: Record<string, Tag>;
  presets: Record<string, Preset>;
  customThemes: Record<string, CustomTheme>;
  favoriteQuotes: Record<string, string[]>;
  connections: unknown[];
  filterPresets: FilterPreset[];
};

export async function initSnapshot(): Promise<false> {
  return false;
}

export function getSnapshot(): Snapshot | null {
  return null;
}

export async function clearLocalDB(): Promise<void> {
  // No-op - data stored in localStorage
}

export async function saveConfig(_config: unknown): Promise<void> {
  // No-op - config saved via localStorage
}

export async function resetConfig(): Promise<void> {
  // No-op
}

export async function getUserAverage10(
  _mode: string,
  _mode2: string,
  _punctuation: boolean,
  _numbers: boolean,
  _language: string,
  _difficulty: string,
  _lazyMode: boolean,
): Promise<[number, number] | null> {
  const key = `${_mode}_${_mode2}_${_punctuation}_${_numbers}_${_language}_${_difficulty}`;
  const avg = storageManager.getAverages()[key];
  if (!avg) return null;
  return [avg.wpm, avg.acc];
}

export async function getLocalPB(
  _mode: string,
  _mode2: string,
  _punctuation: boolean,
  _numbers: boolean,
  _language: string,
  _difficulty: string,
  _lazyMode: boolean,
  _funbox: string[],
): Promise<number | null> {
  return (
    storageManager.getPersonalBest()?.[
      `${_mode}_${_mode2}_${_punctuation}_${_numbers}_${_language}_${_difficulty}_${_lazyMode}`
    ] ?? null
  );
}

export function setSnapshot(_snapshot: Partial<Snapshot>): void {
  // No-op
}

export function isFriend(_uid: string): boolean {
  return false;
}

export function getActiveFunboxes(): string[] {
  return [];
}
