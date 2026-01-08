/**
 * @deprecated Authentication removed in privacy fork
 * This file is a stub to prevent build errors.
 */

export function subscribe(
  _callback: (event?: { type: string; data?: unknown }) => void,
): void {
  // No-op - authentication disabled in privacy fork
}

export function unsubscribe(): void {
  // No-op - authentication disabled in privacy fork
}

export function getSignedInState(): boolean {
  return false;
}
