import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getLotteryFeed, invalidateLotteryMemoryCache, LOTTERY_CACHE_TAG } from "../../../../lib/lottery-provider";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  invalidateLotteryMemoryCache();
  revalidateTag(LOTTERY_CACHE_TAG, { expire: 0 });
  revalidatePath("/");
  revalidatePath("/loterias");
  const feed = await getLotteryFeed();
  return NextResponse.json({
    ok: true,
    updatedAt: feed.updatedAt,
    nextRefreshAt: feed.nextRefreshAt,
    refreshSeconds: feed.refreshSeconds,
  });
}
