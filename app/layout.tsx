import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { NewsletterPopup } from "./components/Engagement";
import { RadioProvider } from "./components/LiveWidgets";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.piodeportes.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pío Deportes | El deporte vive aquí",
    template: "%s | Pío Deportes",
  },
  description:
    "Noticias deportivas de República Dominicana y el mundo: MLB, NBA, LIDOM, fútbol, NFL, tenis, radio y video.",
  icons: {
    icon: "/pio-favicon.png",
    shortcut: "/pio-favicon.png",
    apple: "/pio-favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_DO",
    siteName: "Pío Deportes",
    title: "Pío Deportes | El deporte vive aquí",
    description: "Toda la pasión del deporte dominicano e internacional, en un solo lugar.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Pío Deportes — El deporte vive aquí" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pío Deportes | El deporte vive aquí",
    description: "Noticias, resultados, radio y video para la fanaticada deportiva.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#df0000",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const adsenseClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT;

  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>
        <RadioProvider>
          {children}
          <NewsletterPopup />
        </RadioProvider>
      </body>
      {adsenseClient ? (
        <Script
          async
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
        />
      ) : null}
    </html>
  );
}
