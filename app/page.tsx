/* eslint-disable @next/next/no-img-element -- Local editorial assets are pre-compressed and WordPress can return remote media. */
import Link from "next/link";
import { AudioPlayer, AdSlot } from "./components/LiveWidgets";
import { RotatingHomeSidebarAd } from "./components/DirectAds";
import { ADSENSE_SLOTS } from "../lib/adsense";
import { aesDominicanaWideAd } from "../lib/direct-ads";
import { ArticleCard, SectionHeading, SiteFooter, SiteHeader } from "./components/Portal";
import { ScoreStrip } from "./components/Scoreboard";
import { VideoCarousel } from "./components/VideoCarousel";
import { LotteryCompact } from "./components/LotteryCompact";
import { InstagramFeed } from "./components/InstagramFeed";
import { getArticlesByTag, getCategoryArticles, getVideoItems, homeNewsQuery, type Article } from "../lib/wordpress";
import { getLotteryFeed } from "../lib/lottery-provider";
import { getInstagramFeed } from "../lib/instagram-provider";

export const revalidate = 120;

function takeUnique(pool: Article[], count: number, used: Set<string>) {
  const selected: Article[] = [];
  for (const article of pool) {
    if (used.has(article.slug)) continue;
    used.add(article.slug);
    selected.push(article);
    if (selected.length === count) break;
  }
  return selected;
}

function interleaveArticlePools(...pools: Article[][]) {
  const longest = Math.max(...pools.map((pool) => pool.length));
  return Array.from({ length: longest }, (_, index) => pools.map((pool) => pool[index]))
    .flat()
    .filter((article): article is Article => Boolean(article));
}

function HomeFeatureBlock({
  kicker,
  title,
  href,
  articles,
  reverse = false,
  contrast = false,
}: {
  kicker: string;
  title: string;
  href: string;
  articles: Article[];
  reverse?: boolean;
  contrast?: boolean;
}) {
  const lead = articles[0];
  const stack = articles.slice(1, 5);
  if (!lead) return null;

  return (
    <section className={contrast ? "home-sport-section is-contrast" : "home-sport-section"}>
      <div className="shell">
        <SectionHeading kicker={kicker} title={title} href={href} />
        <div className={reverse ? "feature-pair reverse" : "feature-pair"}>
          <ArticleCard article={lead} />
          <div className="headline-stack">
            {stack.map((article) => (
              <ArticleCard key={article.id} article={article} compact />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  const nbaQuery = { ...homeNewsQuery, exactCategory: true };
  const [
    portadaArticles,
    destacadosArticles,
    videos,
    nationalArticles,
    mlbArticles,
    nbaArticles,
    lidomArticles,
    footballArticles,
    nflArticles,
    hockeyArticles,
    tennisArticles,
    caribbeanArticles,
    otherArticles,
    lotteryFeed,
    instagramFeed,
  ] = await Promise.all([
    getArticlesByTag("portada", 5),
    getArticlesByTag("destacados", 8, homeNewsQuery),
    getVideoItems(6),
    getCategoryArticles("nacionales", homeNewsQuery),
    getCategoryArticles("mlb", homeNewsQuery),
    getCategoryArticles("nba", nbaQuery),
    getCategoryArticles("lidom", homeNewsQuery),
    getCategoryArticles("futbol", homeNewsQuery),
    getCategoryArticles("nfl", homeNewsQuery),
    getCategoryArticles("nhl", homeNewsQuery),
    getCategoryArticles("tennis", homeNewsQuery),
    getCategoryArticles("beisbol-del-caribe", homeNewsQuery),
    getCategoryArticles("otros-deportes", homeNewsQuery),
    getLotteryFeed(),
    getInstagramFeed(),
  ]);

  const usedArticles = new Set<string>();
  const topStories = takeUnique(portadaArticles, 5, usedArticles);
  const hero = topStories[0];
  const sideStories = topStories.slice(1, 3);
  const moreStories = topStories.slice(3, 5);
  const latest = takeUnique(destacadosArticles, 4, usedArticles);
  const nationalStories = takeUnique(nationalArticles, 4, usedArticles);
  const mlbStories = takeUnique(mlbArticles, 5, usedArticles);
  const nbaStories = takeUnique(nbaArticles, 5, usedArticles);
  const lidomStories = takeUnique(lidomArticles, 5, usedArticles);
  const footballStories = takeUnique(footballArticles, 5, usedArticles);
  const nflStories = takeUnique(nflArticles, 5, usedArticles);
  const moreSportsStories = takeUnique(
    interleaveArticlePools(hockeyArticles, tennisArticles, caribbeanArticles, otherArticles),
    4,
    usedArticles,
  );

  return (
    <>
      <SiteHeader />
      <main>
        <ScoreStrip />

        <section className="shell lead-section">
          <div className="lead-label"><span /> Portada</div>
          {hero ? (
          <div className="lead-grid">
            <div className="lead-main">
              <div className="lead-top">
                <article className="hero-story">
                  <Link className="hero-media" href={`/noticias/${hero.slug}`}>
                    <img src={hero.image} alt="" fetchPriority="high" />
                    <div className="hero-shade" />
                    <div className="hero-copy">
                      <span className="hero-category">{hero.category}</span>
                      <h1>{hero.title}</h1>
                      <div className="hero-meta"><span>{hero.author}</span><span>{hero.publishedAt}</span></div>
                    </div>
                    {hero.media ? <span className="hero-play">▶</span> : null}
                  </Link>
                </article>

                <div className="side-stories">
                  {sideStories.map((article) => (
                    <ArticleCard key={article.id} article={article} compact />
                  ))}
                </div>
              </div>

              {moreStories.length ? (
                <div className="lead-more">
                  {moreStories.map((article) => (
                    <ArticleCard key={article.id} article={article} compact />
                  ))}
                </div>
              ) : null}
            </div>

            <aside className="lead-aside">
              {latest.length ? (
              <div className="latest-panel">
                <div className="latest-head"><span>Ahora</span><small>Actualizado</small></div>
                {latest.map((article) => (
                  <Link className="latest-row" href={`/noticias/${article.slug}`} key={article.id}>
                    <small>{article.category}</small>
                    <strong>{article.title}</strong>
                    <time>{article.publishedAt}</time>
                  </Link>
                ))}
              </div>
              ) : null}
              <div className="lead-ad">
                <RotatingHomeSidebarAd lane="primary" />
              </div>
            </aside>
          </div>
          ) : null}
        </section>

        <div className="shell wide-ad">
          <AdSlot slot={ADSENSE_SLOTS.entreSeccionesHome} />
        </div>

        <section className="media-section" id="multimedia">
          <div className="shell">
            <SectionHeading kicker="Videos · Highlights · Entrevistas" title="Pio TV" href="/videos" />
            <div className="media-grid media-grid-carousel">
              <VideoCarousel videos={videos} />
              <div id="radio"><AudioPlayer /></div>
            </div>
          </div>
        </section>

        <section className="national-section">
          <div className="shell">
            <SectionHeading kicker="Actualidad nacional" title="Nacionales" href="/categoria/nacionales" />
            <div className="national-grid">
              {nationalStories.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            <div className="national-ad">
              <AdSlot size="970 × 90" creative={aesDominicanaWideAd} />
            </div>
          </div>
        </section>

        <section className="home-sport-section">
          <div className="shell">
            <SectionHeading kicker="Grandes Ligas" title="MLB" href="/categoria/mlb" />
            <div className="lead-grid coverage-layout">
              <div className="coverage-main">
                <div className="feature-pair coverage-feature">
                  {mlbStories[0] ? <ArticleCard article={mlbStories[0]} /> : null}
                  <div className="headline-stack">
                    {mlbStories.slice(1).map((article) => (
                      <ArticleCard key={article.id} article={article} compact />
                    ))}
                  </div>
                </div>
              </div>
              <aside className="lead-aside">
                <div className="lead-ad">
                  <RotatingHomeSidebarAd lane="secondary" />
                </div>
              </aside>
            </div>
          </div>
        </section>

        <HomeFeatureBlock
          kicker="Baloncesto profesional"
          title="NBA"
          href="/categoria/nba"
          articles={nbaStories}
          reverse
          contrast
        />

        <HomeFeatureBlock
          kicker="Béisbol invernal"
          title="LIDOM"
          href="/categoria/lidom"
          articles={lidomStories}
        />

        <div className="shell wide-ad">
          <AdSlot slot={ADSENSE_SLOTS.entreSeccionesHome} />
        </div>

        <HomeFeatureBlock
          kicker="Juego internacional"
          title="Fútbol"
          href="/categoria/futbol"
          articles={footballStories}
          reverse
          contrast
        />

        <HomeFeatureBlock
          kicker="Fútbol americano"
          title="NFL"
          href="/categoria/nfl"
          articles={nflStories}
        />

        <section className="more-sports-section">
          <div className="shell">
            <SectionHeading kicker="Hockey · Tenis · Caribe · Otros" title="Más deportes" href="/categoria/otros-deportes" />
            <div className="more-sports-grid">
              {moreSportsStories.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>

        <div className="shell wide-ad">
          <AdSlot slot={ADSENSE_SLOTS.entreSeccionesHome} />
        </div>

        <InstagramFeed feed={instagramFeed} />
        <LotteryCompact feed={lotteryFeed} />
      </main>
      <SiteFooter />
    </>
  );
}
