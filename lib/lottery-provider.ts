export type LotterySourceType = "official" | "informative";

export type LotteryResult = {
  id: string;
  operator: string;
  game: string;
  date: string;
  drawTime: string;
  numbers: string[];
  bonus?: Array<{ label: string; number: string }>;
  drawNumber?: string;
  sourceName: string;
  sourceUrl: string;
  sourceType: LotterySourceType;
};

export type LotterySchedule = {
  operator: string;
  game: string;
  days: string;
  time: string;
};

export type LotterySourceStatus = {
  name: string;
  url: string;
  type: LotterySourceType;
  available: boolean;
};

export type LotteryFeed = {
  results: LotteryResult[];
  schedules: LotterySchedule[];
  sources: LotterySourceStatus[];
  updatedAt: string;
  nextRefreshAt: string;
  refreshSeconds: number;
};

const AST_OFFSET_MS = 4 * 60 * 60 * 1000;
const LOTOREAL_API = "https://ov.gruporeal.com.do/api/lr";
const LOTEKA_URL = "https://loteka.com.do/";
const LEIDSA_OFFICIAL_URL = "https://www.leidsa.com/";
const LEIDSA_BACKUP_URL = "https://enloteria.com/resultados-leidsa";
const REAL_BACKUP_URL = "https://enloteria.com/resultados-real";
const LOTO_REAL_BACKUP_URL = "https://enloteria.com/resultados-loto-real";

const schedules: LotterySchedule[] = [
  { operator: "Loto Real", game: "Lotería Real y Loto Pool", days: "Todos los días", time: "12:55 p. m." },
  { operator: "Loto Real", game: "Loto Real", days: "Martes y viernes", time: "12:55 p. m." },
  { operator: "Lotería Nacional", game: "Gana Más y sorteos de la tarde", days: "Todos los días", time: "2:30 p. m." },
  { operator: "LEIDSA", game: "Quiniela, Pega 3 Más, Loto Pool y Súper Kino TV", days: "Lunes a sábado", time: "8:55 p. m." },
  { operator: "LEIDSA", game: "Sorteos dominicales", days: "Domingos", time: "3:55 p. m." },
  { operator: "LEIDSA", game: "Loto LEIDSA", days: "Miércoles y sábados", time: "8:55 p. m." },
  { operator: "Loteka", game: "Quiniela, MegaChance, Repartidera y Toca 3", days: "Todos los días", time: "7:55 p. m." },
  { operator: "Loteka", game: "Lotto Loteka", days: "Lunes y jueves", time: "7:55 p. m." },
  { operator: "Lotería Nacional", game: "Sorteo nocturno", days: "Lunes a sábado", time: "9:00 p. m." },
  { operator: "Lotería Nacional", game: "Sorteo dominical", days: "Domingos", time: "6:00 p. m." },
];

type CacheEntry = { feed: LotteryFeed; expiresAt: number };
let memoryCache: CacheEntry | undefined;
let pendingFeed: Promise<LotteryFeed> | undefined;

function astClock(now = new Date()) {
  const ast = new Date(now.getTime() - AST_OFFSET_MS);
  return {
    year: ast.getUTCFullYear(),
    month: ast.getUTCMonth(),
    date: ast.getUTCDate(),
    day: ast.getUTCDay(),
    minutes: ast.getUTCHours() * 60 + ast.getUTCMinutes(),
  };
}

function refreshPlan(now = new Date()) {
  const clock = astClock(now);
  const regularWindows = [12 * 60 + 55, 14 * 60 + 30, 19 * 60 + 55, 20 * 60 + 55, 21 * 60];
  const sundayWindows = [12 * 60 + 55, 14 * 60 + 30, 15 * 60 + 55, 18 * 60, 19 * 60 + 55];
  const windows = clock.day === 0 ? sundayWindows : regularWindows;
  const active = windows.some((minute) => clock.minutes >= minute - 2 && clock.minutes <= minute + 50);
  const refreshSeconds = active ? 300 : 1800;

  const nextMinute = windows.find((minute) => minute - 2 > clock.minutes);
  const next = new Date(now);
  if (nextMinute !== undefined) {
    const hours = Math.floor(nextMinute / 60);
    const minutes = nextMinute % 60;
    next.setTime(Date.UTC(clock.year, clock.month, clock.date, hours + 4, minutes - 2));
  } else {
    const tomorrow = new Date(Date.UTC(clock.year, clock.month, clock.date + 1));
    const tomorrowClock = astClock(new Date(tomorrow.getTime() + AST_OFFSET_MS));
    const firstMinute = tomorrowClock.day === 0 ? sundayWindows[0] : regularWindows[0];
    next.setTime(Date.UTC(
      tomorrow.getUTCFullYear(),
      tomorrow.getUTCMonth(),
      tomorrow.getUTCDate(),
      Math.floor(firstMinute / 60) + 4,
      (firstMinute % 60) - 2,
    ));
  }

  return { refreshSeconds, nextRefreshAt: next.toISOString() };
}

function dateKeyInAst(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return typeof value === "string" ? value.slice(0, 10) : "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santo_Domingo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function normalizeDate(value: string) {
  const slash = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slash) return `${slash[3]}-${slash[2]}-${slash[1]}`;
  return dateKeyInAst(value);
}

function stripTags(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

async function fetchText(url: string, init: RequestInit = {}, revalidate = 300) {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(9000),
    next: { revalidate },
  });
  if (!response.ok) throw new Error(`Upstream ${response.status}: ${url}`);
  return response.text();
}

const realGames: Record<string, { operator: string; game: string; time: string; sourceType: LotterySourceType }> = {
  NRT: { operator: "Loto Real", game: "Lotería Real", time: "12:55 p. m.", sourceType: "official" },
  LLR: { operator: "Loto Real", game: "Loto Real", time: "12:55 p. m.", sourceType: "official" },
  NLP: { operator: "Loto Real", game: "Loto Pool", time: "12:55 p. m.", sourceType: "official" },
  NPO: { operator: "Loto Real", game: "Loto Pool Noche", time: "8:55 p. m.", sourceType: "official" },
  NN: { operator: "Lotería Nacional", game: "Lotería Nacional", time: "9:00 p. m.", sourceType: "informative" },
  NNT: { operator: "Lotería Nacional", game: "Gana Más", time: "2:30 p. m.", sourceType: "informative" },
  NPR: { operator: "Lotería Nacional", game: "La Primera", time: "12:00 p. m.", sourceType: "informative" },
};

type RealApiResult = { lottery?: string; sorteo?: number | string; results?: string; date?: string };
type RealApiResponse = { success?: boolean; data?: RealApiResult[] };

async function fetchLotoRealResults(revalidate: number) {
  const entries = await Promise.allSettled(Object.keys(realGames).map(async (acronym) => {
    const response = await fetch(`${LOTOREAL_API}/results/${acronym}/0?rowAmount=12`, {
      headers: {
        Accept: "application/json",
        Origin: "https://www.lotoreal.com.do",
        Referer: "https://www.lotoreal.com.do/",
      },
      signal: AbortSignal.timeout(9000),
      next: { revalidate },
    });
    if (!response.ok) throw new Error(`Loto Real ${response.status}`);
    const body = await response.json() as RealApiResponse;
    const game = realGames[acronym];
    return (body.data ?? []).filter((item) => item.results && item.date).map((item): LotteryResult => ({
      id: `real-${acronym}-${item.sorteo ?? item.date}`,
      operator: game.operator,
      game: game.game,
      date: dateKeyInAst(item.date!),
      drawTime: game.time,
      numbers: item.results!.split("-").map((number) => number.trim().padStart(2, "0")),
      drawNumber: item.sorteo ? String(item.sorteo) : undefined,
      sourceName: game.sourceType === "official" ? "Loto Real" : "Loto Real · resultados informativos",
      sourceUrl: "https://www.lotoreal.com.do/",
      sourceType: game.sourceType,
    }));
  }));

  return entries.flatMap((entry) => entry.status === "fulfilled" ? entry.value : []);
}

function lotekaSection(html: string, marker: string) {
  const start = html.indexOf(marker);
  if (start < 0) return "";
  const end = html.indexOf("<!-- bloque-loteria -->", start);
  return html.slice(start, end > start ? end : start + 5000);
}

function lotekaNumbers(section: string) {
  return Array.from(section.matchAll(/<div class="bola[^"]*">([\s\S]*?)<\/div>/gi))
    .map((match) => stripTags(match[1]).match(/(\d{1,2})\s*$/)?.[1])
    .filter((value): value is string => Boolean(value));
}

function parseLotekaResult(
  html: string,
  marker: string,
  game: string,
  options: { lotto?: boolean; singleDigit?: boolean } = {},
): LotteryResult | undefined {
  const section = lotekaSection(html, marker);
  const date = section.match(/fecha-sorteo">\s*(\d{2}\/\d{2}\/\d{4})/i)?.[1];
  const values = lotekaNumbers(section);
  if (!date || !values.length) return undefined;
  const numbers = options.lotto ? values.slice(0, 6) : values;
  return {
    id: `loteka-${game.toLowerCase().replace(/\s+/g, "-")}-${normalizeDate(date)}`,
    operator: "Loteka",
    game,
    date: normalizeDate(date),
    drawTime: "7:55 p. m.",
    numbers: numbers.map((number) => options.singleDigit ? number : number.padStart(2, "0")),
    bonus: options.lotto && values.length >= 8 ? [
      { label: "Extra", number: values[6].padStart(2, "0") },
      { label: "Power", number: values[7].padStart(2, "0") },
    ] : undefined,
    sourceName: "Loteka",
    sourceUrl: LOTEKA_URL,
    sourceType: "official" as const,
  } satisfies LotteryResult;
}

async function fetchLotekaResults(revalidate: number) {
  const html = await fetchText(LOTEKA_URL, { headers: { "User-Agent": "PioDeportes/1.0 (+https://www.piodeportes.com)" } }, revalidate);
  return [
    parseLotekaResult(html, "<!-- Lotto Loteka - Power Lotto -->", "Lotto Loteka", { lotto: true }),
    parseLotekaResult(html, "<!-- MegaChance -->", "MegaChance"),
    parseLotekaResult(html, "<!-- Repartidera MegaChance -->", "Repartidera"),
    parseLotekaResult(html, "<!-- Quiniela -->", "Quiniela Loteka"),
    parseLotekaResult(html, "<!-- Toca 3 -->", "Toca 3", { singleDigit: true }),
  ].filter((result): result is LotteryResult => Boolean(result));
}

function visitJsonLd(value: unknown, found: LotteryResult[]) {
  if (Array.isArray(value)) {
    value.forEach((item) => visitJsonLd(item, found));
    return;
  }
  if (!value || typeof value !== "object") return;
  const record = value as Record<string, unknown>;
  if (record["@type"] === "Event" && record.name === "Leidsa" && Array.isArray(record.additionalProperty)) {
    const properties = Object.fromEntries(record.additionalProperty.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const prop = item as Record<string, unknown>;
      return typeof prop.name === "string" && typeof prop.value === "string" ? [[prop.name, prop.value]] : [];
    }));
    const date = properties["Fecha del Sorteo"];
    const numbers = [properties["Primer Premio"], properties["Segundo Premio"], properties["Tercer Premio"]]
      .filter((number): number is string => Boolean(number))
      .map((number) => number.padStart(2, "0"));
    if (date && numbers.length === 3) {
      found.push({
        id: `leidsa-quiniela-${date}`,
        operator: "LEIDSA",
        game: "Quiniela LEIDSA",
        date,
        drawTime: new Date(`${date}T12:00:00-04:00`).getDay() === 0 ? "3:55 p. m." : "8:55 p. m.",
        numbers,
        sourceName: "EnLotería · fuente informativa",
        sourceUrl: typeof record.url === "string" ? record.url : LEIDSA_BACKUP_URL,
        sourceType: "informative",
      });
    }
  }
  Object.values(record).forEach((item) => visitJsonLd(item, found));
}

async function fetchLeidsaResults(revalidate: number) {
  const html = await fetchText(LEIDSA_BACKUP_URL, { headers: { "User-Agent": "PioDeportes/1.0 (+https://www.piodeportes.com)" } }, revalidate);
  const results: LotteryResult[] = [];
  for (const script of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      visitJsonLd(JSON.parse(script[1]), results);
    } catch {
      // Ignore unrelated or malformed structured-data blocks.
    }
  }
  return results;
}

function parseBackupEvents(
  html: string,
  expectedName: string,
  operator: string,
  game: string,
  drawTime: string,
) {
  const results: LotteryResult[] = [];
  const visit = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!value || typeof value !== "object") return;
    const record = value as Record<string, unknown>;
    if (record["@type"] === "Event" && record.name === expectedName && Array.isArray(record.additionalProperty)) {
      const properties = record.additionalProperty.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const prop = item as Record<string, unknown>;
        return typeof prop.name === "string" && typeof prop.value === "string" ? [{ name: prop.name, value: prop.value }] : [];
      });
      const date = properties.find((property) => property.name === "Fecha del Sorteo")?.value;
      const numbers = properties.filter((property) => property.name !== "Fecha del Sorteo").map((property) => property.value.padStart(2, "0"));
      if (date && numbers.length) {
        results.push({
          id: `backup-${game.toLowerCase().replace(/\s+/g, "-")}-${date}`,
          operator,
          game,
          date,
          drawTime,
          numbers,
          sourceName: "EnLotería · fuente informativa",
          sourceUrl: typeof record.url === "string" ? record.url : REAL_BACKUP_URL,
          sourceType: "informative",
        });
      }
    }
    Object.values(record).forEach(visit);
  };

  for (const script of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      visit(JSON.parse(script[1]));
    } catch {
      // Ignore unrelated or malformed structured-data blocks.
    }
  }
  return results;
}

async function fetchLotoRealBackupResults(revalidate: number) {
  const [daily, lotto] = await Promise.all([
    fetchText(REAL_BACKUP_URL, { headers: { "User-Agent": "PioDeportes/1.0 (+https://www.piodeportes.com)" } }, revalidate),
    fetchText(LOTO_REAL_BACKUP_URL, { headers: { "User-Agent": "PioDeportes/1.0 (+https://www.piodeportes.com)" } }, revalidate),
  ]);
  return [
    ...parseBackupEvents(daily, "Real", "Loto Real", "Lotería Real", "12:55 p. m."),
    ...parseBackupEvents(lotto, "Loto Real", "Loto Real", "Loto Real", "12:55 p. m."),
  ];
}

async function buildLotteryFeed() {
  const plan = refreshPlan();
  const [real, realBackup, loteka, leidsa] = await Promise.allSettled([
    fetchLotoRealResults(plan.refreshSeconds),
    fetchLotoRealBackupResults(plan.refreshSeconds),
    fetchLotekaResults(plan.refreshSeconds),
    fetchLeidsaResults(plan.refreshSeconds),
  ]);
  const officialRealResults = real.status === "fulfilled" ? real.value : [];
  const backupRealResults = realBackup.status === "fulfilled" ? realBackup.value : [];
  const realResults = officialRealResults.length ? officialRealResults : backupRealResults;
  const lotekaResults = loteka.status === "fulfilled" ? loteka.value : [];
  const leidsaResults = leidsa.status === "fulfilled" ? leidsa.value : [];
  const unique = new Map<string, LotteryResult>();
  [...realResults, ...lotekaResults, ...leidsaResults].forEach((result) => unique.set(result.id, result));
  const results = [...unique.values()].sort((a, b) => b.date.localeCompare(a.date) || a.operator.localeCompare(b.operator));

  return {
    results,
    schedules,
    sources: [
      { name: "Loto Real", url: "https://www.lotoreal.com.do/", type: "official", available: officialRealResults.length > 0 },
      { name: "Loteka", url: LOTEKA_URL, type: "official", available: lotekaResults.length > 0 },
      { name: "LEIDSA", url: LEIDSA_OFFICIAL_URL, type: "official", available: false },
      { name: "EnLotería", url: LEIDSA_BACKUP_URL, type: "informative", available: leidsaResults.length > 0 || backupRealResults.length > 0 },
    ] satisfies LotterySourceStatus[],
    updatedAt: new Date().toISOString(),
    nextRefreshAt: plan.nextRefreshAt,
    refreshSeconds: plan.refreshSeconds,
  } satisfies LotteryFeed;
}

export async function getLotteryFeed(): Promise<LotteryFeed> {
  const now = Date.now();
  if (memoryCache && memoryCache.expiresAt > now) return memoryCache.feed;
  if (pendingFeed) return pendingFeed;
  pendingFeed = buildLotteryFeed().then((feed) => {
    memoryCache = { feed, expiresAt: Date.now() + feed.refreshSeconds * 1000 };
    return feed;
  }).finally(() => {
    pendingFeed = undefined;
  });
  return pendingFeed;
}
