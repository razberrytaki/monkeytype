import { getAvatarElement } from "../utils/discord-avatar";
import { qsr } from "../utils/dom";

const nav = qsr("header nav");
const accountButtonAndMenuEl = nav.qsr(".accountButtonAndMenu");
const loginButtonEl = nav.qsr(".textButton.view-login");

export function hide(): void {
  accountButtonAndMenuEl.addClass("hidden");
  loginButtonEl.addClass("hidden");
  // Always hide in privacy mode
}

export function loading(state: boolean): void {
  accountButtonAndMenuEl
    .qs(".spinner")
    ?.setStyle({ opacity: state ? "1" : "0" });
  accountButtonAndMenuEl
    .qs(".avatar")
    ?.setStyle({ opacity: state ? "0" : "1" });
}

export function updateName(name: string): void {
  accountButtonAndMenuEl.qs(".view-account > .text")?.setText(name);
}

export function updateAvatar(avatar?: {
  discordId?: string;
  discordAvatar?: string;
}): void {
  const element = getAvatarElement(avatar ?? {}, {
    userIcon: "fas fa-fw fa-user",
  });
  accountButtonAndMenuEl.qs(".avatar")?.replaceWith(element);
}

export function update(): void {
  // Privacy mode: always hide account button and menu
  accountButtonAndMenuEl.addClass("hidden");
  loginButtonEl.addClass("hidden");

  // Original update logic for authenticated state (now skipped)
  // No authentication in privacy fork
  return;
}

export function updateFriendRequestsIndicator(_count: number): void {
  // No-op - no friend requests in privacy fork
}
