import { getWordpressCategories, type WordpressCategory } from "./wordpress";

export type NavLink = readonly [string, string];

export type NavItem = {
  label: string;
  href: string;
  slug: string;
  children: NavItem[];
};

export type NavTree = {
  primary: NavItem[];
  moreSports: NavItem[];
  moreSportsHref: string;
};

/** Sports that appear as top-level dropdowns, in menu order. */
export const PRIMARY_SPORT_SLUGS = [
  "beisbol",
  "baloncesto",
  "combate",
  "automovilismo",
  "futbol",
] as const;

/** Categories that exist in WordPress but must not appear in menus or footers. */
export const NAV_HIDDEN_SLUGS = new Set([
  "uncategorized",
  "destacados",
  "los-guruses",
  "portadas",
  "portada-b1",
  "portadas-b2",
  "portada-b3",
  "mma",
  "ufc",
  "fifa2026galeria",
  "fifa2026highlights",
  "mundial-fifa-qatar-2022",
  "juegos-olimpicos-paris-2024",
]);

const MORE_SPORTS_ORDER = ["nhl", "tennis", "atletismo", "juegos-olimpicos", "otros-deportes"];

const CHILD_ORDER: Record<string, string[]> = {
  beisbol: ["mlb", "lidom", "beisbol-latino"],
  baloncesto: ["nba", "baloncesto-fiba", "ncaab", "wnba", "liga-nacional-de-baloncesto"],
  combate: ["boxeo"],
  automovilismo: ["formula-1", "motogp"],
  futbol: ["nfl", "futbol-soccer", "ldf", "mls", "ncaaf", "mundial-fifa-usa-can-mex-2026"],
};

const NAV_LABELS: Record<string, string> = {
  nacionales: "Nacionales",
  beisbol: "Béisbol",
  mlb: "MLB",
  lidom: "LIDOM",
  "beisbol-latino": "Béisbol latino",
  baloncesto: "Baloncesto",
  nba: "NBA",
  "baloncesto-fiba": "FIBA",
  ncaab: "NCAAB",
  wnba: "WNBA",
  "liga-nacional-de-baloncesto": "LNB",
  combate: "Combate",
  boxeo: "Boxeo",
  automovilismo: "Automovilismo",
  "formula-1": "F1",
  motogp: "MotoGP",
  futbol: "Fútbol",
  "futbol-soccer": "Fútbol (Soccer)",
  nfl: "NFL",
  ncaaf: "NCAAF",
  ldf: "LDF",
  mls: "MLS",
  "mundial-fifa-usa-can-mex-2026": "Mundial 2026",
  nhl: "Hockey",
  tennis: "Tenis",
  atletismo: "Atletismo",
  "juegos-olimpicos": "Juegos Olímpicos",
  "otros-deportes": "Otros deportes",
};

export const moreSportsHref = "/categoria/otros-deportes";

function navLabel(slug: string, name: string) {
  return NAV_LABELS[slug] ?? name;
}

function categoryHref(slug: string) {
  return `/categoria/${slug}`;
}

function toNavItem(category: WordpressCategory, children: NavItem[] = []): NavItem {
  return {
    label: navLabel(category.slug, category.name),
    href: categoryHref(category.slug),
    slug: category.slug,
    children,
  };
}

function sortBySlugOrder(items: NavItem[], order: readonly string[]) {
  const rank = new Map(order.map((slug, index) => [slug, index]));
  return [...items].sort((left, right) => {
    const leftRank = rank.get(left.slug) ?? 1000;
    const rightRank = rank.get(right.slug) ?? 1000;
    if (leftRank !== rightRank) return leftRank - rightRank;
    return left.label.localeCompare(right.label, "es");
  });
}

function visibleChildren(categories: WordpressCategory[], parentId: number) {
  return categories.filter((category) => (
    category.parent === parentId
    && !NAV_HIDDEN_SLUGS.has(category.slug)
  ));
}

export function buildNavTree(categories: WordpressCategory[]): NavTree {
  const bySlug = new Map(categories.map((category) => [category.slug, category]));
  const primary: NavItem[] = [];

  for (const slug of PRIMARY_SPORT_SLUGS) {
    const sport = bySlug.get(slug);
    if (!sport) continue;
    const children = sortBySlugOrder(
      visibleChildren(categories, sport.id).map((child) => toNavItem(child)),
      CHILD_ORDER[slug] ?? [],
    );
    primary.push(toNavItem(sport, children));
  }

  const moreSportsHubSlug = moreSportsHref.replace("/categoria/", "");
  const reserved = new Set<string>(["nacionales", moreSportsHubSlug, ...PRIMARY_SPORT_SLUGS, ...NAV_HIDDEN_SLUGS]);
  const moreSports = sortBySlugOrder(
    categories
      .filter((category) => category.parent === 0 && !reserved.has(category.slug))
      .map((category) => toNavItem(category)),
    MORE_SPORTS_ORDER,
  );

  return { primary, moreSports, moreSportsHref };
}

const fallbackCategories: WordpressCategory[] = [
  { id: 1, slug: "beisbol", name: "Béisbol", parent: 0, count: 0 },
  { id: 2, slug: "mlb", name: "MLB", parent: 1, count: 1 },
  { id: 3, slug: "lidom", name: "LIDOM", parent: 1, count: 1 },
  { id: 4, slug: "beisbol-latino", name: "Béisbol latino", parent: 1, count: 1 },
  { id: 5, slug: "baloncesto", name: "Baloncesto", parent: 0, count: 0 },
  { id: 6, slug: "nba", name: "NBA", parent: 5, count: 1 },
  { id: 7, slug: "baloncesto-fiba", name: "FIBA", parent: 5, count: 1 },
  { id: 24, slug: "ncaab", name: "NCAAB", parent: 5, count: 1 },
  { id: 25, slug: "wnba", name: "WNBA", parent: 5, count: 1 },
  { id: 26, slug: "liga-nacional-de-baloncesto", name: "LNB", parent: 5, count: 1 },
  { id: 8, slug: "combate", name: "Combate", parent: 0, count: 0 },
  { id: 9, slug: "boxeo", name: "Boxeo", parent: 8, count: 1 },
  { id: 10, slug: "mma", name: "MMA", parent: 8, count: 0 },
  { id: 11, slug: "ufc", name: "UFC", parent: 8, count: 1 },
  { id: 12, slug: "automovilismo", name: "Automovilismo", parent: 0, count: 0 },
  { id: 13, slug: "formula-1", name: "Fórmula 1", parent: 12, count: 1 },
  { id: 14, slug: "motogp", name: "MotoGP", parent: 12, count: 1 },
  { id: 15, slug: "futbol", name: "Fútbol", parent: 0, count: 0 },
  { id: 16, slug: "nfl", name: "NFL", parent: 15, count: 1 },
  { id: 17, slug: "futbol-soccer", name: "Fútbol (Soccer)", parent: 15, count: 1 },
  { id: 18, slug: "ldf", name: "LDF", parent: 15, count: 1 },
  { id: 19, slug: "mls", name: "MLS", parent: 15, count: 1 },
  { id: 20, slug: "ncaaf", name: "NCAAF", parent: 15, count: 1 },
  { id: 27, slug: "mundial-fifa-usa-can-mex-2026", name: "Mundial 2026", parent: 15, count: 1 },
  { id: 21, slug: "nhl", name: "NHL", parent: 0, count: 1 },
  { id: 28, slug: "atletismo", name: "Atletismo", parent: 0, count: 1 },
  { id: 22, slug: "tennis", name: "Tenis", parent: 0, count: 1 },
  { id: 23, slug: "otros-deportes", name: "Otros deportes", parent: 0, count: 1 },
];

export async function getNavTree(): Promise<NavTree> {
  const categories = await getWordpressCategories();
  return buildNavTree(categories.length ? categories : fallbackCategories);
}

export function navItemLinks(items: readonly NavItem[]): NavLink[] {
  return items.map((item) => [item.label, item.href] as const);
}
