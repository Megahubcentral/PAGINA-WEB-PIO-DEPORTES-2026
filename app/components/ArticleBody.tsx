import { AdSlot } from "./LiveWidgets";
import { ADSENSE_SLOTS, splitHtmlAfterParagraph } from "../../lib/adsense";

function InArticleAd() {
  return (
    <div className="article-in-ad" aria-label="Publicidad">
      <AdSlot slot={ADSENSE_SLOTS.inArticle} format="fluid" layout="in-article" fullWidthResponsive={false} />
    </div>
  );
}

export function ArticleBody({ html }: { html?: string | null }) {
  if (!html) {
    return (
      <div className="article-content">
        <p className="dropcap">
          La jornada deportiva volvió a confirmar que los grandes momentos se construyen con preparación, carácter y una
          ejecución precisa. La noticia mantiene atentos a los fanáticos dentro y fuera de República Dominicana.
        </p>
        <p>
          El desarrollo de la competencia dejó claves importantes para lo que viene. Los protagonistas destacaron el
          trabajo colectivo y la capacidad de responder en los instantes decisivos, mientras el cuerpo técnico ya mira
          hacia el próximo compromiso.
        </p>
        <InArticleAd />
        <p>
          En Pío Deportes seguimos cada detalle con contexto, datos y la mirada de quienes viven el deporte. Esta
          plantilla recibe automáticamente desde WordPress el texto completo, galerías, videos insertados, audios,
          etiquetas y créditos editoriales.
        </p>
        <p>La cobertura continuará con reacciones, estadísticas y el calendario actualizado de los próximos encuentros.</p>
      </div>
    );
  }

  const parts = splitHtmlAfterParagraph(html);
  if (!parts) {
    return <div className="article-content wp-content" dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return (
    <div className="article-content wp-content">
      <div dangerouslySetInnerHTML={{ __html: parts.before }} />
      <InArticleAd />
      <div dangerouslySetInnerHTML={{ __html: parts.after }} />
    </div>
  );
}
