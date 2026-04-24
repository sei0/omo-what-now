"use client";

import { useEffect, useState } from "react";

const TICK_MS = 60_000;

export function useNowTick(initialNow: number): number {
  const [now, setNow] = useState(initialNow);

  useEffect(() => {
    let intervalId: number | undefined;

    const start = () => {
      if (intervalId !== undefined) return;
      setNow(Date.now());
      intervalId = window.setInterval(() => setNow(Date.now()), TICK_MS);
    };

    const stop = () => {
      if (intervalId === undefined) return;
      window.clearInterval(intervalId);
      intervalId = undefined;
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return now;
}
