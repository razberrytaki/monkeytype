import Config, { applyConfig, saveFullConfigToLocalStorage } from "../config";
import * as DB from "../db";
import * as Notifications from "../elements/notifications";
import * as TestLogic from "../test/test-logic";
import * as TagController from "./tag-controller";
import type { Preset } from "@monkeytype/schemas/presets";
import type { SnapshotPreset } from "../constants/default-snapshot";

export async function apply(_id: string): Promise<void> {
  // oxlint-disable-next-line strict-boolean-expressions
  const snapshot = DB.getSnapshot();
  if (!snapshot) return;

  const presetToApply = snapshot.presets?.find((preset) => preset._id === _id);
  if (presetToApply === undefined) {
    return;
  }

  if (isPartialPreset(presetToApply)) {
    await applyConfig({
      ...structuredClone(Config),
      ...presetToApply.config,
    });
  } else {
    await applyConfig(presetToApply.config);
  }

  if (
    !isPartialPreset(presetToApply) ||
    presetToApply.settingGroups?.includes("behavior")
  ) {
    TagController.clear(true);
    if (presetToApply.config.tags) {
      for (const tagId of presetToApply.config.tags) {
        TagController.toggle(tagId, false);
      }
      TagController.saveActiveToLocalStorage();
    }
  }
  TestLogic.restart();
  Notifications.add("Preset applied", 1, {
    duration: 2,
  });
  saveFullConfigToLocalStorage();
}
function isPartialPreset(preset: SnapshotPreset): boolean {
  return preset.settingGroups !== undefined && preset.settingGroups !== null;
}

export async function getPreset(_id: string): Promise<Preset | undefined> {
  // oxlint-disable-next-line strict-boolean-expressions
  const snapshot = DB.getSnapshot();
  if (!snapshot) {
    return;
  }

  const preset = snapshot.presets?.find((preset) => preset._id === _id);

  if (preset === undefined) {
    Notifications.add("Preset not found", 0);
    return;
  }
  return preset;
}
