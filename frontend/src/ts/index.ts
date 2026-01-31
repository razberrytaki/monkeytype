import "../styles/vendor.scss";
import "../styles/index.scss";
import "./event-handlers/global";
import "./event-handlers/footer";
import "./event-handlers/keymap";
import "./event-handlers/test";
import "./event-handlers/about";
import "./event-handlers/settings";

import * as Notifications from "./elements/notifications";
import { setNotificationHandler } from "@monkeytype/local-storage-manager";

import "./ui";
import "./input/listeners";
import "./ready";
import "./controllers/route-controller";
import "./utils/url-handler";
import "./test/tts";
import "./elements/psa";

import { isDevEnvironment, addToGlobal } from "./utils/misc";
import * as VersionButton from "./elements/version-button";
import * as Focus from "./test/focus";
import { getDevOptionsModal } from "./utils/async-modules";
import { mountComponents } from "./components/mount";
import { applyEngineSettings } from "./anim";
import Config, { loadFromLocalStorage } from "./config";
import * as TestStats from "./test/test-stats";
import * as Replay from "./test/replay";
import * as TestTimer from "./test/test-timer";
import * as Result from "./test/result";
import * as Logger from "./utils/logger";
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

addToGlobal({
  config: Config,
  stats: TestStats.getStats,
  replay: Replay.getReplayExport,
  enableTimerDebug: TestTimer.enableTimerDebug,
  getTimerStats: TestTimer.getTimerStats,
  toggleSmoothedBurst: Result.toggleSmoothedBurst,
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

mountComponents();
