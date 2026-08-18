const FALLBACK_SITE_URL = "https://www.piodeportes.com";

export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!value) return FALLBACK_SITE_URL;
  try {
    return new URL(value).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}
