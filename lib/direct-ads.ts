export type DirectAdAsset = {
  src: string;
  width: number;
  height: number;
};

export type DirectAdSource = {
  media: string;
  asset: DirectAdAsset;
};

export type DirectAdCreative = {
  href: string;
  alt: string;
  desktop: DirectAdAsset;
  mobile?: DirectAdAsset;
  wide?: DirectAdAsset;
  /** Extra <source> entries, first matching media wins. Overrides mobile/wide when set. */
  sources?: DirectAdSource[];
};

function adAsset(folder: string, file: string, width: number, height: number): DirectAdAsset {
  return {
    src: `/ads/${folder}/${file.replaceAll(" ", "%20")}`,
    width,
    height,
  };
}

export const cometaHeaderAd: DirectAdCreative = {
  href: "https://grupocometa.com.do/",
  alt: "Grupo Cometa",
  desktop: adAsset("cometa", "COMETA.gif", 728, 90),
  sources: [
    { media: "(max-width: 430px)", asset: adAsset("cometa", "BANNER MOVIL 300X50.gif", 300, 50) },
    { media: "(max-width: 760px)", asset: adAsset("cometa", "BANNER MOVIL 320X50.gif", 320, 50) },
    { media: "(max-width: 992px)", asset: adAsset("cometa", "BANNER 468X60.gif", 468, 60) },
  ],
};

export const aesDominicanaWideAd: DirectAdCreative = {
  href: "https://www.aesdominicana.com/es",
  alt: "AES Dominicana",
  desktop: adAsset("aes-dominicana", "BANNER 728X90.webp", 728, 90),
  sources: [
    { media: "(max-width: 480px)", asset: adAsset("aes-dominicana", "BANNER MOVIL 300X125.webp", 300, 125) },
    { media: "(max-width: 760px)", asset: adAsset("aes-dominicana", "BANNER MOVIL 320X100.webp", 320, 100) },
    { media: "(max-width: 992px)", asset: adAsset("aes-dominicana", "BANNER 468X60.webp", 468, 60) },
    { media: "(min-width: 1100px)", asset: adAsset("aes-dominicana", "BANNER 970X90.webp", 970, 90) },
  ],
};

export const arsFuturoSidebarAd: DirectAdCreative = {
  href: "https://www.arsfuturo.com/",
  alt: "ARS Futuro",
  desktop: adAsset("ars-futuro", "BANNER ARS FUTURO (300X600).png", 300, 600),
  mobile: adAsset("ars-futuro", "BANNER ARS FUTURO (300X250).png", 300, 250),
};

export const dominosSidebarAd: DirectAdCreative = {
  href: "https://www.dominos.com.do/",
  alt: "Domino's",
  desktop: adAsset("dominos", "BANNER DOMINOS VERTICAL.png", 300, 600),
  mobile: adAsset("dominos", "BANNER DOMINOS CUADRADO.png", 300, 250),
};
