"use client";

import { useEffect, useMemo, useState } from "react";
import { lotteryBrand, lotteryMonogram } from "../../lib/lottery-brand";
import type { LotteryFeed, LotteryResult } from "../../lib/lottery-provider";
import {
  buildDayBoard,
  formatLotteryDate,
  lotteryKind,
  matchesLotteryQuery,
  operatorsInFeed,
  shiftDateKey,
} from "../../lib/lottery-view";
import { LotteryDrawNumbers, QuinielaPrizes } from "./LotteryMarks";

type BoardView = "hoy" | "ayer" | "historial";

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
        <time dateTime={result.date}>{formatLotteryDate(result.date, "long")}</time>
        <span>{result.drawTime}</span>
        {result.drawNumber ? <span>Sorteo {result.drawNumber}</span> : null}
      </div>
      <LotteryDrawNumbers result={result} />
      <a className="lottery-source-link" href={result.sourceUrl} target="_blank" rel="noreferrer">
        Consultar publicación de origen <span>↗</span>
      </a>
    </article>
  );
}

export function LotteryHub({ feed, today }: { feed: LotteryFeed; today: string }) {
  const [currentFeed, setCurrentFeed] = useState(feed);
  const yesterday = shiftDateKey(today, -1);
  const operators = useMemo(() => operatorsInFeed(currentFeed.results), [currentFeed.results]);
  const [view, setView] = useState<BoardView>("hoy");
  const [operator, setOperator] = useState("Todas");
  const [date, setDate] = useState("");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(18);

  useEffect(() => {
    setCurrentFeed(feed);
  }, [feed]);

  useEffect(() => {
    const loteria = new URLSearchParams(window.location.search).get("loteria");
    if (loteria) setOperator(loteria);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let timer: number | undefined;
    const refresh = () => {
      fetch("/api/lotteries", { signal: controller.signal, cache: "no-store" })
        .then((response) => (response.ok ? response.json() as Promise<LotteryFeed> : undefined))
        .then((latest) => {
          if (!latest) return;
          setCurrentFeed(latest);
          window.clearInterval(timer);
          timer = window.setInterval(refresh, latest.refreshSeconds * 1000);
        })
        .catch(() => undefined);
    };
    refresh();
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, []);

  const boardDate = view === "ayer" ? yesterday : today;
  const board = useMemo(
    () => buildDayBoard(currentFeed.results, boardDate).filter((row) => operator === "Todas" || row.operator === operator),
    [boardDate, currentFeed.results, operator],
  );

  const filtered = useMemo(() => {
    const selectedDate = date || undefined;
    return currentFeed.results.filter((result) => {
      if (operator !== "Todas" && result.operator !== operator) return false;
      if (selectedDate && result.date !== selectedDate) return false;
      return matchesLotteryQuery(result, query);
    });
  }, [date, currentFeed.results, operator, query]);

  function resetVisible() {
    setVisible(18);
  }

  return (
    <>
      <section className="lottery-explorer" aria-labelledby="lottery-results-title">
        <div className="lottery-explorer-head">
          <div>
            <span className="eyebrow">{view === "historial" ? "Archivo reciente" : "Tablero del día"}</span>
            <h2 id="lottery-results-title">{view === "historial" ? "Historial" : view === "ayer" ? "Resultados de ayer" : "Resultados de hoy"}</h2>
          </div>
          <div className="lottery-updated">
            <i /> Actualizado
            <time dateTime={currentFeed.updatedAt} suppressHydrationWarning>
              {new Intl.DateTimeFormat("es-DO", { hour: "numeric", minute: "2-digit", timeZone: "America/Santo_Domingo", hour12: true }).format(new Date(currentFeed.updatedAt))}
            </time>
          </div>
        </div>

        <div className="lottery-view-tabs" role="tablist" aria-label="Día del tablero">
          <button type="button" role="tab" aria-selected={view === "hoy"} className={view === "hoy" ? "is-active" : ""} onClick={() => setView("hoy")}>Hoy</button>
          <button type="button" role="tab" aria-selected={view === "ayer"} className={view === "ayer" ? "is-active" : ""} onClick={() => setView("ayer")}>Ayer</button>
          <button type="button" role="tab" aria-selected={view === "historial"} className={view === "historial" ? "is-active" : ""} onClick={() => setView("historial")}>Historial</button>
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

        {view === "historial" ? (
          <>
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
          </>
        ) : (
          <div className="lottery-board" aria-label={`Sorteos del ${formatLotteryDate(boardDate, "long")}`}>
            <p className="lottery-board-date">{formatLotteryDate(boardDate, "long")}</p>
            {board.length ? board.map((row) => {
              const brand = lotteryBrand(row.operator);
              const source = row.headline ?? row.extras[0];
              return (
                <article className={`lottery-board-row lottery-brand--${brand}${row.pending ? " is-pending" : ""}`} key={row.key}>
                  <div className="lottery-board-time">
                    <b>{row.time}</b>
                    <span>{row.operator}</span>
                  </div>
                  <div className="lottery-board-main">
                    {row.headline ? (
                      <>
                        <h3>{row.headline.game}</h3>
                        {lotteryKind(row.headline) === "quiniela" ? (
                          <QuinielaPrizes numbers={row.headline.numbers} />
                        ) : (
                          <LotteryDrawNumbers result={row.headline} compact />
                        )}
                      </>
                    ) : row.pending ? (
                      <>
                        <h3>Quiniela</h3>
                        <p className="lottery-board-pending">Aún no se publica este sorteo.</p>
                      </>
                    ) : null}
                    {row.extras.length ? (
                      <ul className="lottery-board-extras">
                        {row.extras.map((extra) => (
                          <li key={extra.id}>
                            <span>{extra.game}</span>
                            <LotteryDrawNumbers result={extra} compact />
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  {source ? (
                    <a className={`lottery-source-badge is-${source.sourceType}`} href={source.sourceUrl} target="_blank" rel="noreferrer">
                      {source.sourceType === "official" ? "Oficial" : "Informativa"}
                    </a>
                  ) : <span className="lottery-source-badge">Pendiente</span>}
                </article>
              );
            }) : (
              <div className="lottery-empty">
                <strong>Todavía no hay sorteos para este día.</strong>
                <p>Revisa el historial o la publicación oficial de cada lotería.</p>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="lottery-schedule-section" aria-labelledby="lottery-schedule-title">
        <div className="lottery-schedule-heading">
          <div><span className="eyebrow light">Horario de las tandas</span><h2 id="lottery-schedule-title">A qué hora sale</h2></div>
          <p>El tablero se actualiza cerca de cada sorteo. La quiniela es el 1er, 2do y 3er premio; el loto, el pool y el kino aparecen debajo.</p>
        </div>
        <div className="lottery-schedule-grid">
          {currentFeed.schedules.map((schedule) => (
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
          {currentFeed.sources.map((source) => (
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
