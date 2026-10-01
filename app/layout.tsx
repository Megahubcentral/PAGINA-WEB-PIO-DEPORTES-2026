import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { NewsletterPopup } from "./components/Engagement";
import { BreakingTickerProvider, RadioProvider } from "./components/LiveWidgets";
import { ADSENSE_CLIENT } from "../lib/adsense";
import { organizationJsonLd } from "../lib/seo";
import { getSiteUrl } from "../lib/site";
import { JsonLd } from "./components/JsonLd";
import "./globals.css";
import "./components/MainNav.css";

const GTM_ID = "GTM-5VGC2J7H";

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
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: "window.googletag = window.googletag || {cmd: []};",
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <JsonLd data={organizationJsonLd()} />
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
