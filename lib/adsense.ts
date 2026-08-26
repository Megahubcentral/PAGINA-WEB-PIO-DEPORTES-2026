export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT?.trim() || "ca-pub-3350123194403510";

export const ADSENSE_SLOTS = {
  belowPortada: "9464372100",
  pageBottom: "9464372100",
} as const;
