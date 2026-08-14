"use client";

/* eslint-disable @next/next/no-img-element -- Los escudos llegan dinámicamente de cada proveedor deportivo. */

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  fallbackSportsFeed,
  orderGamesByState,
  type Game,
  type ScheduleDay,
  type SportsFeed,
} from "../../lib/sports-data";

function useSportsFeed() {
  const [feed, setFeed] = useState<SportsFeed>(fallbackSportsFeed);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function refresh() {
      try {
        const response = await fetch("/api/scores", { cache: "no-store" });
        if (response.ok) {
          const nextFeed = await response.json() as SportsFeed;
          if (active) setFeed(nextFeed);
        }
      } catch {
        // The editorial fallback remains visible if the provider is unavailable.
      } finally {
        if (active) timer = setTimeout(refresh, Math.max(20, feed.refreshSeconds) * 1000);
      }
    }

    void refresh();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [feed.refreshSeconds]);

  return feed;
}

function stateLabel(game: Game) {
  if (game.state === "live") return `En vivo · ${game.status}`;
  if (game.state === "finished") return game.status || "Final";
  return game.status || "Próximo";
}

function formatUpdatedAt(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("es-DO", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Santo_Domingo",
  }).format(new Date(value));
}

function TeamMark({ logo, name, abbreviation, compact = false }: {
  logo?: string;
  name: string;
  abbreviation: string;
  compact?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const fallback = abbreviation.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 3).toUpperCase() || "PD";

  return (
    <span className={`team-mark${compact ? " is-compact" : ""}`} aria-hidden="true" title={name}>
      {logo && !failed
        ? <img src={logo} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} />
        : <span>{fallback}</span>}
    </span>
  );
}

export function ScoreStrip() {
  const feed = useSportsFeed();
  const featuredGames = orderGamesByState(feed.games).slice(0, 4);

  return (
    <section className="scoreboard" aria-label="Resultados y próximos partidos">
      <div className="shell score-grid">
        <Link className="score-intro" href="/marcadores">
          <span>Marcadores</span>
          <strong>Resultados</strong>
          <small>Ver todos →</small>
        </Link>
        {featuredGames.map((game) => (
          <Link
            className={`score-item is-${game.state}`}
            href={`/marcadores?deporte=${encodeURIComponent(game.sport.toLowerCase())}#${game.id}`}
            key={game.id}
          >
            <div className="score-top">
              <span>{game.sport}</span>
              <small className={game.state === "live" ? "score-live" : ""}>
                {game.state === "live" ? <i /> : null}{stateLabel(game)}
              </small>
            </div>
            <div className="teams">
              <span className="score-team">
                <TeamMark logo={game.awayLogo} name={game.awayFull} abbreviation={game.away} compact />
                <strong>{game.away}</strong>
              </span>
              <b>{game.score}</b>
              <span className="score-team is-home">
                <TeamMark logo={game.homeLogo} name={game.homeFull} abbreviation={game.home} compact />
                <strong>{game.home}</strong>
              </span>
            </div>
            <div className="score-hover-detail">{game.detail}<span>→</span></div>
          </Link>
        ))}
      </div>
    </section>
  );
}

const filters = ["Todos", "MLB", "LIDOM", "NBA", "Baloncesto RD", "NFL", "Fútbol", "Hockey", "Voleibol", "Tenis"] as const;
const days: ScheduleDay[] = ["Hoy", "Mañana", "Fin de semana"];

function agendaDateLabels() {
  const base = new Date();
  const dateAt = (offset: number) => new Date(base.getTime() + offset * 86_400_000);
  const shortDate = (date: Date) => new Intl.DateTimeFormat("es-DO", {
    day: "2-digit",
    month: "short",
    timeZone: "America/Santo_Domingo",
  }).format(date).replace(/[.-]/g, " ").replace(/\s+/g, " ").toUpperCase();
  const weekend = Array.from({ length: 8 }, (_, index) => dateAt(index + 1)).filter((date) => {
    const weekday = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      timeZone: "America/Santo_Domingo",
    }).format(date);
    return weekday === "Sat" || weekday === "Sun";
  }).slice(0, 2);
  const weekendLabel = weekend.length === 2
    ? `${shortDate(weekend[0]).split(" ")[0]}–${shortDate(weekend[1])}`
    : "PRÓXIMOS";
  return [shortDate(dateAt(0)), shortDate(dateAt(1)), weekendLabel];
}

function ResultCards({ games }: { games: Game[] }) {
  return (
    <div className="results-grid" aria-live="polite">
      {games.map((game) => (
        <article className={`result-card is-${game.state}`} id={game.id} key={game.id}>
          <div className="result-card-head">
            <span>{game.sport}</span>
            <strong>{game.state === "live" ? <i /> : null}{stateLabel(game)}</strong>
          </div>
          <div className="result-competition">
            <strong>{game.competition || game.sport}</strong>
            <span>{[
              game.stage,
              game.season ? `Temporada ${game.season}` : "",
            ].filter(Boolean).join(" · ")}</span>
          </div>
          <div className="result-teams">
            <div className="result-team">
              <div className="result-team-name">
                <TeamMark logo={game.awayLogo} name={game.awayFull} abbreviation={game.away} />
                <b>{game.away}</b>
              </div>
              <span>{game.awayFull}</span>
            </div>
            <em>{game.score}</em>
            <div className="result-team is-home">
              <div className="result-team-name">
                <TeamMark logo={game.homeLogo} name={game.homeFull} abbreviation={game.home} />
                <b>{game.home}</b>
              </div>
              <span>{game.homeFull}</span>
            </div>
          </div>
          {game.incidents?.length ? (
            <div className="result-events">
              <div className="result-events-head"><strong>Eventos destacados</strong><small>{game.incidentNote}</small></div>
              <ol>
                {game.incidents.map((incident) => (
                  <li className={`is-${incident.kind}`} key={incident.id}>
                    <time>{incident.time}</time>
                    <span>{incident.label}{incident.team ? <small>{incident.team}</small> : null}</span>
                    {incident.score ? <b>{incident.score}</b> : null}
                  </li>
                ))}
              </ol>
            </div>
          ) : game.incidentNote ? <p className="result-incident-note">{game.incidentNote}</p> : null}
          <div className="result-foot"><span>{game.detail}</span><span>{game.venue}</span></div>
        </article>
      ))}
    </div>
  );
}

export function ScoresHub() {
  const feed = useSportsFeed();
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todos");
  const [day, setDay] = useState<ScheduleDay>("Hoy");
  const filteredGames = filter === "Todos" ? feed.games : feed.games.filter((game) => game.sport === filter);
  const liveGames = filteredGames.filter((game) => game.state === "live");
  const finishedGames = filteredGames.filter((game) => game.state === "finished");
  const visibleSchedule = feed.schedule.filter((event) => event.day === day && (filter === "Todos" || event.sport === filter));
  const visibleSports = filters.slice(1).filter((sport) => visibleSchedule.some((event) => event.sport === sport));
  const updateTime = formatUpdatedAt(feed.updatedAt);
  const dateLabels = agendaDateLabels();

  return (
    <div className="scores-hub">
      <div className="scores-control-panel">
        <div className="score-date-switcher" role="group" aria-label="Seleccionar fecha de la agenda">
          {days.map((item, index) => (
            <button key={item} type="button" className={day === item ? "active" : ""} onClick={() => setDay(item)}>
              <small>{dateLabels[index]}</small>
              <strong>{item}</strong>
            </button>
          ))}
        </div>
        <div className="score-filters" role="group" aria-label="Filtrar marcadores por deporte">
          {filters.map((item) => (
            <button key={item} type="button" className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>
          ))}
        </div>
        <div className={`scores-data-status is-${feed.source}`}>
          <i />
          <strong>{feed.source === "provider" ? "Señal de resultados conectada" : "Actualización editorial"}</strong>
          <span>{feed.source === "provider" ? `${feed.sourceName}${updateTime ? ` · ${updateTime}` : ""}` : feed.sourceName}</span>
        </div>
      </div>

      {liveGames.length ? (
        <section className="score-results-section live-results-section">
          <div className="scores-section-heading">
            <div><span>Actualización en curso</span><h2>Partidos en vivo</h2></div>
            <small>{liveGames.length} {liveGames.length === 1 ? "encuentro" : "encuentros"} activos</small>
          </div>
          <ResultCards games={liveGames} />
        </section>
      ) : null}

      {finishedGames.length ? (
        <section className="score-results-section finished-results-section">
          <div className="scores-section-heading">
            <div><span>Resultados oficiales</span><h2>Partidos terminados</h2></div>
            <small>Jornada reciente</small>
          </div>
          <ResultCards games={finishedGames} />
        </section>
      ) : null}

      <section className="upcoming-schedule" aria-live="polite">
        <div className="scores-section-heading"><div><span>Calendario por disciplina</span><h2>Próximos partidos</h2></div><small>{day} · Hora de Santo Domingo</small></div>
        {visibleSports.length ? (
          <div className="discipline-schedule-grid">
            {visibleSports.map((sport) => (
              <section className="discipline-schedule" key={sport}>
                <header><span>{sport}</span><small>{visibleSchedule.filter((event) => event.sport === sport).length} eventos</small></header>
                {visibleSchedule.filter((event) => event.sport === sport).map((event) => (
                  <article id={event.id} key={event.id}>
                    <div className="schedule-date"><strong>{event.time}</strong><small>{event.date}</small></div>
                    <div className="schedule-match">
                      <strong className="schedule-teams">
                        <span><TeamMark logo={event.awayLogo} name={event.away} abbreviation={event.away} compact />{event.away}</span>
                        <i>vs.</i>
                        <span><TeamMark logo={event.homeLogo} name={event.home} abbreviation={event.home} compact />{event.home}</span>
                      </strong>
                      <span>{event.competition}</span>
                    </div>
                    <div className="schedule-broadcast"><strong>{event.channel}</strong><small>{event.venue}</small></div>
                  </article>
                ))}
              </section>
            ))}
          </div>
        ) : (
          <div className="schedule-empty">No hay encuentros anunciados para este filtro. Prueba otra fecha o disciplina.</div>
        )}
      </section>

      <p className="scores-disclaimer">
        {feed.source === "provider"
          ? `Resultados suministrados por ${feed.sourceName}. La conexión se procesa de forma segura desde el servidor de Pio Deportes.`
          : "Marcadores preparados por la redacción de Pío Deportes mientras se restablece la conexión con el proveedor oficial."}
      </p>
    </div>
  );
}
