import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pío Deportes",
    short_name: "Pío Deportes",
    description: "Noticias, resultados, radio y video deportivo de República Dominicana y el mundo.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f3ef",
    theme_color: "#df0000",
    lang: "es-DO",
    categories: ["sports", "news", "entertainment"],
    icons: [
      { src: "/pio-favicon.png", sizes: "256x256", type: "image/png" },
      { src: "/pio-favicon.png", sizes: "256x256", type: "image/png", purpose: "maskable" },
    ],
  };
}
