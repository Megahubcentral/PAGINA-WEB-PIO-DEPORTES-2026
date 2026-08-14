# Pío Deportes

Portal deportivo editorial de Pío Deportes, construido con Next.js y preparado para usar WordPress como sala de redacción headless.

## Incluye

- Portada de noticias, subportadas por categoría y páginas individuales.
- Integración con entradas, categorías, autores, imágenes y multimedia de WordPress REST API.
- Secciones nacionales e internacionales: MLB, NBA, LIDOM, fútbol, NFL, tenis y otros deportes.
- Clima y hora de Santo Domingo, agenda, marcadores, radio, videoteca Pio TV y buscador.
- Marcadores ordenados por partidos en vivo, terminados y próximos, con conexión deportiva protegida desde el servidor.
- Ubicaciones para Google AdSense y publicidad de venta directa.
- SEO técnico, metadatos sociales, sitemap y robots.
- Configuración de Vercel y contenedor para AWS.

## Configuración

Copiar `.env.example` a `.env.local` y completar, como mínimo:

```text
WORDPRESS_API_URL=https://admin.piodeportes.com/wp-json/wp/v2
NEXT_PUBLIC_SITE_URL=https://www.piodeportes.com
SPORTS_DATA_API_URL=https://feed-seguro.piodeportes.com/scores
SPORTS_DATA_API_KEY=clave-del-proveedor
```

La radio, los resultados deportivos y Google Ads se conectan mediante variables de entorno. Si WordPress o el proveedor deportivo presentan una interrupción, el portal conserva contenido editorial de respaldo y continúa funcionando.

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
