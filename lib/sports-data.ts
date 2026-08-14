export type Sport = "MLB" | "LIDOM" | "NBA" | "Baloncesto RD" | "NFL" | "Fútbol" | "Hockey" | "Voleibol" | "Tenis";

export type GameState = "live" | "finished" | "upcoming";

export type GameIncident = {
  id: string;
  time: string;
  kind: "score" | "card" | "play" | "period";
  label: string;
  team?: string;
  score?: string;
};

export type Game = {
  id: string;
  sport: Sport;
  away: string;
  awayFull: string;
  awayLogo?: string;
  home: string;
  homeFull: string;
  homeLogo?: string;
  score: string;
  status: string;
  detail: string;
  venue: string;
  state: GameState;
  competition?: string;
  stage?: string;
  season?: string;
  incidents?: GameIncident[];
  incidentNote?: string;
};

export type ScheduleDay = "Hoy" | "Mañana" | "Fin de semana";

export type ScheduleEvent = {
  id: string;
  sport: Sport;
  day: ScheduleDay;
  date: string;
  time: string;
  away: string;
  awayLogo?: string;
  home: string;
  homeLogo?: string;
  competition: string;
  venue: string;
  channel: string;
};

export type SportsFeed = {
  games: Game[];
  schedule: ScheduleEvent[];
  source: "editorial" | "provider";
  sourceName: string;
  updatedAt: string | null;
  refreshSeconds: number;
};

export const fallbackGames: Game[] = [
  { id: "nyy-bos", sport: "MLB", away: "NYY", awayFull: "New York Yankees", awayLogo: "https://www.mlbstatic.com/team-logos/147.svg", home: "BOS", homeFull: "Boston Red Sox", homeLogo: "https://www.mlbstatic.com/team-logos/111.svg", score: "4 — 2", status: "7ma entrada", detail: "2 outs · Corredor en 2B", venue: "Fenway Park", state: "live" },
  { id: "lal-mia", sport: "NBA", away: "LAL", awayFull: "Los Angeles Lakers", awayLogo: "https://a.espncdn.com/i/teamlogos/nba/500/lal.png", home: "MIA", homeFull: "Miami Heat", homeLogo: "https://a.espncdn.com/i/teamlogos/nba/500/mia.png", score: "102 — 98", status: "Final", detail: "Partido finalizado", venue: "Kaseya Center", state: "finished" },
  { id: "lic-agui", sport: "LIDOM", away: "Licey", awayFull: "Tigres del Licey", home: "Águilas", homeFull: "Águilas Cibaeñas", score: "7:30 PM", status: "Próximo", detail: "Temporada regular", venue: "Estadio Quisqueya", state: "upcoming" },
  { id: "rma-bar", sport: "Fútbol", away: "R. Madrid", awayFull: "Real Madrid", home: "Barcelona", homeFull: "FC Barcelona", score: "3:00 PM", status: "Hoy", detail: "Jornada internacional", venue: "Santiago Bernabéu", state: "upcoming" },
  { id: "sd-lad", sport: "MLB", away: "SD", awayFull: "San Diego Padres", awayLogo: "https://www.mlbstatic.com/team-logos/135.svg", home: "LAD", homeFull: "Los Angeles Dodgers", homeLogo: "https://www.mlbstatic.com/team-logos/119.svg", score: "1 — 1", status: "5ta entrada", detail: "1 out · Bases limpias", venue: "Dodger Stadium", state: "live" },
  { id: "bos-nyk", sport: "NBA", away: "BOS", awayFull: "Boston Celtics", awayLogo: "https://a.espncdn.com/i/teamlogos/nba/500/bos.png", home: "NYK", homeFull: "New York Knicks", homeLogo: "https://a.espncdn.com/i/teamlogos/nba/500/ny.png", score: "8:30 PM", status: "Hoy", detail: "Pretemporada", venue: "Madison Square Garden", state: "upcoming" },
];

export const fallbackSchedule: ScheduleEvent[] = [
  { id: "tor-nyy", sport: "MLB", day: "Hoy", date: "13 AGO", time: "7:05 PM", away: "Blue Jays", awayLogo: "https://www.mlbstatic.com/team-logos/141.svg", home: "Yankees", homeLogo: "https://www.mlbstatic.com/team-logos/147.svg", competition: "MLB · Temporada regular", venue: "Yankee Stadium", channel: "MLB.TV" },
  { id: "sea-bos", sport: "MLB", day: "Hoy", date: "13 AGO", time: "8:10 PM", away: "Mariners", awayLogo: "https://www.mlbstatic.com/team-logos/136.svg", home: "Red Sox", homeLogo: "https://www.mlbstatic.com/team-logos/111.svg", competition: "MLB · Temporada regular", venue: "Fenway Park", channel: "ESPN" },
  { id: "lal-mia-next", sport: "NBA", day: "Hoy", date: "13 AGO", time: "9:30 PM", away: "Lakers", awayLogo: "https://a.espncdn.com/i/teamlogos/nba/500/lal.png", home: "Heat", homeLogo: "https://a.espncdn.com/i/teamlogos/nba/500/mia.png", competition: "NBA · Pretemporada", venue: "Kaseya Center", channel: "League Pass" },
  { id: "lic-agui-next", sport: "LIDOM", day: "Hoy", date: "13 AGO", time: "7:30 PM", away: "Licey", home: "Águilas", competition: "LIDOM · Temporada regular", venue: "Estadio Quisqueya", channel: "Pío TV" },
  { id: "rma-bar-next", sport: "Fútbol", day: "Hoy", date: "13 AGO", time: "3:00 PM", away: "Real Madrid", home: "Barcelona", competition: "Fútbol · Copa internacional", venue: "Santiago Bernabéu", channel: "ESPN Deportes" },
  { id: "reinas-pur", sport: "Voleibol", day: "Hoy", date: "13 AGO", time: "8:00 PM", away: "R. Dominicana", home: "Puerto Rico", competition: "Voleibol · Copa Panamericana", venue: "Palacio del Voleibol", channel: "Pío TV" },
  { id: "toronto-semi", sport: "Tenis", day: "Hoy", date: "13 AGO", time: "6:00 PM", away: "Rybakina", home: "Gauff", competition: "WTA · Semifinal", venue: "Centre Court", channel: "Tennis Channel" },
  { id: "chc-cin", sport: "MLB", day: "Mañana", date: "14 AGO", time: "7:10 PM", away: "Cubs", awayLogo: "https://www.mlbstatic.com/team-logos/112.svg", home: "Reds", homeLogo: "https://www.mlbstatic.com/team-logos/113.svg", competition: "MLB · Temporada regular", venue: "Great American Ball Park", channel: "MLB.TV" },
  { id: "gsw-phx", sport: "NBA", day: "Mañana", date: "14 AGO", time: "10:00 PM", away: "Warriors", awayLogo: "https://a.espncdn.com/i/teamlogos/nba/500/gs.png", home: "Suns", homeLogo: "https://a.espncdn.com/i/teamlogos/nba/500/phx.png", competition: "NBA · Pretemporada", venue: "Footprint Center", channel: "League Pass" },
  { id: "esc-estre", sport: "LIDOM", day: "Mañana", date: "14 AGO", time: "7:30 PM", away: "Escogido", home: "Estrellas", competition: "LIDOM · Temporada regular", venue: "Estadio Tetelo Vargas", channel: "Pío Radio" },
  { id: "ars-liv", sport: "Fútbol", day: "Mañana", date: "14 AGO", time: "2:45 PM", away: "Arsenal", home: "Liverpool", competition: "Premier League", venue: "Emirates Stadium", channel: "Sky Sports" },
  { id: "bra-jpn", sport: "Voleibol", day: "Mañana", date: "14 AGO", time: "5:30 PM", away: "Brasil", home: "Japón", competition: "VNL · Fase final", venue: "Ariake Arena", channel: "VBTV" },
  { id: "final-masters", sport: "Tenis", day: "Mañana", date: "14 AGO", time: "4:00 PM", away: "Semifinalista 1", home: "Semifinalista 2", competition: "ATP Masters · Final", venue: "Pista central", channel: "ESPN" },
  { id: "nym-lad", sport: "MLB", day: "Fin de semana", date: "15 AGO", time: "8:15 PM", away: "Mets", awayLogo: "https://www.mlbstatic.com/team-logos/121.svg", home: "Dodgers", homeLogo: "https://www.mlbstatic.com/team-logos/119.svg", competition: "MLB · Juego de la semana", venue: "Dodger Stadium", channel: "FOX" },
  { id: "mil-bos", sport: "NBA", day: "Fin de semana", date: "16 AGO", time: "7:30 PM", away: "Bucks", awayLogo: "https://a.espncdn.com/i/teamlogos/nba/500/mil.png", home: "Celtics", homeLogo: "https://a.espncdn.com/i/teamlogos/nba/500/bos.png", competition: "NBA · Pretemporada", venue: "TD Garden", channel: "League Pass" },
  { id: "atm-sev", sport: "Fútbol", day: "Fin de semana", date: "16 AGO", time: "4:00 PM", away: "Atlético", home: "Sevilla", competition: "LaLiga", venue: "Metropolitano", channel: "ESPN Deportes" },
];

export const fallbackSportsFeed: SportsFeed = {
  games: fallbackGames,
  schedule: fallbackSchedule,
  source: "editorial",
  sourceName: "Redacción Pío Deportes",
  updatedAt: null,
  refreshSeconds: 30,
};

const statePriority: Record<GameState, number> = {
  live: 0,
  finished: 1,
  upcoming: 2,
};

const sportPriority: Record<Sport, number> = {
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

export function orderGamesByState(games: Game[]) {
  return [...games].sort((a, b) =>
    statePriority[a.state] - statePriority[b.state] ||
    sportPriority[a.sport] - sportPriority[b.sport],
  );
}
