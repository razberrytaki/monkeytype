import { Ape } from "../ape";
import * as DB from "../db";
import { IsValidResponse } from "../elements/input-validation";
import * as Settings from "../pages/settings";
import AnimatedModal, { ShowOptions } from "../utils/animated-modal";
import { SimpleModal, TextInput, ExecReturn } from "../utils/simple-modal";
import { TagNameSchema } from "@monkeytype/schemas/users";
import { SnapshotUserTag } from "../constants/default-snapshot";

function getTagFromSnapshot(tagId: string): SnapshotUserTag | undefined {
  return DB.getSnapshot()?.tags.find((tag) => tag._id === tagId);
}

const cleanTagName = (tagName: string): string => tagName.replaceAll(" ", "_");
const tagNameValidation = async (tagName: string): Promise<IsValidResponse> => {
  const validationResult = TagNameSchema.safeParse(cleanTagName(tagName));
  if (validationResult.success) return true;
  return validationResult.error.errors.map((err) => err.message).join(", ");
};

type Action = "add" | "edit" | "remove" | "clearPb";
const actionModals: Record<Action, SimpleModal> = {
  add: new SimpleModal({
    id: "addTag",
    title: "Add new tag",
    inputs: [
      {
        placeholder: "tag name",
        type: "text",
        validation: { isValid: tagNameValidation, debounceDelay: 0 },
      },
    ],
    onlineOnly: true,
    buttonText: "add",
    execFn: async (_thisPopup, ...params): Promise<ExecReturn> => {
      const propTagName = params[0] ?? "";
      const tagName = cleanTagName(propTagName);
      const response = await Ape.users.createTag({ body: { name: tagName } });

      if (response.status !== 200) {
        return {
          status: -1,
          message:
            "Failed to add tag: " +
            response.body.message.replace(tagName, propTagName),
          notificationOptions: { response },
        } as ExecReturn;
      }

      DB.getSnapshot()?.tags?.push({
        display: propTagName,
        name: response.body.data?.name ?? tagName,
        _id: response.body.data?.name ?? tagName,
        personalBests: {
          time: {},
          words: {},
          quote: {},
          zen: {},
          custom: {},
        },
      });
      void Settings.update();

      return { status: 1, message: `Tag added` };
    },
  }),
  edit: new SimpleModal({
    id: "editTag",
    title: "Edit tag",
    inputs: [
      {
        placeholder: "tag name",
        type: "text",
        validation: { isValid: tagNameValidation, debounceDelay: 0 },
      },
    ],
    onlineOnly: true,
    buttonText: "save",
    beforeInitFn: (_thisPopup) => {
      (_thisPopup.inputs[0] as TextInput).initVal = _thisPopup.parameters[0];
    },
    execFn: async (_thisPopup, ...params): Promise<ExecReturn> => {
      const propTagName = params[0] ?? "";
      const tagName = cleanTagName(propTagName);
      const tagId = _thisPopup.parameters[1] as string;

      const response = await Ape.users.editTag({
        params: { tag: tagId },
        body: { newName: tagName },
      });

      if (response.status !== 200) {
        return {
          status: -1,
          message: "Failed to edit tag",
          notificationOptions: { response },
        } as ExecReturn;
      }

      const matchingTag = getTagFromSnapshot(tagId);

      if (matchingTag !== undefined) {
        matchingTag.name = tagName;
        matchingTag.display = propTagName;
      }

      void Settings.update();

      return { status: 1, message: `Tag updated` };
    },
  }),
  remove: new SimpleModal({
    id: "removeTag",
    title: "Delete tag",
    onlineOnly: true,
    buttonText: "delete",
    beforeInitFn: (_thisPopup) => {
      _thisPopup.text = `Are you sure you want to delete tag ${_thisPopup.parameters[0]} ?`;
    },
    execFn: async (_thisPopup) => {
      const tagId = _thisPopup.parameters[1] as string;
      const response = await Ape.users.deleteTag({ params: { tag: tagId } });

      if (response.status !== 200) {
        return {
          status: -1,
          message: "Failed to remove tag",
          notificationOptions: { response },
        };
      }

      const snapshot = DB.getSnapshot();
      if (snapshot?.tags) {
        snapshot.tags = snapshot.tags.filter((it) => it._id !== tagId);
      }

      void Settings.update();
      return { status: 1, message: `Tag removed` };
    },
  }),
  clearPb: new SimpleModal({
    id: "clearTagPb",
    title: "Clear personal bests",
    onlineOnly: true,
    buttonText: "clear",
    beforeInitFn: (_thisPopup) => {
      _thisPopup.text = `Are you sure you want to clear personal bests for tag ${_thisPopup.parameters[0]} ?`;
    },
    execFn: async (_thisPopup) => {
      const tagId = _thisPopup.parameters[1] as string;
      const response = await Ape.users.deleteTagPersonalBest({
        params: { tag: tagId },
      });

      if (response.status !== 200) {
        return {
          status: -1,
          message: "Failed to clear tag pb",
          notificationOptions: { response },
        };
      }

      const matchingTag = getTagFromSnapshot(tagId);

      if (matchingTag !== undefined) {
        matchingTag.personalBests = {
          time: {},
          words: {},
          quote: {},
          zen: {},
          custom: {},
        };
      }

      void Settings.update();
      return { status: 1, message: `Tag PB cleared` };
    },
  }),
};

export function show(
  action: Action,
  id?: string,
  name?: string,
  modalChain?: AnimatedModal,
): void {
  const options: ShowOptions = {
    modalChain,
    focusFirstInput: "focusAndSelect",
  };
  if (action !== "add" && (name === undefined || id === undefined)) return;

  actionModals[action].show([name ?? "", id ?? ""], options);
}
