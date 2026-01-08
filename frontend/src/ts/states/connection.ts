/**
 * This file is a stub to prevent build errors in privacy fork.
 * Backend connection functionality has been removed.
 */

export function get(): boolean {
  return true;
}

export function isSignedIn(): boolean {
  return false;
}

export function hasActiveConfig(): boolean {
  return false;
}

export function showOfflineBanner(): void {
  // No-op
}
