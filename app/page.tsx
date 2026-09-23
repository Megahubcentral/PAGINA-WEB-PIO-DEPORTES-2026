/* eslint-disable @next/next/no-img-element -- Local editorial assets are pre-compressed and WordPress can return remote media. */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { homeMetadata } from "../lib/seo";
import { AudioPlayer, AdSlot } from "./components/LiveWidgets";
import { RotatingHomeSidebarAd } from "./components/DirectAds";
import { HOME_ADSENSE } from "../lib/adsense";
import { aesDominicanaWideAd } from "../lib/direct-ads";
import { ArticleCard, SectionHeading, SiteFooter, SiteHeader } from "./components/Portal";
import { ScoreStrip } from "./components/Scoreboard";
import { VideoCarousel } from "./components/VideoCarousel";
import { LotteryCompact } from "./components/LotteryCompact";
import { InstagramFeed } from "./components/InstagramFeed";
import { getArticlesByTag, getCategoryArticles, getVideoItems, homeNewsQuery, PORTADA_TAGS, sortByNewest, type Article } from "../lib/wordpress";
import { getLotteryFeed } from "../lib/lottery-provider";
import { getInstagramFeed } from "../lib/instagram-provider";

export const metadata: Metadata = homeMetadata();
export const revalidate = 120;

function takeUnique(pool: Article[], count: number, used: Set<string>) {
  const selected: Article[] = [];
  for (const article of sortByNewest(pool)) {
    if (used.has(article.slug)) continue;
    used.add(article.slug);
    selected.push(article);
    if (selected.length === count) break;
  }
  return selected;
}

function HomeFeatureBlock({
  kicker,
  title,
  href,
  articles,
  reverse = false,
  contrast = false,
  aside,
  asideSide = "right",
}: {
  kicker: string;
  title: string;
  href: string;
  articles: Article[];
  reverse?: boolean;
  contrast?: boolean;
  aside?: ReactNode;
  asideSide?: "left" | "right";
}) {
  const lead = articles[0];
  const stack = articles.slice(1, 5);
  if (!lead) return null;

  const pair = (
    <div className={[reverse ? "feature-pair reverse" : "feature-pair", aside ? "coverage-feature" : ""].filter(Boolean).join(" ")}>
      <ArticleCard article={lead} />
      <div className="headline-stack">
        {stack.map((article) => (
          <ArticleCard key={article.id} article={article} compact />
        ))}
      </div>
    </div>
  );

  return (
    <section className={contrast ? "home-sport-section is-contrast" : "home-sport-section"}>
      <div className="shell">
        <SectionHeading kicker={kicker} title={title} href={href} />
        {aside ? (
          <div className={asideSide === "left" ? "lead-grid coverage-layout is-ad-left" : "lead-grid coverage-layout"}>
            <div className="coverage-main">{pair}</div>
            <aside className="lead-aside">
              <div className="lead-ad">{aside}</div>
            </aside>
          </div>
        ) : (
          pair
        )}
      </div>
    </section>
  );
}

function HomeAdSense({ unit }: { unit: (typeof HOME_ADSENSE)[keyof typeof HOME_ADSENSE] }) {
  return (
    <div className="shell wide-ad">
      <AdSlot slot={unit.slot} label={unit.label} />
    </div>
  );
}

export default async function Home() {
  const nbaQuery = { ...homeNewsQuery, exactCategory: true };
  const [
    portadaHeroArticles,
    portadaBelowArticles,
    portadaSideArticles,
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
    getArticlesByTag(PORTADA_TAGS.hero, 1, { fallbackToLatest: false }),
    getArticlesByTag(PORTADA_TAGS.below, 2, { fallbackToLatest: false }),
    getArticlesByTag(PORTADA_TAGS.side, 2, { fallbackToLatest: false }),
    getArticlesByTag("destacados", 8, homeNewsQuery),
    getVideoItems(6),
    getCategoryArticles("nacionales", homeNewsQuery),
    getCategoryArticles("mlb", homeNewsQuery),
    getCategoryArticles("nba", nbaQuery),
    getCategoryArticles("lidom", homeNewsQuery),
    getCategoryArticles("futbol-soccer", homeNewsQuery),
    getCategoryArticles("nfl", homeNewsQuery),
    getCategoryArticles("nhl", homeNewsQuery),
    getCategoryArticles("tennis", homeNewsQuery),
    getCategoryArticles("beisbol-latino", homeNewsQuery),
    getCategoryArticles("otros-deportes", homeNewsQuery),
    getLotteryFeed(),
    getInstagramFeed(),
  ]);

  const usedArticles = new Set<string>();
  const hero = takeUnique(portadaHeroArticles, 1, usedArticles)[0];
  const sideStories = takeUnique(portadaSideArticles, 2, usedArticles);
  const moreStories = takeUnique(portadaBelowArticles, 2, usedArticles);
  const latest = takeUnique(destacadosArticles, 4, usedArticles);
  const lidomStories = takeUnique(lidomArticles, 5, usedArticles);
  const mlbStories = takeUnique(mlbArticles, 5, usedArticles);
  const nbaStories = takeUnique(nbaArticles, 5, usedArticles);
  const nationalStories = takeUnique(nationalArticles, 4, usedArticles);
  const footballStories = takeUnique(footballArticles, 5, usedArticles);
  const nflStories = takeUnique(nflArticles, 5, usedArticles);
  const nhlStories = takeUnique(hockeyArticles, 5, usedArticles);
  const moreSportsStories = takeUnique(
    [...tennisArticles, ...caribbeanArticles, ...otherArticles],
    4,
    usedArticles,
  );
  const pioTvVideos = sortByNewest(videos);

  return (
    <>
      <SiteHeader />
      <main>
        <ScoreStrip />

        <section className="shell lead-section">
          <div className="lead-label"><span /> Portada</div>
          {hero || sideStories.length || moreStories.length ? (
          <div className="lead-grid">
            <div className="lead-main">
              <div className="lead-top">
                {hero ? (
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
                ) : null}

                {sideStories.length ? (
                <div className="side-stories">
                  {sideStories.map((article) => (
                    <ArticleCard key={article.id} article={article} compact />
                  ))}
                </div>
                ) : null}
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

        <HomeAdSense unit={HOME_ADSENSE.afterPortada} />

        <HomeFeatureBlock
          kicker="Béisbol dominicano"
          title="LIDOM"
          href="/categoria/lidom"
          articles={lidomStories}
          aside={<RotatingHomeSidebarAd lane="secondary" />}
          asideSide="left"
        />

        <HomeFeatureBlock
          kicker="MLB · Grandes Ligas"
          title="Béisbol"
          href="/categoria/mlb"
          articles={mlbStories}
          reverse
          contrast
        />

        <HomeAdSense unit={HOME_ADSENSE.afterMlb} />

        <HomeFeatureBlock
          kicker="NBA · FIBA"
          title="Baloncesto"
          href="/categoria/baloncesto"
          articles={nbaStories}
          aside={<RotatingHomeSidebarAd lane="primary" />}
        />

        <section className="national-section">
          <div className="shell">
            <SectionHeading kicker="Actualidad nacional" title="Nacionales" href="/categoria/nacionales" />
            <div className="national-grid">
              {nationalStories.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>

        <div className="shell wide-ad">
          <AdSlot size="970 × 90" creative={aesDominicanaWideAd} />
        </div>

        <section className="media-section" id="multimedia">
          <div className="shell">
            <SectionHeading kicker="Videos · Highlights · Entrevistas" title="Pio TV" href="/videos" />
            <div className="media-grid media-grid-carousel">
              <VideoCarousel videos={pioTvVideos} />
              <div id="radio"><AudioPlayer /></div>
            </div>
          </div>
        </section>

        <HomeFeatureBlock
          kicker="Juego internacional"
          title="Fútbol (Soccer)"
          href="/categoria/futbol-soccer"
          articles={footballStories}
          reverse
          contrast
        />

        <HomeAdSense unit={HOME_ADSENSE.afterFutbol} />

        <HomeFeatureBlock
          kicker="Fútbol americano"
          title="NFL"
          href="/categoria/nfl"
          articles={nflStories}
        />

        <HomeFeatureBlock
          kicker="Hockey"
          title="NHL"
          href="/categoria/nhl"
          articles={nhlStories}
          reverse
          contrast
        />

        <HomeAdSense unit={HOME_ADSENSE.lower} />

        <LotteryCompact feed={lotteryFeed} />

        <section className="more-sports-section">
          <div className="shell">
            <SectionHeading kicker="Tenis · Caribe · Otros" title="Más deportes" href="/categoria/otros-deportes" />
            <div className="more-sports-grid">
              {moreSportsStories.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>

        <InstagramFeed feed={instagramFeed} />
      </main>
      <SiteFooter />
    </>
  );
}
