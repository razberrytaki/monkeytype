import type { Analytics } from "firebase/analytics";
import type { AuthProvider, User, UserCredential } from "firebase/auth";

/**
 * Privacy fork: Firebase/authentication is intentionally disabled.
 * Keep the public module surface so upstream UI code can compile, but never
 * initialize Firebase, create sessions, request ID tokens, or load analytics.
 */
type ReadyCallback = (success: boolean, user: User | null) => Promise<void>;

export const authPromise: Promise<void> = Promise.resolve();

export async function init(callback?: ReadyCallback): Promise<void> {
  await callback?.(false, null);
}

export function getAuthenticatedUser(): User | null {
  return null;
}

export function getAnalytics(): Analytics {
  throw new Error("Analytics removed in privacy fork");
}

export function isAuthAvailable(): boolean {
  return false;
}

export function isAuthenticated(): boolean {
  return false;
}

export async function signOut(): Promise<void> {
  // No-op: authentication removed in privacy fork.
}

export async function signInWithEmailAndPassword(
  _email: string,
  _password: string,
  _rememberMe: boolean,
): Promise<UserCredential> {
  throw new Error("Authentication removed in privacy fork");
}

export function setUserState(_user: User | null): void {
  // No-op: authentication removed in privacy fork.
}

export async function signInWithPopup(
  _provider: AuthProvider,
  _rememberMe: boolean,
): Promise<void> {
  throw new Error("Authentication removed in privacy fork");
}

export async function createUserWithEmailAndPassword(
  _email: string,
  _password: string,
): Promise<UserCredential> {
  throw new Error("Authentication removed in privacy fork");
}

export async function getIdToken(): Promise<string | null> {
  return null;
}

export function resetIgnoreAuthCallback(): void {
  // No-op: authentication removed in privacy fork.
}
