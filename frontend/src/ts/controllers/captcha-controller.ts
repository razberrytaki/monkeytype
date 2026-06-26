/** Privacy fork: reCAPTCHA is intentionally disabled. */
export function isCaptchaAvailable(): boolean {
  return false;
}

export function render(
  _element: HTMLElement,
  _id: string,
  _callback?: (responseToken: string) => void,
): void {
  // No-op.
}

export function reset(_id: string): void {
  // No-op.
}

export function getResponse(_id: string): string {
  return "";
}
