import { SITEMAP_PAGE_PATHS, sitemapUrlsetXml, xmlResponse } from "../../lib/sitemaps";

export const revalidate = 120;

export function GET() {
  return xmlResponse(
    sitemapUrlsetXml(
      SITEMAP_PAGE_PATHS.map((path) => ({
        path,
        changeFrequency: "hourly" as const,
        priority: path === "/" ? 1 : 0.9,
      })),
    ),
  );
}
