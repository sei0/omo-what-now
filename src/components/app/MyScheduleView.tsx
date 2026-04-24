"use client";

import Link from "next/link";
import { ArrowLeft, Note } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { formatHHMM } from "@/lib/time";
import {
  ROLE_META,
  type Assignment,
  type MySchedule,
  type MySlotItem,
} from "@/lib/types";
import { useNowTick } from "./useNowTick";

interface MyScheduleViewProps {
  mySchedule: MySchedule;
  initialNow: number;
  frozen?: boolean;
}

const TONE_DOT: Record<"info" | "warning" | "success" | "neutral", string> = {
  info: "bg-bg-info-bold-default",
  warning: "bg-bg-warning-bold-default",
  success: "bg-bg-success-bold-default",
  neutral: "bg-bg-neutral-bold-default",
};

function shiftTitle(a: Assignment, startAt: string): string {
  if (a.isAllHands) return "전원 참여";
  const meta = ROLE_META[a.role];
  const short =
    a.role === "setup" && formatHHMM(startAt) === "17:30" ? "철수" : meta.short;
  return a.subRole ? `${short} · ${a.subRole}` : short;
}

function shiftDescription(a: Assignment): string {
  if (a.isAllHands) return "모든 자원봉사자가 참여합니다.";
  return ROLE_META[a.role].description;
}

function shiftToneDotClass(a: Assignment): string {
  if (a.isAllHands) return "bg-bg-accent-violet";
  return TONE_DOT[ROLE_META[a.role].tone];
}

function ShiftHeadline({
  assignments,
  startAt,
}: {
  assignments: Assignment[];
  startAt: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {assignments.map((a, idx) => (
        <div key={idx} className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span
              className={cn("size-2 shrink-0 rounded-full", shiftToneDotClass(a))}
              aria-hidden="true"
            />
            <span className="text-title-18-semibold text-text-default break-keep">
              {shiftTitle(a, startAt)}
            </span>
          </div>
          <p className="text-body-14-regular text-text-subtle break-keep">
            {shiftDescription(a)}
          </p>
        </div>
      ))}
    </div>
  );
}

function TimelineRow({
  item,
  isNow,
  past = false,
}: {
  item: MySlotItem;
  isNow: boolean;
  past?: boolean;
}) {
  const isFree = !!item.isFree;

  return (
    <div
      className={cn(
        "relative flex gap-3 rounded-lg border p-4 transition-colors",
        isFree
          ? "border-border-subtle bg-elevation-surface-sunken-default"
          : "border-border-default bg-elevation-surface-raised-default",
        past && !isFree && "opacity-60",
      )}
    >
      <div className="flex w-16 shrink-0 flex-col text-body-12-medium">
        <span
          className={cn(
            isFree ? "text-text-subtle" : "text-text-default",
          )}
        >
          {formatHHMM(item.slot.startAt)}
        </span>
        <span className="text-text-subtlest">{formatHHMM(item.slot.endAt)}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        {isNow && (
          <div className="flex items-center gap-1.5 text-body-12-semibold text-text-accent-red">
            <span className="relative flex size-2">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ backgroundColor: "var(--color-text-accent-red)" }}
              />
              <span
                className="relative inline-flex size-2 rounded-full"
                style={{ backgroundColor: "var(--color-text-accent-red)" }}
              />
            </span>
            LIVE
          </div>
        )}

        {item.slot.program && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "inline-block rounded-md border border-border-default px-2 py-0.5 text-body-12-regular break-keep",
                isFree
                  ? "bg-elevation-surface-raised-default text-text-subtle"
                  : "bg-bg-neutral-subtle-default text-text-subtle",
              )}
            >
              {item.slot.program}
            </span>
            {!isFree && item.slot.note && (
              <span className="inline-flex items-center gap-1 text-body-12-regular text-text-subtle">
                <Note size={12} className="shrink-0" />
                {item.slot.note}
              </span>
            )}
          </div>
        )}

        {isFree ? (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span
                className="size-2 shrink-0 rounded-full bg-bg-accent-amber"
                aria-hidden="true"
              />
              <span className="text-title-18-semibold text-text-subtle">자유</span>
            </div>
            <p className="text-body-14-regular text-text-subtle break-keep">
              배정된 쉬프트가 없어요. 잠시 쉬어 가세요.
            </p>
          </div>
        ) : (
          <ShiftHeadline assignments={item.assignments} startAt={item.slot.startAt} />
        )}
      </div>
    </div>
  );
}

export function MyScheduleView({
  mySchedule,
  initialNow,
  frozen = false,
}: MyScheduleViewProps) {
  const liveNow = useNowTick(initialNow);
  const now = frozen ? initialNow : liveNow;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 self-start rounded-md px-2 py-1 text-body-13-medium text-text-subtle hover:bg-interaction-hovered"
      >
        <ArrowLeft size={14} />
        이름 다시 선택
      </Link>

      <div className="flex flex-col gap-1">
        <h1 className="text-title-32-bold leading-tight text-text-default">
          {mySchedule.name}
          <span className="text-text-subtle">님의 </span>
          What now?
        </h1>
      </div>

      {mySchedule.items.length === 0 ? (
        <div className="rounded-2xl border border-border-default bg-bg-neutral-subtle-default p-6 text-center">
          <p className="text-body-14-regular text-text-subtle">
            이 이름으로 배정된 일정을 찾을 수 없어요.
            <br />
            시트에 정확히 같은 이름이 있는지 확인해주세요.
          </p>
        </div>
      ) : (
        (() => {
          const upcoming: { item: MySlotItem; isNow: boolean }[] = [];
          const past: MySlotItem[] = [];
          for (const item of mySchedule.items) {
            const start = new Date(item.slot.startAt).getTime();
            const end = new Date(item.slot.endAt).getTime();
            if (now >= end) {
              past.push(item);
            } else {
              upcoming.push({ item, isNow: now >= start && now < end });
            }
          }

          return (
            <>
              <section className="flex flex-col gap-3">
                <h2 className="text-title-16-semibold text-text-default">
                  {past.length === 0 ? "전체 일정" : "남은 일정"}
                </h2>
                {upcoming.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border-subtle bg-bg-neutral-subtle-default p-5 text-center">
                    <p className="text-body-14-regular text-text-subtle">
                      오늘 일정이 모두 끝났어요. 수고하셨어요.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {upcoming.map(({ item, isNow }, idx) => (
                      <TimelineRow key={idx} item={item} isNow={isNow} />
                    ))}
                  </div>
                )}
              </section>

              {past.length > 0 && (
                <section className="flex flex-col gap-3">
                  <h2 className="flex items-center gap-2 text-title-16-semibold text-text-subtle">
                    지난 세션
                    <span className="text-body-12-regular text-text-subtlest">
                      {past.length}
                    </span>
                  </h2>
                  <div className="flex flex-col gap-2">
                    {past.map((item, idx) => (
                      <TimelineRow key={idx} item={item} isNow={false} past />
                    ))}
                  </div>
                </section>
              )}
            </>
          );
        })()
      )}
    </div>
  );
}
