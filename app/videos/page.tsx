/* eslint-disable @next/next/no-img-element -- WordPress controls the video poster CDN. */
import Link from "next/link";
import { AdSlot } from "../components/LiveWidgets";
import { SiteFooter, SiteHeader } from "../components/Portal";
import { getVideoItems } from "../../lib/wordpress";

export const metadata = {
  title: "Pio TV — Videos deportivos",
  description: "Highlights, entrevistas, análisis y videos deportivos de Pio Deportes.",
};

export const revalidate = 120;

export default async function VideosPage() {
  const videos = await getVideoItems(12);
  const featured = videos[0];

  return (
    <>
      <SiteHeader />
      <main>
        <header className="page-hero video-page-hero">
          <div className="shell">
            <span className="eyebrow">Highlights · Entrevistas · Análisis</span>
            <h1>Pio TV</h1>
            <p>El deporte también se mira: las jugadas, voces e historias que definen cada jornada.</p>
          </div>
        </header>

        <section className="shell video-archive">
          <div className="video-archive-heading">
            <div><span>Selección audiovisual</span><h2>Videos destacados</h2></div>
            <small>Actualización continua desde WordPress</small>
          </div>

          <article className="video-archive-feature">
            <Link href={`/videos/${featured.slug}`}>
              <img src={featured.thumbnail} alt="" fetchPriority="high" />
              <span className="video-archive-shade" />
              <div className="video-archive-feature-copy">
                <span>{featured.section} · {featured.duration}</span>
                <h2>{featured.title}</h2>
                <p>{featured.excerpt}</p>
              </div>
              <b>▶</b>
            </Link>
          </article>

          <div className="video-archive-grid">
            {videos.slice(1).map((video) => (
              <article key={video.id}>
                <Link className="video-archive-thumb" href={`/videos/${video.slug}`}>
                  <img src={video.thumbnail} alt="" loading="lazy" />
                  <span>▶</span><time>{video.duration}</time>
                </Link>
                <small>{video.section}</small>
                <h3><Link href={`/videos/${video.slug}`}>{video.title}</Link></h3>
                <p>{video.publishedAt}</p>
              </article>
            ))}
          </div>

          <div className="wide-ad"><AdSlot /></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
