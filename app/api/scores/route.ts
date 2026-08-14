import { NextResponse } from "next/server";
import {
  fallbackGames,
  fallbackSchedule,
  type Game,
  type ScheduleEvent,
  type SportsFeed,
} from "../../../lib/sports-data";

export const dynamic = "force-dynamic";

const allowedSports = new Set(["MLB", "NBA", "LIDOM", "Fútbol", "Voleibol", "Tenis"]);
const allowedStates = new Set(["live", "finished", "upcoming"]);
const allowedDays = new Set(["Hoy", "Mañana", "Fin de semana"]);

function validGame(value: unknown): value is Game {
  if (!value || typeof value !== "object") return false;
  const game = value as Partial<Game>;
  return Boolean(
    game.id && game.away && game.home && game.score && game.status && game.detail && game.venue &&
    game.awayFull && game.homeFull && game.sport && allowedSports.has(game.sport) &&
    game.state && allowedStates.has(game.state),
  );
}

function validScheduleEvent(value: unknown): value is ScheduleEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as Partial<ScheduleEvent>;
  return Boolean(
    event.id && event.date && event.time && event.away && event.home && event.competition &&
    event.venue && event.channel && event.sport && allowedSports.has(event.sport) &&
    event.day && allowedDays.has(event.day),
  );
}

function fallbackFeed(): SportsFeed {
  return {
    games: fallbackGames,
    schedule: fallbackSchedule,
    source: "editorial",
    sourceName: "Redacción Pío Deportes",
    updatedAt: null,
    refreshSeconds: 30,
  };
}

async function providerFeed(): Promise<SportsFeed | null> {
  const endpoint = process.env.SPORTS_DATA_API_URL;
  if (!endpoint) return null;

  const headers: Record<string, string> = {};
  const apiKey = process.env.SPORTS_DATA_API_KEY;
  if (apiKey) headers[process.env.SPORTS_DATA_API_HEADER || "x-apisports-key"] = apiKey;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers,
      next: { revalidate: 20 },
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) return null;

    const payload = await response.json() as Partial<SportsFeed>;
    if (!Array.isArray(payload.games) || !Array.isArray(payload.schedule)) return null;

    const games = payload.games.filter(validGame);
    const schedule = payload.schedule.filter(validScheduleEvent);
    if (!games.length && !schedule.length) return null;

    return {
      games,
      schedule,
      source: "provider",
      sourceName: process.env.SPORTS_DATA_PROVIDER_NAME || payload.sourceName || "Proveedor deportivo",
      updatedAt: payload.updatedAt || new Date().toISOString(),
      refreshSeconds: Math.max(20, Number(payload.refreshSeconds) || 30),
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const feed = await providerFeed() || fallbackFeed();
  return NextResponse.json(feed, {
    headers: {
      "Cache-Control": "public, s-maxage=20, stale-while-revalidate=40",
      "X-Pio-Scores-Source": feed.source,
    },
  });
}
