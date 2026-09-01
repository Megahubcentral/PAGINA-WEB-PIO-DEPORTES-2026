"use client";

import { useEffect, useState } from "react";
import type { LotteryFeed } from "../../lib/lottery-provider";
import { delayUntilLotteryRefresh } from "../../lib/lottery-view";

export function useLotteryFeed(feed: LotteryFeed) {
  const [currentFeed, setCurrentFeed] = useState(feed);

  useEffect(() => {
    setCurrentFeed(feed);
  }, [feed]);

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const schedule = (nextRefreshAt: string) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(refresh, delayUntilLotteryRefresh(nextRefreshAt));
    };

    const refresh = () => {
      fetch("/api/lotteries", { signal: controller.signal })
        .then((response) => (response.ok ? response.json() as Promise<LotteryFeed> : undefined))
        .then((latest) => {
          if (cancelled) return;
          if (latest) {
            setCurrentFeed(latest);
            schedule(latest.nextRefreshAt);
            return;
          }
          schedule(feed.nextRefreshAt);
        })
        .catch((error: unknown) => {
          if (cancelled || (error instanceof DOMException && error.name === "AbortError")) return;
          schedule(feed.nextRefreshAt);
        });
    };

    refresh();
    return () => {
      cancelled = true;
      controller.abort();
      if (timer) clearTimeout(timer);
    };
  }, [feed]);

  return currentFeed;
}
