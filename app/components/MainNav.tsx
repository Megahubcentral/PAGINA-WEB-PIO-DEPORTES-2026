import Link from "next/link";
import { Bars3Icon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getNavTree, navItemLinks, type NavItem, type NavLink } from "../../lib/nav-tree";

export type { NavLink };

function DropdownLinks({ items, allHref, allLabel }: {
  items: readonly NavLink[];
  allHref?: string;
  allLabel?: string;
}) {
  return (
    <>
      {items.filter(([, href]) => href !== allHref).map(([label, href]) => (
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

function SportNavItem({ sport }: { sport: NavItem }) {
  if (!sport.children.length) {
    return <Link href={sport.href}>{sport.label}</Link>;
  }

  return (
    <SportMenu
      label={sport.label}
      items={navItemLinks(sport.children)}
      allHref={sport.href}
      allLabel={`Todo ${sport.label}`}
    />
  );
}

export async function MainNav() {
  const nav = await getNavTree();

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

            {nav.primary.map((sport) => (
              <SportNavItem key={sport.slug} sport={sport} />
            ))}

            <Link href="/loterias">Loterías</Link>

            <SportMenu
              label="Más deportes"
              items={navItemLinks(nav.moreSports)}
              allHref={nav.moreSportsHref}
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
