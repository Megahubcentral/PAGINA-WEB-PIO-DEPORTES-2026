import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "./components/Portal";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "Esta dirección ya no existe en Pío Deportes.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main>
        <header className="page-hero">
          <div className="shell">
            <span className="eyebrow">Error 404</span>
            <h1>Esta página no está disponible</h1>
            <p>La dirección no tiene un equivalente en el sitio actual. Prueba la portada o el buscador.</p>
            <p><Link href="/">Volver a la portada</Link></p>
          </div>
        </header>
      </main>
      <SiteFooter />
    </>
  );
}
