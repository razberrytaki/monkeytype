// Cookies disabled for offline version
export type AcceptedCookies = {
  security: boolean;
  analytics: boolean;
  sentry: boolean;
};

export function getAcceptedCookies(): AcceptedCookies | undefined {
  return undefined;
}

export function setAcceptedCookies(_accepted: AcceptedCookies): void {
  // No-op for offline version
}

export function activateWhatsAccepted(): void {
  // No-op for offline version
}
