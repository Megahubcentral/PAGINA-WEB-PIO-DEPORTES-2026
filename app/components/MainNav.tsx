import Link from "next/link";
import { Bars3Icon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";

export type NavLink = readonly [string, string];

export const sportMenus = [
  {
    label: "Béisbol",
    items: [
      ["MLB", "/categoria/mlb"],
      ["LIDOM", "/categoria/lidom"],
      ["Béisbol del Caribe", "/categoria/beisbol-del-caribe"],
    ] satisfies NavLink[],
  },
  {
    label: "Baloncesto",
    items: [
      ["NBA", "/categoria/nba"],
      ["FIBA", "/categoria/baloncesto-fiba"],
    ] satisfies NavLink[],
  },
  {
    label: "Combate",
    items: [
      ["Boxeo", "/categoria/boxeo"],
    ] satisfies NavLink[],
  },
  {
    label: "Motor",
    items: [
      ["F1", "/categoria/formula-1"],
      ["MotoGP", "/categoria/motogp"],
    ] satisfies NavLink[],
  },
] as const;

export const moreSports = [
  ["NFL", "/categoria/nfl"],
  ["Hockey", "/categoria/nhl"],
  ["Tenis", "/categoria/tennis"],
] as const;

export const moreSportsHref = "/categoria/otros-deportes";

function DropdownLinks({ items, allHref, allLabel }: {
  items: readonly NavLink[];
  allHref?: string;
  allLabel?: string;
}) {
  return (
    <>
      {items.map(([label, href]) => (
        <Link key={href} href={href}>{label}</Link>
      ))}
      {allHref && allLabel ? <Link className="nav-dropdown-all" href={allHref}>{allLabel}</Link> : null}
    </>
  );
}

function SportMenu({
  label,
  items,
  allHref,
  allLabel,
  alignEnd,
}: {
  label: string;
  items: readonly NavLink[];
  allHref?: string;
  allLabel?: string;
  alignEnd?: boolean;
}) {
  const menuClass = alignEnd ? "nav-more nav-more-end" : "nav-more";

  return (
    <>
      <div className={`${menuClass} nav-more-desktop`}>
        <span className="nav-more-trigger">
          {label}
          <ChevronDownIcon className="nav-icon" aria-hidden="true" />
        </span>
        <div className="nav-dropdown">
          <DropdownLinks items={items} allHref={allHref} allLabel={allLabel} />
        </div>
      </div>

      <details className={`${menuClass} nav-more-mobile`}>
        <summary className="nav-more-trigger">
          {label}
          <ChevronDownIcon className="nav-icon" aria-hidden="true" />
        </summary>
        <div className="nav-dropdown">
          <DropdownLinks items={items} allHref={allHref} allLabel={allLabel} />
        </div>
      </details>
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
            <Link className="nav-home-desktop" href="/">Portada</Link>
            <Link href="/categoria/nacionales">Nacionales</Link>

            {sportMenus.map((sport) => (
              <SportMenu key={sport.label} label={sport.label} items={sport.items} />
            ))}

            <Link href="/categoria/futbol">Fútbol</Link>
            <Link href="/loterias">Loterías</Link>

            <SportMenu
              label="Más deportes"
              items={moreSports}
              allHref={moreSportsHref}
              allLabel="Otros deportes"
              alignEnd
            />
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
