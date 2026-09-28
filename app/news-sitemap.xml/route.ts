import { canonicalUrl, toAbsoluteIsoDate } from "../../lib/seo";
import { xmlEscape, xmlResponse } from "../../lib/sitemaps";
import { getNewsSitemapEntries } from "../../lib/wordpress";

export const dynamic = "force-dynamic";
export const revalidate = 120;

const NEWS_PUBLICATION = "Pío Deportes";

export async function GET() {
  const entries = await getNewsSitemapEntries();
  const urls = entries.map((entry) => {
    const published = toAbsoluteIsoDate(entry.publishedAt) ?? entry.publishedAt;
    return `  <url>
    <loc>${xmlEscape(canonicalUrl(`/noticias/${entry.slug}`))}</loc>
    <news:news>
      <news:publication>
        <news:name>${xmlEscape(NEWS_PUBLICATION)}</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${xmlEscape(published)}</news:publication_date>
      <news:title>${xmlEscape(entry.title)}</news:title>
    </news:news>
  </url>`;
  }).join("\n");

  return xmlResponse(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>
`);
}
