/* eslint-disable @next/next/no-img-element -- The WordPress newsroom controls the featured-image CDN. */
import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "../../components/LiveWidgets";
import { ArticleCard, SiteFooter, SiteHeader } from "../../components/Portal";
import { fallbackArticles, getArticleBySlug } from "../../../lib/wordpress";
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
  const publicUrl = `${getSiteUrl()}/noticias/${article.slug}`;
  const shareUrl = encodeURIComponent(publicUrl);
  const shareTitle = encodeURIComponent(article.title);

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
            {article.content ? (
              <div className="article-content wp-content" dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <div className="article-content">
                <p className="dropcap">La jornada deportiva volvió a confirmar que los grandes momentos se construyen con preparación, carácter y una ejecución precisa. La noticia mantiene atentos a los fanáticos dentro y fuera de República Dominicana.</p>
                <p>El desarrollo de la competencia dejó claves importantes para lo que viene. Los protagonistas destacaron el trabajo colectivo y la capacidad de responder en los instantes decisivos, mientras el cuerpo técnico ya mira hacia el próximo compromiso.</p>
                <AdSlot size="Contenido patrocinado · Responsive" />
                <p>En Pío Deportes seguimos cada detalle con contexto, datos y la mirada de quienes viven el deporte. Esta plantilla recibe automáticamente desde WordPress el texto completo, galerías, videos insertados, audios, etiquetas y créditos editoriales.</p>
                <p>La cobertura continuará con reacciones, estadísticas y el calendario actualizado de los próximos encuentros.</p>
              </div>
            )}
          </article>
          <aside className="article-sidebar">
            <AdSlot size="300 × 250" />
            <div className="share-block">
              <strong>Comparte esta noticia</strong>
              <div className="share-links">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Compartir en Facebook">f</a>
                <a href={`https://x.com/intent/post?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noreferrer" aria-label="Compartir en X">𝕏</a>
                <a href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Compartir en WhatsApp">WA</a>
                <a href={`mailto:?subject=${shareTitle}&body=${shareUrl}`} aria-label="Compartir por correo">↗</a>
              </div>
            </div>
            <div>
              <span className="eyebrow">También en Pío</span>
              {fallbackArticles.slice(1, 4).map((item) => <ArticleCard compact article={item} key={item.id} />)}
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
