import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("the portal includes its core editorial surfaces", async () => {
  const [page, layout, portal, widgets, wordpress, styles, category, article] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("app/components/Portal.tsx", root), "utf8"),
    readFile(new URL("app/components/LiveWidgets.tsx", root), "utf8"),
    readFile(new URL("lib/wordpress.ts", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
    readFile(new URL("app/categoria/[slug]/page.tsx", root), "utf8"),
    readFile(new URL("app/noticias/[slug]/page.tsx", root), "utf8"),
  ]);

  assert.match(page, /aesDominicanaWideAd/);
  assert.match(page, /HOME_ADSENSE\.afterPortada/);
  assert.match(page, /HOME_ADSENSE\.afterMlb/);
  assert.match(page, /HOME_ADSENSE\.afterFutbol/);
  assert.match(page, /HOME_ADSENSE\.lower/);
  assert.match(page, /title="Nacionales"/);
  assert.match(page, /title="Béisbol"/);
  assert.match(page, /title="Baloncesto"/);
  assert.match(page, /title="LIDOM"/);
  assert.match(page, /title="NHL"/);
  assert.match(page, /href="\/categoria\/mlb"/);
  assert.match(page, /href="\/categoria\/baloncesto"/);
  assert.match(page, /href="\/categoria\/nhl"/);
  assert.match(portal, /section-heading-title/);
  assert.match(portal, /cometaHeaderAd/);
  assert.match(page, /getCategoryArticles\("mlb", homeNewsQuery\)/);
  assert.match(page, /getCategoryArticles\("nba", nbaQuery\)/);
  assert.match(page, /getCategoryArticles\("lidom", homeNewsQuery\)/);
  assert.match(page, /getCategoryArticles\("futbol-soccer", homeNewsQuery\)/);
  assert.match(page, /getCategoryArticles\("nfl", homeNewsQuery\)/);
  assert.match(page, /getCategoryArticles\("nhl", homeNewsQuery\)/);
  assert.match(page, /sortByNewest/);
  assert.match(page, /\[\.\.\.tennisArticles, \.\.\.caribbeanArticles, \.\.\.otherArticles\]/);
  assert.doesNotMatch(page, /interleaveArticlePools/);
  assert.ok(page.indexOf("HOME_ADSENSE.afterPortada") < page.indexOf('title="LIDOM"'));
  assert.ok(page.indexOf('title="LIDOM"') < page.indexOf('title="Béisbol"'));
  assert.ok(page.indexOf('title="Béisbol"') < page.indexOf("HOME_ADSENSE.afterMlb"));
  assert.ok(page.indexOf("HOME_ADSENSE.afterMlb") < page.indexOf('title="Baloncesto"'));
  assert.ok(page.indexOf('title="Baloncesto"') < page.indexOf('title="Nacionales"'));
  assert.ok(page.indexOf("aesDominicanaWideAd") < page.indexOf('title="Pio TV"'));
  assert.ok(page.indexOf('title="Pio TV"') < page.indexOf('title="Fútbol (Soccer)"'));
  assert.ok(page.indexOf("HOME_ADSENSE.afterFutbol") < page.indexOf('title="NFL"'));
  assert.ok(page.indexOf('title="NFL"') < page.indexOf('title="NHL"'));
  assert.ok(page.indexOf("HOME_ADSENSE.lower") < page.indexOf("<LotteryCompact"));
  assert.ok(page.indexOf("<LotteryCompact") < page.indexOf("more-sports-section"));
  assert.doesNotMatch(page, /Cobertura internacional/);
  assert.doesNotMatch(page, /getInternationalArticles\(5, homeNewsQuery\)/);
  assert.match(page, /homeNewsQuery/);
  assert.match(page, /getArticlesByTag\("destacados", 8, homeNewsQuery\)/);
  assert.match(page, /PORTADA_PLACEMENTS\.hero/);
  assert.match(page, /PORTADA_PLACEMENTS\.below/);
  assert.match(page, /PORTADA_PLACEMENTS\.side/);
  assert.match(page, /getArticlesByEditorialLocation/);
  assert.match(wordpress, /ubicacion_editorial/);
  assert.match(wordpress, /hero: "portada-principal"/);
  assert.match(wordpress, /below: "portada-secundaria"/);
  assert.match(wordpress, /side: "portada-terciaria"/);
  assert.match(wordpress, /PORTADA_PLACEMENT_TERM_IDS/);
  assert.match(wordpress, /"portada-principal": 13419/);
  assert.match(wordpress, /timeoutMs \?\? WP_FETCH_TIMEOUT_MS/);
  assert.match(wordpress, /WP_FETCH_TIMEOUT_MS = 8_000/);
  assert.match(wordpress, /readWordpressSnapshot/);
  assert.match(wordpress, /writeWordpressSnapshot/);
  assert.match(wordpress, /allowEditorialPreview/);
  assert.match(wordpress, /NODE_ENV !== "production"/);
  assert.match(wordpress, /listFieldsQuery/);
  assert.match(wordpress, /_fields=id,slug,date,modified,format,title,excerpt,featured_media/);
  assert.match(wordpress, /excludeEditorialLocations: \[\.\.\.portadaPlacementSlugs\]/);
  assert.match(wordpress, /tags_exclude/);
  assert.match(category, /getCategoryArticles\(slug\)/);
  assert.match(category, /getInternationalArticlePage/);
  assert.doesNotMatch(category, /homeNewsQuery/);
  assert.match(page, /Más deportes/);
  assert.match(page, /more-sports-grid/);
  assert.doesNotMatch(page, /Panorama internacional/);
  assert.doesNotMatch(page, /Más disciplinas/);
  assert.match(page, /VideoCarousel/);
  assert.match(wordpress, /const videoTermSlugs = "videos,video"/);
  assert.match(wordpress, /getVideoTermIds\("tags"\)/);
  assert.match(wordpress, /fetchWordpressVideoPosts/);
  assert.match(wordpress, /isPlayableVideoPost/);
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
  assert.match(layout, /GTM-5VGC2J7H/);
  assert.match(layout, /googletagmanager.com\/ns.html/);
  assert.match(wordpress, /export function sortByNewest/);
  assert.match(wordpress, /publishedTime\(right\.date\) - publishedTime\(left\.date\)/);
  assert.match(wordpress, /\.\.\.sortArticlesByNewest\(primary\)/);
  assert.match(wordpress, /sortByNewest\(posts\.map\(normalizeVideoPost\)\)/);
  assert.match(wordpress, /WORDPRESS_API_URL/);
  assert.match(wordpress, /orderby=date&order=desc/);
  assert.match(wordpress, /categories_exclude/);
  assert.match(wordpress, /getInternationalArticles/);
  assert.match(wordpress, /getInternationalArticlePage/);
  assert.match(wordpress, /isNationalArticle/);
  assert.match(wordpress, /isBasketballCategory/);
  assert.match(wordpress, /getBasketballArticles/);
  assert.match(wordpress, /per_page=\$\{safePerPage\}&page=\$\{safePage\}/);
  assert.match(wordpress, /decodeHtmlEntities/);
  assert.match(wordpress, /decodeWordpressHtml/);
  assert.match(wordpress, /curatedLeadImages/);
  assert.match(wordpress, /getRelatedArticles/);
  assert.match(wordpress, /relatednessScore/);
  assert.match(wordpress, /sharesRelatedCategory/);
  assert.match(wordpress, /200 \+ sharedTags/);
  assert.match(wordpress, /if \(sameCategory\) return 100/);
  assert.match(article, /getRelatedArticles\(article, 4\)/);
  assert.match(article, /Noticias relacionadas/);
  assert.match(article, /related-articles-grid/);
  assert.match(styles, /\.related-articles-grid/);
  assert.match(category, /internacional: \{ title: "Cobertura internacional"/);
  assert.match(category, /nba: \{ title: "NBA"/);
  assert.match(category, /ncaab: \{ title: "NCAAB"/);
  assert.match(category, /getInternationalArticlePage/);
  assert.match(category, /CategoryPagination/);
  assert.match(styles, /aspect-ratio: 7 \/ 5/);
  assert.match(styles, /\.category-pagination/);
  assert.match(styles, /\.category-hero--internacional/);
  assert.match(styles, /\.more-sports-grid/);
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
  assert.match(environment, /BEEHIIV_API_KEY/);
  assert.match(environment, /BEEHIIV_PUBLICATION_ID/);
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

test("lottery and horse-racing results use scheduled server-side sources and include the required disclaimer", async () => {
  const [provider, horseProvider, route, revalidateRoute, horseRoute, page, home, hub, compact, lotteryFeedHook, view, horseHub, brands, navigation, navTree, styles, vercel, environment, deployment] = await Promise.all([
    readFile(new URL("lib/lottery-provider.ts", root), "utf8"),
    readFile(new URL("lib/horse-racing-provider.ts", root), "utf8"),
    readFile(new URL("app/api/lotteries/route.ts", root), "utf8"),
    readFile(new URL("app/api/lotteries/revalidate/route.ts", root), "utf8"),
    readFile(new URL("app/api/horse-racing/route.ts", root), "utf8"),
    readFile(new URL("app/loterias/page.tsx", root), "utf8"),
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/components/LotteryHub.tsx", root), "utf8"),
    readFile(new URL("app/components/LotteryCompact.tsx", root), "utf8"),
    readFile(new URL("app/components/useLotteryFeed.ts", root), "utf8"),
    readFile(new URL("lib/lottery-view.ts", root), "utf8"),
    readFile(new URL("app/components/HorseRacingHub.tsx", root), "utf8"),
    readFile(new URL("lib/lottery-brand.ts", root), "utf8"),
    readFile(new URL("app/components/MainNav.tsx", root), "utf8"),
    readFile(new URL("lib/nav-tree.ts", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
    readFile(new URL("vercel.json", root), "utf8"),
    readFile(new URL(".env.example", root), "utf8"),
    readFile(new URL("DEPLOYMENT.md", root), "utf8"),
  ]);

  assert.match(provider, /ov\.gruporeal\.com\.do\/api\/lr/);
  assert.match(provider, /loteka\.com\.do/);
  assert.match(provider, /enloteria\.com\/resultados-leidsa/);
  assert.match(provider, /enloteria\.com\/resultados-loto-pool/);
  assert.match(provider, /enloteria\.com\/resultados-gana-mas/);
  assert.match(provider, /juega-mas-pega-mas/);
  assert.match(provider, /Juega \+ Pega\+/);
  assert.match(compact, /lottery-home-extras/);
  assert.match(provider, /La Primera/);
  assert.match(provider, /refreshPlan/);
  assert.match(provider, /__pioLotteryCache/);
  assert.match(provider, /cache: "no-store"/);
  assert.match(provider, /unstable_cache/);
  assert.match(provider, /LOTTERY_CACHE_TAG = "lotteries"/);
  assert.match(provider, /invalidateLotteryMemoryCache/);
  assert.match(provider, /followUp = draw \+ 15/);
  assert.match(provider, /now\.getTime\(\) \+ 5 \* 60 \* 1000/);
  assert.match(provider, /revalidate: 300/);
  assert.match(hub, /useLotteryFeed/);
  assert.match(compact, /useLotteryFeed/);
  assert.match(lotteryFeedHook, /\/api\/lotteries/);
  assert.match(lotteryFeedHook, /delayUntilLotteryRefresh/);
  assert.match(lotteryFeedHook, /lotteryFeedNeedsRetry/);
  assert.match(lotteryFeedHook, /setTimeout/);
  assert.match(lotteryFeedHook, /nextRefreshAt/);
  assert.match(lotteryFeedHook, /\/api\/lotteries\?ts=/);
  assert.doesNotMatch(lotteryFeedHook, /cache: "no-store"/);
  assert.doesNotMatch(lotteryFeedHook, /setInterval/);
  assert.doesNotMatch(hub, /setInterval/);
  assert.doesNotMatch(hub, /cache: "no-store"/);
  assert.match(view, /delayUntilLotteryRefresh/);
  assert.match(view, /lotteryFeedNeedsRetry/);
  assert.match(view, /90_000/);
  assert.match(view, /60_000/);
  assert.match(route, /s-maxage/);
  assert.match(route, /stale-while-revalidate=60/);
  assert.match(revalidateRoute, /CRON_SECRET/);
  assert.match(revalidateRoute, /Bearer \$\{secret\}/);
  assert.match(revalidateRoute, /revalidateTag\(LOTTERY_CACHE_TAG/);
  assert.match(revalidateRoute, /revalidatePath\("\/"\)/);
  assert.match(revalidateRoute, /revalidatePath\("\/loterias"\)/);
  assert.match(vercel, /\/api\/lotteries\/revalidate/);
  assert.match(vercel, /"0 17 \* \* \*"/);
  assert.match(vercel, /"35 18 \* \* \*"/);
  assert.match(vercel, /"50 18 \* \* \*"/);
  assert.match(vercel, /"0 20 \* \* 0"/);
  assert.match(vercel, /"5 22 \* \* 0"/);
  assert.match(vercel, /"0 0 \* \* \*"/);
  assert.match(vercel, /"0 1 \* \* 1-6"/);
  assert.match(vercel, /"15 1 \* \* 1-6"/);
  assert.match(environment, /^CRON_SECRET=$/m);
  assert.match(deployment, /CRON_SECRET/);
  assert.match(deployment, /nextRefreshAt/);
  assert.match(home, /export const revalidate = 120/);
  assert.doesNotMatch(home, /force-dynamic/);
  assert.match(horseProvider, /hvc\.com\.do\/wp-json\/wp\/v2\/posts/);
  assert.match(horseProvider, /hipodromo-camarero\.com\/api\/races/);
  assert.match(horseProvider, /refreshPlan/);
  assert.match(horseProvider, /memoryCache/);
  assert.match(horseRoute, /s-maxage/);
  assert.match(page, /Pio Deportes publica estos resultados únicamente con fines informativos/);
  assert.match(page, /HorseRacingHub/);
  assert.match(page, /Juega responsablemente/);
  assert.match(home, /LotteryCompact/);
  assert.match(compact, /Quinielas de hoy/);
  assert.match(hub, /lottery-brand-mark/);
  assert.match(hub, /lottery-board/);
  assert.match(hub, /1er/);
  assert.match(horseHub, /Resultados de carreras/);
  assert.match(horseHub, /Comprobar jornada oficial/);
  assert.match(brands, /lotteryMonogram/);
  assert.match(navigation, /getNavTree\(\)/);
  assert.match(navigation, /href="\/loterias"/);
  assert.match(navTree, /"beisbol"/);
  assert.match(navTree, /"baloncesto"/);
  assert.match(navTree, /"combate"/);
  assert.match(navTree, /"automovilismo"/);
  assert.match(navTree, /"futbol"/);
  assert.match(navTree, /futbol-soccer/);
  assert.match(navTree, /NAV_HIDDEN_SLUGS/);
  assert.match(navTree, /"mma"/);
  assert.match(navTree, /"ufc"/);
  assert.doesNotMatch(navigation, /["']MMA["']|["']UFC["']|\/categoria\/mma|\/categoria\/ufc/);
  assert.match(styles, /\.lottery-results-grid/);
  assert.match(styles, /\.lottery-board/);
  assert.match(styles, /\.lottery-quiniela/);
  assert.match(styles, /\.lottery-brand--leidsa/);
  assert.match(styles, /\.lottery-brand--primera/);
  assert.match(styles, /\.horse-meetings-grid/);
});

test("WordPress last-good cache keeps authentic newsroom data during CMS outages", async () => {
  const [wordpress, cache, services, environment, deployment] = await Promise.all([
    readFile(new URL("lib/wordpress.ts", root), "utf8"),
    readFile(new URL("lib/wordpress-cache.ts", root), "utf8"),
    readFile(new URL("lib/server-services.ts", root), "utf8"),
    readFile(new URL(".env.example", root), "utf8"),
    readFile(new URL("DEPLOYMENT.md", root), "utf8"),
  ]);

  assert.match(cache, /wp:last-good:v1:/);
  assert.match(cache, /WP_LAST_GOOD_TTL_SECONDS = 60 \* 60 \* 24 \* 3/);
  assert.match(cache, /SETEX/);
  assert.match(wordpress, /writeWordpressSnapshot\(path, result\)/);
  assert.match(wordpress, /return stale\(\)/);
  assert.doesNotMatch(wordpress, /timeoutMs \?\? 45000/);
  assert.match(wordpress, /withEditorialPreview/);
  assert.match(wordpress, /previewOrEmpty/);
  assert.match(services, /AbortSignal\.timeout\(2_500\)/);
  assert.match(environment, /última respuesta válida de WordPress/);
  assert.match(deployment, /última respuesta válida/);
  assert.match(deployment, /72 horas/);
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
  assert.ok(home.indexOf("more-sports-section") < home.indexOf("<InstagramFeed"));
  assert.match(component, /currentFeed\.posts\.slice\(0, 10\)/);
  assert.match(component, /setInterval\(refresh, clientRefreshInterval\)/);
  assert.match(provider, /graph\.instagram\.com/);
  assert.match(provider, /Authorization: `Bearer \$\{accessToken\}`/);
  assert.match(route, /s-maxage=600/);
  assert.match(environment, /^INSTAGRAM_ACCESS_TOKEN=$/m);
  assert.doesNotMatch(environment, /NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN/);
  assert.match(deployment, /Instagram API with Instagram Login/);
  assert.match(deployment, /Pio TV — guía para el equipo de WordPress/);
  assert.match(deployment, /Etiqueta `videos` o `video`/);
  assert.match(deployment, /Formato de la entrada: \*\*Video\*\*/);
  assert.match(styles, /\.instagram-grid/);
});

test("SEO technical signals cover canonicals, structured data, sitemaps and real 404s", async () => {
  const [seo, layout, home, robots, sitemapIndex, sitemapPages, sitemapNewsChunk, sitemapLib, wordpress, article, video, category, search, newsSitemap, proxy, notFound, nextConfig, portal, styles] = await Promise.all([
    readFile(new URL("lib/seo.ts", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/robots.ts", root), "utf8"),
    readFile(new URL("app/sitemap.xml/route.ts", root), "utf8"),
    readFile(new URL("app/sitemap-pages.xml/route.ts", root), "utf8"),
    readFile(new URL("app/sitemap-noticias/[chunk]/route.ts", root), "utf8"),
    readFile(new URL("lib/sitemaps.ts", root), "utf8"),
    readFile(new URL("lib/wordpress.ts", root), "utf8"),
    readFile(new URL("app/noticias/[slug]/page.tsx", root), "utf8"),
    readFile(new URL("app/videos/[slug]/page.tsx", root), "utf8"),
    readFile(new URL("app/categoria/[slug]/page.tsx", root), "utf8"),
    readFile(new URL("app/buscar/page.tsx", root), "utf8"),
    readFile(new URL("app/news-sitemap.xml/route.ts", root), "utf8"),
    readFile(new URL("proxy.ts", root), "utf8"),
    readFile(new URL("app/not-found.tsx", root), "utf8"),
    readFile(new URL("next.config.ts", root), "utf8"),
    readFile(new URL("app/components/Portal.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);

  assert.match(seo, /canonicalUrl/);
  assert.match(seo, /NewsArticle/);
  assert.match(seo, /Organization/);
  assert.match(seo, /BreadcrumbList/);
  assert.match(seo, /VideoObject/);
  assert.match(seo, /alternates: \{ canonical: url \}/);
  assert.match(layout, /organizationJsonLd/);
  assert.match(home, /homeMetadata/);
  assert.match(robots, /news-sitemap\.xml/);
  assert.match(robots, /sitemap\.xml/);
  assert.match(sitemapIndex, /sitemapIndexXml/);
  assert.match(sitemapIndex, /sitemap-pages\.xml/);
  assert.match(sitemapIndex, /sitemap-noticias-/);
  assert.match(sitemapPages, /SITEMAP_PAGE_PATHS/);
  assert.match(sitemapNewsChunk, /getSitemapNewsChunk/);
  assert.match(sitemapLib, /sitemapindex/);
  assert.match(nextConfig, /sitemap-noticias-:chunk/);
  assert.match(wordpress, /dateModified/);
  assert.match(wordpress, /getSitemapIndexMeta/);
  assert.match(wordpress, /getSitemapNewsChunk/);
  assert.match(wordpress, /getSitemapVideos/);
  assert.match(wordpress, /getNewsSitemapEntries/);
  assert.match(wordpress, /newsWindowMs = 48/);
  assert.match(wordpress, /SITEMAP_NEWS_CHUNK_SIZE = 1000/);
  assert.doesNotMatch(wordpress, /sitemapPageCap = 50/);
  assert.doesNotMatch(wordpress, /getSitemapContent/);
  assert.doesNotMatch(wordpress, /\?\? fallbackArticles\[0\]/);
  assert.doesNotMatch(wordpress, /\?\? fallbackVideos\[0\]/);
  assert.match(article, /notFound\(\)/);
  assert.match(article, /newsArticleJsonLd/);
  assert.match(article, /breadcrumbJsonLd/);
  assert.match(article, /dateTime=\{article\.date\}/);
  assert.match(article, /article-hero-frame/);
  assert.match(video, /videoObjectJsonLd/);
  assert.match(video, /notFound\(\)/);
  assert.match(category, /profile\.description/);
  assert.match(category, /index: page === 1/);
  assert.doesNotMatch(category, /Actualizado hace 6 minutos/);
  assert.match(category, /Actualizado \{lead\.publishedAt\}/);
  assert.match(home, /hero\.imageAlt \|\| hero\.title/);
  assert.match(portal, /article\.imageAlt \|\| article\.title/);
  assert.match(wordpress, /editorialExcerpt/);
  assert.match(wordpress, /videoDurationFromPost/);
  assert.doesNotMatch(wordpress, /duration: "Video"/);
  assert.match(styles, /article-hero-frame/);
  assert.match(styles, /aspect-ratio: 16 \/ 9/);
  assert.match(search, /index: false/);
  assert.match(newsSitemap, /force-dynamic/);
  assert.match(newsSitemap, /news:publication_date/);
  assert.match(newsSitemap, /news:name/);
  assert.match(newsSitemap, /<news:language>es<\/news:language>/);
  assert.match(proxy, /export function proxy/);
  assert.match(proxy, /status: 410/);
  assert.match(proxy, /x-robots-tag/);
  assert.match(notFound, /index: false/);
});

