import type { Metadata } from "next";
import { ScoreStrip, ScoresHub } from "../components/Scoreboard";
import { SiteFooter, SiteHeader } from "../components/Portal";
import { JsonLd } from "../components/JsonLd";
import { breadcrumbJsonLd, routeMetadata } from "../../lib/seo";

export const metadata: Metadata = routeMetadata({
  path: "/marcadores",
  title: "Marcadores y resultados",
  description: "Resultados, partidos en vivo y próximos encuentros en Pío Deportes.",
});

export default function ScoresPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "Inicio", path: "/" },
        { name: "Marcadores", path: "/marcadores" },
      ])} />
      <SiteHeader />
      <ScoreStrip />
      <main>
        <header className="page-hero scores-page-hero">
          <div className="shell">
            <span className="eyebrow">Resultados · Calendario · En vivo</span>
            <h1>Marcadores</h1>
            <p>La jornada deportiva en un solo tablero: resultados, juegos en curso y próximos encuentros.</p>
          </div>
        </header>
        <section className="shell scores-page"><ScoresHub /></section>
      </main>
      <SiteFooter />
    </>
  );
}
