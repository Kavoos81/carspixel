import Link from "next/link";
import { apiGet } from "../../lib/api";

type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
};

export default async function ArticlesPage() {
  const articles = await apiGet<Article[]>("/articles?all=1");

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <section className="relative mb-16 h-[70vh] w-full overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black" />

          <img
            src="/hero.jpg"
            alt="Carspixel Articles"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 flex items-end p-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                مجله Carspixel
              </h1>
              <p className="mt-3 max-w-md text-sm opacity-80">
                بررسی، الهام و داستان‌های دنیای خودرو
              </p>
            </div>
          </div>
        </section>

        <h1 className="text-3xl font-bold">مقالات</h1>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/articles/${a.slug}`}
              className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:bg-white/10 hover:-translate-y-1"
            >
              {a.coverImage && (
                <div className="mb-4 aspect-[16/9] overflow-hidden rounded-xl bg-black/20">
                  <img
                    src={a.coverImage}
                    alt={a.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                </div>
              )}

              <h2 className="text-lg font-medium">{a.title}</h2>

              {a.excerpt && (
                <p className="mt-2 text-sm opacity-70 line-clamp-2">
                  {a.excerpt}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
