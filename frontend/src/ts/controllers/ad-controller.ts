/** Privacy fork: advertising is intentionally removed. */
export const adBlock = false;
export const cookieBlocker = false;

export async function checkAdblock(): Promise<void> {
  // No-op: ads removed.
}

export async function checkCookieblocker(): Promise<void> {
  // No-op: ads removed.
}

export async function reinstate(): Promise<boolean> {
  return false;
}

export async function renderResult(): Promise<void> {
  // No-op: ads removed.
}

export function showConsentPopup(): void {
  // No-op: ads removed.
}

export function destroyResult(): void {
  // No-op: ads removed.
}

export function updateFooterAndVerticalAds(_visible: boolean): void {
  // No-op: ads removed.
}
