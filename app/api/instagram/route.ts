import { getInstagramFeed } from "../../../lib/instagram-provider";

export const dynamic = "force-dynamic";

export async function GET() {
  const feed = await getInstagramFeed();
  return Response.json(feed, {
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
    },
  });
}
