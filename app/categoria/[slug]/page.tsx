/* eslint-disable @next/next/no-img-element -- WordPress media may come from an editor-configured CDN at runtime. */
import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "../../components/LiveWidgets";
import { SiteFooter, SiteHeader } from "../../components/Portal";
import { ADSENSE_SLOTS } from "../../../lib/adsense";
import { breadcrumbJsonLd, routeMetadata } from "../../../lib/seo";
import { getCategoryArticles, getInternationalArticlePage, wordpressCategorySlugs } from "../../../lib/wordpress";
import { JsonLd } from "../../components/JsonLd";

const profiles: Record<string, { title: string; label: string; description: string; code: string }> = {
  nacionales: { title: "Nacionales", label: "República Dominicana", description: "Selecciones, atletas, federaciones y competencias que definen la actualidad deportiva dominicana.", code: "RD" },
  internacional: { title: "Cobertura internacional", label: "Fuera de Nacional", description: "Todas las noticias que no pertenecen a la categoría Nacional, de la más reciente a la más antigua.", code: "MUNDO" },
  mlb: { title: "MLB", label: "Béisbol · Grandes Ligas", description: "Resultados, protagonistas y análisis del mejor béisbol del mundo, con atención especial al talento dominicano.", code: "MLB" },
  nba: { title: "NBA", label: "Baloncesto · NBA", description: "Resultados, protagonistas y análisis de la NBA, con atención especial al talento dominicano.", code: "NBA" },
  baloncesto: { title: "Baloncesto", label: "NBA · FIBA", description: "La cobertura de NBA y el baloncesto internacional de FIBA, de la más reciente a la más antigua.", code: "NBA" },
  ncaab: { title: "NCAAB", label: "Baloncesto universitario", description: "La actualidad del baloncesto universitario de Estados Unidos, con protagonistas, resultados y rumbo a March Madness.", code: "NCAAB" },
  "baloncesto-fiba": { title: "FIBA", label: "Baloncesto · FIBA", description: "El baloncesto internacional de FIBA: selecciones, ventanas, mundiales y las competencias que marcan el calendario.", code: "FIBA" },
  "liga-nacional-de-baloncesto": { title: "Liga Nacional de Baloncesto", label: "Baloncesto dominicano", description: "El seguimiento a la Liga Nacional de Baloncesto, sus equipos y las figuras del circuito local.", code: "LNB" },
  lidom: { title: "LIDOM", label: "Béisbol · LIDOM", description: "Todo el seguimiento a los equipos, figuras y rivalidades de la pelota otoño-invernal dominicana.", code: "LIDOM" },
  beisbol: { title: "Béisbol", label: "MLB · LIDOM · Latino", description: "Grandes Ligas, LIDOM y el béisbol latino, de la más reciente a la más antigua.", code: "BÉISBOL" },
  "beisbol-latino": { title: "Béisbol latino", label: "Béisbol · Latinoamérica", description: "Ligas, series y protagonistas del béisbol profesional de nuestra región.", code: "LATINO" },
  "beisbol-del-caribe": { title: "Béisbol latino", label: "Béisbol · Latinoamérica", description: "Ligas, series y protagonistas del béisbol profesional de nuestra región.", code: "LATINO" },
  wnba: { title: "WNBA", label: "Baloncesto · WNBA", description: "La actualidad de la WNBA, con resultados, figuras y las series que marcan la temporada.", code: "WNBA" },
  combate: { title: "Combate", label: "Boxeo", description: "Peleas, títulos y figuras del boxeo dominicano e internacional.", code: "COMBATE" },
  automovilismo: { title: "Automovilismo", label: "F1 · MotoGP", description: "El Mundial de Fórmula 1, MotoGP y el resto del automovilismo, de la más reciente a la más antigua.", code: "MOTOR" },
  futbol: { title: "Fútbol", label: "NFL · Soccer · Ligas", description: "Fútbol americano, soccer y las ligas que completan la sección, de la más reciente a la más antigua.", code: "FÚTBOL" },
  "futbol-soccer": { title: "Fútbol (Soccer)", label: "Soccer · Juego internacional", description: "Ligas, selecciones y grandes torneos de soccer, con contexto, resultados y análisis de sus protagonistas.", code: "SOCCER" },
  ncaaf: { title: "NCAAF", label: "Fútbol americano universitario", description: "La actualidad del fútbol americano universitario de Estados Unidos.", code: "NCAAF" },
  ldf: { title: "LDF", label: "Fútbol · República Dominicana", description: "La Liga Dominicana de Fútbol, sus clubes y las figuras del circuito local.", code: "LDF" },
  mls: { title: "MLS", label: "Soccer · MLS", description: "La Major League Soccer, con clubes, figuras y el pulso de cada temporada.", code: "MLS" },
  "mundial-fifa-usa-can-mex-2026": { title: "Mundial 2026", label: "FIFA · USA CAN MEX", description: "El camino al Mundial FIFA 2026, con selecciones, sedes y las noticias que marcan la Copa.", code: "FIFA" },
  atletismo: { title: "Atletismo", label: "Pista y campo", description: "El atletismo dominicano e internacional, con figuras, marcas y el calendario de campeonatos.", code: "ATLE" },
  "juegos-olimpicos": { title: "Juegos Olímpicos", label: "Atletismo · Ciclo olímpico", description: "El seguimiento a los Juegos Olímpicos y a los atletas dominicanos en el ciclo internacional.", code: "JJOO" },
  nfl: { title: "NFL", label: "Fútbol americano", description: "Noticias, resultados y claves de la temporada de fútbol americano profesional.", code: "NFL" },
  nhl: { title: "NHL", label: "Hockey", description: "La actualidad de la NHL, con resultados, figuras y las series que marcan la temporada.", code: "NHL" },
  tennis: { title: "Tenis", label: "Circuito mundial", description: "Grand Slams, rankings y protagonistas de los principales circuitos profesionales.", code: "TENIS" },
  tenis: { title: "Tenis", label: "Circuito mundial", description: "Grand Slams, rankings y protagonistas de los principales circuitos profesionales.", code: "TENIS" },
  voleibol: { title: "Voleibol", label: "Cancha y selección", description: "La actualidad de las selecciones dominicanas y de las principales competencias internacionales.", code: "VÓLEY" },
  boxeo: { title: "Boxeo", label: "Combate · Boxeo", description: "Peleas, títulos y figuras del boxeo dominicano e internacional.", code: "BOXEO" },
  "formula-1": { title: "Fórmula 1", label: "Automovilismo · F1", description: "Calendario, equipos y protagonistas del Mundial de Fórmula 1.", code: "F1" },
  motogp: { title: "MotoGP", label: "Automovilismo · MotoGP", description: "La actualidad del Mundial de Motociclismo, con carreras, figuras y el pulso de cada Gran Premio.", code: "MOTOGP" },
  "otros-deportes": { title: "Otros deportes", label: "Polideportivo", description: "Tenis, hockey, atletismo y las disciplinas que completan la agenda deportiva.", code: "MÁS" },
};

const defaultProfile = { title: "Actualidad", label: "Pío Deportes", description: "Noticias, análisis, protagonistas y resultados del deporte nacional e internacional.", code: "PIO" };

function parsePage(value?: string) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function internationalHref(page: number) {
  return page <= 1 ? "/categoria/internacional" : `/categoria/internacional?page=${page}`;
}

function CategoryPagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  const previous = page > 1 ? internationalHref(page - 1) : null;
  const next = page < totalPages ? internationalHref(page + 1) : null;

  return (
    <nav className="category-pagination" aria-label="Paginación de noticias">
      {previous ? <Link href={previous}>← Anterior</Link> : <span className="is-disabled">← Anterior</span>}
      <strong>Página {page} de {totalPages}</strong>
      {next ? <Link href={next}>Siguiente →</Link> : <span className="is-disabled">Siguiente →</span>}
    </nav>
  );
}

export const revalidate = 120;

export function generateStaticParams() {
  return wordpressCategorySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = profiles[slug] ?? defaultProfile;
  const page = parsePage((await searchParams).page);
  const title = slug === "internacional" && page > 1 ? `${profile.title} · Página ${page}` : profile.title;
  return routeMetadata({
    path: `/categoria/${slug}`,
    title,
    description: profile.description,
    index: page === 1,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const profile = profiles[slug] ?? { ...defaultProfile, title: slug.replaceAll("-", " ") };
  const isInternational = slug === "internacional";
  const currentPage = parsePage((await searchParams).page);
  const internationalPage = isInternational ? await getInternationalArticlePage(currentPage) : null;
  const articles = internationalPage?.articles ?? await getCategoryArticles(slug);
  const pagination = internationalPage && internationalPage.totalPages > 1
    ? { page: internationalPage.page, totalPages: internationalPage.totalPages }
    : null;
  const showEditorialFront = (!isInternational || internationalPage?.page === 1) && Boolean(articles[0]);
  const lead = showEditorialFront ? articles[0] : undefined;
  if (!articles.length && !pagination) {
    return (
      <>
        <JsonLd data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: profile.title, path: `/categoria/${slug}` },
        ])} />
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
  const secondary = showEditorialFront ? articles.slice(1, 3) : [];
  const mostRead = showEditorialFront ? articles.slice(3, 6) : [];
  const feed = showEditorialFront ? articles.slice(6) : articles;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "Inicio", path: "/" },
        { name: profile.title, path: `/categoria/${slug}` },
      ])} />
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
          {showEditorialFront && lead ? (
            <>
          <div className="category-front-toolbar">
            <span><i /> Selección editorial</span>
            <time dateTime={lead.date}>Actualizado {lead.publishedAt}</time>
          </div>

          <div className="category-front-grid">
            <article className="category-lead-story">
              <Link href={`/noticias/${lead.slug}`}>
                <img src={lead.image} alt={lead.imageAlt || lead.title} fetchPriority="high" />
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
                  <Link className="category-secondary-image" href={`/noticias/${article.slug}`}><img src={article.image} alt={article.imageAlt || article.title} loading="lazy" /></Link>
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
            </>
          ) : null}

          <div className="category-feed-layout">
            <div>
              <div className="category-feed-heading">
                <div>
                  <span>Últimas noticias</span>
                  <h2>{pagination && pagination.page > 1 ? `Página ${pagination.page}` : "En desarrollo"}</h2>
                </div>
                <Link href="/marcadores">Agenda y resultados →</Link>
              </div>
              <div className="category-news-feed">
                {feed.map((article) => (
                  <article key={article.id}>
                    <Link href={`/noticias/${article.slug}`}><img src={article.image} alt={article.imageAlt || article.title} loading="lazy" /></Link>
                    <div>
                      <span>{article.category}</span>
                      <h3><Link href={`/noticias/${article.slug}`}>{article.title}</Link></h3>
                      <p>{article.excerpt}</p>
                      <small>{article.author} · {article.publishedAt}</small>
                    </div>
                  </article>
                ))}
              </div>
              {pagination ? <CategoryPagination page={pagination.page} totalPages={pagination.totalPages} /> : null}
            </div>
            <aside className="category-sidebar">
              <div className="sidebar-desktop-ad">
                <AdSlot slot={ADSENSE_SLOTS.sidebarDesktop} />
              </div>
              <div className="category-score-promo">
                <span>En vivo · Resultados · Calendario</span>
                <strong>Sigue la jornada sin salir de Pío</strong>
                <Link href="/marcadores">Ir a Marcadores →</Link>
              </div>
              <div className="sidebar-desktop-ad">
                <AdSlot slot={ADSENSE_SLOTS.sidebarDesktop} />
              </div>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
