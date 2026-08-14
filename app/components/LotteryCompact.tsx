"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { lotteryBrand, lotteryMonogram } from "../../lib/lottery-brand";
import type { LotteryFeed, LotteryResult } from "../../lib/lottery-provider";

function compactResults(results: LotteryResult[]) {
  const seen = new Set<string>();
  return results.filter((result) => {
    if (seen.has(result.operator)) return false;
    seen.add(result.operator);
    return true;
  }).slice(0, 4);
}

export function LotteryCompact({ feed }: { feed: LotteryFeed }) {
  const [currentFeed, setCurrentFeed] = useState(feed);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/lotteries", { signal: controller.signal })
      .then((response) => response.ok ? response.json() as Promise<LotteryFeed> : undefined)
      .then((latest) => { if (latest) setCurrentFeed(latest); })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const results = compactResults(currentFeed.results);
  if (!results.length) return null;
  return (
    <section className="lottery-home-section">
      <div className="shell">
        <div className="lottery-home-heading">
          <div><span>Resultados al momento</span><h2>Loterías</h2></div>
          <Link href="/loterias">Ver todos los resultados <b>→</b></Link>
        </div>
        <div className="lottery-home-grid">
          {results.map((result) => (
            <Link className={`lottery-home-card lottery-brand--${lotteryBrand(result.operator)}`} href={`/loterias?loteria=${encodeURIComponent(result.operator)}`} key={result.id}>
              <div className="lottery-home-brand">
                <span className="lottery-brand-mark" aria-hidden="true">{lotteryMonogram(result.operator)}</span>
                <div><span>{result.operator}</span><small>{result.game}</small></div>
              </div>
              <div className="lottery-home-balls">
                {result.numbers.slice(0, 6).map((number, index) => <strong key={`${number}-${index}`}>{number}</strong>)}
              </div>
              <time dateTime={result.date}>{result.date.split("-").reverse().join("/")} · {result.drawTime}</time>
            </Link>
          ))}
        </div>
        <div className="lottery-home-note">
          <span>Información para consulta</span>
          <p>Confirma siempre tu jugada y cualquier premio en el canal oficial de la lotería correspondiente.</p>
        </div>
      </div>
    </section>
  );
}
