import { isDevEnvironment } from "../utils/misc";
import * as Version from "../states/version";

function setText(text: string): void {
  $("footer .currentVersion .text").text(text);
}

function setIndicatorVisible(state: boolean): void {
  if (state) {
    $("#newVersionIndicator").removeClass("hidden");
  } else {
    $("#newVersionIndicator").addClass("hidden");
  }
}

export async function update(): Promise<void> {
  console.log("Version.update(): starting");
  if (isDevEnvironment()) {
    console.log("Version.update(): dev environment, setting text to localhost");
    setText("localhost");
    return;
  }

  console.log("Version.update(): getting version from GitHub");
  const { version, isNew } = await Version.get();
  console.log("Version.update(): got version", { version, isNew });
  setText(version);
  setIndicatorVisible(isNew);
  console.log("Version.update(): complete");
}
