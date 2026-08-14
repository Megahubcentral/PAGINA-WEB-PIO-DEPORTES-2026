import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("the portal includes its core editorial surfaces", async () => {
  const [page, layout, wordpress, styles] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("lib/wordpress.ts", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);

  assert.match(page, /Deporte dominicano/);
  assert.match(page, /Pio TV/);
  assert.match(page, /VideoCarousel/);
  assert.match(page, /ScoreStrip/);
  assert.match(page, /AdSlot/);
  assert.match(layout, /Pío Deportes \| El deporte vive aquí/);
  assert.match(layout, /\/og\.png/);
  assert.match(wordpress, /WORDPRESS_API_URL/);
  assert.match(wordpress, /_embed=wp:featuredmedia/);
  assert.match(wordpress, /curatedLeadImages/);
  assert.match(styles, /aspect-ratio: 7 \/ 5/);
  assert.match(styles, /prefers-reduced-motion/);
});

test("production assets and deployment recipes are present", async () => {
  await Promise.all([
    access(new URL("public/pio-logo-original.png", root)),
    access(new URL("public/pio-logo-white.png", root)),
    access(new URL("app/marcadores/page.tsx", root)),
    access(new URL("app/videos/page.tsx", root)),
    access(new URL("public/og.png", root)),
    access(new URL("vercel.json", root)),
    access(new URL("Dockerfile", root)),
    access(new URL("DEPLOYMENT.md", root)),
  ]);
});

test("commercial, privacy and audience engagement surfaces are wired", async () => {
  const [advertising, terms, engagement, environment] = await Promise.all([
    readFile(new URL("app/anunciate/page.tsx", root), "utf8"),
    readFile(new URL("app/terminos/page.tsx", root), "utf8"),
    readFile(new URL("app/components/Engagement.tsx", root), "utf8"),
    readFile(new URL(".env.example", root), "utf8"),
  ]);

  assert.match(advertising, /AdvertisingForm/);
  assert.match(terms, /Ley núm\. 172-13/);
  assert.match(terms, /info@piodeportes\.com/);
  assert.match(engagement, /newsletter-popup/);
  assert.match(engagement, /OneSignal/);
  assert.match(environment, /ADVERTISING_INBOX/);
  assert.match(environment, /UPSTASH_REDIS_REST_URL/);
  assert.match(environment, /NEXT_PUBLIC_ONESIGNAL_APP_ID/);
  await access(new URL("public/OneSignalSDKWorker.js", root));
  await access(new URL("app/manifest.ts", root));
});
