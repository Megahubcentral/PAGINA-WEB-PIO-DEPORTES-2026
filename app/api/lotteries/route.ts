import { NextResponse } from "next/server";
import { getLotteryFeed } from "../../../lib/lottery-provider";

export const dynamic = "force-dynamic";

export async function GET() {
  const feed = await getLotteryFeed();
  const untilNext = Math.ceil((Date.parse(feed.nextRefreshAt) - Date.now()) / 1000);
  const maxAge = Math.max(30, Math.min(feed.refreshSeconds, Number.isFinite(untilNext) ? untilNext : feed.refreshSeconds));
  return NextResponse.json(feed, {
    headers: {
      "Cache-Control": `public, s-maxage=${maxAge}, stale-while-revalidate=60`,
    },
  });
}
