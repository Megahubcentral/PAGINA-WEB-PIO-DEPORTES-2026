import { NextResponse } from "next/server";
import { getHorseRacingFeed } from "../../../lib/horse-racing-provider";

export const dynamic = "force-dynamic";

export async function GET() {
  const feed = await getHorseRacingFeed();
  return NextResponse.json(feed, {
    headers: {
      "Cache-Control": `public, s-maxage=${feed.refreshSeconds}, stale-while-revalidate=21600`,
    },
  });
}
