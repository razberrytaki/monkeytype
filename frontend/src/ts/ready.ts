import * as Misc from "./utils/misc";
import * as MonkeyPower from "./elements/monkey-power";
import * as MerchBanner from "./elements/merch-banner";
import * as ConnectionState from "./states/connection";
import * as AccountButton from "./elements/account-button";
import * as Loader from "./elements/loader";
import * as ServerConfiguration from "./ape/server-configuration";
import { getActiveFunboxesWithFunction } from "./test/funbox/list";
import { configLoadPromise } from "./config";
import { authPromise } from "./firebase";
import { animate } from "animejs";
import { onDOMReady, qs } from "./utils/dom";

onDOMReady(async () => {
  console.log("onDOMReady callback started");
  console.log("waiting for configLoadPromise...");
  await configLoadPromise;
  console.log("configLoadPromise resolved");
  console.log("waiting for authPromise...");
  await authPromise;
  console.log("authPromise resolved");

  //this line goes back to pretty much the beginning of the project and im pretty sure its here
  //to make sure the initial theme application doesnt animate the background color
  console.log("ready.ts: applying body transition");
  qs("body")?.setStyle({
    transition: "background .25s, transform .05s",
  });
  console.log("ready.ts: showing merch banner if not closed before");
  MerchBanner.showIfNotClosedBefore();

  for (const fb of getActiveFunboxesWithFunction("applyGlobalCSS")) {
    fb.functions.applyGlobalCSS();
  }

  console.log("ready.ts: getting app element");
  const app = document.querySelector("#app") as HTMLElement;
  console.log("ready.ts: app element found", app);
  app?.classList.remove("hidden");
  console.log("ready.ts: removed hidden class from app");
  animate(app, {
    opacity: [0, 1],
    duration: Misc.applyReducedMotion(250),
  });
  console.log("ready.ts: animating app opacity");
  Loader.hide();
  console.log("ready.ts: loader hidden");
  // oxlint-disable-next-line no-deprecated,strict-boolean-expressions
  if (ConnectionState.get()) {
    void ServerConfiguration.sync().then(() => {
      if (!ServerConfiguration.get()?.users?.signUp) {
        AccountButton.hide();
        qs(".register")?.addClass("hidden");
        qs(".login")?.addClass("hidden");
        qs(".disabledNotification")?.removeClass("hidden");
      }
      if (!ServerConfiguration.get()?.connections?.enabled) {
        qs(".accountButtonAndMenu .goToFriends")?.addClass("hidden");
      }
    });
  }
  MonkeyPower.init();

  if (Misc.isDevEnvironment()) {
    void navigator.serviceWorker
      .getRegistrations()
      .then(function (registrations) {
        for (const registration of registrations) {
          void registration.unregister();
        }
      });
  } else {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            console.log(
              "ServiceWorker registration successful with scope: ",
              registration.scope,
            );
          })
          .catch((error: unknown) => {
            console.error("ServiceWorker registration failed: ", error);
          });
      });
    }
  }
});
