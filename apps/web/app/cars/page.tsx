import Link from "next/link";
import { apiGet } from "../../lib/api";

type Car = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  year: number;
  coverImage: string | null;
};

export default async function CarsPage() {
  const cars = await apiGet<Car[]>("/cars");

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">خودروها</h1>
        <p className="mt-2 text-sm opacity-70">لیست خودروهای منتشر شده</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {cars.map((c) => (
            <Link
              key={c.id}
              href={`/cars/${c.slug}`}
              className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:bg-white/10 hover:-translate-y-1"
            >
              <div className="mb-4 aspect-[16/9] overflow-hidden rounded-xl bg-black/20">
                {c.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.coverImage}
                    alt={c.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                ) : null}
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-medium">{c.title}</h2>
                  <p className="mt-1 text-sm opacity-70">
                    {c.brand} • {c.year}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {cars.length === 0 ? (
          <p className="mt-10 opacity-70">فعلاً خودروی منتشر شده‌ای نداریم.</p>
        ) : null}
      </div>
    </main>
  );
}
