/* eslint-disable @next/next/no-img-element -- WordPress controls the video poster CDN. */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "../../components/JsonLd";
import { AdSlot } from "../../components/LiveWidgets";
import { SiteFooter, SiteHeader } from "../../components/Portal";
import { breadcrumbJsonLd, routeMetadata, videoObjectJsonLd } from "../../../lib/seo";
import { getVideoBySlug, getVideoItems } from "../../../lib/wordpress";

export const revalidate = 120;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) {
    return { title: "Video no encontrado", robots: { index: false, follow: false } };
  }
  return routeMetadata({
    path: `/videos/${video.slug}`,
    title: video.title,
    description: video.excerpt,
    image: video.thumbnail,
    imageAlt: video.title,
    ogType: "video.other",
    publishedTime: video.date,
    modifiedTime: video.dateModified,
  });
}

export default async function VideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [video, videos] = await Promise.all([getVideoBySlug(slug), getVideoItems(5)]);
  if (!video) notFound();
  const directVideo = Boolean(video.embedUrl && /\.(mp4|webm|ogg)(\?|$)/i.test(video.embedUrl));
  const videoSchema = videoObjectJsonLd({
    title: video.title,
    description: video.excerpt,
    thumbnail: video.thumbnail,
    uploadDate: video.date,
    duration: video.duration,
    embedUrl: directVideo ? undefined : video.embedUrl,
    contentUrl: directVideo ? video.embedUrl : undefined,
    path: `/videos/${video.slug}`,
  });

  return (
    <>
      {videoSchema ? <JsonLd data={videoSchema} /> : null}
      <JsonLd data={breadcrumbJsonLd([
        { name: "Inicio", path: "/" },
        { name: "Pio TV", path: "/videos" },
        { name: video.title, path: `/videos/${video.slug}` },
      ])} />
      <SiteHeader />
      <main className="video-watch-page">
        <div className="shell video-watch-layout">
          <article>
            <Link className="video-watch-back" href="/videos">← Todos los videos</Link>
            <span className="eyebrow">{video.section}{video.duration ? ` · ${video.duration}` : ""}</span>
            <h1>{video.title}</h1>

            <div className="video-player-frame">
              {directVideo ? (
                <video controls preload="metadata" poster={video.thumbnail}>
                  <source src={video.embedUrl} />
                  <track kind="captions" src="/video-captions.vtt" srcLang="es" label="Español" default />
                  Tu navegador no puede reproducir este video.
                </video>
              ) : video.embedUrl ? (
                <iframe
                  src={video.embedUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <a href={video.sourceUrl} target="_blank" rel="noreferrer" className="video-player-poster">
                  <img src={video.thumbnail} alt={video.title} />
                  <span>▶</span>
                  <strong>Reproducir en el canal oficial</strong>
                </a>
              )}
            </div>

            <p className="video-watch-deck">{video.excerpt}</p>
            <div className="video-watch-meta">
              <span>Pio Deportes</span>
              <time dateTime={video.date}>{video.publishedAt}</time>
            </div>
          </article>

          <aside className="video-watch-aside">
            <AdSlot size="300 × 250" />
            <div className="video-embed-note">
              <span>Para la redacción</span>
              <strong>Este video también puede insertarse dentro de cualquier noticia desde el editor de WordPress.</strong>
            </div>
          </aside>
        </div>

        <section className="shell related-videos">
          <div className="video-archive-heading"><div><span>Continúa mirando</span><h2>Más de Pio TV</h2></div></div>
          <div className="video-archive-grid compact-grid">
            {videos.filter((item) => item.slug !== video.slug).slice(0, 4).map((item) => (
              <article key={item.id}>
                <Link className="video-archive-thumb" href={`/videos/${item.slug}`}>
                  <img src={item.thumbnail} alt={item.title} loading="lazy" /><span>▶</span>{item.duration ? <time>{item.duration}</time> : null}
                </Link>
                <small>{item.section}</small>
                <h3><Link href={`/videos/${item.slug}`}>{item.title}</Link></h3>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
