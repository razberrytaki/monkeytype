/**
 * This file is a stub to prevent build errors in privacy fork.
 * Authentication functionality has been removed.
 */
export async function init(): Promise<void> {
  throw new Error("Authentication removed in privacy fork");
}

export function isAuthenticated(): boolean {
  return false;
}

export function isAuthAvailable(): boolean {
  return false;
}

export function getAuthenticatedUser(): { uid: string } | null {
  return null;
}

export async function signOut(): Promise<void> {
  throw new Error("Authentication removed in privacy fork");
}

export const authPromise = Promise.resolve();

export function getAnalytics(): never {
  throw new Error("Analytics removed in privacy fork");
}

export function resetIgnoreAuthCallback(): void {
  // No-op - authentication removed in privacy fork
}
