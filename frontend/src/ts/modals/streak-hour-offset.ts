// Stub for privacy fork - streak hour offset modal disabled
import * as Notifications from "../elements/notifications";

export function show(): void {
  Notifications.add("Streak hour offset is disabled in privacy fork", 0, {
    duration: 3,
  });
}
