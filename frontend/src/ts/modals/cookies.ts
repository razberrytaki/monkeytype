import * as Notifications from "../elements/notifications";
import { isPopupVisible } from "../utils/misc";
import { focusWords } from "../test/test-ui";
import AnimatedModal from "../utils/animated-modal";

const modal = new AnimatedModal({
  dialogId: "cookiesModal",
  customEscapeHandler: (): void => {
    //
  },
  customWrapperClickHandler: (): void => {
    //
  },
  setup: async (modalEl): Promise<void> => {
    modalEl.qs(".acceptAll")?.on("click", () => {
      Notifications.add("All cookies accepted (analytics disabled)", 0);
      void hide();
    });
    modalEl.qs(".rejectAll")?.on("click", () => {
      Notifications.add("Only essential cookies accepted", 0);
      void hide();
    });
    modalEl.qs(".acceptSelected")?.on("click", () => {
      Notifications.add("Selected cookies accepted (analytics disabled)", 0);
      void hide();
    });
  },
});

export function show(goToSettings?: boolean): void {
  void modal.show({
    beforeAnimation: async () => {
      if (goToSettings) {
        modal.getModal().qs(".main")?.hide();
        modal.getModal().qs(".settings")?.show();
      }
    },
    afterAnimation: async () => {
      if (!isPopupVisible("cookiesModal")) {
        modal.destroy();
      }
    },
  });
}

async function hide(): Promise<void> {
  void modal.hide({
    afterAnimation: async () => {
      focusWords();
    },
  });
}
