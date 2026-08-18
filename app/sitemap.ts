import type { MetadataRoute } from "next";
import { getSiteUrl } from "../lib/site";
import { fallbackArticles, fallbackVideos, localCategoryArticles, wordpressCategorySlugs } from "../lib/wordpress";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return [
    { url: base, changeFrequency: "hourly", priority: 1 },
    { url: `${base}/marcadores`, changeFrequency: "hourly", priority: .9 },
    { url: `${base}/loterias`, changeFrequency: "hourly", priority: .9 },
    { url: `${base}/videos`, changeFrequency: "hourly", priority: .9 },
    ...wordpressCategorySlugs.map((slug) => ({ url: `${base}/categoria/${slug}`, changeFrequency: "hourly" as const, priority: .8 })),
    ...fallbackArticles.map((article) => ({ url: `${base}/noticias/${article.slug}`, changeFrequency: "daily" as const, priority: .7 })),
    ...localCategoryArticles.map((article) => ({ url: `${base}/noticias/${article.slug}`, changeFrequency: "daily" as const, priority: .6 })),
    ...fallbackVideos.map((video) => ({ url: `${base}/videos/${video.slug}`, changeFrequency: "daily" as const, priority: .7 })),
  ];
}
