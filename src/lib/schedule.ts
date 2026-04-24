import {
  ROLE_ORDER,
  type Assignment,
  type MySchedule,
  type MySlotItem,
  type Schedule,
} from "./types";

export function findMySchedule(schedule: Schedule, name: string): MySchedule {
  const trimmed = name.trim();

  const perSlot: { slot: (typeof schedule.slots)[number]; assignments: Assignment[] }[] =
    schedule.slots.map((slot) => {
      const assignments: Assignment[] = [];

      for (const role of ROLE_ORDER) {
        for (const p of slot.byRole[role]) {
          if (p.name === trimmed) {
            assignments.push({ role, subRole: p.subRole });
          }
        }
      }

      if (slot.isAllHands && schedule.volunteers.includes(trimmed)) {
        assignments.push({ role: "setup", isAllHands: true });
      }

      return { slot, assignments };
    });

  const firstIdx = perSlot.findIndex((x) => x.assignments.length > 0);
  const lastIdx = (() => {
    for (let i = perSlot.length - 1; i >= 0; i--) {
      if (perSlot[i].assignments.length > 0) return i;
    }
    return -1;
  })();

  const items: MySlotItem[] = [];
  if (firstIdx !== -1 && lastIdx !== -1) {
    for (let i = firstIdx; i <= lastIdx; i++) {
      const { slot, assignments } = perSlot[i];
      items.push(
        assignments.length > 0
          ? { slot, assignments }
          : { slot, assignments: [], isFree: true },
      );
    }
  }

  return { name: trimmed, items };
}
