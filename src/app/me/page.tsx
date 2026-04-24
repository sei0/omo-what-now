import Link from "next/link";
import { notFound } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MyScheduleView } from "@/components/app/MyScheduleView";
import { RefreshButton } from "@/components/app/RefreshButton";
import { fetchSchedule } from "@/lib/fetchSchedule";
import { findMySchedule } from "@/lib/schedule";

interface PageProps {
  searchParams: Promise<{ name?: string; mockTime?: string }>;
}

function parseMockTime(value: string | undefined): number | null {
  if (!value) return null;
  const match = value.match(/^(\d{1,2}):?(\d{2})$/);
  if (!match) return null;
  const [, hh, mm] = match;
  const iso = `2026-04-25T${hh.padStart(2, "0")}:${mm}:05+09:00`;
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? null : t;
}

export default async function MePage({ searchParams }: PageProps) {
  const { name, mockTime } = await searchParams;
  if (!name) notFound();

  const schedule = await fetchSchedule();
  const mySchedule = findMySchedule(schedule, name);
  const initialNow = parseMockTime(mockTime) ?? Date.now();

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="flex items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="text-body-12-medium text-text-subtle hover:text-text-default"
        >
          OmOCon
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 px-5 pb-16">
        <div className="mx-auto w-full max-w-md flex flex-col gap-5">
          <RefreshButton fetchedAt={schedule.fetchedAt} />
          <MyScheduleView
            mySchedule={mySchedule}
            initialNow={initialNow}
            frozen={mockTime !== undefined}
          />
        </div>
      </main>
    </div>
  );
}
