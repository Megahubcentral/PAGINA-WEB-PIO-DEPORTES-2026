import {
  orderGamesByState,
  type Game,
  type GameIncident,
  type GameState,
  type ScheduleDay,
  type ScheduleEvent,
  type Sport,
  type SportsFeed,
} from "./sports-data";

type JsonRecord = Record<string, unknown>;

type ProviderEvent = {
  game: Game;
  schedule: ScheduleEvent | null;
  startsAt: number;
};

const DOMINICAN_TIME_ZONE = "America/Santo_Domingo";
const BALLDONTLIE_BASE_URL = "https://api.balldontlie.io";
const THESPORTSDB_BASE_URL = "https://www.thesportsdb.com/api/v1/json";
const MLB_STATS_BASE_URL = "https://statsapi.mlb.com/api";
const NHL_BASE_URL = "https://api-web.nhle.com/v1";
const FINAL_STATUSES = new Set(["FT", "AET", "PEN", "AOT", "AP", "AWD"]);
const UPCOMING_STATUSES = new Set(["NS", "TBD"]);
const CANCELLED_STATUSES = new Set(["CANC", "PST", "POST", "ABD", "WO"]);
const FOOTBALL_LEAGUES = [
  { id: "4328", name: "Premier League" },
  { id: "4335", name: "LaLiga" },
  { id: "4480", name: "UEFA Champions League" },
] as const;
const SPORT_PRIORITY: Record<Sport, number> = {
  MLB: 0,
  LIDOM: 1,
  NBA: 2,
  "Baloncesto RD": 3,
  NFL: 4,
  Fútbol: 5,
  Hockey: 6,
  Voleibol: 7,
  Tenis: 8,
};

let cachedFeed: { expiresAt: number; value: SportsFeed | null } | null = null;
let pendingFeed: Promise<SportsFeed | null> | null = null;

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" ? value as JsonRecord : {};
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asId(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return asString(value);
}

function asNumber(value: unknown, fallback = 0) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function defaultText(value: unknown) {
  return asString(asRecord(value).default) || asString(value);
}

function dateKey(offset = 0) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: DOMINICAN_TIME_ZONE,
  }).formatToParts(new Date());
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);
  return new Date(Date.UTC(year, month - 1, day + offset, 12)).toISOString().slice(0, 10);
}

function dateRange() {
  const dates = new Set([dateKey(-1), dateKey(0), dateKey(1)]);
  for (let offset = 2; offset <= 8; offset += 1) {
    const value = dateKey(offset);
    const weekday = new Date(`${value}T12:00:00Z`).getUTCDay();
    if (weekday === 0 || weekday === 6) dates.add(value);
  }
  return [...dates];
}

function startTimestamp(value: string) {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function eventDay(value: string): ScheduleDay | null {
  const parsed = new Date(value.includes("T") ? value : `${value}T12:00:00Z`);
  const parts = Number.isNaN(parsed.getTime()) ? [] : new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: DOMINICAN_TIME_ZONE,
  }).formatToParts(parsed);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  const ymd = year && month && day ? `${year}-${month}-${day}` : value.slice(0, 10);
  if (ymd === dateKey(0)) return "Hoy";
  if (ymd === dateKey(1)) return "Mañana";
  const weekday = Number.isNaN(parsed.getTime()) ? "" : new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: DOMINICAN_TIME_ZONE,
  }).format(parsed);
  return weekday === "Sat" || weekday === "Sun" ? "Fin de semana" : null;
}

function displayDate(value: string) {
  const parsed = new Date(value.includes("T") ? value : `${value}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return "POR DEFINIR";
  return new Intl.DateTimeFormat("es-DO", {
    day: "2-digit",
    month: "short",
    timeZone: DOMINICAN_TIME_ZONE,
  }).format(parsed).replace(/[.-]/g, " ").replace(/\s+/g, " ").toUpperCase();
}

function displayTime(value: string, fallback = "Por definir") {
  if (!value.includes("T")) return fallback;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return fallback;
  return new Intl.DateTimeFormat("es-DO", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: DOMINICAN_TIME_ZONE,
  }).format(parsed).replace("a. m.", "AM").replace("p. m.", "PM");
}

function shortTeamName(value: string) {
  const words = value.replace(/[^\p{L}\p{N} ]/gu, " ").split(/\s+/).filter(Boolean);
  if (!words.length) return "TBD";
  if (words.length === 1) return words[0].slice(0, 4).toUpperCase();
  return words.map((word) => word[0]).join("").slice(0, 4).toUpperCase();
}

function teamInfo(value: unknown, explicitName = "") {
  const team = asRecord(value);
  const fullName = asString(team.full_name) || asString(team.display_name) ||
    [asString(team.city), asString(team.name)].filter(Boolean).join(" ") ||
    asString(team.name) || explicitName || "Por definir";
  return {
    id: asId(team.id),
    fullName,
    shortName: asString(team.abbreviation) || shortTeamName(fullName),
    logo: asString(team.logo) || asString(team.image_url),
  };
}

function ballDontLieTeamLogo(sport: "NBA" | "NFL", team: ReturnType<typeof teamInfo>) {
  if (team.logo) return team.logo;
  const abbreviation = team.shortName.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!abbreviation) return "";
  return `https://a.espncdn.com/i/teamlogos/${sport.toLowerCase()}/500/${abbreviation}.png`;
}

function classifyStatus(status: string, startsAt: number, period = 0): GameState {
  const normalized = status.toLowerCase();
  if (/final|completed|closed|finished/.test(normalized)) return "finished";
  if (/scheduled|not started|pre-game|pregame|tbd/.test(normalized)) return "upcoming";
  if (period > 0 || /live|progress|quarter|halftime|inning|period/.test(normalized)) return "live";
  return startsAt > Date.now() ? "upcoming" : "finished";
}

function scheduleFor(event: {
  id: string;
  sport: Sport;
  startsAt: string;
  away: string;
  awayLogo?: string;
  home: string;
  homeLogo?: string;
  competition: string;
  venue: string;
  channel?: string;
}) {
  const day = eventDay(event.startsAt);
  if (!day) return null;
  return {
    id: event.id,
    sport: event.sport,
    day,
    date: displayDate(event.startsAt),
    time: displayTime(event.startsAt),
    away: event.away,
    awayLogo: event.awayLogo,
    home: event.home,
    homeLogo: event.homeLogo,
    competition: event.competition,
    venue: event.venue,
    channel: event.channel || "Transmisión por confirmar",
  } satisfies ScheduleEvent;
}

async function fetchJson(url: string, headers: Record<string, string>, revalidate: number) {
  try {
    const response = await fetch(url, {
      headers,
      next: { revalidate },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return null;
    return await response.json() as unknown;
  } catch {
    return null;
  }
}

function ballDontLieStage(raw: JsonRecord, sport: "NBA" | "NFL") {
  const seasonType = asString(raw.season_type) || (raw.postseason ? "Postemporada" : "Temporada regular");
  if (sport === "NFL") {
    const week = asNumber(raw.week);
    return week ? `${seasonType} · Semana ${week}` : seasonType;
  }
  const istStage = asString(raw.ist_stage);
  return istStage ? `${seasonType} · ${istStage}` : seasonType;
}

function normalizeBallDontLieGame(rawValue: unknown, sport: "NBA" | "NFL"): ProviderEvent | null {
  const raw = asRecord(rawValue);
  const id = asId(raw.id);
  if (!id) return null;

  const away = teamInfo(raw.away_team || raw.visitor_team);
  const home = teamInfo(raw.home_team);
  const awayLogo = ballDontLieTeamLogo(sport, away);
  const homeLogo = ballDontLieTeamLogo(sport, home);
  const startsAt = asString(raw.datetime) || asString(raw.date);
  if (!startsAt || away.fullName === "Por definir" || home.fullName === "Por definir") return null;

  const statusValue = asString(raw.status, "Programado");
  if (raw.postponed || /cancel|postpon/.test(statusValue.toLowerCase())) return null;
  const period = asNumber(raw.period);
  const state = classifyStatus(statusValue, startTimestamp(startsAt), period);
  const awayScore = asNumber(raw.away_team_score ?? raw.visitor_team_score);
  const homeScore = asNumber(raw.home_team_score);
  const score = state === "upcoming" ? displayTime(startsAt, statusValue) : `${awayScore} — ${homeScore}`;
  const competition = sport;
  const stage = ballDontLieStage(raw, sport);
  const season = asId(raw.season);
  const venue = asString(raw.venue, "Sede por confirmar");

  let liveStatus = statusValue;
  let detail = asString(raw.summary) || stage;
  if (sport === "NBA" && state === "live") {
    liveStatus = asString(raw.period_detail) || (period ? `${period}º cuarto` : statusValue);
    detail = asString(raw.time) || liveStatus;
  }
  if (sport === "NFL" && state === "live") {
    liveStatus = period ? `${period}º cuarto` : statusValue;
    detail = asString(raw.time) || asString(raw.display_clock) || liveStatus;
  }
  if (state === "finished") {
    liveStatus = "Final";
    detail = "Partido finalizado";
  }
  if (state === "upcoming") liveStatus = eventDay(startsAt) === "Hoy" ? "Hoy" : "Próximo";

  const normalizedId = `bdl-${sport.toLowerCase()}-${id}`;
  return {
    game: {
      id: normalizedId,
      sport,
      away: away.shortName,
      awayFull: away.fullName,
      awayLogo,
      home: home.shortName,
      homeFull: home.fullName,
      homeLogo,
      score,
      status: liveStatus,
      detail,
      venue,
      state,
      competition,
      stage,
      season,
      incidentNote: "El plan gratuito ofrece marcador y periodo; no incluye jugada por jugada.",
    },
    schedule: state === "upcoming" ? scheduleFor({
      id: normalizedId,
      sport,
      startsAt,
      away: away.fullName,
      awayLogo,
      home: home.fullName,
      homeLogo,
      competition: `${competition} · ${stage}`,
      venue,
    }) : null,
    startsAt: startTimestamp(startsAt),
  };
}

async function ballDontLieEvents() {
  const apiKey = process.env.BALLDONTLIE_API_KEY;
  if (!apiKey) return [];
  const dates = dateRange();
  const endpoints = [
    { sport: "NBA" as const, path: "/nba/v1/games" },
    { sport: "NFL" as const, path: "/nfl/v1/games" },
  ];

  const responses = await Promise.all(endpoints.map(async ({ sport, path }) => {
    const params = new URLSearchParams({ per_page: "100" });
    dates.forEach((date) => params.append("dates[]", date));
    const payload = asRecord(await fetchJson(
      `${BALLDONTLIE_BASE_URL}${path}?${params}`,
      { Authorization: apiKey },
      60,
    ));
    const data = Array.isArray(payload.data) ? payload.data : [];
    return data.map((game) => normalizeBallDontLieGame(game, sport)).filter(Boolean) as ProviderEvent[];
  }));
  return responses.flat();
}

function mlbGameType(value: string) {
  const types: Record<string, string> = {
    S: "Entrenamientos de primavera",
    R: "Temporada regular",
    F: "Serie de comodines",
    D: "Serie divisional",
    L: "Serie de campeonato",
    W: "Serie Mundial",
    A: "Juego de Estrellas",
    E: "Exhibición",
  };
  return types[value] || "Calendario oficial";
}

function mlbStage(value: string) {
  const stages: Record<string, string> = {
    "regular season": "Temporada regular",
    "spring training": "Entrenamientos de primavera",
    "wild card": "Serie de comodines",
    "division series": "Serie divisional",
    "league championship series": "Serie de campeonato",
    "world series": "Serie Mundial",
    "all-star game": "Juego de Estrellas",
  };
  return stages[value.toLowerCase()] || value;
}

function mlbHalfInning(value: string) {
  const normalized = value.toLowerCase();
  if (normalized === "top") return "Alta";
  if (normalized === "bottom") return "Baja";
  if (normalized === "middle") return "Mitad";
  if (normalized === "end") return "Fin";
  return value;
}

function normalizeMlbGame(rawValue: unknown, sport: "MLB" | "LIDOM", incidents: GameIncident[] = []): ProviderEvent | null {
  const raw = asRecord(rawValue);
  const gamePk = asId(raw.gamePk);
  const startsAt = asString(raw.gameDate);
  if (!gamePk || !startsAt) return null;

  const teams = asRecord(raw.teams);
  const awayData = asRecord(teams.away);
  const homeData = asRecord(teams.home);
  const awayTeam = asRecord(awayData.team);
  const homeTeam = asRecord(homeData.team);
  const awayFull = asString(awayTeam.name, "Visitante por definir");
  const homeFull = asString(homeTeam.name, "Local por definir");
  const awayTeamId = asId(awayTeam.id);
  const homeTeamId = asId(homeTeam.id);
  const awayLogo = awayTeamId ? `https://www.mlbstatic.com/team-logos/${awayTeamId}.svg` : "";
  const homeLogo = homeTeamId ? `https://www.mlbstatic.com/team-logos/${homeTeamId}.svg` : "";
  const status = asRecord(raw.status);
  const abstractState = asString(status.abstractGameState);
  const detailedState = asString(status.detailedState);
  if (/cancel|postpon|suspend/.test(detailedState.toLowerCase())) return null;
  const state: GameState = abstractState === "Live" ? "live" : abstractState === "Final" ? "finished" : "upcoming";
  const lineScore = asRecord(raw.linescore);
  const awayScore = asNumber(awayData.score ?? asRecord(asRecord(lineScore.teams).away).runs);
  const homeScore = asNumber(homeData.score ?? asRecord(asRecord(lineScore.teams).home).runs);
  const score = state === "upcoming" ? displayTime(startsAt) : `${awayScore} — ${homeScore}`;
  const seriesStatus = asRecord(raw.seriesStatus);
  const stage = mlbStage(asString(seriesStatus.description) || asString(raw.seriesDescription) || mlbGameType(asString(raw.gameType)));
  const competition = sport;
  const season = asId(raw.season);
  const venue = asString(asRecord(raw.venue).name, "Sede por confirmar");
  const inning = asNumber(lineScore.currentInning);
  const inningState = mlbHalfInning(asString(lineScore.inningState));
  const outs = asNumber(lineScore.outs);
  const balls = asNumber(lineScore.balls);
  const strikes = asNumber(lineScore.strikes);
  let cardStatus = state === "finished" ? "Final" : state === "upcoming" ? "Próximo" : detailedState;
  let detail = state === "finished" ? "Partido finalizado" : stage;
  if (state === "live") {
    cardStatus = inning ? `${inningState} de la ${inning}ª` : detailedState;
    detail = `${outs} ${outs === 1 ? "out" : "outs"} · Cuenta ${balls}-${strikes}`;
  }
  if (state === "finished") {
    const decisions = asRecord(raw.decisions);
    const winner = asString(asRecord(decisions.winner).fullName);
    const save = asString(asRecord(decisions.save).fullName);
    detail = [winner ? `Ganador: ${winner}` : "", save ? `Salvamento: ${save}` : ""].filter(Boolean).join(" · ") || "Partido finalizado";
  }

  const normalizedId = `${sport.toLowerCase()}-${gamePk}`;
  return {
    game: {
      id: normalizedId,
      sport,
      away: asString(awayTeam.abbreviation) || shortTeamName(awayFull),
      awayFull,
      awayLogo,
      home: asString(homeTeam.abbreviation) || shortTeamName(homeFull),
      homeFull,
      homeLogo,
      score,
      status: cardStatus,
      detail,
      venue,
      state,
      competition,
      stage,
      season,
      incidents,
      incidentNote: incidents.length ? "Jugadas anotadoras de la señal oficial." : undefined,
    },
    schedule: state === "upcoming" ? scheduleFor({
      id: normalizedId,
      sport,
      startsAt,
      away: awayFull,
      awayLogo,
      home: homeFull,
      homeLogo,
      competition: `${competition} · ${stage}`,
      venue,
      channel: sport === "MLB" ? "MLB.TV" : "Transmisión por confirmar",
    }) : null,
    startsAt: startTimestamp(startsAt),
  };
}

function mlbScoringIncidents(payloadValue: unknown) {
  const payload = asRecord(payloadValue);
  const allPlays = asRecord(asRecord(asRecord(payload.liveData).plays)).allPlays;
  if (!Array.isArray(allPlays)) return [];
  return allPlays.filter((playValue) => asRecord(asRecord(playValue).about).isScoringPlay).slice(-6).map((playValue, index) => {
    const play = asRecord(playValue);
    const about = asRecord(play.about);
    const result = asRecord(play.result);
    const matchup = asRecord(play.matchup);
    const batter = asString(asRecord(matchup.batter).fullName, "Jugador por confirmar");
    const eventType = asString(result.eventType).toLowerCase();
    const playNames: Record<string, string> = {
      home_run: "Jonrón",
      single: "Sencillo",
      double: "Doble",
      triple: "Triple",
      walk: "Base por bolas",
      sacrifice_fly: "Elevado de sacrificio",
      sac_fly: "Elevado de sacrificio",
      force_out: "Jugada de selección",
      field_out: "Out productor",
      field_error: "Error defensivo",
      hit_by_pitch: "Golpeado por lanzamiento",
      stolen_base: "Base robada",
    };
    const playName = playNames[eventType] || asString(result.event, "Jugada anotadora");
    const runs = asNumber(result.rbi);
    const inning = asNumber(about.inning);
    const half = mlbHalfInning(asString(about.halfInning));
    return {
      id: `mlb-play-${asId(about.atBatIndex) || index}`,
      time: inning ? `${half} ${inning}ª` : "Anotación",
      kind: "score" as const,
      label: `${playName} de ${batter}${runs ? ` · ${runs} ${runs === 1 ? "carrera" : "carreras"}` : ""}`,
      score: `${asNumber(result.awayScore)}–${asNumber(result.homeScore)}`,
    } satisfies GameIncident;
  });
}

async function mlbEvents() {
  const dates = dateRange().sort();
  const startDate = dates[0];
  const endDate = dates[dates.length - 1];
  const hydrate = "team,linescore,seriesStatus,decisions";
  const sources = [
    { sport: "MLB" as const, params: `sportId=1&startDate=${startDate}&endDate=${endDate}` },
    { sport: "LIDOM" as const, params: `sportId=17&leagueId=131&startDate=${startDate}&endDate=${endDate}` },
  ];
  const rawBySport = await Promise.all(sources.map(async ({ sport, params }) => {
    const payload = asRecord(await fetchJson(`${MLB_STATS_BASE_URL}/v1/schedule?${params}&hydrate=${hydrate}`, {}, 60));
    const datesPayload = Array.isArray(payload.dates) ? payload.dates : [];
    const games = datesPayload.flatMap((dateValue) => {
      const gamesValue = asRecord(dateValue).games;
      return Array.isArray(gamesValue) ? gamesValue : [];
    });
    return { sport, games };
  }));

  const normalized = rawBySport.flatMap(({ sport, games }) => games.map((game) => normalizeMlbGame(game, sport)).filter(Boolean) as ProviderEvent[]);
  const detailTargets = [
    ...normalized.filter((event) => event.game.state === "live"),
    ...normalized.filter((event) => event.game.state === "finished").sort((a, b) => b.startsAt - a.startsAt),
  ].slice(0, 6);
  const incidentPairs = await Promise.all(detailTargets.map(async (event) => {
    const gamePk = event.game.id.split("-").at(-1) || "";
    const payload = await fetchJson(`${MLB_STATS_BASE_URL}/v1.1/game/${gamePk}/feed/live`, {}, 30);
    return [event.game.id, mlbScoringIncidents(payload)] as const;
  }));
  const incidentMap = new Map(incidentPairs);
  return normalized.map((event) => {
    const incidents = incidentMap.get(event.game.id);
    if (!incidents) return event;
    return {
      ...event,
      game: {
        ...event.game,
        incidents,
        incidentNote: incidents.length
          ? "Jugadas anotadoras de la señal oficial."
          : "Aún no se han registrado jugadas anotadoras.",
      },
    };
  });
}

function nhlStage(gameType: number) {
  if (gameType === 1) return "Pretemporada";
  if (gameType === 2) return "Temporada regular";
  if (gameType === 3) return "Playoffs";
  return "Calendario oficial";
}

function nhlSeason(value: unknown) {
  const season = asId(value);
  return season.length === 8 ? `${season.slice(0, 4)}–${season.slice(4)}` : season;
}

function nhlTeamName(value: unknown) {
  const team = asRecord(value);
  return defaultText(team.name) || defaultText(team.commonName) || defaultText(team.placeName) || asString(team.abbrev, "Por definir");
}

function nhlGoalIncidents(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.slice(-6).map((goalValue, index) => {
    const goal = asRecord(goalValue);
    const firstName = defaultText(goal.firstName);
    const lastName = defaultText(goal.lastName);
    const player = [firstName, lastName].filter(Boolean).join(" ") || asString(goal.name, "Anotación");
    const period = asNumber(goal.period) || asNumber(asRecord(goal.periodDescriptor).number);
    const team = asString(goal.teamAbbrev);
    const assists = Array.isArray(goal.assists)
      ? goal.assists.map((assist) => {
          const record = asRecord(assist);
          return [defaultText(record.firstName), defaultText(record.lastName)].filter(Boolean).join(" ");
        }).filter(Boolean)
      : [];
    return {
      id: `nhl-goal-${asId(goal.eventId) || index}`,
      time: `${period ? `${period}P` : "Gol"} · ${asString(goal.timeInPeriod)}`.replace(/ · $/, ""),
      kind: "score" as const,
      label: `${player}${assists.length ? ` · Asistencias: ${assists.join(", ")}` : ""}`,
      team,
      score: `${asNumber(goal.awayScore)}–${asNumber(goal.homeScore)}`,
    } satisfies GameIncident;
  });
}

function normalizeNhlGame(rawValue: unknown): ProviderEvent | null {
  const raw = asRecord(rawValue);
  const id = asId(raw.id);
  const startsAt = asString(raw.startTimeUTC);
  if (!id || !startsAt) return null;
  const rawState = asString(raw.gameState).toUpperCase();
  const state: GameState = ["LIVE", "CRIT"].includes(rawState) ? "live" : ["OFF", "FINAL"].includes(rawState) ? "finished" : "upcoming";
  const away = asRecord(raw.awayTeam);
  const home = asRecord(raw.homeTeam);
  const awayFull = nhlTeamName(away);
  const homeFull = nhlTeamName(home);
  const awayAbbreviation = asString(away.abbrev) || shortTeamName(awayFull);
  const homeAbbreviation = asString(home.abbrev) || shortTeamName(homeFull);
  const awayLogo = asString(away.logo) || `https://assets.nhle.com/logos/nhl/svg/${awayAbbreviation}_light.svg`;
  const homeLogo = asString(home.logo) || `https://assets.nhle.com/logos/nhl/svg/${homeAbbreviation}_light.svg`;
  const awayScore = asNumber(away.score);
  const homeScore = asNumber(home.score);
  const score = state === "upcoming" ? displayTime(startsAt) : `${awayScore} — ${homeScore}`;
  const periodDescriptor = asRecord(raw.periodDescriptor);
  const period = asNumber(periodDescriptor.number);
  const clock = asRecord(raw.clock);
  const stage = nhlStage(asNumber(raw.gameType));
  const season = nhlSeason(raw.season);
  const venue = defaultText(raw.venue) || "Sede por confirmar";
  const status = state === "finished" ? "Final" : state === "upcoming" ? "Próximo" : `${period}º periodo`;
  const detail = state === "live" ? asString(clock.timeRemaining, "En juego") : state === "finished" ? "Partido finalizado" : stage;
  const incidents = nhlGoalIncidents(raw.goals);
  const normalizedId = `nhl-${id}`;
  return {
    game: {
      id: normalizedId,
      sport: "Hockey",
      away: awayAbbreviation,
      awayFull,
      awayLogo,
      home: homeAbbreviation,
      homeFull,
      homeLogo,
      score,
      status,
      detail,
      venue,
      state,
      competition: "NHL",
      stage,
      season,
      incidents,
      incidentNote: incidents.length ? "Goles y asistencias de la señal oficial." : undefined,
    },
    schedule: state === "upcoming" ? scheduleFor({
      id: normalizedId,
      sport: "Hockey",
      startsAt,
      away: awayFull,
      awayLogo,
      home: homeFull,
      homeLogo,
      competition: `NHL · ${stage}`,
      venue,
      channel: "NHL.TV / por confirmar",
    }) : null,
    startsAt: startTimestamp(startsAt),
  };
}

async function nhlEvents() {
  const responses = await Promise.all(dateRange().map(async (date) => {
    const payload = asRecord(await fetchJson(`${NHL_BASE_URL}/score/${date}`, {}, 60));
    const games = Array.isArray(payload.games) ? payload.games : [];
    return games.map(normalizeNhlGame).filter(Boolean) as ProviderEvent[];
  }));
  return responses.flat();
}

function footballRound(value: unknown, league: string) {
  const round = asNumber(value);
  const stages: Record<number, string> = {
    125: "Cuartos de final",
    150: "Semifinal",
    160: "Playoff",
    170: "Semifinal de playoff",
    180: "Final de playoff",
    200: "Final",
  };
  if (stages[round]) return stages[round];
  if (!round) return "Fase por confirmar";
  if (round <= 100 && /league|la\s*liga/i.test(league)) return `Jornada ${round}`;
  if (round > 200) return "Fase no especificada por la fuente";
  return `Ronda ${round}`;
}

function sportsDbTimeline(value: unknown) {
  const payload = asRecord(value);
  const timeline = Array.isArray(payload.timeline) ? payload.timeline : [];
  return timeline.flatMap((entryValue, index) => {
    const entry = asRecord(entryValue);
    const event = asString(entry.strTimeline) || asString(entry.strEvent) || asString(entry.strType);
    const normalized = event.toLowerCase();
    const isGoal = normalized.includes("goal");
    const isCard = normalized.includes("card");
    if (!isGoal && !isCard) return [];
    const card = normalized.includes("red") ? "Tarjeta roja" : normalized.includes("yellow") ? "Tarjeta amarilla" : "Tarjeta";
    return [{
      id: `tsdb-event-${asId(entry.idTimeline) || index}`,
      time: `${asNumber(entry.intTime)}′`,
      kind: isGoal ? "score" as const : "card" as const,
      label: isGoal ? `Gol · ${asString(entry.strPlayer, "Jugador por confirmar")}` : `${card} · ${asString(entry.strPlayer, "Jugador por confirmar")}`,
      team: asString(entry.strTeam),
    } satisfies GameIncident];
  });
}

function normalizeSportsDbEvent(rawValue: unknown, leagueName: string, incidents: GameIncident[] = []): ProviderEvent | null {
  const raw = asRecord(rawValue);
  const id = asId(raw.idEvent);
  const awayFull = asString(raw.strAwayTeam);
  const homeFull = asString(raw.strHomeTeam);
  if (!id || !awayFull || !homeFull) return null;

  const rawStatus = asString(raw.strStatus, "NS").toUpperCase();
  if (CANCELLED_STATUSES.has(rawStatus)) return null;
  const startsAt = asString(raw.strTimestamp) || [asString(raw.dateEvent), asString(raw.strTime)].filter(Boolean).join("T");
  if (!startsAt) return null;
  const state: GameState = FINAL_STATUSES.has(rawStatus) ? "finished" : UPCOMING_STATUSES.has(rawStatus) ? "upcoming" : "live";
  const awayScore = asNumber(raw.intAwayScore);
  const homeScore = asNumber(raw.intHomeScore);
  const score = state === "upcoming" ? displayTime(startsAt) : `${awayScore} — ${homeScore}`;
  const venue = asString(raw.strVenue, "Sede por confirmar");
  const progress = asString(raw.strProgress) || rawStatus;
  const normalizedId = `tsdb-football-${id}`;
  const competition = asString(raw.strLeague, leagueName);
  const stage = footballRound(raw.intRound, competition);
  const season = asString(raw.strSeason);
  const awayLogo = asString(raw.strAwayTeamBadge) || asString(raw.strAwayTeamLogo);
  const homeLogo = asString(raw.strHomeTeamBadge) || asString(raw.strHomeTeamLogo);

  return {
    game: {
      id: normalizedId,
      sport: "Fútbol",
      away: shortTeamName(awayFull),
      awayFull,
      awayLogo,
      home: shortTeamName(homeFull),
      homeFull,
      homeLogo,
      score,
      status: state === "finished" ? "Final" : state === "upcoming" ? "Próximo" : progress,
      detail: state === "finished" ? "Partido finalizado" : state === "upcoming" ? `${competition} · ${stage}` : progress,
      venue,
      state,
      competition,
      stage,
      season,
      incidents,
      incidentNote: incidents.length ? "Cronología parcial del nivel gratuito: puede omitir anotaciones." : undefined,
    },
    schedule: state === "upcoming" ? scheduleFor({
      id: normalizedId,
      sport: "Fútbol",
      startsAt,
      away: awayFull,
      awayLogo,
      home: homeFull,
      homeLogo,
      competition: `${competition} · ${stage}`,
      venue,
      channel: asString(raw.strTVStation),
    }) : null,
    startsAt: startTimestamp(startsAt),
  };
}

async function sportsDbEvents() {
  const apiKey = process.env.THESPORTSDB_API_KEY || "123";
  const requests = FOOTBALL_LEAGUES.flatMap((league) => [
    { league, endpoint: "eventspastleague.php" },
    { league, endpoint: "eventsnextleague.php" },
  ]);
  const responses = await Promise.all(requests.map(async ({ league, endpoint }) => {
    const payload = asRecord(await fetchJson(`${THESPORTSDB_BASE_URL}/${encodeURIComponent(apiKey)}/${endpoint}?id=${league.id}`, {}, 600));
    const events = Array.isArray(payload.events) ? payload.events : [];
    return events.map((event) => normalizeSportsDbEvent(event, league.name)).filter(Boolean) as ProviderEvent[];
  }));
  const normalized = responses.flat();
  const timelineTargets = normalized.filter((event) => event.game.state !== "upcoming").slice(0, 8);
  const timelines = await Promise.all(timelineTargets.map(async (event) => {
    const id = event.game.id.replace("tsdb-football-", "");
    const payload = await fetchJson(`${THESPORTSDB_BASE_URL}/${encodeURIComponent(apiKey)}/lookuptimeline.php?id=${id}`, {}, 600);
    return [event.game.id, sportsDbTimeline(payload)] as const;
  }));
  const timelineMap = new Map(timelines);
  return normalized.map((event) => {
    const incidents = timelineMap.get(event.game.id);
    return incidents?.length
      ? { ...event, game: { ...event.game, incidents, incidentNote: "Cronología parcial del nivel gratuito: puede omitir anotaciones." } }
      : event;
  });
}

function deduplicateEvents(events: ProviderEvent[]) {
  const seen = new Set<string>();
  return events.filter(({ game }) => {
    const key = `${game.sport}|${game.awayFull}|${game.homeFull}|${game.score}|${game.state}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function trimEvents(events: ProviderEvent[]) {
  const sorted = [...events].sort((a, b) => {
    if (a.game.state === "finished" && b.game.state === "finished") return b.startsAt - a.startsAt;
    return a.startsAt - b.startsAt;
  });
  const perSportLimits: Record<GameState, number> = { live: 8, finished: 10, upcoming: 12 };
  const counts = new Map<string, number>();
  return sorted.filter((event) => {
    const key = `${event.game.state}|${event.game.sport}`;
    const current = counts.get(key) || 0;
    if (current >= perSportLimits[event.game.state]) return false;
    counts.set(key, current + 1);
    return true;
  });
}

async function loadFreeSportsFeed(): Promise<SportsFeed | null> {
  const [mlb, ballDontLie, nhl, sportsDb] = await Promise.all([
    mlbEvents(),
    ballDontLieEvents(),
    nhlEvents(),
    sportsDbEvents(),
  ]);
  const events = trimEvents(deduplicateEvents([...mlb, ...ballDontLie, ...nhl, ...sportsDb]));
  if (!events.length) return null;
  const providers = [
    mlb.length ? "MLB Stats API" : "",
    ballDontLie.length ? "BALLDONTLIE" : "",
    nhl.length ? "NHL" : "",
    sportsDb.length ? "TheSportsDB" : "",
  ].filter(Boolean);
  const schedule = events
    .filter((event) => event.schedule)
    .sort((a, b) => SPORT_PRIORITY[a.game.sport] - SPORT_PRIORITY[b.game.sport] || a.startsAt - b.startsAt)
    .map((event) => event.schedule as ScheduleEvent);
  return {
    games: orderGamesByState(events.map((event) => event.game)),
    schedule,
    source: "provider",
    sourceName: providers.join(" + "),
    updatedAt: new Date().toISOString(),
    refreshSeconds: 60,
  };
}

export async function freeSportsFeed() {
  if (cachedFeed && cachedFeed.expiresAt > Date.now()) return cachedFeed.value;
  if (pendingFeed) return pendingFeed;
  pendingFeed = loadFreeSportsFeed()
    .then((value) => {
      cachedFeed = { expiresAt: Date.now() + 55_000, value };
      return value;
    })
    .finally(() => {
      pendingFeed = null;
    });
  return pendingFeed;
}
