"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ArrowClockwise } from "@phosphor-icons/react";
import { Button } from "@/components/Button";
import { formatClockTime } from "@/lib/time";
import { refreshSchedule } from "@/app/me/actions";

interface RefreshButtonProps {
  fetchedAt: string;
}

export function RefreshButton({ fetchedAt }: RefreshButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      await refreshSchedule();
      router.refresh();
    });
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border-default bg-bg-neutral-subtle-default px-3 py-2">
      <span className="text-body-12-regular text-text-subtle">
        최근 업데이트{" "}
        <span className="text-text-default font-medium">
          {formatClockTime(fetchedAt)}
        </span>
      </span>
      <Button
        size="sm"
        appearance="subtle"
        onClick={handleRefresh}
        loading={isPending}
      >
        <ArrowClockwise size={12} weight="bold" />
        새로고침
      </Button>
    </div>
  );
}
