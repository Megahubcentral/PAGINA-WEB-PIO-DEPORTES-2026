"use client";

import { useMemo, useState } from "react";
import { lotteryBrand, lotteryMonogram } from "../../lib/lottery-brand";
import type { LotteryFeed, LotteryResult } from "../../lib/lottery-provider";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-DO", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "America/Santo_Domingo",
  }).format(new Date(`${date}T12:00:00-04:00`));
}

function ResultCard({ result }: { result: LotteryResult }) {
  const brand = lotteryBrand(result.operator);
  return (
    <article className={`lottery-result-card lottery-brand--${brand}`}>
      <div className="lottery-result-top">
        <div className="lottery-result-brand">
          <span className="lottery-brand-mark" aria-hidden="true">{lotteryMonogram(result.operator)}</span>
          <div>
            <span className="lottery-operator">{result.operator}</span>
            <h3>{result.game}</h3>
          </div>
        </div>
        <span className={`lottery-source-badge is-${result.sourceType}`}>
          {result.sourceType === "official" ? "Fuente oficial" : "Fuente informativa"}
        </span>
      </div>
      <div className="lottery-result-meta">
        <time dateTime={result.date}>{formatDate(result.date)}</time>
        <span>{result.drawTime}</span>
        {result.drawNumber ? <span>Sorteo {result.drawNumber}</span> : null}
      </div>
      <div className="lottery-balls" aria-label={`Números ganadores: ${result.numbers.join(", ")}`}>
        {result.numbers.map((number, index) => <strong key={`${number}-${index}`}>{number}</strong>)}
      </div>
      {result.bonus?.length ? (
        <div className="lottery-bonus">
          {result.bonus.map((bonus) => <span key={bonus.label}><small>{bonus.label}</small><b>{bonus.number}</b></span>)}
        </div>
      ) : null}
      <a className="lottery-source-link" href={result.sourceUrl} target="_blank" rel="noreferrer">
        Consultar publicación de origen <span>↗</span>
      </a>
    </article>
  );
}

export function LotteryHub({ feed }: { feed: LotteryFeed }) {
  const operators = useMemo(() => [...new Set(feed.results.map((result) => result.operator))], [feed.results]);
  const [operator, setOperator] = useState("Todas");
  const [date, setDate] = useState("");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(18);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("es");
    return feed.results.filter((result) => {
      if (operator !== "Todas" && result.operator !== operator) return false;
      if (date && result.date !== date) return false;
      return !needle || `${result.operator} ${result.game} ${result.numbers.join(" ")}`.toLocaleLowerCase("es").includes(needle);
    });
  }, [date, feed.results, operator, query]);

  function resetVisible() {
    setVisible(18);
  }

  return (
    <>
      <section className="lottery-explorer" aria-labelledby="lottery-results-title">
        <div className="lottery-explorer-head">
          <div>
            <span className="eyebrow">Resultados e historial reciente</span>
            <h2 id="lottery-results-title">Consulta tu sorteo</h2>
          </div>
          <div className="lottery-updated">
            <i /> Datos actualizados
            <time dateTime={feed.updatedAt}>{new Intl.DateTimeFormat("es-DO", { hour: "numeric", minute: "2-digit", timeZone: "America/Santo_Domingo" }).format(new Date(feed.updatedAt))}</time>
          </div>
        </div>

        <div className="lottery-filters">
          <label>
            <span>Buscar juego o número</span>
            <input value={query} onChange={(event) => { setQuery(event.target.value); resetVisible(); }} type="search" placeholder="Ej.: Quiniela, Loto Real, 24…" />
          </label>
          <label>
            <span>Fecha del sorteo</span>
            <input value={date} onChange={(event) => { setDate(event.target.value); resetVisible(); }} type="date" />
          </label>
          <button type="button" onClick={() => { setQuery(""); setDate(""); setOperator("Todas"); resetVisible(); }}>Limpiar filtros</button>
        </div>

        <div className="lottery-operator-tabs" role="group" aria-label="Filtrar por lotería">
          {["Todas", ...operators].map((name) => (
            <button
              className={`lottery-brand--${name === "Todas" ? "general" : lotteryBrand(name)}${operator === name ? " is-active" : ""}`}
              key={name}
              type="button"
              onClick={() => { setOperator(name); resetVisible(); }}
            ><i className="lottery-tab-dot" aria-hidden="true" />{name}</button>
          ))}
        </div>

        {filtered.length ? (
          <div className="lottery-results-grid">
            {filtered.slice(0, visible).map((result) => <ResultCard key={result.id} result={result} />)}
          </div>
        ) : (
          <div className="lottery-empty">
            <strong>No encontramos resultados con esos criterios.</strong>
            <p>Prueba otra fecha o consulta la publicación oficial de cada lotería.</p>
          </div>
        )}

        {visible < filtered.length ? (
          <button className="lottery-load-more" type="button" onClick={() => setVisible((current) => current + 18)}>
            Mostrar más resultados
          </button>
        ) : null}
      </section>

      <section className="lottery-schedule-section" aria-labelledby="lottery-schedule-title">
        <div className="lottery-schedule-heading">
          <div><span className="eyebrow light">Calendario de actualización</span><h2 id="lottery-schedule-title">Próximos sorteos</h2></div>
          <p>El sistema consulta las fuentes cerca de cada horario de publicación y reduce las llamadas fuera de esas ventanas.</p>
        </div>
        <div className="lottery-schedule-grid">
          {feed.schedules.map((schedule) => (
            <article className={`lottery-brand--${lotteryBrand(schedule.operator)}`} key={`${schedule.operator}-${schedule.game}-${schedule.days}`}>
              <span>{schedule.operator}</span>
              <h3>{schedule.game}</h3>
              <div><b>{schedule.time}</b><small>{schedule.days}</small></div>
            </article>
          ))}
        </div>
      </section>

      <section className="lottery-sources" aria-labelledby="lottery-sources-title">
        <div>
          <span className="eyebrow">Transparencia de datos</span>
          <h2 id="lottery-sources-title">Fuentes consultadas</h2>
        </div>
        <div className="lottery-source-list">
          {feed.sources.map((source) => (
            <a key={source.name} href={source.url} target="_blank" rel="noreferrer">
              <span className={source.available ? "is-online" : ""} />
              <div><strong>{source.name}</strong><small>{source.type === "official" ? "Canal oficial" : "Respaldo informativo"}</small></div>
              <b>↗</b>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
