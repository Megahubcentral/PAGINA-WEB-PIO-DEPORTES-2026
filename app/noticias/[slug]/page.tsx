/* eslint-disable @next/next/no-img-element -- The WordPress newsroom controls the featured-image CDN. */
import type { Metadata } from "next";
import Link from "next/link";
import { ArticleBody } from "../../components/ArticleBody";
import { AdSlot } from "../../components/LiveWidgets";
import { ArticleCard, SectionHeading, SiteFooter, SiteHeader } from "../../components/Portal";
import { ADSENSE_SLOTS } from "../../../lib/adsense";
import { getArticleBySlug, getRelatedArticles } from "../../../lib/wordpress";
import { getSiteUrl } from "../../../lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  return {
    title: article?.title ?? "Noticia deportiva",
    description: article?.excerpt,
    openGraph: article ? { images: [article.image] } : undefined,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return null;
  const related = await getRelatedArticles(article, 4);
  const publicUrl = `${getSiteUrl()}/noticias/${article.slug}`;
  const shareUrl = encodeURIComponent(publicUrl);
  const shareTitle = encodeURIComponent(article.title);
  const sidebarRelated = related.slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main className="shell article-page">
        <div className="article-layout">
          <article>
            <header className="article-header">
              <Link className="category-link" href={`/categoria/${article.categorySlug}`}>{article.category}</Link>
              <h1>{article.title}</h1>
              <p className="article-deck">{article.excerpt}</p>
              <div className="article-byline"><strong>Por {article.author}</strong><span>{article.publishedAt}</span><span>Santo Domingo, RD</span></div>
            </header>
            <img className="article-hero-image" src={article.image} alt="" fetchPriority="high" />
            {article.imageCredit ? (
              <p className="article-image-credit">
                Foto: {article.imageSourceUrl ? <a href={article.imageSourceUrl} target="_blank" rel="noreferrer">{article.imageCredit}</a> : article.imageCredit}
                {article.imageLicense ? <> · {article.imageLicenseUrl ? <a href={article.imageLicenseUrl} target="_blank" rel="noreferrer">{article.imageLicense}</a> : article.imageLicense}</> : null}
              </p>
            ) : null}
            <ArticleBody html={article.content} />
            <div className="wide-ad article-end-ad">
              <AdSlot slot={ADSENSE_SLOTS.finalDeArticulo} />
            </div>
          </article>
          <aside className="article-sidebar">
            <div className="sidebar-desktop-ad">
              <AdSlot slot={ADSENSE_SLOTS.sidebarDesktop} />
            </div>
            <div className="share-block">
              <strong>Comparte esta noticia</strong>
              <div className="share-links">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Compartir en Facebook">f</a>
                <a href={`https://x.com/intent/post?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noreferrer" aria-label="Compartir en X">𝕏</a>
                <a href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Compartir en WhatsApp">WA</a>
                <a href={`mailto:?subject=${shareTitle}&body=${shareUrl}`} aria-label="Compartir por correo">↗</a>
              </div>
            </div>
            {sidebarRelated.length ? (
              <div className="related-sidebar">
                <span className="eyebrow">Más de {article.category}</span>
                {sidebarRelated.map((item) => <ArticleCard compact article={item} key={`side-${item.id}-${item.slug}`} />)}
              </div>
            ) : null}
          </aside>
        </div>
        {related.length ? (
          <section className="related-articles" aria-label="Noticias relacionadas">
            <SectionHeading kicker="Sigue leyendo" title="Noticias relacionadas" href={`/categoria/${article.categorySlug}`} />
            <div className="related-articles-grid">
              {related.map((item) => <ArticleCard article={item} key={`${item.id}-${item.slug}`} />)}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
