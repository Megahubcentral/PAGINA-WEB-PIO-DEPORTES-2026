import { canonicalUrl, toAbsoluteIsoDate } from "../../lib/seo";
import { getNewsSitemapEntries } from "../../lib/wordpress";

export const revalidate = 120;

const NEWS_PUBLICATION = "Pío Deportes";

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

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

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=60, s-maxage=120",
    },
  });
}
