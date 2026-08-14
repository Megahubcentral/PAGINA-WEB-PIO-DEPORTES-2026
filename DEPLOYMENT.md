# Pío Deportes — publicación y operación

## WordPress como sala de redacción

El portal funciona en modalidad headless: periodistas y editores crean entradas, categorías, imágenes destacadas, galerías y contenido multimedia en WordPress; la portada las recibe por la API REST y se actualiza cada dos minutos.

1. Instalar WordPress en `admin.piodeportes.com` o el dominio editorial elegido.
2. Conservar los tipos nativos `posts`, `categories`, `tags` y `media`.
3. Definir `WORDPRESS_API_URL=https://admin.piodeportes.com/wp-json/wp/v2` en el proveedor de hosting.
4. Usar estos slugs de categoría para mantener la navegación automática: `nacionales`, `mlb`, `nba`, `lidom`, `futbol`, `nfl`, `tenis`, `voleibol`, `beisbol-del-caribe` y `otros-deportes`.
5. Crear la categoría `videos` para alimentar automáticamente el archivo Pio Play. También se reconocen las entradas publicadas con formato de WordPress `video`.

Si la API no responde, la portada conserva contenido editorial de respaldo y nunca queda vacía.

## Vercel — opción recomendada

Importar el repositorio, añadir las variables de `.env.example` y publicar. Vercel detecta Next.js y utiliza la configuración incluida. Apuntar `www.piodeportes.com` al proyecto cuando la versión haya sido aprobada.

## AWS

El `Dockerfile` incluido produce una imagen de producción autocontenida. Puede ejecutarse en AWS App Runner, ECS/Fargate o Elastic Beanstalk, exponiendo el puerto 3000 y usando las mismas variables de entorno.

## Marcadores deportivos en producción

La interfaz consulta `/api/scores` cada 30 segundos. Esta ruta se ejecuta en el servidor de Next.js, conserva la clave fuera del navegador, ordena los encuentros como `live`, `finished` y `upcoming`, y utiliza una caché breve para proteger la cuota del proveedor. Funciona como una Vercel Function o dentro del contenedor de AWS sin cambiar el código.

Configurar estas variables en producción y en los entornos previos a la publicación:

```text
SPORTS_DATA_API_URL=https://feed-seguro.piodeportes.com/scores
SPORTS_DATA_API_KEY=clave-del-proveedor
SPORTS_DATA_API_HEADER=x-apisports-key
SPORTS_DATA_PROVIDER_NAME=API-Sports
```

`SPORTS_DATA_API_URL` debe apuntar al adaptador contratado por Pio Deportes y devolver JSON normalizado con esta forma:

```json
{
  "games": [
    {
      "id": "liga-partido-fecha",
      "sport": "MLB",
      "away": "NYY",
      "awayFull": "New York Yankees",
      "home": "BOS",
      "homeFull": "Boston Red Sox",
      "score": "4 — 2",
      "status": "7ma entrada",
      "detail": "2 outs",
      "venue": "Fenway Park",
      "state": "live"
    }
  ],
  "schedule": [],
  "updatedAt": "2026-08-13T22:00:00-04:00",
  "refreshSeconds": 30
}
```

Los deportes aceptados actualmente son `MLB`, `NBA`, `LIDOM`, `Fútbol`, `Voleibol` y `Tenis`. Los estados aceptados son `live`, `finished` y `upcoming`. Si el proveedor no responde, la página conserva datos editoriales de respaldo para mantener disponible la sección.

## Publicidad y multimedia

- Google Ads: completar el cliente y los IDs de slots en las variables públicas.
- Venta directa: sustituir cualquier bloque `AdSlot` por una creatividad enlazada o conectarlo al ad server contratado.
- Radio: la señal pública asociada a TuneIn (`Pio Deportes 1080`, estación 182264) queda configurada por defecto como MP3 a 192 kbps. `NEXT_PUBLIC_RADIO_STREAM_URL` permite sustituirla si cambia el proveedor.
- Pio Play: publicar cada pieza en la categoría `videos`, asignar una imagen destacada y colocar como primer bloque un video nativo o embed de YouTube/Vimeo. El portal lo convierte en una pieza de la videoteca, separada de las noticias.
- Video dentro de una noticia: en Gutenberg, añadir un bloque **Video**, **YouTube**, **Vimeo** o **Incrustado** en cualquier punto del cuerpo. El portal conserva su posición y lo presenta automáticamente en formato panorámico 16:9.
- Para distribución de alto tráfico conviene usar YouTube, Vimeo, Mux o Cloudflare Stream en vez de servir archivos pesados directamente desde WordPress.

## Formularios, boletín y ventana de suscripción

El formulario de **Anúnciate** envía la solicitud desde `/api/advertising`; el destinatario queda exclusivamente en una variable del servidor y nunca se incluye en el HTML público. Para producción:

1. Crear una cuenta en Resend, verificar `piodeportes.com` y generar una API key.
2. Configurar `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` y `ADVERTISING_INBOX` con los valores indicados en `.env.example`.
3. Hacer una prueba real desde el dominio de producción y confirmar recepción, respuesta y carpeta de spam.

La suscripción al boletín acepta dos integraciones complementarias:

- `NEWSLETTER_WEBHOOK_URL`, para conectar Mailchimp, Brevo, HubSpot u otra plataforma mediante webhook.
- Upstash Redis, que almacena el conjunto de correos cuando se configuran `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`.

La invitación emergente usa la misma base Redis para registrar un identificador HMAC de la IP sin guardar la dirección legible. La operación `SET ... NX` garantiza que se muestre una sola vez por IP incluso entre navegadores o dispositivos de la misma red. `NEWSLETTER_POPUP_SALT` debe ser una cadena privada, larga y aleatoria. Sin Redis, el portal conserva un respaldo por cookie que evita repeticiones en ese navegador, pero no puede garantizar el control entre dispositivos.

## Alertas deportivas en macOS y Windows

El portal incluye manifest web, service worker y una activación voluntaria en el pie de página. La entrega se administra con OneSignal para recibir Web Push aun cuando el portal no esté abierto.

1. Crear una aplicación Web Push en OneSignal con origen `https://www.piodeportes.com`.
2. Configurar `NEXT_PUBLIC_ONESIGNAL_APP_ID` en Vercel o AWS.
3. Confirmar que `/OneSignalSDKWorker.js` responde como JavaScript y no redirige.
4. Probar el permiso mediante el botón **Activar alertas deportivas** en Chrome, Edge y Safari sobre HTTPS.
5. En OneSignal, limitar los envíos a noticias verdaderamente importantes y ofrecer siempre la salida desde la configuración del navegador.

En iPhone y iPad, Apple exige instalar el portal en la pantalla de inicio; en macOS y Windows las notificaciones se integran con el centro de notificaciones del sistema a través de un navegador compatible.
