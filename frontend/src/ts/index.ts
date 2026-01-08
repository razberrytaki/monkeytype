import "../styles/vendor.scss";
import "../styles/index.scss";
import "./event-handlers/global";
import "./event-handlers/footer";
import "./event-handlers/keymap";
import "./event-handlers/test";
import "./event-handlers/about";
import "./event-handlers/settings";

import * as Logger from "./utils/logger";
import * as Notifications from "./elements/notifications";
import { setNotificationHandler } from "@monkeytype/local-storage-manager";
import "./ui";
import "./controllers/ad-controller";
import Config, { loadFromLocalStorage } from "./config";
import * as TestStats from "./test/test-stats";
import * as Replay from "./test/replay";
import * as TestTimer from "./test/test-timer";
import * as Result from "./test/result";
import { enable } from "./states/glarses-mode";
import "./test/caps-warning";
import "./modals/simple-modals";
// Cookies disabled for offline version
// import * as CookiesModal from "./modals/cookies";
import "./input/listeners";
import "./ready";
import "./controllers/route-controller";
import "./pages/about";
import "./elements/scroll-to-top";
import "./elements/no-css";
import { egVideoListener } from "./popups/video-ad-popup";
import "./test/tts";
import "./elements/fps-counter";
import { isDevEnvironment, addToGlobal } from "./utils/misc";
import * as VersionButton from "./elements/version-button";
import * as Focus from "./test/focus";
import { getDevOptionsModal } from "./utils/async-modules";
// Cookies disabled for offline version
// import * as Cookies from "./cookies";
import "./elements/psa";
import "./utils/url-handler";
import { applyEngineSettings } from "./anim";
import { qs, qsa, qsr } from "./utils/dom";

// Lock Math.random
Object.defineProperty(Math, "random", {
  value: Math.random,
  writable: false,
  configurable: false,
  enumerable: true,
});

// Freeze Math object
Object.freeze(Math);

// Lock Math on window
Object.defineProperty(window, "Math", {
  value: Math,
  writable: false,
  configurable: false,
  enumerable: true,
});

setNotificationHandler(Notifications.add);

console.log("index.ts: applying engine settings");
applyEngineSettings();
console.log("index.ts: loading from localStorage");
void loadFromLocalStorage();
console.log("index.ts: updating version button");
void VersionButton.update();
console.log("index.ts: setting focus");
Focus.set(true, true);
console.log("index.ts: ready import already done (line 23)");

// Cookies disabled for offline version
// const accepted = Cookies.getAcceptedCookies();
// if (accepted === null) {
//   if (isDevEnvironment()) {
//     const autoAccepted = {
//       security: true,
//       analytics: true,
//       sentry: true,
//     };
//     Cookies.setAcceptedCookies(autoAccepted);
//     Cookies.activateWhatsAccepted();
//   } else {
//     CookiesModal.show();
//   }
// } else {
//   Cookies.activateWhatsAccepted();
// }

addToGlobal({
  config: Config,
  glarsesMode: enable,
  stats: TestStats.getStats,
  replay: Replay.getReplayExport,
  enableTimerDebug: TestTimer.enableTimerDebug,
  getTimerStats: TestTimer.getTimerStats,
  toggleSmoothedBurst: Result.toggleSmoothedBurst,
  egVideoListener: egVideoListener,
  toggleDebugLogs: Logger.toggleDebugLogs,
  qs: qs,
  qsa: qsa,
  qsr: qsr,
});

if (isDevEnvironment()) {
  void import("jquery").then((jq) => {
    addToGlobal({ $: jq.default });
  });
  void getDevOptionsModal().then((module) => {
    module.appendButton();
  });
}
