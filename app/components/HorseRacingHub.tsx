"use client";

import { useEffect, useState } from "react";
import type { HorseRacingFeed, HorseRacingMeeting } from "../../lib/horse-racing-provider";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-DO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Santo_Domingo",
  }).format(new Date(`${date}T12:00:00-04:00`));
}

function meetingBrand(meeting: HorseRacingMeeting) {
  return meeting.track.includes("Camarero") ? "camarero" : "hvc";
}

function MeetingCard({ meeting }: { meeting: HorseRacingMeeting }) {
  const brand = meetingBrand(meeting);
  return (
    <article className={`horse-meeting-card horse-brand--${brand}`}>
      <div className="horse-meeting-top">
        <span className="horse-track-mark" aria-hidden="true">{brand === "hvc" ? "HVC" : "CAM"}</span>
        <div>
          <span>{meeting.country}</span>
          <h3>{meeting.track}</h3>
          <time dateTime={meeting.date}>{formatDate(meeting.date)}</time>
        </div>
        <b>Fuente oficial</b>
      </div>
      <p className="horse-meeting-label">{meeting.label}</p>
      <div className="horse-race-list">
        {meeting.races.map((race) => (
          <div className="horse-race-row" key={`${meeting.id}-${race.raceNumber}`}>
            <span>{race.raceNumber}ª</span>
            <div>
              <strong>{race.winnerName ?? "Resultado oficial disponible"}</strong>
              <small>{race.winnerNumber ? `Ejemplar #${race.winnerNumber}` : "Consulta el detalle en la fuente"}</small>
            </div>
            {race.winPayout ? <b>{race.winPayout}</b> : null}
          </div>
        ))}
      </div>
      <a className="horse-source-link" href={meeting.sourceUrl} target="_blank" rel="noreferrer">
        Comprobar jornada oficial <span>↗</span>
      </a>
    </article>
  );
}

export function HorseRacingHub({ feed }: { feed: HorseRacingFeed }) {
  const [currentFeed, setCurrentFeed] = useState(feed);

  useEffect(() => {
    const refresh = () => {
      fetch("/api/horse-racing")
        .then((response) => response.ok ? response.json() as Promise<HorseRacingFeed> : undefined)
        .then((latest) => { if (latest) setCurrentFeed(latest); })
        .catch(() => undefined);
    };
    const interval = window.setInterval(refresh, Math.max(currentFeed.refreshSeconds, 300) * 1000);
    return () => window.clearInterval(interval);
  }, [currentFeed.refreshSeconds]);

  return (
    <section className="horse-results-section" aria-labelledby="horse-results-title">
      <div className="horse-results-head">
        <div>
          <span className="eyebrow">Hípica dominicana y Puerto Rico</span>
          <h2 id="horse-results-title">Resultados de carreras</h2>
        </div>
        <div className="horse-results-status">
          <i /> Consulta programada
          <time dateTime={currentFeed.updatedAt}>
            {new Intl.DateTimeFormat("es-DO", { hour: "numeric", minute: "2-digit", timeZone: "America/Santo_Domingo" }).format(new Date(currentFeed.updatedAt))}
          </time>
        </div>
      </div>
      <p className="horse-results-intro">
        Ganadores publicados por el Hipódromo V Centenario y el Hipódromo Camarero. La información se actualiza con menor frecuencia fuera de las jornadas de carrera.
      </p>

      {currentFeed.meetings.length ? (
        <div className="horse-meetings-grid">
          {currentFeed.meetings.map((meeting) => <MeetingCard meeting={meeting} key={meeting.id} />)}
        </div>
      ) : (
        <div className="horse-results-empty">
          <strong>No hay una jornada reciente disponible.</strong>
          <p>Los canales oficiales siguen accesibles para comprobar resultados y próximas carreras.</p>
        </div>
      )}

      <div className="horse-source-strip">
        {currentFeed.sources.map((source) => (
          <a href={source.url} target="_blank" rel="noreferrer" key={source.name}>
            <i className={source.available ? "is-online" : ""} />
            <span><strong>{source.name}</strong><small>Canal oficial</small></span>
            <b>↗</b>
          </a>
        ))}
      </div>
    </section>
  );
}
