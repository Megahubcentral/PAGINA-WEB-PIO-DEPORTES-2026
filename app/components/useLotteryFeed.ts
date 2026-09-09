"use client";

import { useEffect, useState } from "react";
import type { LotteryFeed } from "../../lib/lottery-provider";
import { delayUntilLotteryRefresh, lotteryFeedNeedsRetry, STALE_LOTTERY_RETRY_MS } from "../../lib/lottery-view";

export function useLotteryFeed(feed: LotteryFeed) {
  const [currentFeed, setCurrentFeed] = useState(feed);

  useEffect(() => {
    setCurrentFeed(feed);
  }, [feed]);

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const schedule = (latest: LotteryFeed) => {
      if (timer) clearTimeout(timer);
      const keepRetrying = lotteryFeedNeedsRetry(latest.results, new Date(), 180);
      const delay = keepRetrying
        ? STALE_LOTTERY_RETRY_MS
        : delayUntilLotteryRefresh(latest.nextRefreshAt);
      timer = setTimeout(() => refresh(keepRetrying), delay);
    };

    const refresh = (bypassCache = false) => {
      const url = bypassCache ? `/api/lotteries?ts=${Date.now()}` : "/api/lotteries";
      fetch(url, { signal: controller.signal })
        .then((response) => (response.ok ? response.json() as Promise<LotteryFeed> : undefined))
        .then((latest) => {
          if (cancelled) return;
          if (latest) {
            setCurrentFeed(latest);
            schedule(latest);
            return;
          }
          schedule(feed);
        })
        .catch((error: unknown) => {
          if (cancelled || (error instanceof DOMException && error.name === "AbortError")) return;
          schedule(feed);
        });
    };

    refresh(lotteryFeedNeedsRetry(feed.results));
    return () => {
      cancelled = true;
      controller.abort();
      if (timer) clearTimeout(timer);
    };
  }, [feed]);

  return currentFeed;
}
