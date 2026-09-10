import type { Metadata } from "next";
import { getSiteUrl } from "./site";

export const SITE_NAME = "Pío Deportes";
export const SITE_LOCALE = "es_DO";
export const HOME_TITLE = "Pío Deportes | El deporte vive aquí";
export const HOME_DESCRIPTION =
  "Noticias deportivas de República Dominicana y el mundo: MLB, NBA, LIDOM, fútbol, NFL, tenis, radio y video.";

const SOCIAL_PROFILES = [
  "https://www.youtube.com/@piodeportes",
  "https://www.instagram.com/piodeportes/",
] as const;

type JsonLdValue = Record<string, unknown>;

export function canonicalUrl(path = "/") {
  const base = getSiteUrl().replace(/\/$/, "");
  if (!path || path === "/") return `${base}/`;
  const clean = path.split("?")[0].split("#")[0].replace(/\/+$/, "");
  return `${base}${clean.startsWith("/") ? clean : `/${clean}`}`;
}

export function absoluteUrl(pathOrUrl = "/") {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return canonicalUrl(pathOrUrl === "/" ? "/" : pathOrUrl);
}

export function metaDescription(value?: string, fallback = HOME_DESCRIPTION) {
  const text = (value ?? "").replace(/\s+/g, " ").trim() || fallback;
  if (text.length <= 160) return text;
  return `${text.slice(0, 157).replace(/\s+\S*$/, "").trim()}…`;
}

export function toAbsoluteIsoDate(value?: string) {
  const raw = value?.trim();
  if (!raw) return undefined;
  if (/[zZ]|[+-]\d{2}:\d{2}$/.test(raw)) {
    const timestamp = Date.parse(raw);
    return Number.isNaN(timestamp) ? undefined : new Date(timestamp).toISOString();
  }
  const withTime = raw.includes("T") ? raw : `${raw}T00:00:00`;
  const localized = `${withTime}-04:00`;
  const timestamp = Date.parse(localized);
  return Number.isNaN(timestamp) ? undefined : localized;
}

export function isoDuration(value?: string) {
  const raw = value?.trim() ?? "";
  const match = raw.match(/^(?:(\d+):)?(\d{1,2}):(\d{2})$/);
  if (!match) return undefined;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);
  if (![hours, minutes, seconds].every((part) => Number.isInteger(part)) || minutes > 59 || seconds > 59) {
    return undefined;
  }
  if (hours) return `PT${hours}H${minutes}M${seconds}S`;
  if (minutes) return `PT${minutes}M${seconds}S`;
  return `PT${seconds}S`;
}

export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationJsonLd(): JsonLdValue {
  const url = canonicalUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/pio-logo-original.png"),
    },
    sameAs: [...SOCIAL_PROFILES],
  };
}

export function publisherJsonLd(): JsonLdValue {
  return {
    "@type": "Organization",
    name: SITE_NAME,
    url: canonicalUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/pio-logo-original.png"),
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function newsArticleJsonLd(article: {
  title: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  category?: string;
  path: string;
}): JsonLdValue {
  const url = canonicalUrl(article.path);
  const datePublished = toAbsoluteIsoDate(article.datePublished);
  const dateModified = toAbsoluteIsoDate(article.dateModified) ?? datePublished;
  const image = article.image ? absoluteUrl(article.image) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: metaDescription(article.description, article.title),
    inLanguage: "es",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    image: image ? [image] : undefined,
    datePublished,
    dateModified,
    author: article.author ? { "@type": "Person", name: article.author } : undefined,
    publisher: publisherJsonLd(),
    articleSection: article.category,
  };
}

export function videoObjectJsonLd(video: {
  title: string;
  description?: string;
  thumbnail?: string;
  uploadDate?: string;
  duration?: string;
  embedUrl?: string;
  contentUrl?: string;
  path: string;
}): JsonLdValue | undefined {
  const embedUrl = video.embedUrl?.startsWith("http") ? video.embedUrl : undefined;
  const contentUrl = video.contentUrl?.startsWith("http") ? video.contentUrl : undefined;
  if (!embedUrl && !contentUrl) return undefined;

  const uploadDate = toAbsoluteIsoDate(video.uploadDate);
  const duration = isoDuration(video.duration);

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: metaDescription(video.description, video.title),
    thumbnailUrl: video.thumbnail ? [absoluteUrl(video.thumbnail)] : undefined,
    uploadDate,
    duration,
    embedUrl,
    contentUrl,
    publisher: publisherJsonLd(),
    mainEntityOfPage: canonicalUrl(video.path),
  };
}

export function routeMetadata({
  path,
  title,
  description,
  image,
  imageAlt,
  index = true,
  ogType = "website",
  publishedTime,
  modifiedTime,
  authors,
  absoluteTitle = false,
}: {
  path: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  index?: boolean;
  ogType?: "website" | "article" | "video.other";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  absoluteTitle?: boolean;
}): Metadata {
  const url = canonicalUrl(path);
  const summary = metaDescription(description);
  const ogImage = image ? [{ url: absoluteUrl(image), alt: imageAlt || title }] : undefined;
  const published = toAbsoluteIsoDate(publishedTime);
  const modified = toAbsoluteIsoDate(modifiedTime) ?? published;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: summary,
    alternates: { canonical: url },
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: ogType,
      url,
      title,
      description: summary,
      locale: SITE_LOCALE,
      siteName: SITE_NAME,
      images: ogImage,
      ...(ogType === "article"
        ? {
            publishedTime: published,
            modifiedTime: modified,
            authors,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: summary,
      images: image ? [absoluteUrl(image)] : undefined,
    },
  };
}

export function homeMetadata(): Metadata {
  return routeMetadata({
    path: "/",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    image: "/og.png",
    imageAlt: "Pío Deportes — El deporte vive aquí",
    absoluteTitle: true,
  });
}
