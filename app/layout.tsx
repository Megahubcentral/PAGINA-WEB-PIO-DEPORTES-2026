import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { NewsletterPopup } from "./components/Engagement";
import { BreakingTickerProvider, RadioProvider } from "./components/LiveWidgets";
import { ADSENSE_CLIENT } from "../lib/adsense";
import { getSiteUrl } from "../lib/site";
import "./globals.css";
import "./components/MainNav.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
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
  other: {
    "google-adsense-account": ADSENSE_CLIENT,
  },
};

export const viewport: Viewport = {
  themeColor: "#df0000",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <RadioProvider>
          <BreakingTickerProvider>
            {children}
            <NewsletterPopup />
            <Analytics />
          </BreakingTickerProvider>
        </RadioProvider>
      </body>
    </html>
  );
}
