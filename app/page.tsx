/* eslint-disable @next/next/no-img-element -- Local editorial assets are pre-compressed and WordPress can return remote media. */
import Link from "next/link";
import { AudioPlayer, AdSlot } from "./components/LiveWidgets";
import { ArticleCard, SectionHeading, SiteFooter, SiteHeader } from "./components/Portal";
import { ScoreStrip } from "./components/Scoreboard";
import { VideoCarousel } from "./components/VideoCarousel";
import { LotteryCompact } from "./components/LotteryCompact";
import { InstagramFeed } from "./components/InstagramFeed";
import { getCategoryArticles, getFeaturedArticles, getVideoItems, type Article } from "../lib/wordpress";
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

export default async function Home() {
  const [
    featuredArticles,
    videos,
    nationalArticles,
    mlbArticles,
    nbaArticles,
    footballArticles,
    nflArticles,
    tennisArticles,
    lidomArticles,
    caribbeanArticles,
    otherArticles,
    lotteryFeed,
    instagramFeed,
  ] = await Promise.all([
    getFeaturedArticles(7),
    getVideoItems(6),
    getCategoryArticles("nacionales"),
    getCategoryArticles("mlb"),
    getCategoryArticles("nba"),
    getCategoryArticles("futbol"),
    getCategoryArticles("nfl"),
    getCategoryArticles("tennis"),
    getCategoryArticles("lidom"),
    getCategoryArticles("beisbol-del-caribe"),
    getCategoryArticles("otros-deportes"),
    getLotteryFeed(),
    getInstagramFeed(),
  ]);

  const usedArticles = new Set<string>();
  const topStories = takeUnique(featuredArticles, 7, usedArticles);
  const hero = topStories[0];
  const sideStories = topStories.slice(1, 3);
  const latest = topStories.slice(3, 7);
  const nationalStories = takeUnique(nationalArticles, 4, usedArticles);
  const coverageLead = takeUnique(mlbArticles, 1, usedArticles)[0];
  const coverageStories = takeUnique(
    interleaveArticlePools(mlbArticles, tennisArticles, caribbeanArticles, lidomArticles),
    4,
    usedArticles,
  );
  const nbaLead = takeUnique(nbaArticles, 1, usedArticles)[0];
  const nbaStories = takeUnique(nbaArticles, 4, usedArticles);
  const panoramaStory = takeUnique(footballArticles, 1, usedArticles)[0];
  const moreSportsStories = takeUnique(
    interleaveArticlePools(otherArticles, tennisArticles, nflArticles, caribbeanArticles, lidomArticles),
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
            <article className="hero-story">
              <Link className="hero-media" href={`/noticias/${hero.slug}`}>
                <img src={hero.image} alt="" fetchPriority="high" />
                <div className="hero-shade" />
                <div className="hero-copy">
                  <span className="hero-category">{hero.category}</span>
                  <h1>{hero.title}</h1>
                  <p>{hero.excerpt}</p>
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

            <aside className="latest-panel">
              <div className="latest-head"><span>Ahora</span><small>Actualizado</small></div>
              {latest.map((article, index) => (
                <Link className="latest-row" href={`/noticias/${article.slug}`} key={article.id}>
                  <span className="latest-number">0{index + 1}</span>
                  <div><small>{article.category}</small><strong>{article.title}</strong><time>{article.publishedAt}</time></div>
                </Link>
              ))}
            </aside>
          </div>
          ) : null}
        </section>

        <div className="shell wide-ad"><AdSlot /></div>

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
            <SectionHeading kicker="Actualidad nacional" title="Deporte dominicano" href="/categoria/nacionales" />
            <div className="national-grid">
              {nationalStories.map((article) => <ArticleCard key={article.id} article={article} />)}
            </div>
          </div>
        </section>

        <InstagramFeed feed={instagramFeed} />

        <section className="coverage-section">
          <div className="shell">
            <SectionHeading kicker="Competiciones" title="Cobertura internacional" />
            <div className="subsection-title"><h3>Grandes Ligas</h3><Link href="/categoria/mlb">Más MLB →</Link></div>
            <div className="feature-pair coverage-feature">
              {coverageLead ? <ArticleCard article={coverageLead} /> : null}
              <div className="headline-stack">
                {coverageStories.map((article) => (
                  <ArticleCard key={article.id} article={article} compact />
                ))}
              </div>
            </div>

            <div className="agenda-card agenda-horizontal">
              <div className="agenda-intro">
                <span className="eyebrow">Agenda</span>
                <h3>Próximos eventos</h3>
              </div>
              <div className="agenda-date"><strong>13</strong><span>AGO<br />HOY</span></div>
              <Link className="agenda-item" href="/marcadores#nyy-bos"><time>7:10 PM</time><div><strong>Yankees vs. Red Sox</strong><small>MLB · ESPN</small></div><span>→</span></Link>
              <Link className="agenda-item" href="/marcadores#reinas-pur"><time>8:00 PM</time><div><strong>Reinas del Caribe</strong><small>Voleibol · Pio TV</small></div><span>→</span></Link>
              <Link className="agenda-item" href="/marcadores#lal-mia"><time>9:30 PM</time><div><strong>Lakers vs. Heat</strong><small>NBA · League Pass</small></div><span>→</span></Link>
              <Link className="agenda-cta" href="/marcadores">Ver agenda completa <span>→</span></Link>
            </div>
          </div>
        </section>

        <section className="nba-home-section">
          <div className="shell">
            <div className="subsection-title"><h3>NBA & baloncesto</h3><Link href="/categoria/nba">Más NBA →</Link></div>
            <div className="feature-pair reverse">
              {nbaLead ? <ArticleCard article={nbaLead} /> : null}
              <div className="headline-stack">
                {nbaStories.map((article) => (
                  <ArticleCard key={article.id} article={article} compact />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="shell closing-grid">
          <div>
            <SectionHeading kicker="Fútbol mundial" title="Panorama internacional" href="/categoria/futbol" />
            <div className="closing-feature">{panoramaStory ? <ArticleCard article={panoramaStory} /> : null}</div>
          </div>
          <div>
            <SectionHeading kicker="Polideportivo" title="Más disciplinas" href="/categoria/otros-deportes" />
            <div className="closing-list">
              {moreSportsStories.map((article) => <ArticleCard compact key={article.id} article={article} />)}
            </div>
          </div>
        </section>

        <LotteryCompact feed={lotteryFeed} />

        <div className="shell wide-ad bottom-ad"><AdSlot /></div>
      </main>
      <SiteFooter />
    </>
  );
}
