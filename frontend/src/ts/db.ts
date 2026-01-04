/**
 * @deprecated Database sync removed in privacy fork
 * This file is a stub to prevent build errors.
 * Data is now persisted using localStorage.
 */

type Snapshot = {
  isPremium: boolean;
  typingStats: {
    completedTests: number;
  };
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

export async function getUserAverage10(_mode: string, _mode2: string): Promise<[number, number] | null> {
  return null;
}

export async function getLocalPB(_mode: string, _mode2: string): Promise<number | null> {
  return null;
}

export function setSnapshot(_snapshot: Partial<Snapshot>): void {
  // No-op
}
