"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

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

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const panelId = useId();
  const moreId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreCloseTimer = useRef<number>(0);
  const moreActive = moreSports.some(([, href]) => isCurrent(pathname, href)) || isCurrent(pathname, moreSportsHref);

  function canHoverDropdown() {
    return window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1051px)").matches;
  }

  function openMore() {
    window.clearTimeout(moreCloseTimer.current);
    setMoreOpen(true);
  }

  function closeMoreSoon() {
    if (!canHoverDropdown()) return;
    window.clearTimeout(moreCloseTimer.current);
    moreCloseTimer.current = window.setTimeout(() => setMoreOpen(false), 120);
  }

  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMoreOpen(false);
        setMenuOpen(false);
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setMoreOpen(false);
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1051px)");
    const onChange = () => {
      if (media.matches) {
        setMenuOpen(false);
        setMoreOpen(false);
      }
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
    setMoreOpen(false);
  }

  return (
    <nav ref={navRef} className="main-nav" aria-label="Secciones principales">
      <div className="shell nav-bar">
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls={panelId}
          onClick={() => {
            setMenuOpen((open) => !open);
            setMoreOpen(false);
          }}
        >
          <span className="nav-toggle-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          Menú
        </button>

        <div id={panelId} className={menuOpen ? "nav-panel is-open" : "nav-panel"}>
          <div className="nav-links">
            {primaryNav.map(([label, href]) => (
              <Link key={href} href={href} aria-current={isCurrent(pathname, href) ? "page" : undefined}>
                {label}
              </Link>
            ))}

            <div
              className={moreOpen ? "nav-more is-open" : "nav-more"}
              onMouseEnter={() => {
                if (canHoverDropdown()) openMore();
              }}
              onMouseLeave={closeMoreSoon}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                  setMoreOpen(false);
                }
              }}
            >
              <button
                type="button"
                className="nav-more-trigger"
                aria-expanded={moreOpen}
                aria-controls={moreId}
                aria-current={moreActive ? "true" : undefined}
                onClick={() => {
                  if (canHoverDropdown()) {
                    openMore();
                    return;
                  }
                  setMoreOpen((open) => !open);
                }}
                onFocus={() => {
                  if (canHoverDropdown()) openMore();
                }}
              >
                Más deportes
                <svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
                  <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
              <div id={moreId} className={moreOpen ? "nav-dropdown" : "nav-dropdown is-closed"}>
                {moreSports.map(([label, href]) => (
                  <Link key={href} href={href} aria-current={isCurrent(pathname, href) ? "page" : undefined}>
                    {label}
                  </Link>
                ))}
                <Link
                  className="nav-dropdown-all"
                  href={moreSportsHref}
                  aria-current={isCurrent(pathname, moreSportsHref) ? "page" : undefined}
                >
                  Otros deportes
                </Link>
              </div>
            </div>
          </div>

          <div className="nav-panel-extras">
            <form className="nav-search" action="/buscar" role="search">
              <label className="sr-only" htmlFor="nav-search">Buscar noticias</label>
              <input id="nav-search" name="q" type="search" placeholder="Buscar" />
              <button type="submit">Buscar</button>
            </form>
            <div className="nav-utility">
              <Link href="/#radio" onClick={closeMenu}>Radio</Link>
              <Link href="/videos" onClick={closeMenu}>TV</Link>
              <a href="#contacto" onClick={closeMenu}>Contacto</a>
            </div>
          </div>
        </div>

        <Link className="nav-live" href="/#radio"><span /> EN VIVO</Link>
      </div>
      {menuOpen ? <button type="button" className="nav-backdrop" aria-label="Cerrar menú" onClick={closeMenu} /> : null}
    </nav>
  );
}
