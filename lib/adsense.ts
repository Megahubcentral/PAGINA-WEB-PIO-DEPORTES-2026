export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT?.trim() || "ca-pub-3350123194403510";

export const ADSENSE_SLOTS = {
  entreSeccionesHome: "8113639710",
  finalDeArticulo: "2208425545",
  sidebarDesktop: "3848810279",
  inArticle: "1473928370",
  /** Reserved: AdSense in-feed unit (not placed in the UI for now). */
  inFeed: "4124142446",
} as const;

/** Human labels for local layout preview (development only). */
export const ADSENSE_SLOT_LABELS: Record<string, string> = {
  [ADSENSE_SLOTS.entreSeccionesHome]: "Entre secciones · home",
  [ADSENSE_SLOTS.finalDeArticulo]: "Final de artículo",
  [ADSENSE_SLOTS.sidebarDesktop]: "Sidebar desktop",
  [ADSENSE_SLOTS.inArticle]: "In-article",
  [ADSENSE_SLOTS.inFeed]: "In-feed",
};

/** First in-article unit after this many paragraphs (industry default: 2–3). */
export const IN_ARTICLE_AFTER_PARAGRAPH = 2;

export function splitHtmlAfterParagraph(html: string, afterParagraph = IN_ARTICLE_AFTER_PARAGRAPH) {
  const closingParagraph = /<\/p>/gi;
  let match: RegExpExecArray | null;
  let count = 0;

  while ((match = closingParagraph.exec(html)) !== null) {
    count += 1;
    if (count !== afterParagraph) continue;

    const index = match.index + match[0].length;
    const before = html.slice(0, index);
    const after = html.slice(index).trim();
    // Skip short posts: FinalDeArticulo already covers the end of the piece.
    if (!after) return null;
    return { before, after };
  }

  return null;
}
