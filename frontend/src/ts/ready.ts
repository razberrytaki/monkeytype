import * as Misc from "./utils/misc";
import * as MonkeyPower from "./elements/monkey-power";
import * as ServerConfiguration from "./ape/server-configuration";
import { configLoadPromise } from "./config/lifecycle";
import { authPromise } from "./firebase";
import { animate } from "animejs";
import { onDOMReady, qs } from "./utils/dom";

onDOMReady(async () => {
  await configLoadPromise;
  await authPromise;

  //this line goes back to pretty much the beginning of the project and im pretty sure its here
  //to make sure the initial theme application doesnt animate the background color
  qs("body")?.setStyle({
    transition: "background .25s, transform .05s",
  });
  const app = document.querySelector("#app") as HTMLElement;
  app?.classList.remove("hidden");
  animate(app, {
    opacity: [0, 1],
    duration: Misc.applyReducedMotion(250),
  });

  void ServerConfiguration.sync();

  MonkeyPower.init();

  // Privacy fork: avoid PWA/runtime caching so users don't get stale upstream
  // bundles that may still contain removed UI such as cookie or merch prompts.
  if ("serviceWorker" in navigator) {
    void navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        void registration.unregister();
      }
    });
  }
  if ("caches" in window) {
    void caches.keys().then((names) => {
      for (const name of names) {
        void caches.delete(name);
      }
    });
  }
});
