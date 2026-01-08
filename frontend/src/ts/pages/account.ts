/**
 * @deprecated Account page removed in privacy fork
 * This file is a stub to prevent build errors.
 */

import Page, { PageName } from "./page";

export default class AccountPage extends Page<undefined> {
  getId(): PageName {
    return "account";
  }

  init(): void {
    // No-op - account page removed in privacy fork
  }

  update(_options?: unknown): void {
    // No-op - account page removed in privacy fork
  }

  static updateTagsForResult(_resultId: string, _tags: string[]): void {
    // No-op - account page removed in privacy fork
  }
}
