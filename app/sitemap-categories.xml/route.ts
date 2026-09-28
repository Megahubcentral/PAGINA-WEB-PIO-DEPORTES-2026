import { sitemapUrlsetXml, xmlResponse } from "../../lib/sitemaps";
import { wordpressCategorySlugs } from "../../lib/wordpress";

export const revalidate = 120;

export function GET() {
  return xmlResponse(
    sitemapUrlsetXml(
      wordpressCategorySlugs.map((slug) => ({
        path: `/categoria/${slug}`,
        changeFrequency: "hourly" as const,
        priority: 0.8,
      })),
    ),
  );
}
