import { editorialImageBank, type EditorialImage } from "./editorial-images";

export type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  image: string;
  author: string;
  publishedAt: string;
  content?: string;
  media?: "video" | "audio";
  imageCredit?: string;
  imageSourceUrl?: string;
  imageLicense?: string;
  imageLicenseUrl?: string;
};

export type VideoItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  section: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  embedUrl?: string;
  sourceUrl?: string;
};

const pioYoutubeChannel = "https://www.youtube.com/@piodeportes/featured";

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
    image: "/news/reinas.jpg",
    author: "Pío Deportes",
    publishedAt: "Hace 24 minutos",
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
    image: "/news/mlb.jpg",
    author: "Redacción Pío",
    publishedAt: "Hace 42 minutos",
  },
  {
    id: 3,
    slug: "odell-beckham-debut-giants",
    title: "Odell Beckham Jr. jugará en el debut de los Giants en pretemporada",
    excerpt:
      "El receptor está listo para volver al terreno y todas las miradas apuntan a su primer partido.",
    category: "NFL",
    categorySlug: "nfl",
    image: "/news/giants.jpg",
    author: "Pío Deportes",
    publishedAt: "Hace 1 hora",
  },
  {
    id: 4,
    slug: "holanda-ficha-a-xavi",
    title: "Holanda ficha a Xavi, su primer técnico extranjero desde 1978",
    excerpt:
      "La selección neerlandesa apuesta por una nueva idea de juego de cara al próximo gran ciclo internacional.",
    category: "Fútbol",
    categorySlug: "futbol",
    image: "/news/futbol.jpg",
    author: "Agencias",
    publishedAt: "Hace 2 horas",
  },
  {
    id: 5,
    slug: "rybakina-vence-a-gauff",
    title: "Rybakina vence a Gauff y alcanza la final de Toronto",
    excerpt:
      "La campeona resolvió los momentos clave y aseguró su lugar en la definición del torneo.",
    category: "Tenis",
    categorySlug: "tennis",
    image: "/news/tennis.jpg",
    author: "Pío Deportes",
    publishedAt: "Hace 2 horas",
  },
  {
    id: 6,
    slug: "cambio-historico-nba-lakers",
    title: "Cambio histórico en la NBA: los Lakers tienen nuevos dueños",
    excerpt:
      "La operación abre una etapa distinta para una de las franquicias más reconocidas del deporte mundial.",
    category: "NBA",
    categorySlug: "nba",
    image: "/news/nba.jpg",
    author: "Redacción Pío",
    publishedAt: "Hace 3 horas",
  },
  {
    id: 7,
    slug: "dominicana-mexico-serie-caribe-kids",
    title: "República Dominicana arrolla a México y mantiene su invicto",
    excerpt:
      "El conjunto quisqueyano volvió a producir desde temprano y sigue firme en la Serie del Caribe Kids.",
    category: "Béisbol del Caribe",
    categorySlug: "beisbol-del-caribe",
    image: "/news/caribe.jpg",
    author: "Pío Deportes",
    publishedAt: "Hace 4 horas",
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
    image: "/news/voleibol.jpg",
    author: "Pío Deportes",
    publishedAt: "Hace 5 horas",
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
    category: "Fútbol",
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
  {
    title: "las claves que explican el momento",
    excerpt: "Un repaso a las decisiones, estadísticas y protagonistas que ayudan a entender el desarrollo de esta historia deportiva.",
  },
  {
    title: "protagonistas, datos y próximos pasos",
    excerpt: "El escenario queda abierto con nuevos retos, figuras a seguir y una agenda que puede modificar el rumbo de la competencia.",
  },
  {
    title: "qué cambia y por qué importa",
    excerpt: "Contexto y análisis para conocer el impacto de la noticia dentro de la temporada y sus posibles consecuencias deportivas.",
  },
  {
    title: "el escenario que se abre a partir de ahora",
    excerpt: "Equipos, atletas y cuerpos técnicos ajustan sus planes mientras la atención se concentra en los próximos compromisos.",
  },
  {
    title: "agenda, contexto y puntos de atención",
    excerpt: "Las fechas importantes, los nombres propios y los detalles que la fanaticada debe tener presentes durante los próximos días.",
  },
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
        title: series === 0 ? baseTitle : `${baseTitle}: ${angle.title}`,
        excerpt: angle.excerpt,
        category: profile.category,
        categorySlug,
        image: editorialImage?.url ?? profile.image,
        imageCredit: editorialImage?.credit,
        imageSourceUrl: editorialImage?.sourceUrl,
        imageLicense: editorialImage?.license,
        imageLicenseUrl: editorialImage?.licenseUrl,
        author: index % 3 === 0 ? "Pío Deportes" : index % 3 === 1 ? "Redacción Pío" : "Agencias",
        publishedAt: elapsed < 12
          ? `Hace ${elapsed} hora${elapsed === 1 ? "" : "s"}`
          : `Hace ${Math.ceil((elapsed - 11) / 3)} día${elapsed < 15 ? "" : "s"}`,
        media: index % 12 === 2 ? "video" as const : index % 17 === 8 ? "audio" as const : undefined,
      };
    }),
);

const localArticleArchive = [...fallbackArticles, ...localCategoryArticles];

const apiBase = (process.env.WORDPRESS_API_URL || "https://piod.axworkflow.com/wp-json/wp/v2").replace(/\/$/, "");

export const wordpressCategorySlugs = [
  "nacionales",
  "mlb",
  "nba",
  "lidom",
  "futbol",
  "nfl",
  "tennis",
  "beisbol-del-caribe",
  "otros-deportes",
] as const;

const categorySlugAliases: Record<string, string> = {
  tenis: "tennis",
};

function resolveCategorySlug(slug: string) {
  return categorySlugAliases[slug] ?? slug;
}

type WpTerm = { taxonomy?: string; name?: string; slug?: string };
type WpPost = {
  id: number;
  slug: string;
  date: string;
  format?: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      media_details?: { sizes?: { large?: { source_url?: string } } };
    }>;
    "wp:term"?: WpTerm[][];
    author?: Array<{ name?: string }>;
  };
};

function plainText(value = "") {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8230;|&hellip;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

const editorialCategorySlugs = new Set(["destacados", "uncategorized"]);

function displayCategory(terms: WpTerm[]) {
  const categories = terms.filter((term) => term.taxonomy === "category");
  return (
    categories.find((term) => term.slug && !editorialCategorySlugs.has(term.slug)) ??
    categories[0]
  );
}

function normalizePost(post: WpPost): Article {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  const terms = post?._embedded?.["wp:term"]?.flat?.() ?? [];
  const category = displayCategory(terms);
  const author = post?._embedded?.author?.[0]?.name;

  return {
    id: post.id,
    slug: post.slug,
    title: plainText(post.title?.rendered),
    excerpt: plainText(post.excerpt?.rendered),
    category: category?.name ?? "Actualidad",
    categorySlug: category?.slug ?? "actualidad",
    image:
      media?.media_details?.sizes?.large?.source_url ??
      media?.source_url ??
      "/news/reinas.jpg",
    author: author ?? "Pío Deportes",
    publishedAt: new Intl.DateTimeFormat("es-DO", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(post.date)),
    content: post.content?.rendered,
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
    duration: "Video",
    embedUrl,
    sourceUrl: embedUrl ?? pioYoutubeChannel,
  };
}

async function wpFetch(path: string) {
  if (!apiBase) return null;
  const response = await fetch(`${apiBase}${path}`, {
    next: { revalidate: 120 },
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`WordPress respondió ${response.status}`);
  return response.json();
}

function mergeUniqueArticles(primary: Article[], editorial: Article[], limit: number) {
  const slugs = new Set(primary.map((article) => article.slug));
  return [
    ...primary,
    ...editorial.filter((article) => !slugs.has(article.slug)),
  ].slice(0, limit);
}

export async function getLatestArticles(limit = 12): Promise<Article[]> {
  try {
    const posts = await wpFetch(
      `/posts?per_page=${limit}&orderby=date&order=desc&_embed=wp:featuredmedia,wp:term,author`,
    );
    return posts?.length
      ? mergeUniqueArticles(posts.map(normalizePost), localArticleArchive, limit)
      : localArticleArchive.slice(0, limit);
  } catch {
    return localArticleArchive.slice(0, limit);
  }
}

type WpTermRecord = { id: number };

function mergePostsByDate(groups: WpPost[][], limit: number) {
  const seen = new Set<number>();
  return groups
    .flat()
    .filter((post) => {
      if (!post?.id || seen.has(post.id)) return false;
      seen.add(post.id);
      return true;
    })
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
    .slice(0, limit);
}

export async function getFeaturedArticles(limit = 7): Promise<Article[]> {
  try {
    const [tagTerms, categoryTerms] = await Promise.all([
      wpFetch("/tags?slug=destacados,destacado") as Promise<WpTermRecord[] | null>,
      wpFetch("/categories?slug=destacados") as Promise<WpTermRecord[] | null>,
    ]);
    const tagIds = (tagTerms ?? []).map((term) => term.id).join(",");
    const categoryIds = (categoryTerms ?? []).map((term) => term.id).join(",");
    const embed = "_embed=wp:featuredmedia,wp:term,author";
    const [taggedPosts, categorizedPosts] = await Promise.all([
      tagIds
        ? wpFetch(`/posts?tags=${tagIds}&per_page=${limit}&orderby=date&order=desc&${embed}`) as Promise<WpPost[] | null>
        : Promise.resolve(null),
      categoryIds
        ? wpFetch(`/posts?categories=${categoryIds}&per_page=${limit}&orderby=date&order=desc&${embed}`) as Promise<WpPost[] | null>
        : Promise.resolve(null),
    ]);
    const featured = mergePostsByDate([taggedPosts ?? [], categorizedPosts ?? []], limit).map(normalizePost);
    if (featured.length >= limit) return featured;
    if (featured.length) return mergeUniqueArticles(featured, await getLatestArticles(limit), limit);
  } catch {
    // Fall through to the latest-news backup below.
  }
  return getLatestArticles(limit);
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
  return localArticleArchive.find((article) => article.slug === slug) ?? fallbackArticles[0];
}

export async function getCategoryArticles(slug: string): Promise<Article[]> {
  const resolvedSlug = resolveCategorySlug(slug);
  const categoryEditorial = [
    ...fallbackArticles.filter((article) => article.categorySlug === resolvedSlug || article.categorySlug === slug),
    ...localCategoryArticles.filter((article) => article.categorySlug === resolvedSlug || article.categorySlug === slug),
  ];

  try {
    const categories = await wpFetch(`/categories?slug=${encodeURIComponent(resolvedSlug)}`);
    if (categories?.[0]) {
      const posts = await wpFetch(
        `/posts?categories=${categories[0].id}&per_page=${articlesPerCategory}&_embed=wp:featuredmedia,wp:term,author`,
      );
      if (posts?.length) {
        const normalized = posts.map(normalizePost);
        return mergeUniqueArticles(normalized, categoryEditorial, articlesPerCategory);
      }
    }
  } catch {
    // Fall through to representative local content.
  }
  return categoryEditorial.length
    ? mergeUniqueArticles([], categoryEditorial, articlesPerCategory)
    : localArticleArchive.slice(0, articlesPerCategory);
}

export async function getVideoItems(limit = 8): Promise<VideoItem[]> {
  try {
    const videoCategories = await wpFetch("/categories?slug=videos,video");
    if (videoCategories?.[0]) {
      const posts = await wpFetch(
        `/posts?categories=${videoCategories[0].id}&per_page=${limit}&_embed=wp:featuredmedia,wp:term,author`,
      );
      if (posts?.length) return posts.map(normalizeVideoPost);
    }

    const formattedPosts = await wpFetch(
      `/posts?format=video&per_page=${limit}&_embed=wp:featuredmedia,wp:term,author`,
    );
    if (formattedPosts?.length) return formattedPosts.map(normalizeVideoPost);
  } catch {
    // Keep the video section available while WordPress is offline or unconfigured.
  }
  return fallbackVideos.slice(0, limit);
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
  return fallbackVideos.find((video) => video.slug === slug) ?? fallbackVideos[0];
}
