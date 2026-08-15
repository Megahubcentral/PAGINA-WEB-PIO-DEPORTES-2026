import type { Metadata } from "next";
import { HorseRacingHub } from "../components/HorseRacingHub";
import { LotteryHub } from "../components/LotteryHub";
import { SiteFooter, SiteHeader } from "../components/Portal";
import { getHorseRacingFeed } from "../../lib/horse-racing-provider";
import { getLotteryFeed } from "../../lib/lottery-provider";

export const metadata: Metadata = {
  title: "Loterías e hípica: resultados y horarios",
  description: "Consulta resultados recientes de loterías dominicanas y carreras del Hipódromo V Centenario y el Hipódromo Camarero.",
};

export const dynamic = "force-dynamic";

export default async function LotteriesPage() {
  const [feed, horseRacingFeed] = await Promise.all([
    getLotteryFeed(),
    getHorseRacingFeed(),
  ]);
  return (
    <>
      <SiteHeader />
      <main className="lottery-page">
        <section className="lottery-hero">
          <div className="shell lottery-hero-inner">
            <div>
              <span className="eyebrow light">Sorteos · hípica · fuentes</span>
              <h1>Loterías</h1>
              <p>Los principales sorteos dominicanos y las jornadas hípicas de República Dominicana y Puerto Rico, organizados para comprobar su origen.</p>
            </div>
            <div className="lottery-hero-balls" aria-hidden="true">
              <span>24</span><span>09</span><span>57</span><span>31</span>
            </div>
          </div>
        </section>

        <div className="shell lottery-content">
          <LotteryHub feed={feed} />
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
