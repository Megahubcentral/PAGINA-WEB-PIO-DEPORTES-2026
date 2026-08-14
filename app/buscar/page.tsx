import { ArticleCard, SiteFooter, SiteHeader } from "../components/Portal";
import { getLatestArticles } from "../../lib/wordpress";

export const metadata = { title: "Buscar" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const articles = await getLatestArticles(20);
  const term = q.trim().toLowerCase();
  const matches = term ? articles.filter((article) => `${article.title} ${article.category}`.toLowerCase().includes(term)) : articles;

  return (
    <>
      <SiteHeader />
      <main>
        <header className="page-hero"><div className="shell"><span className="eyebrow">Explora Pío</span><h1>Buscar</h1><p>{term ? `${matches.length} resultados para “${q}”` : "Escribe una palabra en el buscador para encontrar noticias."}</p></div></header>
        <section className="shell category-page"><div className="category-grid">{matches.map((article) => <ArticleCard article={article} key={article.id} />)}</div></section>
      </main>
      <SiteFooter />
    </>
  );
}
