import { EVENT_DATE, SHEET_CSV_URL } from "./config";
import { parseSchedule } from "./parser";
import type { Schedule } from "./types";

export async function fetchSchedule(): Promise<Schedule> {
  const res = await fetch(SHEET_CSV_URL, {
    next: { revalidate: 300, tags: ["schedule"] },
  });

  if (!res.ok) {
    throw new Error(`Sheet fetch failed: ${res.status} ${res.statusText}`);
  }

  const csv = await res.text();
  return parseSchedule(csv, EVENT_DATE);
}
