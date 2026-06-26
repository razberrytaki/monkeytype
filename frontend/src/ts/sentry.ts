/** Privacy fork: Sentry is intentionally disabled. */
export function captureException(_error: unknown): void {
  // No-op.
}

export function captureMessage(_message: string): void {
  // No-op.
}

export async function setUser(_uid?: string, _name?: string): Promise<void> {
  // No-op.
}

export async function clearUser(): Promise<void> {
  // No-op.
}

export function activateSentry(): void {
  // No-op.
}

export function toggleDebug(): void {
  // No-op.
}
