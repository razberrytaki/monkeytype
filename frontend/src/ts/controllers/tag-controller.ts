import { z } from "zod";
import * as DB from "../db";
import * as ModesNotice from "../elements/modes-notice";
import { LocalStorageWithSchema } from "../utils/local-storage-with-schema";
import { IdSchema } from "@monkeytype/schemas/util";
import * as AuthEvent from "../observables/auth-event";

const activeTagsLS = new LocalStorageWithSchema({
  key: "activeTags",
  schema: z.array(IdSchema),
  fallback: [],
});

export function saveActiveToLocalStorage(): void {
  const tags: string[] = [];

  DB.getSnapshot()?.tags?.forEach((tag) => {
    if (tag.active === true) {
      tags.push(tag._id);
    }
  });

  activeTagsLS.set(tags);
}

export function clear(nosave = false): void {
  // oxlint-disable-next-line strict-boolean-expressions
  const snapshot = DB.getSnapshot();
  if (!snapshot) return;

  snapshot.tags = snapshot.tags?.map((tag) => {
    tag.active = false;
    return tag;
  });

  DB.setSnapshot(snapshot);
  void ModesNotice.update();
  if (!nosave) saveActiveToLocalStorage();
}

export function toggle(tagid: string, nosave = false): void {
  DB.getSnapshot()?.tags?.forEach((tag) => {
    if (tag._id === tagid) {
      if (tag.active === undefined) {
        tag.active = true;
      } else {
        tag.active = !tag.active;
      }
    }
  });
  void ModesNotice.update();
  if (!nosave) saveActiveToLocalStorage();
}

export function loadActiveFromLocalStorage(): void {
  const newTags = activeTagsLS.get();
  for (const tag of newTags) {
    toggle(tag, true);
  }
  saveActiveToLocalStorage();
}

// oxlint-disable-next-line no-deprecated
AuthEvent.subscribe((event) => {
  if (event?.type === "snapshotUpdated") {
    const data = event.data as { isInitial?: boolean };
    if (data.isInitial) {
      loadActiveFromLocalStorage();
    }
  }
});
