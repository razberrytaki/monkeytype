/**
 * @deprecated Database sync removed in privacy fork
 * This file is a stub to prevent build errors.
 * Data is now persisted using localStorage.
 */

import storageManager from "@monkeytype/local-storage-manager";
import type { Snapshot as DefaultSnapshot } from "./constants/default-snapshot";

type CustomTheme = {
  _id: string;
  name: string;
  colors: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];
};

export type Snapshot = DefaultSnapshot & {
  typingStats: {
    testsCompleted: number;
    testsStarted: number;
    timeTyping: number;
  };
  customThemes: CustomTheme[];
};

export async function initSnapshot(): Promise<false> {
  return false;
}

export function getSnapshot(): Snapshot | null {
  return {
    typingStats: {
      testsCompleted: 0,
      testsStarted: 0,
      timeTyping: 0,
    },
    customThemes: [],
    connections: {},
    uid: "guest",
    name: "Guest",
    email: "guest@local",
    addedAt: Date.now(),
    tags: [],
    themes: [],
    presets: [],
    resultFilters: [],
    favorites: [],
    banned: false,
    personalBests: {},
    customBackground: null,
    customLayout: "default",
    customThemeRefreshedOn: 0,
    discordId: "",
    discordAvatar: "",
    inventory: {
      badges: [],
    },
    xp: 0,
    streak: 0,
    maxStreak: 0,
    testActivity: [],
    startedTests: 0,
    completedTests: 0,
  } as unknown as Snapshot;
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

export function getActiveFunboxes(): Array<{
  name: string;
  properties: string[];
  functions?: unknown;
}> {
  return [];
}

export function updateInboxUnreadSize(_size: number): void {
  // No-op
}

export function addBadge(_badgeId: number): void {
  // No-op
}

export function addXp(_xp: number): void {
  // No-op
}

export async function getActiveTagsPB(
  _mode: string,
  _mode2: string,
  _punctuation: boolean,
  _numbers: boolean,
  _language: string,
  _difficulty: string,
  _lazyMode: boolean,
): Promise<number | null> {
  return null;
}

export function getLocalTagPB(
  _tagName: string,
  _mode: string,
  _mode2: string,
  _punctuation: boolean,
  _numbers: boolean,
  _language: string,
  _difficulty: string,
): number | null {
  return null;
}

export function saveLocalTagPB(
  _tagName: string,
  _mode: string,
  _mode2: string,
  _punctuation: boolean,
  _numbers: boolean,
  _language: string,
  _difficulty: string,
  _lazyMode: boolean,
  _wpm: number,
  _acc: number,
  _rawWpm: number,
  _consistency: number,
): void {
  // No-op
}

export async function getUserDailyBest(
  _mode: string,
  _mode2: string,
  _punctuation: boolean,
  _numbers: boolean,
  _language: string,
  _difficulty: string,
  _lazyMode: boolean,
): Promise<number | null> {
  return null;
}

export function updateLbMemory(
  _type: string,
  _mode2: string,
  _language: string,
  _rank: number,
  _isPb: boolean,
): void {
  // No-op
}

export function mergeConnections(_connections: unknown[]): void {
  // No-op
}

export async function saveLocalResult(_result: unknown): Promise<void> {
  // No-op
}

export async function saveLocalResultData(
  _result: unknown,
  _isPb: boolean,
  _tags: string[],
): Promise<void> {
  // No-op
}

export type SaveLocalResultData = {
  xp?: number;
  streak?: number;
  result?: unknown;
  isPb?: boolean;
};

export async function addCustomTheme(_theme: unknown): Promise<void> {
  // No-op
}

export async function deleteCustomTheme(_id: string): Promise<void> {
  // No-op
}

export async function editCustomTheme(
  _id: string,
  _theme: unknown,
): Promise<void> {
  // No-op
}

export async function getTestActivityCalendar(
  _selected?: string,
): Promise<null> {
  return null;
}
