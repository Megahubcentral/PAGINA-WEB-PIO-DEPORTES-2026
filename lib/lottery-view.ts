import type { LotteryResult } from "./lottery-provider";

export type LotteryKind = "quiniela" | "loto" | "pool" | "mega" | "kino" | "toca" | "other";

export type HomeQuinielaCard = {
  operator: string;
  fallbackTime: string;
  result?: LotteryResult;
  extras: LotteryResult[];
  isToday: boolean;
};

export type LotteryBoardRow = {
  key: string;
  operator: string;
  time: string;
  minutes: number;
  headline?: LotteryResult;
  extras: LotteryResult[];
  pending: boolean;
};

export const HOME_HOUSES = [
  { operator: "Loto Real", fallbackTime: "12:55 p. m." },
  { operator: "Lotería Nacional", fallbackTime: "2:30 p. m." },
  { operator: "Loteka", fallbackTime: "7:55 p. m." },
  { operator: "LEIDSA", fallbackTime: "8:55 p. m." },
] as const;

export const QUINIELA_LABELS = ["1er", "2do", "3er"] as const;

export function todayKeyInAst(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santo_Domingo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function shiftDateKey(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

export function isSundayInAst(date: string) {
  return new Date(`${date}T12:00:00-04:00`).getDay() === 0;
}

export function drawMinutes(time: string) {
  const match = time.replace(/\s+/g, " ").match(/(\d{1,2}):(\d{2})\s*([ap])/i);
  if (!match) return 0;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const afternoon = match[3].toLowerCase() === "p";
  if (hours === 12) hours = afternoon ? 12 : 0;
  else if (afternoon) hours += 12;
  return hours * 60 + minutes;
}

function foldedGame(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
}

export function isNacionalAfternoon(result: LotteryResult) {
  if (result.operator !== "Lotería Nacional") return false;
  const game = foldedGame(result.game);
  return game.includes("gana") || game.includes("juega") || game.includes("pega");
}

export function lotteryKind(result: LotteryResult): LotteryKind {
  const game = foldedGame(result.game);
  if (game.includes("kino")) return "kino";
  if (game.includes("toca")) return "toca";
  if (game.includes("mega")) return "mega";
  if (game.includes("repartidera")) return "other";
  if (game.includes("pool")) return "pool";
  if (game.includes("lotto") || game === "loto real" || game.includes("loto leidsa") || /^loto\b/.test(game)) return "loto";
  if (result.numbers.length === 3) return "quiniela";
  if (result.numbers.length >= 6) return "loto";
  return "other";
}

export function isQuiniela(result: LotteryResult) {
  return lotteryKind(result) === "quiniela";
}

function isHouseQuiniela(result: LotteryResult) {
  if (!isQuiniela(result)) return false;
  const game = result.game.toLocaleLowerCase("es");
  if (result.operator === "Loteka" || result.operator === "LEIDSA") return game.includes("quiniela");
  if (result.operator === "Loto Real") return game.includes("quiniela") || game.includes("lotería real") || game.includes("loteria real");
  return true;
}

function newestFirst(a: LotteryResult, b: LotteryResult) {
  return b.date.localeCompare(a.date) || drawMinutes(b.drawTime) - drawMinutes(a.drawTime);
}

export function selectHomeQuinielas(results: LotteryResult[], now = new Date()): HomeQuinielaCard[] {
  const today = todayKeyInAst(now);
  return HOME_HOUSES.map((house) => {
    const quinielas = results.filter((result) => result.operator === house.operator && isHouseQuiniela(result)).sort(newestFirst);
    const todayResult = quinielas.find((result) => result.date === today);
    const result = todayResult ?? quinielas[0];
    const extras = results.filter((item) => (
      house.operator === "Lotería Nacional"
      && item.operator === house.operator
      && item.date === today
      && item !== result
      && isNacionalAfternoon(item)
    )).sort((a, b) => a.game.localeCompare(b.game, "es"));
    return {
      operator: house.operator,
      fallbackTime: house.fallbackTime,
      result,
      extras,
      isToday: result?.date === today,
    };
  });
}

type SlotTemplate = {
  operator: string;
  time: string;
  match: (result: LotteryResult) => boolean;
};

function daySlots(date: string): SlotTemplate[] {
  const sunday = isSundayInAst(date);
  return [
    { operator: "La Primera", time: "12:00 p. m.", match: (result) => result.operator === "La Primera" },
    { operator: "Loto Real", time: "12:55 p. m.", match: (result) => result.operator === "Loto Real" && !result.game.toLocaleLowerCase("es").includes("noche") },
    { operator: "Lotería Nacional", time: "2:30 p. m.", match: isNacionalAfternoon },
    { operator: "Loteka", time: "7:55 p. m.", match: (result) => result.operator === "Loteka" },
    { operator: "LEIDSA", time: sunday ? "3:55 p. m." : "8:55 p. m.", match: (result) => result.operator === "LEIDSA" },
    { operator: "Loto Real", time: "8:55 p. m.", match: (result) => result.operator === "Loto Real" && result.game.toLocaleLowerCase("es").includes("noche") },
    { operator: "Lotería Nacional", time: sunday ? "6:00 p. m." : "9:00 p. m.", match: (result) => result.operator === "Lotería Nacional" && !isNacionalAfternoon(result) },
  ];
}

export function buildDayBoard(results: LotteryResult[], date: string): LotteryBoardRow[] {
  const ofDay = results.filter((result) => result.date === date);
  return daySlots(date).map((slot) => {
    const matched = ofDay.filter(slot.match).sort((a, b) => {
      const headline = Number(isHouseQuiniela(b)) - Number(isHouseQuiniela(a));
      if (headline) return headline;
      return a.game.localeCompare(b.game, "es");
    });
    const headline = matched.find(isHouseQuiniela) ?? (matched.length === 1 ? matched[0] : undefined);
    const extras = matched.filter((result) => result !== headline);
    return {
      key: `${slot.operator}-${slot.time}`,
      operator: slot.operator,
      time: slot.time,
      minutes: drawMinutes(slot.time),
      headline,
      extras,
      pending: !headline && extras.length === 0,
    };
  }).filter((row) => {
    if (!row.pending) return true;
    if (row.operator === "Loto Real" && row.time === "8:55 p. m.") return false;
    if (row.operator === "La Primera") return results.some((result) => result.operator === "La Primera");
    return ["Loto Real", "Lotería Nacional", "Loteka", "LEIDSA"].includes(row.operator);
  });
}

export function operatorsInFeed(results: LotteryResult[]) {
  const preferred = ["Loto Real", "Lotería Nacional", "Loteka", "LEIDSA", "La Primera"];
  const found = [...new Set(results.map((result) => result.operator))];
  return [
    ...preferred.filter((name) => found.includes(name)),
    ...found.filter((name) => !preferred.includes(name)).sort((a, b) => a.localeCompare(b, "es")),
  ];
}

const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"] as const;
const MONTHS_SHORT = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"] as const;

export function formatLotteryDate(date: string, style: "short" | "long" = "short") {
  const day = new Date(`${date}T12:00:00-04:00`);
  const weekday = WEEKDAYS[day.getUTCDay()];
  const month = MONTHS_SHORT[day.getUTCMonth()];
  const dayNumber = day.getUTCDate();
  const year = day.getUTCFullYear();
  if (style === "long") return `${weekday}, ${dayNumber} de ${month} de ${year}`;
  return `${weekday.slice(0, 3)}, ${dayNumber} ${month}`;
}

export function matchesLotteryQuery(result: LotteryResult, query: string) {
  const needle = query.trim().toLocaleLowerCase("es");
  if (!needle) return true;
  return `${result.operator} ${result.game} ${result.numbers.join(" ")}`.toLocaleLowerCase("es").includes(needle);
}
