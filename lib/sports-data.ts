export type Sport = "MLB" | "NBA" | "LIDOM" | "Fútbol" | "Voleibol" | "Tenis";

export type GameState = "live" | "finished" | "upcoming";

export type Game = {
  id: string;
  sport: Sport;
  away: string;
  awayFull: string;
  home: string;
  homeFull: string;
  score: string;
  status: string;
  detail: string;
  venue: string;
  state: GameState;
};

export type ScheduleDay = "Hoy" | "Mañana" | "Fin de semana";

export type ScheduleEvent = {
  id: string;
  sport: Sport;
  day: ScheduleDay;
  date: string;
  time: string;
  away: string;
  home: string;
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
  { id: "nyy-bos", sport: "MLB", away: "NYY", awayFull: "New York Yankees", home: "BOS", homeFull: "Boston Red Sox", score: "4 — 2", status: "7ma entrada", detail: "2 outs · Corredor en 2B", venue: "Fenway Park", state: "live" },
  { id: "lal-mia", sport: "NBA", away: "LAL", awayFull: "Los Angeles Lakers", home: "MIA", homeFull: "Miami Heat", score: "102 — 98", status: "Final", detail: "Partido finalizado", venue: "Kaseya Center", state: "finished" },
  { id: "lic-agui", sport: "LIDOM", away: "Licey", awayFull: "Tigres del Licey", home: "Águilas", homeFull: "Águilas Cibaeñas", score: "7:30 PM", status: "Próximo", detail: "Temporada regular", venue: "Estadio Quisqueya", state: "upcoming" },
  { id: "rma-bar", sport: "Fútbol", away: "R. Madrid", awayFull: "Real Madrid", home: "Barcelona", homeFull: "FC Barcelona", score: "3:00 PM", status: "Hoy", detail: "Jornada internacional", venue: "Santiago Bernabéu", state: "upcoming" },
  { id: "sd-lad", sport: "MLB", away: "SD", awayFull: "San Diego Padres", home: "LAD", homeFull: "Los Angeles Dodgers", score: "1 — 1", status: "5ta entrada", detail: "1 out · Bases limpias", venue: "Dodger Stadium", state: "live" },
  { id: "bos-nyk", sport: "NBA", away: "BOS", awayFull: "Boston Celtics", home: "NYK", homeFull: "New York Knicks", score: "8:30 PM", status: "Hoy", detail: "Pretemporada", venue: "Madison Square Garden", state: "upcoming" },
];

export const fallbackSchedule: ScheduleEvent[] = [
  { id: "tor-nyy", sport: "MLB", day: "Hoy", date: "13 AGO", time: "7:05 PM", away: "Blue Jays", home: "Yankees", competition: "MLB · Temporada regular", venue: "Yankee Stadium", channel: "MLB.TV" },
  { id: "sea-bos", sport: "MLB", day: "Hoy", date: "13 AGO", time: "8:10 PM", away: "Mariners", home: "Red Sox", competition: "MLB · Temporada regular", venue: "Fenway Park", channel: "ESPN" },
  { id: "lal-mia-next", sport: "NBA", day: "Hoy", date: "13 AGO", time: "9:30 PM", away: "Lakers", home: "Heat", competition: "NBA · Pretemporada", venue: "Kaseya Center", channel: "League Pass" },
  { id: "lic-agui-next", sport: "LIDOM", day: "Hoy", date: "13 AGO", time: "7:30 PM", away: "Licey", home: "Águilas", competition: "LIDOM · Temporada regular", venue: "Estadio Quisqueya", channel: "Pío TV" },
  { id: "rma-bar-next", sport: "Fútbol", day: "Hoy", date: "13 AGO", time: "3:00 PM", away: "Real Madrid", home: "Barcelona", competition: "Fútbol · Copa internacional", venue: "Santiago Bernabéu", channel: "ESPN Deportes" },
  { id: "reinas-pur", sport: "Voleibol", day: "Hoy", date: "13 AGO", time: "8:00 PM", away: "R. Dominicana", home: "Puerto Rico", competition: "Voleibol · Copa Panamericana", venue: "Palacio del Voleibol", channel: "Pío TV" },
  { id: "toronto-semi", sport: "Tenis", day: "Hoy", date: "13 AGO", time: "6:00 PM", away: "Rybakina", home: "Gauff", competition: "WTA · Semifinal", venue: "Centre Court", channel: "Tennis Channel" },
  { id: "chc-cin", sport: "MLB", day: "Mañana", date: "14 AGO", time: "7:10 PM", away: "Cubs", home: "Reds", competition: "MLB · Temporada regular", venue: "Great American Ball Park", channel: "MLB.TV" },
  { id: "gsw-phx", sport: "NBA", day: "Mañana", date: "14 AGO", time: "10:00 PM", away: "Warriors", home: "Suns", competition: "NBA · Pretemporada", venue: "Footprint Center", channel: "League Pass" },
  { id: "esc-estre", sport: "LIDOM", day: "Mañana", date: "14 AGO", time: "7:30 PM", away: "Escogido", home: "Estrellas", competition: "LIDOM · Temporada regular", venue: "Estadio Tetelo Vargas", channel: "Pío Radio" },
  { id: "ars-liv", sport: "Fútbol", day: "Mañana", date: "14 AGO", time: "2:45 PM", away: "Arsenal", home: "Liverpool", competition: "Premier League", venue: "Emirates Stadium", channel: "Sky Sports" },
  { id: "bra-jpn", sport: "Voleibol", day: "Mañana", date: "14 AGO", time: "5:30 PM", away: "Brasil", home: "Japón", competition: "VNL · Fase final", venue: "Ariake Arena", channel: "VBTV" },
  { id: "final-masters", sport: "Tenis", day: "Mañana", date: "14 AGO", time: "4:00 PM", away: "Semifinalista 1", home: "Semifinalista 2", competition: "ATP Masters · Final", venue: "Pista central", channel: "ESPN" },
  { id: "nym-lad", sport: "MLB", day: "Fin de semana", date: "15 AGO", time: "8:15 PM", away: "Mets", home: "Dodgers", competition: "MLB · Juego de la semana", venue: "Dodger Stadium", channel: "FOX" },
  { id: "mil-bos", sport: "NBA", day: "Fin de semana", date: "16 AGO", time: "7:30 PM", away: "Bucks", home: "Celtics", competition: "NBA · Pretemporada", venue: "TD Garden", channel: "League Pass" },
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

export function orderGamesByState(games: Game[]) {
  return [...games].sort((a, b) => statePriority[a.state] - statePriority[b.state]);
}
