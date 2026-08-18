/* eslint-disable @next/next/no-img-element -- WordPress media may come from an editor-configured CDN at runtime. */
import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "../../components/LiveWidgets";
import { SiteFooter, SiteHeader } from "../../components/Portal";
import { getCategoryArticles, wordpressCategorySlugs } from "../../../lib/wordpress";

const profiles: Record<string, { title: string; label: string; description: string; code: string }> = {
  nacionales: { title: "Nacionales", label: "República Dominicana", description: "Selecciones, atletas, federaciones y competencias que definen la actualidad deportiva dominicana.", code: "RD" },
  mlb: { title: "MLB", label: "Grandes Ligas", description: "Resultados, protagonistas y análisis del mejor béisbol del mundo, con atención especial al talento dominicano.", code: "MLB" },
  nba: { title: "NBA", label: "Baloncesto", description: "La liga, sus estrellas y las historias que marcan cada jornada dentro y fuera de la cancha.", code: "NBA" },
  lidom: { title: "LIDOM", label: "Béisbol invernal", description: "Todo el seguimiento a los equipos, figuras y rivalidades de la pelota otoño-invernal dominicana.", code: "LIDOM" },
  futbol: { title: "Fútbol", label: "Juego internacional", description: "Ligas, selecciones y grandes torneos con contexto, resultados y análisis de sus protagonistas.", code: "FÚTBOL" },
  nfl: { title: "NFL", label: "Fútbol americano", description: "Noticias, resultados y claves de la temporada de fútbol americano profesional.", code: "NFL" },
  tennis: { title: "Tenis", label: "Circuito mundial", description: "Grand Slams, rankings y protagonistas de los principales circuitos profesionales.", code: "TENIS" },
  tenis: { title: "Tenis", label: "Circuito mundial", description: "Grand Slams, rankings y protagonistas de los principales circuitos profesionales.", code: "TENIS" },
  voleibol: { title: "Voleibol", label: "Cancha y selección", description: "La actualidad de las selecciones dominicanas y de las principales competencias internacionales.", code: "VÓLEY" },
  "beisbol-del-caribe": { title: "Béisbol del Caribe", label: "Pelota caribeña", description: "Ligas, series y protagonistas del béisbol profesional de nuestra región.", code: "CARIBE" },
  "otros-deportes": { title: "Otros deportes", label: "Polideportivo", description: "Boxeo, Fórmula 1, golf, atletismo y las disciplinas que completan la agenda deportiva.", code: "MÁS" },
};

const defaultProfile = { title: "Actualidad", label: "Pío Deportes", description: "Noticias, análisis, protagonistas y resultados del deporte nacional e internacional.", code: "PIO" };

export function generateStaticParams() {
  return wordpressCategorySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const profile = profiles[slug] ?? defaultProfile;
  return { title: profile.title, description: `Últimas noticias de ${profile.title} en Pío Deportes.` };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = profiles[slug] ?? { ...defaultProfile, title: slug.replaceAll("-", " ") };
  const articles = await getCategoryArticles(slug);
  const lead = articles[0];
  if (!lead) {
    return (
      <>
        <SiteHeader />
        <main>
          <header className={`page-hero category-hero category-hero--${slug}`}>
            <span className="category-watermark" aria-hidden="true">{profile.code}</span>
            <div className="shell category-hero-inner">
              <span className="eyebrow">{profile.label}</span>
              <h1>{profile.title}</h1>
              <p>{profile.description}</p>
            </div>
          </header>
        </main>
        <SiteFooter />
      </>
    );
  }
  const secondary = articles.slice(1, 3);
  const mostRead = articles.slice(3, 6);
  const feed = articles.slice(6);

  return (
    <>
      <SiteHeader />
      <main>
        <header className={`page-hero category-hero category-hero--${slug}`}>
          <span className="category-watermark" aria-hidden="true">{profile.code}</span>
          <div className="shell category-hero-inner">
            <span className="eyebrow">{profile.label}</span>
            <h1>{profile.title}</h1>
            <p>{profile.description}</p>
          </div>
        </header>
        <section className={`shell category-front category-front--${slug}`}>
          <div className="category-front-toolbar">
            <span><i /> Selección editorial</span>
            <time>Actualizado hace 6 minutos</time>
          </div>

          <div className="category-front-grid">
            <article className="category-lead-story">
              <Link href={`/noticias/${lead.slug}`}>
                <img src={lead.image} alt="" fetchPriority="high" />
                <span className="category-lead-shade" />
                <div className="category-lead-copy">
                  <span>{lead.category} · En portada</span>
                  <h2>{lead.title}</h2>
                  <p>{lead.excerpt}</p>
                  <small>{lead.author} · {lead.publishedAt}</small>
                </div>
                {lead.media ? <b className="category-lead-media">▶</b> : null}
              </Link>
            </article>

            <div className="category-secondary-stories">
              {secondary.map((article) => (
                <article key={article.id}>
                  <Link className="category-secondary-image" href={`/noticias/${article.slug}`}><img src={article.image} alt="" loading="lazy" /></Link>
                  <span>{article.category}</span>
                  <h3><Link href={`/noticias/${article.slug}`}>{article.title}</Link></h3>
                  <small>{article.publishedAt}</small>
                </article>
              ))}
            </div>

            <aside className="category-most-read">
              <div className="category-most-head"><span>Lo más leído</span><small>24 horas</small></div>
              {mostRead.map((article, index) => (
                <Link href={`/noticias/${article.slug}`} key={article.id}>
                  <b>0{index + 1}</b>
                  <span><small>{article.category}</small><strong>{article.title}</strong></span>
                </Link>
              ))}
              <Link className="category-most-cta" href="/buscar">Ver todas las noticias →</Link>
            </aside>
          </div>

          <div className="category-front-ad"><AdSlot /></div>

          <div className="category-feed-layout">
            <div>
              <div className="category-feed-heading">
                <div><span>Últimas noticias</span><h2>En desarrollo</h2></div>
                <Link href="/marcadores">Agenda y resultados →</Link>
              </div>
              <div className="category-news-feed">
                {feed.map((article) => (
                  <article key={article.id}>
                    <Link href={`/noticias/${article.slug}`}><img src={article.image} alt="" loading="lazy" /></Link>
                    <div>
                      <span>{article.category}</span>
                      <h3><Link href={`/noticias/${article.slug}`}>{article.title}</Link></h3>
                      <p>{article.excerpt}</p>
                      <small>{article.author} · {article.publishedAt}</small>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <aside className="category-sidebar">
              <AdSlot size="300 × 250" />
              <div className="category-score-promo">
                <span>En vivo · Resultados · Calendario</span>
                <strong>Sigue la jornada sin salir de Pío</strong>
                <Link href="/marcadores">Ir a Marcadores →</Link>
              </div>
              <AdSlot size="300 × 600" />
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
