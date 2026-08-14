# Pío Deportes

Portal deportivo editorial de Pío Deportes, construido con Next.js y preparado para usar WordPress como sala de redacción headless.

## Incluye

- Portada de noticias, subportadas por categoría y páginas individuales.
- Integración con entradas, categorías, autores, imágenes y multimedia de WordPress REST API.
- Secciones nacionales e internacionales: MLB, NBA, LIDOM, fútbol, NFL, tenis y otros deportes.
- Clima y hora de Santo Domingo, agenda, marcadores, radio, videoteca Pio TV y buscador.
- Marcadores ordenados por partidos en vivo, terminados y próximos, con torneo, fase, temporada y eventos destacados cuando la fuente los ofrece.
- Resultados de loterías dominicanas con búsqueda por fecha, horarios, fuentes identificadas y un resumen compacto en portada.
- Ubicaciones para Google AdSense y publicidad de venta directa.
- SEO técnico, metadatos sociales, sitemap y robots.
- Configuración de Vercel y contenedor para AWS.

## Configuración

Copiar `.env.example` a `.env.local` y completar, como mínimo:

```text
WORDPRESS_API_URL=https://admin.piodeportes.com/wp-json/wp/v2
NEXT_PUBLIC_SITE_URL=https://www.piodeportes.com
BALLDONTLIE_API_KEY=clave-gratuita-de-balldontlie
THESPORTSDB_API_KEY=123
```

La radio, los resultados deportivos y Google Ads se conectan mediante variables de entorno. Los marcadores usan las señales oficiales de MLB para MLB/LIDOM y de NHL para hockey, BALLDONTLIE para NBA/NFL y TheSportsDB para fútbol. Loterías consulta el canal oficial de Loteka e intenta el feed de Loto Real; cuando un canal oficial no puede consumirse de forma segura desde el servidor, usa un respaldo informativo claramente identificado. LEIDSA utiliza ese respaldo mientras su portal oficial no exponga un feed público. La caché del servidor protege los niveles gratuitos y evita llamadas repetidas.

## Desarrollo

Requiere Node.js 22 o superior.

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm test
```

La guía completa para WordPress, Vercel, AWS, publicidad y multimedia está en `DEPLOYMENT.md`.
