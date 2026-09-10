import type { MetadataRoute } from "next";
import { canonicalUrl, toAbsoluteIsoDate } from "../lib/seo";
import { getSitemapContent, wordpressCategorySlugs } from "../lib/wordpress";

export const revalidate = 120;

function sitemapDate(value?: string) {
  const iso = toAbsoluteIsoDate(value);
  if (!iso) return undefined;
  const timestamp = Date.parse(iso);
  return Number.isNaN(timestamp) ? undefined : new Date(timestamp);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { articles, videos } = await getSitemapContent();

  return [
    { url: canonicalUrl("/"), changeFrequency: "hourly", priority: 1 },
    { url: canonicalUrl("/marcadores"), changeFrequency: "hourly", priority: .9 },
    { url: canonicalUrl("/loterias"), changeFrequency: "hourly", priority: .9 },
    { url: canonicalUrl("/videos"), changeFrequency: "hourly", priority: .9 },
    ...wordpressCategorySlugs.map((slug) => ({
      url: canonicalUrl(`/categoria/${slug}`),
      changeFrequency: "hourly" as const,
      priority: .8,
    })),
    ...articles.map((article) => ({
      url: canonicalUrl(`/noticias/${article.slug}`),
      lastModified: sitemapDate(article.lastModified),
      changeFrequency: "daily" as const,
      priority: .7,
    })),
    ...videos.map((video) => ({
      url: canonicalUrl(`/videos/${video.slug}`),
      lastModified: sitemapDate(video.lastModified),
      changeFrequency: "daily" as const,
      priority: .7,
    })),
  ];
}
