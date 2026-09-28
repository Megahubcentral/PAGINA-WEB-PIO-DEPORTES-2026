/* eslint-disable @next/next/no-img-element -- WordPress media may come from an editor-configured CDN at runtime. */
import Link from "next/link";
import { getLatestArticles, type Article } from "../../lib/wordpress";
import { PushNotificationButton } from "./Engagement";
import { AdSlot, BreakingTicker, CurrentDate, LiveInfo, NewsletterForm } from "./LiveWidgets";
import { cometaHeaderAd } from "../../lib/direct-ads";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { getNavTree, navItemLinks, type NavLink } from "../../lib/nav-tree";
import { MainNav } from "./MainNav";

export async function SiteHeader() {
  const breakingHeadlines = (await getLatestArticles(20)).slice(0, 20).map((article) => ({
    title: article.title,
    time: article.publishedAt,
    href: `/noticias/${article.slug}`,
  }));

  return (
    <>
      <div className="utility-bar">
        <div className="shell utility-inner">
          <CurrentDate />
          <LiveInfo />
          <div className="utility-links">
            <Link href="/#radio">Radio</Link>
            <Link href="/videos">TV</Link>
            <a href="#contacto">Contacto</a>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="shell masthead">
          <Link className="brand" href="/" aria-label="Pío Deportes, portada">
            <img src="/pio-logo-original.png" alt="Pío Deportes" width="210" height="105" />
          </Link>
          <div className="masthead-ad"><AdSlot size="728 × 90" creative={cometaHeaderAd} /></div>
          <form className="search" action="/buscar" role="search">
            <label className="sr-only" htmlFor="site-search">Buscar noticias</label>
            <input id="site-search" name="q" type="search" placeholder="Buscar" />
            <button type="submit" aria-label="Buscar">⌕</button>
          </form>
        </div>

        <MainNav />
      </header>

      <div className="breaking-bar">
        <div className="shell breaking-inner">
          <strong>Última hora</strong>
          <BreakingTicker headlines={breakingHeadlines} />
        </div>
      </div>
    </>
  );
}

export function ArticleCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  return (
    <article className={compact ? "article-card compact" : "article-card"}>
      <Link className="article-image" href={`/noticias/${article.slug}`}>
        <img src={article.image} alt={article.imageAlt || article.title} loading="lazy" />
        {article.media ? <span className="media-badge">{article.media === "video" ? "▶" : "♪"}</span> : null}
      </Link>
      <div className="article-body">
        <Link className="category-link" href={`/categoria/${article.categorySlug}`}>{article.category}</Link>
        <Link className="article-copy" href={`/noticias/${article.slug}`}>
          <strong className="article-title">{article.title}</strong>
          {!compact ? <span className="article-excerpt">{article.excerpt}</span> : null}
        </Link>
        <div className="story-meta"><span>{article.author}</span><span>{article.publishedAt}</span></div>
      </div>
    </article>
  );
}

export function SectionHeading({ kicker, title, href }: { kicker?: string; title: string; href?: string }) {
  return (
    <div className="section-heading">
      <div>
        {kicker ? <span className="eyebrow">{kicker}</span> : null}
        <h2>
          {href ? (
            <Link href={href} className="section-heading-title">
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
      </div>
      {href ? (
        <Link href={href} className="section-heading-more">
          Ver todo <span>→</span>
        </Link>
      ) : null}
    </div>
  );
}

function FooterSportMenu({
  label,
  items,
  allHref,
  allLabel,
}: {
  label: string;
  items: readonly NavLink[];
  allHref?: string;
  allLabel?: string;
}) {
  return (
    <details className="footer-sport">
      <summary>
        {label}
        <ChevronDownIcon className="footer-sport-icon" width={14} height={14} aria-hidden="true" />
      </summary>
      <div className="footer-sport-leagues">
        {items.filter(([, href]) => href !== allHref).map(([itemLabel, href]) => (
          <Link key={href} href={href}>{itemLabel}</Link>
        ))}
        {allHref && allLabel ? <Link href={allHref}>{allLabel}</Link> : null}
      </div>
    </details>
  );
}

export async function SiteFooter() {
  const nav = await getNavTree();

  return (
    <footer className="site-footer" id="contacto">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <img src="/pio-logo-white.png" alt="Pío Deportes" width="190" height="95" />
          <p>El deporte vive aquí. Noticias dominicanas e internacionales con rigor, pasión y velocidad.</p>
        </div>
        <nav className="footer-sections" aria-label="Secciones">
          <h3>Secciones</h3>
          <Link href="/categoria/nacionales">Nacionales</Link>
          <Link href="/categoria/internacional">Internacional</Link>
          {nav.primary.map((sport) => (
            <FooterSportMenu
              key={sport.slug}
              label={sport.label}
              items={navItemLinks(sport.children.length ? sport.children : [sport])}
            />
          ))}
          <Link href="/loterias">Loterías</Link>
          <FooterSportMenu
            label="Más deportes"
            items={navItemLinks(nav.moreSports)}
            allHref={nav.moreSportsHref}
            allLabel="Otros deportes"
          />
        </nav>
        <div>
          <h3>Pío Deportes</h3>
          <Link href="/#radio">Radio en vivo</Link>
          <Link href="/videos">Videos</Link>
          <Link href="/anunciate">Anúnciate</Link>
          <Link href="/terminos">Términos y privacidad</Link>
          <a href="mailto:info@piodeportes.com">info@piodeportes.com</a>
        </div>
        <div className="newsletter">
          <h3>El resumen que sí importa</h3>
          <p>Las noticias clave, directo a tu correo.</p>
          <NewsletterForm />
          <PushNotificationButton />
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 Pío Deportes. Todos los derechos reservados.</span>
        <span>Hecho en República Dominicana 🇩🇴</span>
      </div>
    </footer>
  );
}
