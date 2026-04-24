"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/Button";
import { Combobox } from "@/components/Combobox";
import { refreshSchedule } from "@/app/me/actions";

interface HomeFormProps {
  volunteers: string[];
}

export function HomeForm({ volunteers }: HomeFormProps) {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (selected: string | null) => {
    if (!selected) return;
    startTransition(async () => {
      await refreshSchedule();
      router.push(`/me?name=${encodeURIComponent(selected)}`);
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <Combobox
        items={volunteers}
        value={name}
        onValueChange={(v) => setName(v)}
        placeholder="이름을 입력하거나 선택하세요"
        className="w-full"
        popupClassName="w-[var(--anchor-width)] min-w-60"
        size="lg"
      />
      <Button
        size="lg"
        onClick={() => handleSubmit(name)}
        disabled={!name}
        loading={isPending}
        className="w-full"
      >
        내 일정 보기
        <ArrowRight size={16} weight="bold" />
      </Button>
    </div>
  );
}
