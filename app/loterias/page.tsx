import type { Metadata } from "next";
import { HorseRacingHub } from "../components/HorseRacingHub";
import { JsonLd } from "../components/JsonLd";
import { LotteryHub } from "../components/LotteryHub";
import { SiteFooter, SiteHeader } from "../components/Portal";
import { getHorseRacingFeed } from "../../lib/horse-racing-provider";
import { getLotteryFeed } from "../../lib/lottery-provider";
import { todayKeyInAst } from "../../lib/lottery-view";
import { breadcrumbJsonLd, routeMetadata } from "../../lib/seo";

export const metadata: Metadata = routeMetadata({
  path: "/loterias",
  title: "Loterías e hípica: resultados de hoy",
  description: "Quinielas de hoy en República Dominicana: 1er, 2do y 3er premio de Loto Real, Nacional, Loteka y LEIDSA, más loto, pool, kino y resultados hípicos.",
});

export const dynamic = "force-dynamic";

export default async function LotteriesPage() {
  const [feed, horseRacingFeed] = await Promise.all([
    getLotteryFeed(),
    getHorseRacingFeed(),
  ]);
  const today = todayKeyInAst();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "Inicio", path: "/" },
        { name: "Loterías", path: "/loterias" },
      ])} />
      <SiteHeader />
      <main className="lottery-page">
        <section className="lottery-hero">
          <div className="shell lottery-hero-inner">
            <div>
              <span className="eyebrow light">Quiniela · loto · hípica</span>
              <h1>Loterías</h1>
              <p>El tablero de hoy, con 1er, 2do y 3er premio de cada casa, más loto, pool y kino. Debajo, las jornadas hípicas de República Dominicana y Puerto Rico.</p>
            </div>
            <div className="lottery-hero-prizes" aria-hidden="true">
              <span><small>1er</small><b>16</b></span>
              <span><small>2do</small><b>24</b></span>
              <span><small>3er</small><b>64</b></span>
            </div>
          </div>
        </section>

        <div className="shell lottery-content">
          <LotteryHub feed={feed} today={today} />
          <HorseRacingHub feed={horseRacingFeed} />

          <aside className="lottery-disclaimer" aria-label="Aviso importante sobre los resultados">
            <strong>Aviso importante</strong>
            <p>Pio Deportes publica estos resultados únicamente con fines informativos. No organiza, administra ni certifica sorteos o carreras. Aunque procuramos reproducir los datos con precisión, pueden existir retrasos, errores u omisiones. Para reclamar premios o confirmar una jugada, verifica siempre el boleto y el resultado en los canales oficiales de la lotería o hipódromo correspondiente. Pio Deportes no asume responsabilidad por pérdidas, pagos o decisiones basadas exclusivamente en esta información.</p>
            <span>Solo para mayores de edad. Juega responsablemente.</span>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
