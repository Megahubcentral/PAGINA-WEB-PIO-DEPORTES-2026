export type HorseRacingSource = {
  name: string;
  url: string;
  available: boolean;
};

export type HorseRaceOutcome = {
  raceNumber: number;
  winnerNumber?: string;
  winnerName?: string;
  winPayout?: string;
};

export type HorseRacingMeeting = {
  id: string;
  track: "Hipódromo V Centenario" | "Hipódromo Camarero";
  country: "República Dominicana" | "Puerto Rico";
  date: string;
  label: string;
  races: HorseRaceOutcome[];
  sourceUrl: string;
};

export type HorseRacingFeed = {
  meetings: HorseRacingMeeting[];
  sources: HorseRacingSource[];
  updatedAt: string;
  nextRefreshAt: string;
  refreshSeconds: number;
};

const HVC_RESULTS_URL = "https://hvc.com.do/resultados-2/";
const HVC_POSTS_API = "https://hvc.com.do/wp-json/wp/v2/posts?search=Resultados&per_page=12&_fields=id,date,link,title,excerpt";
const CAMARERO_RESULTS_URL = "https://www.hipodromo-camarero.com/resultados/locales";
const CAMARERO_API = "https://www.hipodromo-camarero.com/api/races";

type CacheEntry = { feed: HorseRacingFeed; expiresAt: number };
type UnknownRecord = Record<string, unknown>;
type HvcPost = {
  id?: number;
  date?: string;
  link?: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
};

let memoryCache: CacheEntry | undefined;
let pendingFeed: Promise<HorseRacingFeed> | undefined;

function astParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Santo_Domingo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return {
    weekday: value("weekday"),
    minutes: Number(value("hour")) * 60 + Number(value("minute")),
  };
}

function refreshPlan(now = new Date()) {
  const clock = astParts(now);
  const possibleRaceDay = ["Sun", "Tue", "Thu", "Fri", "Sat"].includes(clock.weekday);
  const activeWindow = possibleRaceDay && clock.minutes >= 12 * 60 + 30 && clock.minutes <= 22 * 60 + 15;
  const refreshSeconds = activeWindow ? 15 * 60 : 6 * 60 * 60;
  return {
    refreshSeconds,
    nextRefreshAt: new Date(now.getTime() + refreshSeconds * 1000).toISOString(),
  };
}

function dateKey(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return typeof value === "string" ? value.slice(0, 10) : "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santo_Domingo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function recentDateKeys(days = 7, now = new Date()) {
  return Array.from({ length: days }, (_, index) => dateKey(new Date(now.getTime() - index * 86_400_000)));
}

function decodeHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function asRecord(value: unknown): UnknownRecord | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value as UnknownRecord : undefined;
}

function firstText(record: UnknownRecord | undefined, keys: string[]) {
  if (!record) return undefined;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return undefined;
}

function allRecords(value: unknown, depth = 0): UnknownRecord[] {
  if (depth > 5 || value === null || value === undefined) return [];
  if (Array.isArray(value)) return value.flatMap((item) => allRecords(item, depth + 1));
  const record = asRecord(value);
  if (!record) return [];
  return [record, ...Object.values(record).flatMap((item) => allRecords(item, depth + 1))];
}

function extractHvcWinners(value: string) {
  const text = decodeHtml(value)
    .replace(/^.*?Ganadores\s*\(/i, "")
    .replace(/\)\s*$/g, "");
  return Array.from(text.matchAll(/#\s*(\d+)\s+(.+?)(?=\s*,\s*#|$)/g)).map((match, index) => ({
    raceNumber: index + 1,
    winnerNumber: match[1],
    winnerName: match[2].trim(),
  } satisfies HorseRaceOutcome));
}

async function fetchHvcMeetings(revalidate: number) {
  const response = await fetch(HVC_POSTS_API, {
    headers: { Accept: "application/json", "User-Agent": "PioDeportes/1.0 (+https://www.piodeportes.com)" },
    signal: AbortSignal.timeout(9000),
    next: { revalidate },
  });
  if (!response.ok) throw new Error(`HVC ${response.status}`);
  const posts = await response.json() as HvcPost[];

  return posts.flatMap((post): HorseRacingMeeting[] => {
    const title = decodeHtml(post.title?.rendered ?? "");
    if (!/^Resultados\b/i.test(title)) return [];
    const races = extractHvcWinners(post.excerpt?.rendered ?? "");
    if (!races.length || !post.date) return [];
    return [{
      id: `hvc-${post.id ?? dateKey(post.date)}`,
      track: "Hipódromo V Centenario",
      country: "República Dominicana",
      date: dateKey(post.date),
      label: title,
      races,
      sourceUrl: post.link ?? HVC_RESULTS_URL,
    }];
  }).slice(0, 4);
}

function extractArray(value: unknown, keys: string[]): unknown[] {
  const record = asRecord(value);
  if (!record) return Array.isArray(value) ? value : [];
  for (const key of keys) {
    if (Array.isArray(record[key])) return record[key] as unknown[];
    const nested = asRecord(record[key]);
    if (nested) {
      const found: unknown[] = extractArray(nested, keys);
      if (found.length) return found;
    }
  }
  return [];
}

function camareroOutcome(race: unknown, detail: unknown, index: number): HorseRaceOutcome {
  const raceRecord = asRecord(race);
  const records = allRecords(detail);
  const raceNumber = Number(firstText(raceRecord, ["race_number", "raceNumber", "numero_carrera", "number"])) || index + 1;
  const positionKeys = ["finish_position", "finishPosition", "position", "posicion", "place", "rank"];
  const horseKeys = ["horse_name", "horseName", "nombre_ejemplar", "exemplar_name", "runner_name", "runnerName"];
  const numberKeys = ["program_number", "programNumber", "horse_number", "horseNumber", "numero", "number"];
  const winner = records.find((record) => Number(firstText(record, positionKeys)) === 1 && firstText(record, horseKeys));
  const namedWinner = records.find((record) => firstText(record, ["winner_name", "winning_horse_name", "ganador", "winner"]));
  const winnerName = firstText(winner, horseKeys)
    ?? firstText(namedWinner, ["winner_name", "winning_horse_name", "ganador", "winner"]);
  const winnerNumber = firstText(winner, numberKeys)
    ?? firstText(namedWinner, ["winner_number", "winning_number", "numero_ganador"]);
  const payoutRecord = records.find((record) => firstText(record, ["win_payout", "winPayout", "pago_ganador", "payout_win"]));
  const winPayout = firstText(payoutRecord, ["win_payout", "winPayout", "pago_ganador", "payout_win"]);
  return { raceNumber, winnerName, winnerNumber, winPayout };
}

async function fetchCamareroDetails(race: unknown, index: number, revalidate: number) {
  const raceRecord = asRecord(race);
  const raceId = firstText(raceRecord, ["id", "race_id", "raceId"]);
  if (!raceId) return camareroOutcome(race, race, index);
  try {
    const response = await fetch(`${CAMARERO_API}/details?raceId=${encodeURIComponent(raceId)}`, {
      headers: { Accept: "application/json", "User-Agent": "PioDeportes/1.0 (+https://www.piodeportes.com)" },
      signal: AbortSignal.timeout(9000),
      next: { revalidate },
    });
    if (!response.ok) return camareroOutcome(race, race, index);
    return camareroOutcome(race, await response.json(), index);
  } catch {
    return camareroOutcome(race, race, index);
  }
}

async function fetchCamareroMeeting(revalidate: number) {
  for (const date of recentDateKeys()) {
    try {
      const response = await fetch(`${CAMARERO_API}/by-date?d=${date}&category=local`, {
        headers: { Accept: "application/json", "User-Agent": "PioDeportes/1.0 (+https://www.piodeportes.com)" },
        signal: AbortSignal.timeout(9000),
        next: { revalidate },
      });
      if (!response.ok) continue;
      const body = await response.json() as unknown;
      const races = extractArray(body, ["races", "data", "results"]);
      if (!races.length) continue;
      const outcomes = await Promise.all(races.slice(0, 12).map((race, index) => fetchCamareroDetails(race, index, revalidate)));
      return {
        id: `camarero-${date}`,
        track: "Hipódromo Camarero",
        country: "Puerto Rico",
        date,
        label: `Resultados locales · ${date.split("-").reverse().join("/")}`,
        races: outcomes,
        sourceUrl: CAMARERO_RESULTS_URL,
      } satisfies HorseRacingMeeting;
    } catch {
      // Try the previous date. The official endpoint returns an empty list on non-racing days.
    }
  }
  return undefined;
}

async function buildHorseRacingFeed() {
  const plan = refreshPlan();
  const [hvc, camarero] = await Promise.allSettled([
    fetchHvcMeetings(plan.refreshSeconds),
    fetchCamareroMeeting(plan.refreshSeconds),
  ]);
  const hvcMeetings = hvc.status === "fulfilled" ? hvc.value : [];
  const camareroMeeting = camarero.status === "fulfilled" ? camarero.value : undefined;
  const meetings = [...hvcMeetings, ...(camareroMeeting ? [camareroMeeting] : [])]
    .sort((a, b) => b.date.localeCompare(a.date));

  return {
    meetings,
    sources: [
      { name: "Hipódromo V Centenario", url: HVC_RESULTS_URL, available: hvcMeetings.length > 0 },
      { name: "Hipódromo Camarero", url: CAMARERO_RESULTS_URL, available: Boolean(camareroMeeting) },
    ],
    updatedAt: new Date().toISOString(),
    nextRefreshAt: plan.nextRefreshAt,
    refreshSeconds: plan.refreshSeconds,
  } satisfies HorseRacingFeed;
}

export async function getHorseRacingFeed(): Promise<HorseRacingFeed> {
  const now = Date.now();
  if (memoryCache && memoryCache.expiresAt > now) return memoryCache.feed;
  if (pendingFeed) return pendingFeed;
  pendingFeed = buildHorseRacingFeed().then((feed) => {
    memoryCache = { feed, expiresAt: Date.now() + feed.refreshSeconds * 1000 };
    return feed;
  }).finally(() => {
    pendingFeed = undefined;
  });
  return pendingFeed;
}
