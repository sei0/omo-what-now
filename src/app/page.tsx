import { ArrowUpRight, CalendarBlank, Users } from "@phosphor-icons/react/dist/ssr";
import { fetchSchedule } from "@/lib/fetchSchedule";
import { EVENT_DATE } from "@/lib/config";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HomeForm } from "@/components/app/HomeForm";

function formatEventDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${year}년 ${month}월 ${day}일`;
}

export default async function Home() {
  const schedule = await fetchSchedule();

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="flex items-center justify-between px-5 py-4">
        <span className="text-body-12-medium text-text-subtle">OmOCon</span>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 pb-16">
        <div className="w-full max-w-md flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <h1 className="text-title-40-bold leading-tight">
              OmOCon<br />
              <span className="text-text-subtle">What now?</span>
            </h1>
            <p className="text-body-16-regular text-text-subtle">
              이름을 선택하면 시간별로 무엇을 해야 하는지 알려드립니다.
            </p>
          </div>

          <HomeForm volunteers={schedule.volunteers} />

          <div className="flex flex-col gap-2 rounded-lg border border-border-default bg-bg-neutral-subtle-default p-4">
            <div className="flex items-center gap-2">
              <CalendarBlank size={16} className="text-icon-default shrink-0" />
              <span className="text-body-14-regular text-text-default">
                {formatEventDate(EVENT_DATE)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-icon-default shrink-0" />
              <span className="text-body-14-regular text-text-default">
                자원봉사자 {schedule.volunteers.length}명 · 슬롯 {schedule.slots.length}개
              </span>
            </div>
            <a
              href="https://luma.com/0c78q15u"
              target="_blank"
              rel="noopener noreferrer"
              className="-mx-2 -my-1 flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-interaction-hovered"
            >
              <ArrowUpRight size={16} className="text-icon-default shrink-0" />
              <span className="text-body-14-medium text-text-default underline decoration-border-default decoration-1 underline-offset-4">
                Luma에서 행사 정보 보기
              </span>
            </a>
          </div>
        </div>
      </main>

      <footer className="px-5 py-4 text-center text-body-12-regular text-text-subtlest">
        이름을 선택하면 최신 시트 데이터를 다시 불러옵니다.
      </footer>
    </div>
  );
}
