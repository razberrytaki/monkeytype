/**
 * @deprecated Authentication removed in privacy fork
 * This file is a stub to prevent build errors.
 */
export function init(): Promise<void> {
  throw new Error("Authentication removed in privacy fork");
}

export function isAuthenticated(): boolean {
  return false;
}

export function isAuthAvailable(): boolean {
  return false;
}

export function getAuthenticatedUser(): never {
  throw new Error("Authentication removed in privacy fork");
}

export function signOut(): Promise<void> {
  throw new Error("Authentication removed in privacy fork");
}

export const authPromise = Promise.resolve();
