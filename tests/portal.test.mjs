import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("the portal includes its core editorial surfaces", async () => {
  const [page, layout, portal, widgets, wordpress, styles] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("app/components/Portal.tsx", root), "utf8"),
    readFile(new URL("app/components/LiveWidgets.tsx", root), "utf8"),
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
  assert.match(portal, /getLatestArticles\(20\)/);
  assert.match(portal, /BreakingTicker headlines=\{breakingHeadlines\}/);
  assert.match(widgets, /const breakingTickerInterval = 7000/);
  assert.match(widgets, /BreakingTickerProvider/);
  assert.match(widgets, /headlines\.slice\(0, 20\)/);
  assert.match(widgets, /onMouseEnter=\{\(\) => setPaused\(true\)\}/);
  assert.match(layout, /<BreakingTickerProvider>/);
  assert.match(wordpress, /WORDPRESS_API_URL/);
  assert.match(wordpress, /orderby=date&order=desc/);
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

test("free sports providers are server-side, cached and deployment ready", async () => {
  const [provider, route, environment, deployment, scoreboard, styles] = await Promise.all([
    readFile(new URL("lib/free-sports-provider.ts", root), "utf8"),
    readFile(new URL("app/api/scores/route.ts", root), "utf8"),
    readFile(new URL(".env.example", root), "utf8"),
    readFile(new URL("DEPLOYMENT.md", root), "utf8"),
    readFile(new URL("app/components/Scoreboard.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);

  assert.match(provider, /api\.balldontlie\.io/);
  assert.match(provider, /thesportsdb\.com\/api\/v1\/json/);
  assert.match(provider, /statsapi\.mlb\.com\/api/);
  assert.match(provider, /api-web\.nhle\.com\/v1/);
  assert.match(provider, /lookuptimeline\.php/);
  assert.match(provider, /mlbstatic\.com\/team-logos/);
  assert.match(provider, /next: \{ revalidate \}/);
  assert.match(route, /freeSportsFeed/);
  assert.match(scoreboard, /TeamMark/);
  assert.match(styles, /\.team-mark/);
  assert.match(environment, /^BALLDONTLIE_API_KEY=/m);
  assert.match(environment, /^THESPORTSDB_API_KEY=123/m);
  assert.doesNotMatch(environment, /NEXT_PUBLIC_BALLDONTLIE/);
  assert.match(deployment, /Liga de Béisbol Profesional de la República Dominicana/);
  assert.match(deployment, /100 consultas diarias/);
});

test("lottery results use scheduled server-side sources and include the required disclaimer", async () => {
  const [provider, route, page, home, hub, brands, navigation, styles] = await Promise.all([
    readFile(new URL("lib/lottery-provider.ts", root), "utf8"),
    readFile(new URL("app/api/lotteries/route.ts", root), "utf8"),
    readFile(new URL("app/loterias/page.tsx", root), "utf8"),
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/components/LotteryHub.tsx", root), "utf8"),
    readFile(new URL("lib/lottery-brand.ts", root), "utf8"),
    readFile(new URL("app/components/Portal.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);

  assert.match(provider, /ov\.gruporeal\.com\.do\/api\/lr/);
  assert.match(provider, /loteka\.com\.do/);
  assert.match(provider, /enloteria\.com\/resultados-leidsa/);
  assert.match(provider, /refreshPlan/);
  assert.match(provider, /memoryCache/);
  assert.match(route, /s-maxage/);
  assert.match(page, /Pio Deportes publica estos resultados únicamente con fines informativos/);
  assert.match(page, /Juega responsablemente/);
  assert.match(home, /LotteryCompact/);
  assert.match(hub, /lottery-brand-mark/);
  assert.match(brands, /lotteryMonogram/);
  assert.match(navigation, /\["Loterías", "\/loterias"\]/);
  assert.match(styles, /\.lottery-results-grid/);
  assert.match(styles, /\.lottery-brand--leidsa/);
});

test("the homepage Instagram feed is server-side, cached and automatically refreshed", async () => {
  const [home, component, provider, route, environment, deployment, styles] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/components/InstagramFeed.tsx", root), "utf8"),
    readFile(new URL("lib/instagram-provider.ts", root), "utf8"),
    readFile(new URL("app/api/instagram/route.ts", root), "utf8"),
    readFile(new URL(".env.example", root), "utf8"),
    readFile(new URL("DEPLOYMENT.md", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);

  assert.match(home, /<InstagramFeed feed=\{instagramFeed\} \/>/);
  assert.ok(home.indexOf("<InstagramFeed") < home.indexOf("coverage-section"));
  assert.match(component, /currentFeed\.posts\.slice\(0, 10\)/);
  assert.match(component, /setInterval\(refresh, clientRefreshInterval\)/);
  assert.match(provider, /graph\.instagram\.com/);
  assert.match(provider, /Authorization: `Bearer \$\{accessToken\}`/);
  assert.match(route, /s-maxage=600/);
  assert.match(environment, /^INSTAGRAM_ACCESS_TOKEN=$/m);
  assert.doesNotMatch(environment, /NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN/);
  assert.match(deployment, /Instagram API with Instagram Login/);
  assert.match(styles, /\.instagram-grid/);
});
