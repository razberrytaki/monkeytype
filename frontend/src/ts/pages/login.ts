/**
 * @deprecated Login page removed in privacy fork
 * This file is a stub to prevent build errors.
 */

import Page, { PageName } from "./page";

export default class LoginPage extends Page<undefined> {
  getId(): PageName {
    return "login";
  }

  init(): void {
    // No-op - login page removed in privacy fork
  }

  update(_options?: unknown): void {
    // No-op - login page removed in privacy fork
  }
}

export function hidePreloader(): void {
  // No-op
}

export function enableInputs(): void {
  // No-op
}

export function enableSignUpButton(): void {
  // No-op
}
