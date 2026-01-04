/**
 * @deprecated Database sync removed in privacy fork
 * This file is a stub to prevent build errors.
 * Data is now persisted using localStorage.
 */

import storageManager from "@monkeytype/local-storage-manager";

type Snapshot = {
  isPremium: boolean;
  typingStats: {
    completedTests: number;
  };
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
): Promise<[number, number] | null> {
  return null;
}

export async function getLocalPB(
  _mode: string,
  _mode2: string,
): Promise<number | null> {
  return null;
}

export function setSnapshot(_snapshot: Partial<Snapshot>): void {
  // No-op
}
