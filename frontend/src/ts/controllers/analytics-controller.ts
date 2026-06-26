/** Privacy fork: analytics/Google Tag Manager are intentionally disabled. */
export async function log(
  _eventName: string,
  _params?: Record<string, string>,
): Promise<void> {
  // No-op.
}

export function activateAnalytics(): void {
  // No-op.
}
