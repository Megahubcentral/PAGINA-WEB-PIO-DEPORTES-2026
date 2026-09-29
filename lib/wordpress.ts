import { cache } from "react";
import { editorialImageBank, type EditorialImage } from "./editorial-images";

export type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  categorySlugs?: string[];
  image: string;
  imageAlt?: string;
  author: string;
  publishedAt: string;
  date?: string;
  dateModified?: string;
  content?: string;
  media?: "video" | "audio";
  imageCredit?: string;
  imageSourceUrl?: string;
  imageLicense?: string;
  imageLicenseUrl?: string;
  tags?: string[];
  editorialLocations?: string[];
};

export type VideoItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  section: string;
  thumbnail: string;
  publishedAt: string;
  date?: string;
  dateModified?: string;
  duration?: string;
  embedUrl?: string;
  sourceUrl?: string;
};

export type SitemapEntry = {
  slug: string;
  lastModified?: string;
};

export type SitemapIndexMeta = {
  newsChunks: number;
  postTotal: number;
  fromWordpress: boolean;
};

export const SITEMAP_NEWS_CHUNK_SIZE = 1000;
export const WP_SITEMAP_PER_PAGE = 100;
const wpPagesPerNewsChunk = SITEMAP_NEWS_CHUNK_SIZE / WP_SITEMAP_PER_PAGE;
const videoSitemapMaxPages = 20;

export type NewsSitemapEntry = {
  slug: string;
  title: string;
  publishedAt: string;
};

const pioYoutubeChannel = "https://www.youtube.com/@piodeportes/featured";
const localNow = Date.now();
const nationalCategorySlugs = new Set(["nacionales", "nacional"]);

function isoFromNow(msAgo: number) {
  return new Date(localNow - msAgo).toISOString();
}

export const fallbackVideos: VideoItem[] = [
  {
    id: 501,
    slug: "celebracion-reinas-del-caribe",
    title: "Así fue la celebración completa de las Reinas del Caribe",
    excerpt: "Los mejores momentos, las reacciones y la premiación de una jornada inolvidable para el voleibol dominicano.",
    section: "Selecciones nacionales",
    thumbnail: "/news/reinas.jpg",
    publishedAt: "Hace 18 minutos",
    duration: "03:42",
    date: isoFromNow(18 * 60 * 1000),
    sourceUrl: pioYoutubeChannel,
  },
  {
    id: 502,
    slug: "diez-ponches-castillo",
    title: "Los 10 ponches de Castillo, lanzamiento por lanzamiento",
    excerpt: "Revive la dominante apertura del derecho dominicano y las secuencias que definieron el partido.",
    section: "MLB · Highlights",
    thumbnail: "/news/mlb.jpg",
    publishedAt: "Hace 46 minutos",
    duration: "02:18",
    date: isoFromNow(46 * 60 * 1000),
    sourceUrl: pioYoutubeChannel,
  },
  {
    id: 503,
    slug: "resumen-dominicana-mexico",
    title: "Resumen: Dominicana impone su ofensiva ante México",
    excerpt: "Carreras, jugadas defensivas y las claves del triunfo quisqueyano en un resumen compacto.",
    section: "Béisbol del Caribe",
    thumbnail: "/news/caribe.jpg",
    publishedAt: "Hace 1 hora",
    duration: "01:56",
    date: isoFromNow(60 * 60 * 1000),
    sourceUrl: pioYoutubeChannel,
  },
  {
    id: 504,
    slug: "analisis-nuevo-ciclo-futbol",
    title: "Pio TV analiza las claves del nuevo ciclo internacional",
    excerpt: "El panel estudia los cambios tácticos, protagonistas y decisiones que ya generan conversación.",
    section: "Análisis",
    thumbnail: "/news/futbol.jpg",
    publishedAt: "Hace 2 horas",
    duration: "08:15",
    date: isoFromNow(2 * 60 * 60 * 1000),
    sourceUrl: pioYoutubeChannel,
  },
  {
    id: 505,
    slug: "nba-mercado-movimientos",
    title: "Cinco movimientos que pueden cambiar la próxima temporada de NBA",
    excerpt: "Una mirada rápida a las operaciones, equipos y figuras que podrían alterar el mapa competitivo.",
    section: "NBA · Pio explica",
    thumbnail: "/news/nba.jpg",
    publishedAt: "Hace 3 horas",
    duration: "04:09",
    date: isoFromNow(3 * 60 * 60 * 1000),
    sourceUrl: pioYoutubeChannel,
  },
  {
    id: 506,
    slug: "entrevista-reinas-proximo-reto",
    title: "En primera persona: las Reinas hablan de su próximo reto",
    excerpt: "Las protagonistas repasan el torneo y explican cómo preparan el siguiente compromiso internacional.",
    section: "Entrevista",
    thumbnail: "/news/voleibol.jpg",
    publishedAt: "Hace 4 horas",
    duration: "05:20",
    date: isoFromNow(4 * 60 * 60 * 1000),
    sourceUrl: pioYoutubeChannel,
  },
];

export const fallbackArticles: Article[] = [
  {
    id: 1,
    slug: "reinas-del-caribe-oro-y-premios",
    title: "Las Reinas del Caribe se llevan el oro… y también la lluvia de premios",
    excerpt:
      "La selección dominicana volvió a imponer su carácter competitivo y cerró el torneo con una actuación para la historia.",
    category: "Nacionales",
    categorySlug: "nacionales",
    categorySlugs: ["nacionales"],
    image: "/news/reinas.jpg",
    author: "Pío Deportes",
    publishedAt: "Hace 24 minutos",
    date: isoFromNow(24 * 60 * 1000),
    media: "video",
  },
  {
    id: 2,
    slug: "castillo-poncha-diez-white-sox",
    title: "Castillo poncha 10 y White Sox blanquean a Reds",
    excerpt:
      "Una salida dominante marcó la jornada en las Grandes Ligas y encendió la conversación entre los fanáticos.",
    category: "MLB",
    categorySlug: "mlb",
    categorySlugs: ["mlb"],
    image: "/news/mlb.jpg",
    author: "Redacción Pío",
    publishedAt: "Hace 42 minutos",
    date: isoFromNow(42 * 60 * 1000),
  },
  {
    id: 3,
    slug: "odell-beckham-debut-giants",
    title: "Odell Beckham Jr. jugará en el debut de los Giants en pretemporada",
    excerpt:
      "El receptor está listo para volver al terreno y todas las miradas apuntan a su primer partido.",
    category: "NFL",
    categorySlug: "nfl",
    categorySlugs: ["nfl"],
    image: "/news/giants.jpg",
    author: "Pío Deportes",
    publishedAt: "Hace 1 hora",
    date: isoFromNow(60 * 60 * 1000),
  },
  {
    id: 4,
    slug: "holanda-ficha-a-xavi",
    title: "Holanda ficha a Xavi, su primer técnico extranjero desde 1978",
    excerpt:
      "La selección neerlandesa apuesta por una nueva idea de juego de cara al próximo gran ciclo internacional.",
    category: "Fútbol (Soccer)",
    categorySlug: "futbol",
    categorySlugs: ["futbol"],
    image: "/news/futbol.jpg",
    author: "Agencias",
    publishedAt: "Hace 2 horas",
    date: isoFromNow(2 * 60 * 60 * 1000),
  },
  {
    id: 5,
    slug: "rybakina-vence-a-gauff",
    title: "Rybakina vence a Gauff y alcanza la final de Toronto",
    excerpt:
      "La campeona resolvió los momentos clave y aseguró su lugar en la definición del torneo.",
    category: "Tenis",
    categorySlug: "tennis",
    categorySlugs: ["tennis"],
    image: "/news/tennis.jpg",
    author: "Pío Deportes",
    publishedAt: "Hace 2 horas",
    date: isoFromNow(2 * 60 * 60 * 1000 + 12 * 60 * 1000),
  },
  {
    id: 6,
    slug: "cambio-historico-nba-lakers",
    title: "Cambio histórico en la NBA: los Lakers tienen nuevos dueños",
    excerpt:
      "La operación abre una etapa distinta para una de las franquicias más reconocidas del deporte mundial.",
    category: "NBA",
    categorySlug: "nba",
    categorySlugs: ["nba"],
    image: "/news/nba.jpg",
    author: "Redacción Pío",
    publishedAt: "Hace 3 horas",
    date: isoFromNow(3 * 60 * 60 * 1000),
  },
  {
    id: 7,
    slug: "dominicana-mexico-serie-caribe-kids",
    title: "República Dominicana arrolla a México y mantiene su invicto",
    excerpt:
      "El conjunto quisqueyano volvió a producir desde temprano y sigue firme en la Serie del Caribe Kids.",
    category: "Béisbol del Caribe",
    categorySlug: "beisbol-del-caribe",
    categorySlugs: ["beisbol-del-caribe"],
    image: "/news/caribe.jpg",
    author: "Pío Deportes",
    publishedAt: "Hace 4 horas",
    date: isoFromNow(4 * 60 * 60 * 1000),
    media: "video",
  },
  {
    id: 8,
    slug: "dominicana-corea-mundial-u17",
    title: "Corea del Sur frena a República Dominicana en el Mundial U-17",
    excerpt:
      "Las dominicanas dejaron buenos pasajes, pero no pudieron completar la remontada ante el orden asiático.",
    category: "Voleibol",
    categorySlug: "voleibol",
    categorySlugs: ["voleibol"],
    image: "/news/voleibol.jpg",
    author: "Pío Deportes",
    publishedAt: "Hace 5 horas",
    date: isoFromNow(5 * 60 * 60 * 1000),
    media: "video",
  },
];

const localCategoryProfiles: Record<string, { category: string; image: string; titles: string[] }> = {
  nacionales: {
    category: "Nacionales",
    image: "/news/reinas.jpg",
    titles: [
      "La delegación dominicana afina su calendario para el próximo ciclo",
      "El deporte escolar abre una nueva ruta para el talento del país",
      "Federaciones presentan sus planes de preparación y competencia",
      "Atletas dominicanos elevan la bandera en escenarios internacionales",
      "La nueva generación pide espacio en las selecciones nacionales",
      "Santo Domingo se prepara para recibir una gran jornada deportiva",
      "Clubes y entrenadores apuestan por una formación más completa",
    ],
  },
  mlb: {
    category: "MLB",
    image: "/news/mlb.jpg",
    titles: [
      "Juan Soto responde con poder en una noche de alta tensión",
      "Vladimir Guerrero Jr. vuelve a castigar el pitcheo rival",
      "El relevo dominicano gana protagonismo en la recta decisiva",
      "Caminero confirma por qué es una de las figuras del futuro",
      "La carrera por octubre entra en su tramo más exigente",
      "Los brazos quisqueyanos dominan otra jornada de Grandes Ligas",
      "El mercado comienza a mover piezas para la próxima temporada",
    ],
  },
  nba: {
    category: "NBA",
    image: "/news/nba.jpg",
    titles: [
      "Las nuevas alianzas cambian el mapa competitivo de la liga",
      "Las estrellas jóvenes aceleran el relevo generacional de la NBA",
      "El Este se prepara para una batalla sin un favorito absoluto",
      "La defensa vuelve a ser la gran apuesta de los aspirantes",
      "El calendario internacional amplía el alcance del baloncesto",
      "Los novatos que buscan impactar desde su primera temporada",
      "La agencia libre deja decisiones que pueden definir el campeonato",
    ],
  },
  lidom: {
    category: "LIDOM",
    image: "/news/caribe.jpg",
    titles: [
      "Los equipos de LIDOM toman forma para una temporada de alta rivalidad",
      "Licey y Águilas renuevan sus plantillas con la mira en la corona",
      "El talento joven busca ganarse un lugar en la pelota invernal",
      "Los estadios se preparan para recibir otra gran fiesta del béisbol",
      "Toros y Estrellas presentan sus primeras piezas importadas",
      "El Escogido apuesta por profundidad y velocidad en su alineación",
      "La gerencia deportiva marca el pulso antes del primer lanzamiento",
      "Calendario, rivalidades y claves de la próxima campaña de LIDOM",
    ],
  },
  futbol: {
    category: "Fútbol (Soccer)",
    image: "/news/futbol.jpg",
    titles: [
      "La carrera por Europa comienza con nuevos proyectos y viejas ambiciones",
      "Los grandes clubes ajustan sus plantillas antes del cierre del mercado",
      "La Champions prepara una temporada con duelos de máxima exigencia",
      "El talento latino gana espacio en las ligas más competitivas",
      "Real Madrid y Barcelona renuevan una rivalidad que no descansa",
      "Las selecciones entran en la fase decisiva de su preparación",
      "Los técnicos que prometen transformar el mapa del fútbol europeo",
    ],
  },
  nfl: {
    category: "NFL",
    image: "/news/giants.jpg",
    titles: [
      "Los quarterbacks jóvenes ponen a prueba el orden de la conferencia",
      "La pretemporada abre oportunidades para nuevas figuras",
      "Las defensivas que pueden cambiar el rumbo de la próxima campaña",
      "El mercado de receptores eleva la competencia entre aspirantes",
      "Los campeones comienzan la defensa con una plantilla renovada",
      "La batalla por los puestos titulares entra en su semana decisiva",
      "Cinco historias para seguir antes del inicio de la temporada",
    ],
  },
  nhl: {
    category: "NHL",
    image: "/news/nba.jpg",
    titles: [
      "El Este de la NHL entra en una recta de máxima rivalidad",
      "Las potencias del hockey ajustan sus líneas rumbo a los playoffs",
      "Los porteros marcan diferencias en una noche de alta tensión",
      "El talento joven acelera el relevo en las franquicias aspirantes",
      "Canadá y Estados Unidos calientan otra batalla continental",
      "Los campeones defienden la corona con una plantilla reforzada",
      "Calendario, rivalidades y claves de la próxima semana en la NHL",
    ],
  },
  tennis: {
    category: "Tenis",
    image: "/news/tennis.jpg",
    titles: [
      "El circuito femenino llega a la recta final con el ranking abierto",
      "Los favoritos ajustan su juego para el último Grand Slam del año",
      "Una nueva generación desafía la jerarquía del tenis mundial",
      "La batalla por el número uno se decide punto a punto",
      "El calendario de pista dura reúne a las principales figuras",
      "Los latinoamericanos que buscan avanzar en el circuito profesional",
      "Servicio, velocidad y consistencia: las claves de la próxima final",
    ],
  },
  voleibol: {
    category: "Voleibol",
    image: "/news/voleibol.jpg",
    titles: [
      "Las Reinas del Caribe trazan la ruta de su próximo gran desafío",
      "La selección juvenil crece con una generación de enorme proyección",
      "El voleibol dominicano amplía su presencia internacional",
      "La defensa y el servicio sostienen el nuevo plan de competencia",
      "El calendario reúne fogueos de alto nivel para la selección",
      "Las ligas internacionales vuelven a contar con talento dominicano",
      "El cuerpo técnico ajusta piezas antes de la fase decisiva",
    ],
  },
  "beisbol-del-caribe": {
    category: "Béisbol del Caribe",
    image: "/news/caribe.jpg",
    titles: [
      "La pelota caribeña prepara una serie con identidad y grandes figuras",
      "República Dominicana encabeza una jornada de poder ofensivo",
      "Puerto Rico y Venezuela presentan sus plantillas para el torneo",
      "Los prospectos convierten la competencia regional en una vitrina",
      "El pitcheo vuelve a marcar diferencias en los juegos cerrados",
      "La rivalidad del Caribe escribe un nuevo capítulo",
      "Calendario y claves para seguir la próxima serie regional",
    ],
  },
  "otros-deportes": {
    category: "Más deportes",
    image: "/news/tennis.jpg",
    titles: [
      "El boxeo dominicano presenta a sus nuevas figuras para el ciclo mundial",
      "La Fórmula 1 entra en una semana decisiva dentro y fuera de la pista",
      "El atletismo nacional suma marcas que invitan al optimismo",
      "Golf, motor y combate completan una agenda de alto impacto",
      "Los deportes urbanos ganan terreno entre la nueva generación",
      "Dominicana amplía su presencia en competencias multidisciplinarias",
      "Las historias que merecen atención más allá de las grandes ligas",
      "Agenda polideportiva: eventos y protagonistas para no perder de vista",
    ],
  },
};

// The archive image bank keeps every card visually unique, while these lead
// assignments make the stories used on the home page match their exact topic.
const curatedLeadImages: Record<string, Record<number, EditorialImage>> = {
  futbol: {
    0: {
      url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Manchester%20United%20v%20FC%20Basel%2C%2012%20September%202017%20%2811%29.jpg?width=1280",
      credit: "Ardfern",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Manchester_United_v_FC_Basel,_12_September_2017_(11).jpg",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    },
  },
  nfl: {
    0: {
      url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Quarterback%20Aaron%20Rodgers%20%2812%29%20and%20the%20Packers%20break%20the%20huddle..jpg?width=1200",
      credit: "Mike Morbeck",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Quarterback_Aaron_Rodgers_(12)_and_the_Packers_break_the_huddle..jpg",
      license: "CC BY-SA 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    },
  },
  "otros-deportes": {
    0: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Delvin_Rodriguez_vs._Pawel_Wolak.jpg/1280px-Delvin_Rodriguez_vs._Pawel_Wolak.jpg",
      credit: "Bryan Horowitz",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Delvin_Rodriguez_vs._Pawel_Wolak.jpg",
      license: "CC BY-SA 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    },
    1: {
      url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Valtteri%20Bottas%20on%20track%2C%20Singapore%20Grand%20Prix%202024.jpg?width=1280",
      credit: "Henrikkoh333",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Valtteri_Bottas_on_track,_Singapore_Grand_Prix_2024.jpg",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    },
    2: {
      url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Felix%20Sanchez%20wins%20Olympic%20400%20hurdles.jpg?width=1280",
      credit: "sportsflair2000",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Felix_Sanchez_wins_Olympic_400_hurdles.jpg",
      license: "CC BY-SA 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    },
  },
};

const editorialAngles = [
  "las claves que explican el momento",
  "protagonistas, datos y próximos pasos",
  "qué cambia y por qué importa",
  "el escenario que se abre a partir de ahora",
  "agenda, contexto y puntos de atención",
];

const articlesPerCategory = 30;

export const localCategoryArticles: Article[] = Object.entries(localCategoryProfiles).flatMap(
  ([categorySlug, profile], categoryIndex) =>
    Array.from({ length: articlesPerCategory }, (_, index) => {
      const baseTitle = profile.titles[index % profile.titles.length];
      const series = Math.floor(index / profile.titles.length);
      const angle = editorialAngles[(index + series) % editorialAngles.length];
      const editorialImage = (series === 0 ? curatedLeadImages[categorySlug]?.[index] : undefined)
        ?? editorialImageBank[categorySlug]?.[index];
      const elapsed = index + 1;

      return {
        id: 1000 + categoryIndex * 100 + index,
        slug: `${categorySlug}-informe-${index + 1}`,
        title: series === 0 ? baseTitle : `${baseTitle}: ${angle}`,
        excerpt: series === 0 ? `${baseTitle}.` : `${baseTitle}: ${angle}.`,
        category: profile.category,
        categorySlug,
        categorySlugs: [categorySlug],
        tags: [categorySlug],
        image: editorialImage?.url ?? profile.image,
        imageCredit: editorialImage?.credit,
        imageSourceUrl: editorialImage?.sourceUrl,
        imageLicense: editorialImage?.license,
        imageLicenseUrl: editorialImage?.licenseUrl,
        author: index % 3 === 0 ? "Pío Deportes" : index % 3 === 1 ? "Redacción Pío" : "Agencias",
        publishedAt: elapsed < 12
          ? `Hace ${elapsed} hora${elapsed === 1 ? "" : "s"}`
          : `Hace ${Math.ceil((elapsed - 11) / 3)} día${elapsed < 15 ? "" : "s"}`,
        date: isoFromNow((index * Object.keys(localCategoryProfiles).length + categoryIndex + 8) * 50 * 60 * 1000),
        media: index % 12 === 2 ? "video" as const : index % 17 === 8 ? "audio" as const : undefined,
      };
    }),
);

const localArticleArchive = [...fallbackArticles, ...localCategoryArticles];

const apiBase = (process.env.WORDPRESS_API_URL || "https://piod.axworkflow.com/wp-json/wp/v2").replace(/\/$/, "");

export const wordpressCategorySlugs = [
  "nacionales",
  "internacional",
  "beisbol",
  "mlb",
  "lidom",
  "beisbol-latino",
  "baloncesto",
  "nba",
  "ncaab",
  "wnba",
  "baloncesto-fiba",
  "liga-nacional-de-baloncesto",
  "combate",
  "boxeo",
  "automovilismo",
  "formula-1",
  "motogp",
  "futbol",
  "futbol-soccer",
  "nfl",
  "ncaaf",
  "ldf",
  "mls",
  "mundial-fifa-usa-can-mex-2026",
  "nhl",
  "tennis",
  "atletismo",
  "juegos-olimpicos",
  "otros-deportes",
] as const;

const categorySlugAliases: Record<string, string> = {
  tenis: "tennis",
  hockey: "nhl",
  fiba: "baloncesto-fiba",
  f1: "formula-1",
  formula1: "formula-1",
  "moto-gp": "motogp",
  motor: "automovilismo",
  "beisbol-del-caribe": "beisbol-latino",
};

function resolveCategorySlug(slug: string) {
  return categorySlugAliases[slug] ?? slug;
}

export function displayCategoryName(name = "", slug = "") {
  const resolved = resolveCategorySlug(slug).toLowerCase();
  if (resolved === "futbol-soccer") return "Fútbol (Soccer)";
  if (resolved === "futbol") return "Fútbol";
  return name;
}

export type WordpressCategory = {
  id: number;
  slug: string;
  name: string;
  parent: number;
  count: number;
};

export const getWordpressCategories = cache(async function getWordpressCategories(): Promise<WordpressCategory[]> {
  try {
    const categories = await wpFetch("/categories?per_page=100&hide_empty=false") as Array<{
      id?: number;
      slug?: string;
      name?: string;
      parent?: number;
      count?: number;
    }> | null;
    return (categories ?? [])
      .filter((category): category is { id: number; slug: string; name?: string; parent?: number; count?: number } => (
        Boolean(category.id && category.slug)
      ))
      .map((category) => ({
        id: category.id,
        slug: category.slug,
        name: category.name ?? category.slug,
        parent: category.parent ?? 0,
        count: category.count ?? 0,
      }));
  } catch {
    return [];
  }
});

function descendantCategoryIds(categories: WordpressCategory[], parentId: number): number[] {
  const children = categories.filter((category) => category.parent === parentId);
  return [parentId, ...children.flatMap((child) => descendantCategoryIds(categories, child.id))];
}

type WpTerm = { taxonomy?: string; name?: string; slug?: string };
type WpPost = {
  id: number;
  slug: string;
  date: string;
  modified?: string;
  format?: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  featured_media?: number;
  categories?: number[];
  tags?: number[];
  ubicacion_editorial?: number[];
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      alt_text?: string;
      media_details?: {
        length?: number;
        length_formatted?: string;
        sizes?: { large?: { source_url?: string } };
      };
    }>;
    "wp:term"?: WpTerm[][];
    author?: Array<{ name?: string }>;
  };
};

const htmlNamedEntities: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  sbquo: "‚",
  bdquo: "„",
  laquo: "«",
  raquo: "»",
  lsaquo: "‹",
  rsaquo: "›",
  bull: "•",
  middot: "·",
  trade: "™",
  copy: "©",
  reg: "®",
  deg: "°",
  times: "×",
  divide: "÷",
  euro: "€",
  pound: "£",
  yen: "¥",
  cent: "¢",
};

function fromHtmlCodePoint(code: number) {
  if (!Number.isInteger(code) || code < 0 || code > 0x10ffff) return "";
  if (code >= 0xd800 && code <= 0xdfff) return "";
  return String.fromCodePoint(code);
}

function decodeHtmlEntities(value = "") {
  const decodeOnce = (input: string) =>
    input
      .replace(/&amp;/gi, "&")
      .replace(/&#(\d+);/g, (_, code: string) => fromHtmlCodePoint(Number(code)))
      .replace(/&#x([\da-f]+);/gi, (_, code: string) => fromHtmlCodePoint(Number.parseInt(code, 16)))
      .replace(/&([a-z]+);/gi, (match, name: string) => htmlNamedEntities[name.toLowerCase()] ?? match);

  return decodeOnce(decodeOnce(value));
}

function plainText(value = "") {
  return decodeHtmlEntities(value.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

const minExcerptLength = 80;

function firstParagraphText(html = "") {
  const paragraph = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1];
  return plainText(paragraph ?? "");
}

function editorialExcerpt(excerptHtml = "", contentHtml = "") {
  const excerpt = plainText(excerptHtml)
    .replace(/\[(?:&hellip;|…|...)\]$/u, "")
    .replace(/\s*(?:contin[uú]a? leyendo|leer m[aá]s|read more).*$/i, "")
    .trim();
  if (excerpt.length >= minExcerptLength) return excerpt;
  return firstParagraphText(contentHtml) || excerpt;
}

function clockFromSeconds(seconds: number) {
  const total = Math.round(seconds);
  if (!Number.isFinite(total) || total <= 0) return undefined;
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const rest = total % 60;
  if (hours) return `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function videoClock(value?: string) {
  const raw = value?.trim() ?? "";
  if (/^(?:(\d+):)?(\d{1,2}):(\d{2})$/.test(raw)) return raw;
  return undefined;
}

function videoDurationFromPost(post: WpPost) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0]?.media_details;
  return clockFromSeconds(Number(media?.length)) ?? videoClock(media?.length_formatted);
}

function decodeWordpressHtml(value = "") {
  return value.replace(/&amp;(#(?:\d+|x[\da-f]+)|[a-z]+);/gi, "&$1");
}

const editorialCategorySlugs = new Set(["destacados", "uncategorized"]);

function displayCategory(terms: WpTerm[]) {
  const categories = terms.filter((term) => term.taxonomy === "category");
  return (
    categories.find((term) => term.slug && !editorialCategorySlugs.has(term.slug)) ??
    categories[0]
  );
}

function articleCategorySlugs(terms: WpTerm[]) {
  return terms
    .filter((term) => term.taxonomy === "category" && term.slug)
    .map((term) => resolveCategorySlug(term.slug as string));
}

function articleTagSlugs(terms: WpTerm[]) {
  return terms
    .filter((term) => term.taxonomy === "post_tag" && term.slug)
    .map((term) => term.slug as string);
}

function articleEditorialLocationSlugs(terms: WpTerm[]) {
  return terms
    .filter((term) => term.taxonomy === EDITORIAL_LOCATION_TAXONOMY && term.slug)
    .map((term) => term.slug as string);
}

export function isNationalArticle(article: Article) {
  const slugs = [article.categorySlug, ...(article.categorySlugs ?? [])].map((slug) => slug.toLowerCase());
  if (slugs.some((slug) => nationalCategorySlugs.has(slug))) return true;
  const name = article.category.trim().toLowerCase();
  return name === "nacional" || name === "nacionales";
}

function publishedTime(value?: string) {
  const time = Date.parse(value ?? "");
  return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time;
}

export function sortByNewest<T extends { date?: string }>(items: T[]) {
  return [...items].sort((left, right) => publishedTime(right.date) - publishedTime(left.date));
}

function sortArticlesByNewest(articles: Article[]) {
  return sortByNewest(articles);
}

function localInternationalArticles() {
  return sortArticlesByNewest(localArticleArchive.filter((article) => !isNationalArticle(article)));
}

function normalizePost(post: WpPost): Article {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  const terms = post?._embedded?.["wp:term"]?.flat?.() ?? [];
  const category = displayCategory(terms);
  const author = post?._embedded?.author?.[0]?.name;
  const categorySlugs = articleCategorySlugs(terms);

  const title = plainText(post.title?.rendered);
  const imageAlt = plainText(media?.alt_text) || title;

  return {
    id: post.id,
    slug: post.slug,
    title,
    excerpt: editorialExcerpt(post.excerpt?.rendered, post.content?.rendered),
    category: displayCategoryName(decodeHtmlEntities(category?.name ?? "Actualidad"), category?.slug ?? "actualidad"),
    categorySlug: resolveCategorySlug(category?.slug ?? "actualidad"),
    categorySlugs,
    tags: articleTagSlugs(terms),
    editorialLocations: articleEditorialLocationSlugs(terms),
    image:
      media?.media_details?.sizes?.large?.source_url ??
      media?.source_url ??
      "/news/reinas.jpg",
    imageAlt,
    author: decodeHtmlEntities(author ?? "Pío Deportes"),
    date: post.date,
    dateModified: post.modified || post.date,
    publishedAt: new Intl.DateTimeFormat("es-DO", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(post.date)),
    content: post.content?.rendered ? decodeWordpressHtml(post.content.rendered) : undefined,
    media:
      post.format === "video" || /wp-block-video|youtube|vimeo/i.test(post.content?.rendered ?? "")
        ? "video"
        : post.format === "audio" || /wp-block-audio|<audio/i.test(post.content?.rendered ?? "")
          ? "audio"
          : undefined,
  };
}

function normalizeEmbedUrl(value?: string) {
  if (!value?.startsWith("http")) return undefined;
  if (value.includes("youtube.com/watch?v=")) {
    return value.replace("youtube.com/watch?v=", "youtube-nocookie.com/embed/").split("&")[0];
  }
  if (value.includes("youtu.be/")) {
    return value.replace("youtu.be/", "youtube-nocookie.com/embed/").split("?")[0];
  }
  return value;
}

function firstVideoUrl(html = "") {
  const iframe = html.match(/<iframe[^>]+src=["']([^"']+)["']/i)?.[1];
  const video = html.match(/<video[^>]+src=["']([^"']+)["']/i)?.[1];
  const source = html.match(/<source[^>]+src=["']([^"']+)["']/i)?.[1];
  return normalizeEmbedUrl(iframe ?? video ?? source);
}

function normalizeVideoPost(post: WpPost): VideoItem {
  const article = normalizePost(post);
  const embedUrl = firstVideoUrl(post.content?.rendered);
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    section: article.category,
    thumbnail: article.image,
    publishedAt: article.publishedAt,
    date: article.date,
    dateModified: article.dateModified,
    duration: videoDurationFromPost(post),
    embedUrl,
    sourceUrl: embedUrl ?? pioYoutubeChannel,
  };
}

const wpJsonCache = cache(async (path: string) => wpFetchResult<unknown>(path));

async function wpFetch(path: string): Promise<any> {
  const result = await wpJsonCache(path);
  return result?.data ?? null;
}

async function wpFetchResult<T = unknown>(
  path: string,
  options?: { timeoutMs?: number },
): Promise<{ data: T; total: number; totalPages: number } | null> {
  if (!apiBase) return null;
  const response = await fetch(`${apiBase}${path}`, {
    next: { revalidate: 120 },
    headers: {
      Accept: "application/json",
      "User-Agent": "PioDeportes/1.0 (+https://www.piodeportes.com)",
    },
    signal: AbortSignal.timeout(options?.timeoutMs ?? 45000),
  });
  if (response.status === 400) {
    return { data: [] as unknown as T, total: 0, totalPages: 0 };
  }
  if (!response.ok) throw new Error(`WordPress respondió ${response.status}`);
  const total = Number(response.headers.get("X-WP-Total") ?? 0);
  const totalPages = Number(response.headers.get("X-WP-TotalPages") ?? 0);
  return {
    data: (await response.json()) as T,
    total: Number.isFinite(total) ? total : 0,
    totalPages: Number.isFinite(totalPages) ? totalPages : 0,
  };
}

function mergeUniqueArticles(primary: Article[], editorial: Article[], limit: number) {
  const slugs = new Set(primary.map((article) => article.slug));
  return [
    ...sortArticlesByNewest(primary),
    ...sortArticlesByNewest(editorial.filter((article) => !slugs.has(article.slug))),
  ].slice(0, limit);
}

export async function getLatestArticles(limit = 12): Promise<Article[]> {
  try {
    const posts = await wpFetch(
      `/posts?per_page=${limit}&orderby=date&order=desc&${listFieldsQuery}`,
    );
    return posts?.length
      ? mergeUniqueArticles(await postsToArticles(posts), localArticleArchive, limit)
      : sortArticlesByNewest(localArticleArchive).slice(0, limit);
  } catch {
    return sortArticlesByNewest(localArticleArchive).slice(0, limit);
  }
}

type WpTermRecord = { id: number; slug?: string; name?: string };

export type ArticleQueryOptions = {
  excludeTags?: string[];
  excludeEditorialLocations?: string[];
  exactCategory?: boolean;
  fallbackToLatest?: boolean;
};

/** Custom WP taxonomy "Ubicaciones editoriales". */
export const EDITORIAL_LOCATION_TAXONOMY = "ubicacion_editorial";

/** Terms that place a story in the three Portada blocks. */
export const PORTADA_PLACEMENTS = {
  hero: "portada-principal",
  below: "portada-secundaria",
  side: "portada-terciaria",
} as const;

type PortadaPlacementSlug = (typeof PORTADA_PLACEMENTS)[keyof typeof PORTADA_PLACEMENTS];

/** Stable WP term IDs so Portada does not wait on the slow taxonomy listing. */
export const PORTADA_PLACEMENT_TERM_IDS: Record<PortadaPlacementSlug, number> = {
  "portada-principal": 13419,
  "portada-secundaria": 13420,
  "portada-terciaria": 13421,
};

export const portadaPlacementSlugs = [
  PORTADA_PLACEMENTS.hero,
  PORTADA_PLACEMENTS.below,
  PORTADA_PLACEMENTS.side,
];

export const homeNewsQuery: ArticleQueryOptions = {
  excludeEditorialLocations: [...portadaPlacementSlugs],
};

async function getTagIdsBySlug(slugs: string[]) {
  const unique = [...new Set(slugs.map((slug) => slug.trim()).filter(Boolean))];
  if (!unique.length) return [];
  const batches = await Promise.all(
    unique.map((slug) => wpFetch(`/tags?slug=${encodeURIComponent(slug)}`) as Promise<WpTermRecord[] | null>),
  );
  return [...new Set(batches.flatMap((terms) => (terms ?? []).map((term) => term.id).filter(Boolean)))];
}

async function getTaxonomyTermIds(taxonomy: string, slugs: string[]) {
  const unique = [...new Set(slugs.map((slug) => slug.trim()).filter(Boolean))];
  if (!unique.length) return [];
  if (taxonomy === EDITORIAL_LOCATION_TAXONOMY) {
    const known = unique.flatMap((slug) => {
      const id = PORTADA_PLACEMENT_TERM_IDS[slug as PortadaPlacementSlug];
      return id ? [id] : [];
    });
    if (known.length === unique.length) return [...new Set(known)];
  }
  const batches = await Promise.all(
    unique.map((slug) => wpFetch(`/${taxonomy}?slug=${encodeURIComponent(slug)}`) as Promise<WpTermRecord[] | null>),
  );
  return [...new Set(batches.flatMap((terms) => (terms ?? []).map((term) => term.id).filter(Boolean)))];
}

async function decoratePosts(posts: WpPost[]): Promise<WpPost[]> {
  const mediaIds = [
    ...new Set(posts.map((post) => post.featured_media).filter((id): id is number => Boolean(id))),
  ];
  let mediaRecords: Array<{
    id?: number;
    source_url?: string;
    alt_text?: string;
    media_details?: NonNullable<NonNullable<WpPost["_embedded"]>["wp:featuredmedia"]>[number]["media_details"];
  }> = [];
  try {
    if (mediaIds.length) {
      mediaRecords = (await wpFetch(
        `/media?include=${mediaIds.join(",")}&per_page=${Math.min(100, mediaIds.length)}&_fields=id,source_url,alt_text,media_details`,
      )) ?? [];
    }
  } catch {
    mediaRecords = [];
  }
  const mediaById = new Map(
    mediaRecords.filter((item) => item.id).map((item) => [item.id as number, item]),
  );
  const categories = await getWordpressCategories().catch(() => [] as WordpressCategory[]);
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const locationById = new Map(
    (Object.entries(PORTADA_PLACEMENT_TERM_IDS) as Array<[PortadaPlacementSlug, number]>).map(
      ([slug, id]) => [id, slug],
    ),
  );

  return posts.map((post) => {
    const media = post.featured_media ? mediaById.get(post.featured_media) : undefined;
    const categoryTerms: WpTerm[] = (post.categories ?? []).flatMap((id) => {
      const category = categoryById.get(id);
      return category ? [{ taxonomy: "category", name: category.name, slug: category.slug }] : [];
    });
    const locationTerms: WpTerm[] = (post.ubicacion_editorial ?? []).flatMap((id) => {
      const slug = locationById.get(id);
      return slug ? [{ taxonomy: EDITORIAL_LOCATION_TAXONOMY, name: slug, slug }] : [];
    });
    return {
      ...post,
      _embedded: {
        "wp:featuredmedia": media
          ? [{ source_url: media.source_url, alt_text: media.alt_text, media_details: media.media_details }]
          : [],
        "wp:term": [categoryTerms, locationTerms],
        author: [{ name: "Pío Deportes" }],
      },
    };
  });
}

async function postsToArticles(posts: WpPost[] | null | undefined, options?: ArticleQueryOptions) {
  if (!posts?.length) return [];
  return withoutExcludedTags((await decoratePosts(posts)).map(normalizePost), options);
}

async function tagExcludeQuery(options?: ArticleQueryOptions) {
  const [tagIds, locationIds] = await Promise.all([
    getTagIdsBySlug(options?.excludeTags ?? []),
    getTaxonomyTermIds(EDITORIAL_LOCATION_TAXONOMY, options?.excludeEditorialLocations ?? []),
  ]);
  const parts: string[] = [];
  if (tagIds.length) parts.push(`tags_exclude=${tagIds.join(",")}`);
  if (locationIds.length) parts.push(`${EDITORIAL_LOCATION_TAXONOMY}_exclude=${locationIds.join(",")}`);
  return parts.length ? `&${parts.join("&")}` : "";
}

function withoutExcludedTags(articles: Article[], options?: ArticleQueryOptions) {
  const excludedTags = new Set((options?.excludeTags ?? []).map((slug) => slug.toLowerCase()));
  const excludedLocations = new Set((options?.excludeEditorialLocations ?? []).map((slug) => slug.toLowerCase()));
  if (!excludedTags.size && !excludedLocations.size) return articles;
  return articles.filter((article) => {
    if (excludedTags.size && (article.tags ?? []).some((tag) => excludedTags.has(tag.toLowerCase()))) return false;
    if (
      excludedLocations.size
      && (article.editorialLocations ?? []).some((location) => excludedLocations.has(location.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });
}

function normalizeCategoryText(value = "") {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function isBasketballCategory(slug = "", name = "") {
  const text = `${normalizeCategoryText(slug)} ${normalizeCategoryText(name)}`;
  return (
    /\bnba\b/.test(text) ||
    /\bwnba\b/.test(text) ||
    text.includes("baloncesto") ||
    text.includes("basket") ||
    /\bncaab\b/.test(text)
  );
}

function localBasketballArticles() {
  return sortArticlesByNewest(
    localArticleArchive.filter((article) => isBasketballCategory(article.categorySlug, article.category)),
  );
}

async function getBasketballCategoryIds() {
  const categories = await wpFetch("/categories?per_page=100") as WpTermRecord[] | null;
  return (categories ?? [])
    .filter((category) => isBasketballCategory(category.slug, category.name))
    .map((category) => category.id)
    .filter(Boolean);
}

export async function getBasketballArticles(limit = 5, options?: ArticleQueryOptions): Promise<Article[]> {
  const localBasketball = withoutExcludedTags(localBasketballArticles(), options);
  const cap = Math.max(1, limit);

  try {
    const [categoryIds, excludeQuery] = await Promise.all([
      getBasketballCategoryIds(),
      tagExcludeQuery(options),
    ]);
    if (categoryIds.length) {
      const posts = await wpFetch(
        `/posts?categories=${categoryIds.join(",")}&per_page=${cap}&orderby=date&order=desc${excludeQuery}&${listFieldsQuery}`,
      ) as WpPost[] | null;
      if (posts?.length) {
        const fromWordpress = await postsToArticles(posts, options);
        if (fromWordpress.length >= cap) return fromWordpress.slice(0, cap);
        return mergeUniqueArticles(fromWordpress, localBasketball, cap);
      }
    }
  } catch {
    // Fall through to the local basketball archive.
  }

  return localBasketball.slice(0, cap);
}

export async function getArticlesByTag(slug: string, limit = 9, options?: ArticleQueryOptions): Promise<Article[]> {
  try {
    const [tagTerms, excludeQuery] = await Promise.all([
      wpFetch(`/tags?slug=${encodeURIComponent(slug)}`) as Promise<WpTermRecord[] | null>,
      tagExcludeQuery(options),
    ]);
    const tagIds = (tagTerms ?? []).map((term) => term.id).join(",");
    if (tagIds) {
      const posts = await wpFetch(
        `/posts?tags=${tagIds}&per_page=${limit}&orderby=date&order=desc${excludeQuery}&${listFieldsQuery}`,
      ) as WpPost[] | null;
      if (posts?.length) return sortArticlesByNewest(await postsToArticles(posts, options));
      if (options?.fallbackToLatest === false) return [];
    }
  } catch {
    if (options?.fallbackToLatest === false) return [];
  }
  if (options?.fallbackToLatest === false) return [];
  return withoutExcludedTags(await getLatestArticles(limit), options);
}

export async function getArticlesByEditorialLocation(
  slug: string,
  limit = 9,
  options?: ArticleQueryOptions,
): Promise<Article[]> {
  try {
    const [termIds, excludeQuery] = await Promise.all([
      getTaxonomyTermIds(EDITORIAL_LOCATION_TAXONOMY, [slug]),
      tagExcludeQuery(options),
    ]);
    if (termIds.length) {
      const posts = await wpFetch(
        `/posts?${EDITORIAL_LOCATION_TAXONOMY}=${termIds.join(",")}&per_page=${limit}&orderby=date&order=desc${excludeQuery}&${listFieldsQuery}`,
      ) as WpPost[] | null;
      if (posts?.length) {
        const articles = (await postsToArticles(posts, options)).map((article) => ({
          ...article,
          editorialLocations: [...new Set([...(article.editorialLocations ?? []), slug])],
        }));
        return sortArticlesByNewest(articles);
      }
      if (options?.fallbackToLatest === false) return [];
    }
  } catch {
    if (options?.fallbackToLatest === false) return [];
  }
  if (options?.fallbackToLatest === false) return [];
  return withoutExcludedTags(await getLatestArticles(limit), options);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const posts = await wpFetch(
      `/posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia,wp:term,author`,
    );
    if (posts?.[0]) return normalizePost(posts[0]);
  } catch {
    // The local editorial preview remains available if WordPress is offline.
  }
  return localArticleArchive.find((article) => article.slug === slug);
}

function articleTagSet(article: Article) {
  return new Set((article.tags ?? []).map((tag) => tag.trim().toLowerCase()).filter(Boolean));
}

function articleSlugKey(article: Pick<Article, "slug">) {
  return article.slug.trim().toLowerCase();
}

function isSameArticle(left: Pick<Article, "id" | "slug">, right: Pick<Article, "id" | "slug">) {
  return left.id === right.id || articleSlugKey(left) === articleSlugKey(right);
}

function primaryCategorySlug(article: Article) {
  return resolveCategorySlug(article.categorySlug).toLowerCase();
}

export function sharesRelatedCategory(source: Article, candidate: Article) {
  const sourceSlug = primaryCategorySlug(source);
  const candidateSlug = primaryCategorySlug(candidate);
  if (nationalCategorySlugs.has(sourceSlug) || nationalCategorySlugs.has(candidateSlug)) {
    return nationalCategorySlugs.has(sourceSlug) && nationalCategorySlugs.has(candidateSlug);
  }
  if (isBasketballCategory(sourceSlug, source.category)) {
    return isBasketballCategory(candidateSlug, candidate.category);
  }
  return sourceSlug === candidateSlug;
}

export function relatednessScore(source: Article, candidate: Article) {
  if (isSameArticle(source, candidate)) return 0;
  const sameCategory = sharesRelatedCategory(source, candidate);
  const sharedTags = [...articleTagSet(candidate)].filter((tag) => articleTagSet(source).has(tag)).length;
  if (sameCategory && sharedTags) return 200 + sharedTags;
  if (sameCategory) return 100;
  if (sharedTags) return sharedTags;
  return 0;
}

function rankRelatedArticles(source: Article, pool: Article[], limit: number) {
  const seen = new Set([articleSlugKey(source)]);
  return pool
    .filter((candidate) => {
      const slug = articleSlugKey(candidate);
      if (seen.has(slug) || isSameArticle(source, candidate)) return false;
      seen.add(slug);
      return true;
    })
    .map((candidate) => ({ candidate, score: relatednessScore(source, candidate) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      const rightTime = Date.parse(right.candidate.date ?? "");
      const leftTime = Date.parse(left.candidate.date ?? "");
      if (Number.isNaN(rightTime) && Number.isNaN(leftTime)) return 0;
      if (Number.isNaN(rightTime)) return 1;
      if (Number.isNaN(leftTime)) return -1;
      return rightTime - leftTime;
    })
    .map(({ candidate }) => candidate)
    .slice(0, limit);
}

function localRelatedArticles(article: Article, limit: number) {
  return rankRelatedArticles(article, localArticleArchive, limit);
}

async function relatedCategoryIds(article: Article) {
  const slug = primaryCategorySlug(article);
  if (nationalCategorySlugs.has(slug)) {
    const terms = await wpFetch("/categories?slug=nacionales,nacional") as WpTermRecord[] | null;
    return (terms ?? []).map((term) => term.id).filter(Boolean);
  }
  if (isBasketballCategory(slug, article.category)) {
    return getBasketballCategoryIds();
  }
  const terms = await wpFetch(`/categories?slug=${encodeURIComponent(slug)}`) as WpTermRecord[] | null;
  return (terms ?? []).map((term) => term.id).filter(Boolean);
}

export async function getRelatedArticles(article: Article, limit = 4): Promise<Article[]> {
  const cap = Math.max(1, Math.min(12, limit));
  const localRelated = localRelatedArticles(article, cap);
  const tagSlugs = [...articleTagSet(article)];

  try {
    const [tagIds, categoryIds] = await Promise.all([
      tagSlugs.length ? getTagIdsBySlug(tagSlugs) : Promise.resolve([] as number[]),
      relatedCategoryIds(article),
    ]);
    const excludeQuery = article.id ? `&exclude=${article.id}` : "";
    const pools = await Promise.all([
      categoryIds.length
        ? (wpFetch(
            `/posts?categories=${categoryIds.join(",")}${excludeQuery}&per_page=${Math.max(12, cap + 8)}&orderby=date&order=desc&${listFieldsQuery}`,
          ) as Promise<WpPost[] | null>)
        : Promise.resolve([] as WpPost[] | null),
      tagIds.length
        ? (wpFetch(
            `/posts?tags=${tagIds.join(",")}${excludeQuery}&per_page=${cap + 4}&orderby=date&order=desc&${listFieldsQuery}`,
          ) as Promise<WpPost[] | null>)
        : Promise.resolve([] as WpPost[] | null),
    ]);
    const fromWordpress = await postsToArticles(pools.flatMap((posts) => posts ?? []));
    const related = rankRelatedArticles(article, fromWordpress, cap);
    if (related.length >= cap) return related;
    return mergeUniqueArticles(related, localRelated, cap);
  } catch {
    return localRelated;
  }
}

const embedQuery = "_embed=wp:featuredmedia,wp:term,author";
const listFieldsQuery =
  "_fields=id,slug,date,modified,format,title,excerpt,featured_media,categories,tags,ubicacion_editorial";
export const internationalPageSize = 12;

export type ArticlePage = {
  articles: Article[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

async function nationalCategoryExcludeIds() {
  const categories = await wpFetch("/categories?slug=nacionales,nacional") as WpTermRecord[] | null;
  return (categories ?? []).map((term) => term.id).filter(Boolean);
}

function paginateArticles(articles: Article[], page: number, perPage: number): ArticlePage {
  const total = articles.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage) || 1);
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * perPage;
  return {
    articles: articles.slice(start, start + perPage),
    page: currentPage,
    perPage,
    total,
    totalPages,
  };
}

export async function getInternationalArticlePage(page = 1, perPage = internationalPageSize, options?: ArticleQueryOptions): Promise<ArticlePage> {
  const safePerPage = Math.min(30, Math.max(1, perPage));
  const safePage = Math.max(1, Math.floor(page) || 1);
  const localInternational = withoutExcludedTags(localInternationalArticles(), options);

  try {
    const [excludeIds, tagExclude] = await Promise.all([
      nationalCategoryExcludeIds(),
      tagExcludeQuery(options),
    ]);
    const excludeQuery = excludeIds.length ? `&categories_exclude=${excludeIds.join(",")}` : "";
    const result = await wpFetchResult<WpPost[]>(
      `/posts?orderby=date&order=desc${excludeQuery}${tagExclude}&per_page=${safePerPage}&page=${safePage}&${listFieldsQuery}`,
    );
    if (result && Array.isArray(result.data)) {
      const articles = (await postsToArticles(result.data, options)).filter((article) => !isNationalArticle(article));
      if (articles.length || result.totalPages > 0 || result.total > 0) {
        const totalPages = Math.max(1, result.totalPages || (result.total ? Math.ceil(result.total / safePerPage) : 1));
        return {
          articles,
          page: Math.min(safePage, totalPages),
          perPage: safePerPage,
          total: result.total || articles.length,
          totalPages,
        };
      }
      if (safePage > 1) {
        return {
          articles: [],
          page: safePage,
          perPage: safePerPage,
          total: 0,
          totalPages: Math.max(1, safePage - 1),
        };
      }
    }
  } catch {
    // Fall through to the local international archive.
  }

  return paginateArticles(localInternational, safePage, safePerPage);
}

export async function getInternationalArticles(limit = 5, options?: ArticleQueryOptions): Promise<Article[]> {
  const { articles } = await getInternationalArticlePage(1, limit, options);
  if (articles.length >= limit) return articles.slice(0, limit);
  return mergeUniqueArticles(articles, withoutExcludedTags(localInternationalArticles(), options), limit);
}

export async function getCategoryArticles(slug: string, options?: ArticleQueryOptions): Promise<Article[]> {
  const resolvedSlug = resolveCategorySlug(slug);
  if (resolvedSlug === "internacional") {
    return getInternationalArticles(articlesPerCategory, options);
  }
  if (resolvedSlug === "baloncesto") {
    return getBasketballArticles(articlesPerCategory, options);
  }

  const categoryEditorial = withoutExcludedTags([
    ...fallbackArticles.filter((article) => article.categorySlug === resolvedSlug || article.categorySlug === slug),
    ...localCategoryArticles.filter((article) => article.categorySlug === resolvedSlug || article.categorySlug === slug),
  ], options);

  try {
    const [slugTerms, tree, excludeQuery] = await Promise.all([
      wpFetch(`/categories?slug=${encodeURIComponent(resolvedSlug)}`) as Promise<Array<{ id?: number; slug?: string; name?: string; parent?: number; count?: number }> | null>,
      getWordpressCategories().catch(() => [] as WordpressCategory[]),
      tagExcludeQuery(options),
    ]);
    const slugMatch = slugTerms?.[0]?.id
      ? {
          id: slugTerms[0].id,
          slug: slugTerms[0].slug ?? resolvedSlug,
          name: slugTerms[0].name ?? resolvedSlug,
          parent: slugTerms[0].parent ?? 0,
          count: slugTerms[0].count ?? 0,
        } satisfies WordpressCategory
      : undefined;
    const match = tree.find((category) => category.slug.toLowerCase() === resolvedSlug.toLowerCase()) ?? slugMatch;
    const categoryIds = match
      ? (options?.exactCategory || !tree.length ? [match.id] : descendantCategoryIds(tree, match.id))
      : [];
    if (categoryIds.length) {
      const posts = await wpFetch(
        `/posts?categories=${categoryIds.join(",")}&per_page=${articlesPerCategory}&orderby=date&order=desc${excludeQuery}&${listFieldsQuery}`,
      );
      if (posts?.length) {
        const normalized = await postsToArticles(posts, options);
        return mergeUniqueArticles(normalized, categoryEditorial, articlesPerCategory);
      }
    }
  } catch {
    // Fall through to representative local content.
  }
  return categoryEditorial.slice(0, articlesPerCategory);
}

const videoTermSlugs = "videos,video";

async function getVideoTermIds(taxonomy: "categories" | "tags") {
  const terms = await wpFetch(`/${taxonomy}?slug=${encodeURIComponent(videoTermSlugs)}`) as WpTermRecord[] | null;
  return (terms ?? []).map((term) => term.id).filter(Boolean);
}

function mergeUniqueWpPosts(groups: Array<WpPost[] | null | undefined>) {
  const byId = new Map<number, WpPost>();
  for (const group of groups) {
    for (const post of group ?? []) {
      if (post?.id && !byId.has(post.id)) byId.set(post.id, post);
    }
  }
  return sortByNewest([...byId.values()]);
}

function isPlayableVideoPost(post: WpPost) {
  return post.format === "video" || Boolean(firstVideoUrl(post.content?.rendered));
}

async function fetchWordpressVideoPosts(limit: number): Promise<WpPost[]> {
  const perPage = Math.min(100, Math.max(limit * 2, 12));
  const [categoryIds, tagIds] = await Promise.all([
    getVideoTermIds("categories"),
    getVideoTermIds("tags"),
  ]);
  const requests: Array<Promise<WpPost[] | null>> = [
    wpFetch(`/posts?format=video&per_page=${perPage}&orderby=date&order=desc&${embedQuery}`),
  ];
  if (categoryIds.length) {
    requests.push(
      wpFetch(`/posts?categories=${categoryIds.join(",")}&per_page=${perPage}&orderby=date&order=desc&${embedQuery}`),
    );
  }
  if (tagIds.length) {
    requests.push(
      wpFetch(`/posts?tags=${tagIds.join(",")}&per_page=${perPage}&orderby=date&order=desc&${embedQuery}`),
    );
  }
  const groups = await Promise.all(requests);
  return mergeUniqueWpPosts(groups).filter(isPlayableVideoPost).slice(0, limit);
}

export async function getVideoItems(limit = 8): Promise<VideoItem[]> {
  try {
    const posts = await fetchWordpressVideoPosts(limit);
    if (posts.length) return sortByNewest(posts.map(normalizeVideoPost));
  } catch {
    // Keep the video section available while WordPress is offline or unconfigured.
  }
  return sortByNewest(fallbackVideos).slice(0, limit);
}

export async function getVideoBySlug(slug: string): Promise<VideoItem | undefined> {
  try {
    const posts = await wpFetch(
      `/posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia,wp:term,author`,
    );
    if (posts?.[0]) return normalizeVideoPost(posts[0]);
  } catch {
    // Use the editorial preview below.
  }
  return fallbackVideos.find((video) => video.slug === slug);
}

const sitemapPostFields = "_fields=id,slug,date,modified,format,title";
const newsWindowMs = 48 * 60 * 60 * 1000;

type WpSitemapPost = {
  id?: number;
  slug?: string;
  date?: string;
  modified?: string;
  format?: string;
  title?: { rendered?: string };
};

function isVideoFormat(post: Pick<WpSitemapPost, "format">) {
  return post.format === "video";
}

function toSitemapEntry(post: WpSitemapPost): SitemapEntry | null {
  if (!post.slug) return null;
  return {
    slug: post.slug,
    lastModified: post.modified || post.date,
  };
}

async function fetchWpPostsPage(query: string, page: number) {
  return wpFetchResult<WpSitemapPost[]>(`/posts?${query}&per_page=${WP_SITEMAP_PER_PAGE}&page=${page}`, {
    timeoutMs: 20000,
  });
}

async function paginateWpPosts(
  query: string,
  options?: { fromPage?: number; toPage?: number; maxPages?: number },
): Promise<WpSitemapPost[]> {
  const fromPage = Math.max(1, options?.fromPage ?? 1);
  const first = await fetchWpPostsPage(query, fromPage);
  if (!first || !Array.isArray(first.data)) return [];
  const totalPages = Math.max(first.totalPages || 1, 1);
  const cappedByMax = options?.maxPages ? fromPage + options.maxPages - 1 : totalPages;
  const lastPage = Math.min(options?.toPage ?? totalPages, cappedByMax, totalPages);
  if (lastPage <= fromPage) return [...first.data];

  const remaining = Array.from({ length: lastPage - fromPage }, (_, index) => fromPage + 1 + index);
  const rest = await Promise.all(remaining.map((page) => fetchWpPostsPage(query, page)));
  return [
    ...first.data,
    ...rest.flatMap((result) => (result && Array.isArray(result.data) ? result.data : [])),
  ];
}

async function getWordpressVideoPosts() {
  try {
    const [categoryIds, tagIds] = await Promise.all([
      getVideoTermIds("categories"),
      getVideoTermIds("tags"),
    ]);
    const [categoryPosts, tagPosts, formatPosts] = await Promise.all([
      categoryIds.length
        ? paginateWpPosts(`categories=${categoryIds.join(",")}&${sitemapPostFields}`, { maxPages: videoSitemapMaxPages })
        : Promise.resolve([] as WpSitemapPost[]),
      tagIds.length
        ? paginateWpPosts(`tags=${tagIds.join(",")}&${sitemapPostFields}`, { maxPages: videoSitemapMaxPages })
        : Promise.resolve([] as WpSitemapPost[]),
      paginateWpPosts(`format=video&${sitemapPostFields}`, { maxPages: videoSitemapMaxPages }),
    ]);
    const bySlug = new Map<string, WpSitemapPost>();
    for (const post of [...categoryPosts, ...tagPosts, ...formatPosts]) {
      if (post.slug && !bySlug.has(post.slug)) bySlug.set(post.slug, post);
    }
    return [...bySlug.values()];
  } catch {
    return [] as WpSitemapPost[];
  }
}

function localNewsEntries(): SitemapEntry[] {
  return [...fallbackArticles, ...localCategoryArticles].map((article) => ({ slug: article.slug }));
}

function localVideoEntries(): SitemapEntry[] {
  return fallbackVideos.map((video) => ({ slug: video.slug }));
}

export async function getSitemapIndexMeta(): Promise<SitemapIndexMeta> {
  try {
    const first = await fetchWpPostsPage(sitemapPostFields, 1);
    if (!first || !first.totalPages) {
      return { newsChunks: 1, postTotal: 0, fromWordpress: false };
    }
    const newsChunks = Math.max(1, Math.ceil(first.totalPages / wpPagesPerNewsChunk));
    return { newsChunks, postTotal: first.total, fromWordpress: true };
  } catch {
    return { newsChunks: 1, postTotal: 0, fromWordpress: false };
  }
}

export async function getSitemapNewsChunk(chunk: number): Promise<SitemapEntry[]> {
  const safeChunk = Math.max(1, Math.floor(chunk) || 1);
  const fromPage = (safeChunk - 1) * wpPagesPerNewsChunk + 1;
  const toPage = safeChunk * wpPagesPerNewsChunk;
  try {
    const posts = await paginateWpPosts(sitemapPostFields, { fromPage, toPage });
    const articles = posts
      .filter((post) => !isVideoFormat(post))
      .map(toSitemapEntry)
      .filter((entry): entry is SitemapEntry => Boolean(entry));
    if (articles.length) return articles;
    return safeChunk === 1 ? localNewsEntries() : [];
  } catch {
    return safeChunk === 1 ? localNewsEntries() : [];
  }
}

export async function getSitemapVideos(): Promise<SitemapEntry[]> {
  try {
    const videos = (await getWordpressVideoPosts())
      .map(toSitemapEntry)
      .filter((entry): entry is SitemapEntry => Boolean(entry));
    return videos.length ? videos : localVideoEntries();
  } catch {
    return localVideoEntries();
  }
}

export async function getNewsSitemapEntries(): Promise<NewsSitemapEntry[]> {
  try {
    const after = new Date(Date.now() - newsWindowMs).toISOString();
    const posts = await paginateWpPosts(
      `after=${after}&orderby=date&order=desc&${sitemapPostFields}`,
      { maxPages: 10 },
    );
    return posts
      .filter((post) => post.slug && post.date && !isVideoFormat(post))
      .slice(0, 1000)
      .map((post) => ({
        slug: post.slug as string,
        title: plainText(post.title?.rendered) || post.slug as string,
        publishedAt: post.date as string,
      }));
  } catch {
    return [];
  }
}
