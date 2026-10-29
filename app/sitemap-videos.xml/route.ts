import { newsEntriesToUrlset, xmlResponse } from "../../lib/sitemaps";
import { getSitemapVideos } from "../../lib/wordpress";

export const revalidate = 3600;

export async function GET() {
  const videos = await getSitemapVideos();
  return xmlResponse(newsEntriesToUrlset(videos, "/videos"));
}
