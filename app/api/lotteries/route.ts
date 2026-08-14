import { NextResponse } from "next/server";
import { getLotteryFeed } from "../../../lib/lottery-provider";

export const dynamic = "force-dynamic";

export async function GET() {
  const feed = await getLotteryFeed();
  return NextResponse.json(feed, {
    headers: {
      "Cache-Control": `public, s-maxage=${feed.refreshSeconds}, stale-while-revalidate=1800`,
    },
  });
}
