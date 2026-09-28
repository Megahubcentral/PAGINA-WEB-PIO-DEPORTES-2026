import { sitemapIndexXml, xmlResponse } from "../../lib/sitemaps";
import { getSitemapIndexMeta } from "../../lib/wordpress";

export const revalidate = 120;

export async function GET() {
  const { newsChunks } = await getSitemapIndexMeta();
  const newsFiles = Array.from({ length: newsChunks }, (_, index) => `/sitemap-noticias-${index + 1}.xml`);
  return xmlResponse(
    sitemapIndexXml([
      "/sitemap-pages.xml",
      "/sitemap-categories.xml",
      "/sitemap-videos.xml",
      ...newsFiles,
    ]),
  );
}
