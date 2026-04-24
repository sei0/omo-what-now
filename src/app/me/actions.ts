"use server";

import { updateTag } from "next/cache";

export async function refreshSchedule() {
  updateTag("schedule");
}
