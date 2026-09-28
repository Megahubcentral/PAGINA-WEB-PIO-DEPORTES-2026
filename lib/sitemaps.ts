import { canonicalUrl, toAbsoluteIsoDate } from "./seo";
import type { SitemapEntry } from "./wordpress";

export const SITEMAP_PAGE_PATHS = ["/", "/marcadores", "/loterias", "/videos"] as const;
export const SITEMAP_REVALIDATE_SECONDS = 120;

export function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function xmlResponse(xml: string) {
  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": `public, max-age=60, s-maxage=${SITEMAP_REVALIDATE_SECONDS}`,
    },
  });
}

function lastmodTag(value?: string) {
  const iso = toAbsoluteIsoDate(value);
  return iso ? `\n    <lastmod>${xmlEscape(iso)}</lastmod>` : "";
}

export function sitemapIndexXml(locs: string[]) {
  const body = locs.map((loc) => `  <sitemap>\n    <loc>${xmlEscape(canonicalUrl(loc))}</loc>\n  </sitemap>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`;
}

export function sitemapUrlsetXml(
  entries: Array<{
    path: string;
    lastModified?: string;
    changeFrequency?: "hourly" | "daily";
    priority?: number;
  }>,
) {
  const body = entries.map((entry) => {
    const changefreq = entry.changeFrequency ? `\n    <changefreq>${entry.changeFrequency}</changefreq>` : "";
    const priority = typeof entry.priority === "number" ? `\n    <priority>${entry.priority}</priority>` : "";
    return `  <url>\n    <loc>${xmlEscape(canonicalUrl(entry.path))}</loc>${lastmodTag(entry.lastModified)}${changefreq}${priority}\n  </url>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

export function newsEntriesToUrlset(entries: SitemapEntry[], prefix: "/noticias" | "/videos") {
  return sitemapUrlsetXml(
    entries.map((entry) => ({
      path: `${prefix}/${entry.slug}`,
      lastModified: entry.lastModified,
      changeFrequency: "daily",
      priority: 0.7,
    })),
  );
}
