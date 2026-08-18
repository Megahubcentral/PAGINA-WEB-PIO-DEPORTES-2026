# Pío Deportes — publicación y operación

## WordPress como sala de redacción

El portal funciona en modalidad headless: periodistas y editores crean entradas, categorías, imágenes destacadas, galerías y contenido multimedia en WordPress; la portada las recibe por la API REST y se actualiza cada dos minutos.

1. Instalar WordPress en `piod.axworkflow.com` o el dominio editorial elegido.
2. Conservar los tipos nativos `posts`, `categories`, `tags` y `media`.
3. Definir `WORDPRESS_API_URL=https://piod.axworkflow.com/wp-json/wp/v2` en el proveedor de hosting.
4. Usar estos slugs de categoría para mantener la navegación automática: `nacionales`, `mlb`, `nba`, `lidom`, `futbol`, `nfl`, `tennis`, `beisbol-del-caribe` y `otros-deportes`.
5. Crear la categoría `videos` para alimentar automáticamente el archivo Pio Play. También se reconocen las entradas publicadas con formato de WordPress `video`.

Si la API no responde, la portada conserva contenido editorial de respaldo y nunca queda vacía.

## Instagram de Pio Deportes

La portada consulta las diez publicaciones más recientes de `@piodeportes` mediante la API oficial para cuentas profesionales. La ruta interna `/api/instagram` conserva el token fuera del navegador, ordena el contenido por fecha y usa una caché de diez minutos. El bloque vuelve a consultar esa ruta mientras el visitante permanece en la portada, por lo que las nuevas publicaciones aparecen sin modificar el sitio.

1. Confirmar que `@piodeportes` sea una cuenta **Business** o **Creator**.
2. Crear una aplicación Business en Meta y habilitar **Instagram API with Instagram Login**.
3. Autorizar la cuenta propia con el permiso básico profesional y generar un token de larga duración.
4. Configurar en Vercel, AWS y `.env.local`:

```text
INSTAGRAM_ACCESS_TOKEN=token-privado-de-meta
INSTAGRAM_USER_ID=me
INSTAGRAM_API_VERSION=v25.0
```

El token nunca debe utilizar el prefijo `NEXT_PUBLIC_`. Si todavía no se configura o Meta interrumpe temporalmente la consulta, la portada muestra una invitación limpia al perfil oficial en lugar de publicaciones inventadas. Conviene programar una revisión del token antes de su vencimiento y renovarlo desde Meta cuando corresponda.

## Vercel — opción recomendada

Importar el repositorio, añadir las variables de `.env.example` y publicar. Vercel detecta Next.js, instala con pnpm y usa Node 22. Apuntar `www.piodeportes.com` al proyecto cuando la versión haya sido aprobada.

Variables mínimas para que el build y la portada salgan con noticias reales:

```text
WORDPRESS_API_URL=https://piod.axworkflow.com/wp-json/wp/v2
NEXT_PUBLIC_SITE_URL=https://www.piodeportes.com
```

Si `WORDPRESS_API_URL` no está en el panel, el build usa esa misma API por defecto. El resto de claves (Instagram, Resend, Redis, AdSense, OneSignal, BALLDONTLIE) se pueden añadir después; el sitio publica igual con respaldos.

## AWS

El `Dockerfile` incluido produce una imagen de producción autocontenida. Puede ejecutarse en AWS App Runner, ECS/Fargate o Elastic Beanstalk, exponiendo el puerto 3000 y usando las mismas variables de entorno.

## Marcadores deportivos en producción

La interfaz consulta `/api/scores` cada 60 segundos. Esta ruta se ejecuta en el servidor de Next.js, conserva las claves fuera del navegador, ordena los encuentros como `live`, `finished` y `upcoming`, y utiliza caché compartida para proteger las cuotas gratuitas. Funciona como una Vercel Function o dentro del contenedor de AWS sin cambiar el código ni la interfaz visual.

La combinación gratuita incorporada es:

- **MLB Stats API:** señal oficial sin API key para MLB y para la Liga de Béisbol Profesional de la República Dominicana (liga 131). Entrega competencia, temporada, estado, entrada, conteo, estadio y jugadas anotadoras durante partidos en vivo.
- **NHL:** señal oficial sin API key para calendario, resultados, periodo, reloj, goles y asistencias de NHL. Durante la pausa de temporada es normal que el filtro no muestre encuentros.
- **BALLDONTLIE:** partidos, marcadores y periodo de NBA y NFL. El endpoint de juegos forma parte del plan gratuito de cinco consultas por minuto; la jugada por jugada no está incluida en ese nivel.
- **TheSportsDB:** calendarios, torneo, temporada, ronda y resultados recientes de Premier League, LaLiga y Champions League. La cronología v1 gratuita entrega hasta cinco eventos por partido; la interfaz los identifica como eventos destacados. El livescore v2 y una cronología más amplia requieren Premium.

1. Crear una cuenta gratuita en `https://app.balldontlie.io/` y copiar la API key.
2. Configurar en Vercel, AWS y `.env.local`:

```text
BALLDONTLIE_API_KEY=clave-gratuita-de-balldontlie
THESPORTSDB_API_KEY=123
```

TheSportsDB no requiere registro para el nivel utilizado. Sin `BALLDONTLIE_API_KEY`, MLB, LIDOM, NHL y fútbol continúan funcionando; NBA y NFL no se consultan hasta que se configure esa clave.

**Baloncesto dominicano:** API-Sports confirma cobertura de ligas de República Dominicana, incluida LNB. Su nivel gratuito permite 100 consultas diarias por disciplina: alcanza para un calendario o corte de resultados con caché amplia, pero no para actualizar un livescore cada minuto. Para cobertura continua su plan Pro de API-Basketball parte de US$15 al mes (7,500 consultas diarias). Por esa razón no se presenta información LNB incompleta como si fuera en vivo; puede conectarse mediante el adaptador normalizado cuando Pío Deportes elija el plan.

**Alcance editorial recomendado:** la primera prioridad de orden es MLB, LIDOM, NBA, baloncesto dominicano, NFL, fútbol internacional y NHL. Dentro de cada disciplina, los partidos en vivo aparecen primero, después los terminados y por último los próximos.

### Proveedor normalizado opcional

Si Pío Deportes obtiene un feed de una liga, federación o proveedor adicional, se puede hacer que tenga prioridad mediante:

```text
SPORTS_DATA_API_URL=https://feed-seguro.piodeportes.com/scores
SPORTS_DATA_API_KEY=clave-del-proveedor
SPORTS_DATA_API_HEADER=x-api-key
SPORTS_DATA_PROVIDER_NAME=Proveedor oficial
```

`SPORTS_DATA_API_URL` debe devolver JSON normalizado con esta forma:

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
      "state": "live",
      "competition": "MLB",
      "stage": "Temporada regular",
      "season": "2026",
      "incidents": [
        {
          "id": "jugada-1",
          "time": "Alta 7ª",
          "kind": "score",
          "label": "Jonrón de dos carreras",
          "score": "4–2"
        }
      ]
    }
  ],
  "schedule": [],
  "updatedAt": "2026-08-13T22:00:00-04:00",
  "refreshSeconds": 30
}
```

Los deportes aceptados actualmente son `MLB`, `LIDOM`, `NBA`, `Baloncesto RD`, `NFL`, `Fútbol`, `Hockey`, `Voleibol` y `Tenis`. Los estados aceptados son `live`, `finished` y `upcoming`. Si todos los proveedores fallan, la página conserva datos editoriales de respaldo para mantener disponible la sección.

## Resultados de loterías

La ruta `/loterias` y el resumen de portada comparten una sola caché del servidor. No se expone ninguna credencial en el navegador:

- **Loto Real:** se intenta primero el feed publicado por Grupo Real. Si su certificado no puede validarse de forma segura desde Node, entra un respaldo informativo identificado; nunca se desactiva la validación TLS.
- **Loteka:** resultados publicados directamente en el portal oficial de Loteka.
- **LEIDSA:** su web oficial no ofrece actualmente una API o RSS público estable; se consulta un respaldo informativo con datos estructurados y cada resultado queda marcado como tal, con enlace para verificar en la fuente.

La actualización se adapta al calendario dominicano. Durante los 50 minutos posteriores a los horarios principales de 12:55 p. m., 2:30 p. m., 7:55 p. m., 8:55 p. m. y 9:00 p. m. la caché dura cinco minutos. Fuera de esas ventanas dura treinta minutos. Los domingos se aplican los horarios especiales de LEIDSA y Lotería Nacional. Así se evita consultar continuamente datos que no cambian entre sorteos.

La API interna `/api/lotteries` agrega `s-maxage` y `stale-while-revalidate`, por lo que Vercel o la capa CDN de AWS puede servir el mismo resultado a muchos visitantes sin repetir llamadas a las fuentes. Conviene revisar los horarios y condiciones de uso de cada operador trimestralmente.

### Resultados hípicos

La misma sección incorpora resultados de carreras de dos hipódromos oficiales, sin claves de API ni servicios de pago:

- **Hipódromo V Centenario (República Dominicana):** consulta las publicaciones oficiales de resultados expuestas por WordPress y presenta los ganadores que la fuente identifica en cada jornada.
- **Hipódromo Camarero (Puerto Rico):** consulta los resultados oficiales por fecha y el detalle de cada carrera. Cuando la fuente incluye ejemplar ganador y dividendo, se muestran; si no pueden normalizarse con seguridad, el portal enlaza el resultado oficial sin inventar información.

La API interna `/api/horse-racing` conserva una caché de quince minutos durante las ventanas habituales de carreras y de seis horas fuera de ellas. También incluye `stale-while-revalidate`, de modo que Vercel o AWS puede atender muchas visitas sin repetir la consulta en los portales oficiales. El diseño siempre identifica el hipódromo y ofrece el enlace de verificación original.

Estas fuentes son públicas pero no constituyen APIs documentadas con garantía contractual. Conviene revisar trimestralmente su estructura y sus condiciones de uso. El aviso legal de Loterías también cubre los resultados hípicos: Pío Deportes los transmite con fines informativos y cada jugada, dividendo o premio debe confirmarse en el canal oficial correspondiente.

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
