import Page from "./page";
import * as Notifications from "../elements/notifications";
import * as UserReportModal from "../modals/user-report";
import * as Skeleton from "../utils/skeleton";
import { UserProfile } from "@monkeytype/schemas/users";
import * as TestActivity from "../elements/test-activity";
import { addFriend } from "./friends";
import { qs, qsr } from "../utils/dom";

function reset(): void {
  qs(".page.pageProfile .error")?.hide();
  qs(".page.pageProfile .preloader")?.show();
  qs(".page.pageProfile .profile")?.setHtml(`
      <div class="details none">
        <div class="avatarAndName">
          <div class="avatar"></div>
          <div>
             <div class="user">
              <div class="name">-</div>
              <div class="userFlags"></div>
            </div>
            <div class="badges"></div>
            <div class="allBadges"></div>
            <div class="joined" data-balloon-pos="up">-</div>
	          <div class="streak" data-balloon-pos="up">-</div>
          </div>
          <div class="levelAndBar">
            <div class="level" data-balloon-pos="up">-</div>
            <div class="xpBar" data-balloon-pos="up">
              <div class="bar" style="width: 0%;"></div>
            </div>
            <div class="xp" data-balloon-pos="up">-/-</div>
          </div>
        </div>
        <div class="separator sep1"></div>
        <div class="typingStats vertical">
          <div class="started">
            <div class="title">tests started</div>
            <div class="value">-</div>
          </div>
          <div class="completed">
            <div class="title">tests completed</div>
            <div class="value">-</div>
          </div>
          <div class="timeTyping">
            <div class="title">time typing</div>
            <div class="value">-</div>
          </div>
        </div>
        <div class="separator sep2 hidden"></div>

        <div class="bioAndKeyboard vertical hidden">
          <div class="bio">
            <div class="title">bio</div>
            <div class="value">-</div>
          </div>
          <div class="keyboard hidden">
            <div class="title">keyboard</div>
            <div class="value">-</div>
          </div>
        </div>
        <div class="separator sep3 hidden"></div>

        <div class="socials big hidden">
          <div class="title">socials</div>
          <div class="value">-</div>
        </div>
        <div class="buttonGroup">
          <button
            class="userReportButton hidden"
            data-balloon-pos="left"
            aria-label="Report user"
          >
            <i class="fas fa-flag"></i>
          </button>
          <button
            class="addFriendButton hidden"
            data-balloon-pos="left"
            aria-label="Send friend request"
          >
            <i class="fas fa-user-plus"></i>
          </button>
        </div>
      </div>
      <div class="leaderboardsPositions">
        <div class="title">All-Time English Leaderboards</div>
        <div class="group t15">
          <div class="testType">15 seconds</div>
          <div class="pos">-</div>
          <div class="topPercentage">-</div>
        </div>
        <div class="group t60">
          <div class="testType">60 seconds</div>
          <div class="pos">-</div>
          <div class="topPercentage">-</div>
        </div>
      </div>
      <div class="pbsWords">
        <div class="group">
          <div class="quick">
            <div class="test">10 words</div>
            <div class="wpm">-</div>
            <div class="acc">-</div>
          </div>
        </div>
        <div class="group">
          <div class="quick">
            <div class="test">25 words</div>
            <div class="wpm">-</div>
            <div class="acc">-</div>
          </div>
        </div>
        <div class="group">
          <div class="quick">
            <div class="test">50 words</div>
            <div class="wpm">-</div>
            <div class="acc">-</div>
          </div>
        </div>
        <div class="group">
          <div class="quick">
            <div class="test">100 words</div>
            <div class="wpm">-</div>
            <div class="acc">-</div>
          </div>
        </div>
      </div>
      <div class="pbsTime">
        <div class="group">
          <div class="quick">
            <div class="test">15 seconds</div>
            <div class="wpm">-</div>
            <div class="acc">-</div>
          </div>
        </div>
        <div class="group">
          <div class="quick">
            <div class="test">30 seconds</div>
            <div class="wpm">-</div>
            <div class="acc">-</div>
          </div>
        </div>
        <div class="group">
          <div class="quick">
            <div class="test">60 seconds</div>
            <div class="wpm">-</div>
            <div class="acc">-</div>
          </div>
        </div>
        <div class="group">
          <div class="quick">
            <div class="test">120 seconds</div>
            <div class="wpm">-</div>
            <div class="acc">-</div>
          </div>
        </div>
      </div><div class="lbOptOutReminder hidden"></div>
      `);

  const testActivityEl = document.querySelector(
    ".page.pageProfile .testActivity",
  );
  if (testActivityEl !== null) {
    TestActivity.clear(testActivityEl as HTMLElement);
  }
}

type UpdateOptions = {
  uidOrName?: string;
  data?: undefined | UserProfile;
};

async function update(_options: UpdateOptions): Promise<void> {
  // Privacy mode: hide profile page
  qs(".pageProfile")?.addClass("hidden");

  // Original profile logic (now skipped)
  return;
}

qs(".page.pageProfile")?.onChild("click", ".profile .userReportButton", () => {
  const uid = qs(".page.pageProfile .profile")?.getAttribute("uid") ?? "";
  const name = qs(".page.pageProfile .profile")?.getAttribute("name") ?? "";
  const lbOptOut =
    (qs(".page.pageProfile .profile")?.getAttribute("lbOptOut") ?? "false") ===
    "true";

  void UserReportModal.show({ uid, name, lbOptOut });
});

qs(".page.pageProfile")?.onChild(
  "click",
  ".profile .addFriendButton",
  async () => {
    const friendName =
      qs(".page.pageProfile .profile")?.getAttribute("name") ?? "";

    const result = await addFriend(friendName);

    if (result === true) {
      Notifications.add(`Request sent to ${friendName}`);
      qs(".profile .details .addFriendButton")?.disable();
    } else {
      Notifications.add(result, -1);
    }
  },
);

export const page = new Page<undefined | UserProfile>({
  id: "profile",
  element: qsr(".page.pageProfile"),
  path: "/profile",
  afterHide: async (): Promise<void> => {
    Skeleton.remove("pageProfile");
    reset();
  },
  beforeShow: async (options): Promise<void> => {
    Skeleton.append("pageProfile", "main");
    const uidOrName = options?.params?.["uidOrName"] ?? "";
    if (uidOrName) {
      qs(".page.pageProfile .preloader")?.show();
      qs(".page.pageProfile .search")?.hide();
      qs(".page.pageProfile .content")?.show();
      reset();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      void update({
        uidOrName,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: options?.data,
      });
    } else {
      qs(".page.pageProfile .preloader")?.hide();
      qs(".page.pageProfile .search")?.show();
      qs(".page.pageProfile .content")?.hide();
    }
  },
});

Skeleton.save("pageProfile");
