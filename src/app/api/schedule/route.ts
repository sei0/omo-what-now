import { NextResponse } from "next/server";
import { fetchSchedule } from "@/lib/fetchSchedule";

export async function GET() {
  try {
    const schedule = await fetchSchedule();
    return NextResponse.json(schedule);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
