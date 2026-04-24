export type RoleCategory = "checkin" | "timer" | "cleanup" | "setup";

export const ROLE_META: Record<
  RoleCategory,
  {
    label: string;
    short: string;
    tone: "info" | "warning" | "success" | "neutral";
    description: string;
  }
> = {
  checkin: {
    label: "참석자 체크인 / 안내",
    short: "체크인",
    tone: "info",
    description: "입장 안내, QR/등록 확인. 피크 타임 외엔 안내 겸임.",
  },
  timer: {
    label: "발표자 준비 / 타이머",
    short: "타이머",
    tone: "warning",
    description:
      "발표 5분 전 대기 · 슬라이드/마이크 확인 · 발표 중 타이머 · 종료 1분 전·종료 신호.",
  },
  cleanup: {
    label: "청소 / 동선 정리",
    short: "청소",
    tone: "success",
    description:
      "세션 중 조용히 쓰레기/복도/좌석 정리. 쉬는 시간에 집중 정리.",
  },
  setup: {
    label: "세팅 / 점심 / 철수",
    short: "세팅",
    tone: "neutral",
    description: "의자·점심·장비 세팅, 철수 시 공간 원상복구.",
  },
};

export const ROLE_ORDER: RoleCategory[] = ["checkin", "timer", "cleanup", "setup"];

export interface AssignedPerson {
  name: string;
  subRole?: string;
}

export interface Assignment {
  role: RoleCategory;
  subRole?: string;
  isAllHands?: boolean;
}

export interface Slot {
  time: string;
  startAt: string;
  endAt: string;
  program: string;
  note?: string;
  byRole: Record<RoleCategory, AssignedPerson[]>;
  isAllHands: boolean;
}

export interface Schedule {
  slots: Slot[];
  volunteers: string[];
  fetchedAt: string;
}

export interface MySlotItem {
  slot: Slot;
  assignments: Assignment[];
  isFree?: boolean;
  isNow?: boolean;
}

export interface MySchedule {
  name: string;
  items: MySlotItem[];
}
