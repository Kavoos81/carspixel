import { apiGet } from "../../../lib/api";

type Article = {
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
};

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await apiGet<Article>(`/articles/${params.slug}`);

  return (
    <main className="min-h-screen px-6 py-12">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">{article.title}</h1>

        {article.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.coverImage}
            alt={article.title}
            className="my-6 aspect-[16/9] w-full rounded-xl object-cover"
          />
        )}

        {article.excerpt && (
          <p className="text-base opacity-80">{article.excerpt}</p>
        )}

        <div className="prose prose-invert mt-8 max-w-none">
          <p>{article.content}</p>
        </div>
      </article>
    </main>
  );
}
