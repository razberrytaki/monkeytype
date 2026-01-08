/**
 * @deprecated Account settings page removed in privacy fork
 * This file is a stub to prevent build errors.
 */

import Page, { PageName } from "./page";

export default class AccountSettingsPage extends Page<undefined> {
  getId(): PageName {
    return "accountSettings";
  }

  init(): void {
    // No-op - account settings page removed in privacy fork
  }

  update(_options?: unknown): void {
    // No-op - account settings page removed in privacy fork
  }
}

export function updateUI(): void {
  // No-op - account settings page removed in privacy fork
}
