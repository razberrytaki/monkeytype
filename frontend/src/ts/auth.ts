/**
 * This file is a stub to prevent build errors in privacy fork.
 * Authentication functionality has been removed.
 */
export const gmailProvider = "";
export const githubProvider = "";

export async function signIn(): Promise<void> {
  throw new Error("Authentication removed in privacy fork");
}

export async function signOut(): Promise<void> {
  throw new Error("Authentication removed in privacy fork");
}

export async function loadUser(_user?: unknown): Promise<void> {
  // No-op - authentication removed in privacy fork
}

export type FirebaseError = Error;

export async function linkWithCredential(
  _user: unknown,
  _credential: unknown,
): Promise<void> {
  // No-op
}

export async function reauthenticateWithCredential(
  _user: unknown,
  _credential: unknown,
): Promise<void> {
  // No-op
}

export async function reauthenticateWithPopup(
  _user: unknown,
  _provider: string,
): Promise<void> {
  // No-op
}

export async function unlink(_user: unknown): Promise<void> {
  // No-op
}
