import { AdSlot } from "../components/LiveWidgets";
import { SiteFooter, SiteHeader } from "../components/Portal";
import AdvertisingForm from "./AdvertisingForm";

export const metadata = {
  title: "Anúnciate",
  description: "Soluciones publicitarias, patrocinios y contenido de marca para conectar con la audiencia deportiva de Pío Deportes.",
};

export default function AdvertisePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <header className="page-hero advertise-hero">
          <div className="shell">
            <span className="eyebrow">Conecta con la fanaticada</span>
            <h1>Tu marca entra al juego</h1>
            <p>Campañas de alto impacto, patrocinios y contenido de marca para conversar con una audiencia deportiva activa en República Dominicana y el exterior.</p>
          </div>
        </header>

        <section className="shell advertising-overview">
          <div className="advertising-intro">
            <span className="eyebrow">Soluciones comerciales</span>
            <h2>Presencia relevante, en el momento correcto</h2>
            <p>Diseñamos campañas que respetan la experiencia editorial y se adaptan a portada, secciones, noticias, video, radio y coberturas especiales. Las piezas publicitarias se identifican claramente y se optimizan para computadoras, tabletas y móviles.</p>
          </div>
          <div className="ad-products">
            <article><b>01</b><h3>Display responsivo</h3><p>Banners de alta visibilidad y formatos adaptables para portada, categorías y artículos.</p></article>
            <article><b>02</b><h3>Video y radio</h3><p>Pre-roll, menciones, segmentos patrocinados y presencia dentro de experiencias audiovisuales.</p></article>
            <article><b>03</b><h3>Contenido de marca</h3><p>Historias, especiales y activaciones producidas con separación clara entre publicidad y criterio editorial.</p></article>
            <article><b>04</b><h3>Coberturas y eventos</h3><p>Patrocinios alrededor de ligas, torneos, transmisiones, entrevistas y momentos deportivos clave.</p></article>
          </div>
        </section>

        <section className="advertising-form-section">
          <div className="shell commercial-layout">
            <AdvertisingForm />
            <aside className="commercial-aside">
              <div className="commercial-principles">
                <span className="eyebrow">Cómo trabajamos</span>
                <h2>Una propuesta hecha a la medida</h2>
                <ol>
                  <li><b>Objetivo</b><span>Entendemos la meta, audiencia y momento de la campaña.</span></li>
                  <li><b>Plan</b><span>Recomendamos formatos, ubicaciones y frecuencia.</span></li>
                  <li><b>Ejecución</b><span>Validamos piezas, activamos y damos seguimiento.</span></li>
                </ol>
              </div>
              <AdSlot size="300 × 250" />
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
