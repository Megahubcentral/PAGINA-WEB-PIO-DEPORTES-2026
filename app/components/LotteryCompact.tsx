"use client";

import Link from "next/link";
import { lotteryBrand, lotteryMonogram } from "../../lib/lottery-brand";
import type { LotteryFeed } from "../../lib/lottery-provider";
import { formatLotteryDate, selectHomeQuinielas } from "../../lib/lottery-view";
import { LotteryBalls, QuinielaPrizes } from "./LotteryMarks";
import { useLotteryFeed } from "./useLotteryFeed";

export function LotteryCompact({ feed }: { feed: LotteryFeed }) {
  const currentFeed = useLotteryFeed(feed);

  const cards = selectHomeQuinielas(currentFeed.results);
  if (!cards.some((card) => card.result)) return null;

  return (
    <section className="lottery-home-section">
      <div className="shell">
        <div className="lottery-home-heading">
          <div>
            <span>Quinielas de hoy</span>
            <h2>Loterías</h2>
          </div>
          <Link href="/loterias">Ver tablero completo <b>→</b></Link>
        </div>
        <div className="lottery-home-grid">
          {cards.map((card) => {
            const result = card.result;
            const brand = lotteryBrand(card.operator);
            return (
              <Link
                className={`lottery-home-card lottery-brand--${brand}${card.isToday ? " is-today" : ""}`}
                href="/loterias"
                key={card.operator}
              >
                <div className="lottery-home-brand">
                  <span className="lottery-brand-mark" aria-hidden="true">{lotteryMonogram(card.operator)}</span>
                  <div>
                    <span>{card.operator}</span>
                    <small>{result?.game ?? "Quiniela"}</small>
                  </div>
                </div>
                {result ? (
                  <QuinielaPrizes numbers={result.numbers} dimmed={!card.isToday} />
                ) : (
                  <QuinielaPrizes numbers={["—", "—", "—"]} dimmed />
                )}
                {card.extras.length ? (
                  <ul className="lottery-home-extras">
                    {card.extras.map((extra) => (
                      <li key={extra.id}>
                        <span>{extra.game}</span>
                        <LotteryBalls result={extra} compact />
                      </li>
                    ))}
                  </ul>
                ) : null}
                <time dateTime={result?.date}>
                  {card.isToday ? `Hoy · ${result?.drawTime ?? card.fallbackTime}` : result ? `Último · ${formatLotteryDate(result.date)}` : "Aún no sale"}
                </time>
              </Link>
            );
          })}
        </div>
        <div className="lottery-home-note">
          <span>Información para consulta</span>
          <p>La quiniela se lee como 1er, 2do y 3er premio. Confirma siempre tu jugada en el canal oficial de cada lotería.</p>
        </div>
      </div>
    </section>
  );
}
