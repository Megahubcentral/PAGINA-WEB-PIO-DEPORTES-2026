import Link from "next/link";
import { Bars3Icon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";

const primaryNav = [
  ["Nacionales", "/categoria/nacionales"],
  ["MLB", "/categoria/mlb"],
  ["NBA", "/categoria/nba"],
  ["LIDOM", "/categoria/lidom"],
  ["Fútbol", "/categoria/futbol"],
  ["Loterías", "/loterias"],
] as const;

const moreSports = [
  ["NFL", "/categoria/nfl"],
  ["Tenis", "/categoria/tennis"],
  ["Caribe", "/categoria/beisbol-del-caribe"],
] as const;

const moreSportsHref = "/categoria/otros-deportes";

function MoreSportsLinks() {
  return (
    <>
      {moreSports.map(([label, href]) => (
        <Link key={href} href={href}>{label}</Link>
      ))}
      <Link className="nav-dropdown-all" href={moreSportsHref}>Otros deportes</Link>
    </>
  );
}

export function MainNav() {
  return (
    <nav className="main-nav" aria-label="Secciones principales">
      <div className="shell nav-bar">
        <input id="pio-nav-toggle" className="nav-checkbox" type="checkbox" />
        <label htmlFor="pio-nav-toggle" className="nav-toggle">
          <Bars3Icon className="nav-icon nav-icon-menu" aria-hidden="true" />
          <XMarkIcon className="nav-icon nav-icon-close" aria-hidden="true" />
          <span className="nav-toggle-text nav-toggle-text-menu">Menú</span>
          <span className="nav-toggle-text nav-toggle-text-close">Cerrar</span>
        </label>

        <div className="nav-panel">
          <div className="nav-links">
            {primaryNav.map(([label, href]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}

            <div className="nav-more nav-more-desktop">
              <span className="nav-more-trigger">
                Más deportes
                <ChevronDownIcon className="nav-icon" aria-hidden="true" />
              </span>
              <div className="nav-dropdown">
                <MoreSportsLinks />
              </div>
            </div>

            <details className="nav-more nav-more-mobile">
              <summary className="nav-more-trigger">
                Más deportes
                <ChevronDownIcon className="nav-icon" aria-hidden="true" />
              </summary>
              <div className="nav-dropdown">
                <MoreSportsLinks />
              </div>
            </details>
          </div>

          <div className="nav-panel-extras">
            <form className="nav-search" action="/buscar" role="search">
              <label className="sr-only" htmlFor="nav-search">Buscar noticias</label>
              <input id="nav-search" name="q" type="search" placeholder="Buscar" />
              <button type="submit">Buscar</button>
            </form>
            <div className="nav-utility">
              <Link href="/#radio">Radio</Link>
              <Link href="/videos">TV</Link>
              <a href="#contacto">Contacto</a>
            </div>
          </div>
        </div>

        <Link className="nav-live" href="/#radio"><span /> EN VIVO</Link>
      </div>
    </nav>
  );
}
