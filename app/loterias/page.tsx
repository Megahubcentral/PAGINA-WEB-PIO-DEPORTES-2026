import type { Metadata } from "next";
import { LotteryHub } from "../components/LotteryHub";
import { SiteFooter, SiteHeader } from "../components/Portal";
import { getLotteryFeed } from "../../lib/lottery-provider";

export const metadata: Metadata = {
  title: "Loterías Dominicanas: resultados y horarios",
  description: "Consulta resultados recientes y horarios de LEIDSA, Loteka, Loto Real y Lotería Nacional en República Dominicana.",
};

export const dynamic = "force-dynamic";

export default async function LotteriesPage() {
  const feed = await getLotteryFeed();
  return (
    <>
      <SiteHeader />
      <main className="lottery-page">
        <section className="lottery-hero">
          <div className="shell lottery-hero-inner">
            <div>
              <span className="eyebrow light">Resultados · horarios · fuentes</span>
              <h1>Loterías</h1>
              <p>Los resultados de los principales sorteos dominicanos, organizados para encontrarlos rápido y comprobar su origen.</p>
            </div>
            <div className="lottery-hero-balls" aria-hidden="true">
              <span>24</span><span>09</span><span>57</span><span>31</span>
            </div>
          </div>
        </section>

        <div className="shell lottery-content">
          <LotteryHub feed={feed} />

          <aside className="lottery-disclaimer" aria-label="Aviso importante sobre los resultados">
            <strong>Aviso importante</strong>
            <p>Pio Deportes publica estos resultados únicamente con fines informativos. No organiza, administra ni certifica sorteos. Aunque procuramos reproducir los datos con precisión, pueden existir retrasos, errores u omisiones. Para reclamar premios o confirmar una jugada, verifica siempre el boleto y el resultado en los canales oficiales de la lotería correspondiente. Pio Deportes no asume responsabilidad por pérdidas, pagos o decisiones basadas exclusivamente en esta información.</p>
            <span>Solo para mayores de edad. Juega responsablemente.</span>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
