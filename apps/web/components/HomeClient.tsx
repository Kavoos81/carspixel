"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import ScrollProgress from "@/components/ScrollProgress";

type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
};

type Car = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  year: number;
  coverImage: string | null;
};

function MediaImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  // micro-motion: خیلی خیلی نرم
  return (
    <motion.img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      initial={{ scale: 1.02 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

export default function HomeClient({
  cars,
  articles,
}: {
  cars: Car[];
  articles: Article[];
}) {
  const featuredCars = cars.slice(0, 4);
  const featuredArticles = articles.slice(0, 4);

  const { scrollY } = useScroll();

  // Hero parallax
  const heroImgY = useTransform(scrollY, [0, 700], [0, 70]);
  const heroImgOpacity = useTransform(scrollY, [0, 500], [1, 0.92]);

  // Text parallax (برعکس و کمتر)
  const heroTextY = useTransform(scrollY, [0, 700], [0, -18]);
  const heroTextOpacity = useTransform(scrollY, [0, 420], [1, 0.95]);

  return (
    <main className="min-h-screen">
      {/* Scroll Progress */}
      <ScrollProgress />

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl">
        <div className="relative h-[82vh]">
          <motion.img
            src="/home-hero.jpg"
            alt="Carspixel"
            className="h-full w-full object-cover"
            style={{ y: heroImgY, opacity: heroImgOpacity }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/55 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_40%)]" />

          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-6xl px-6 pb-14">
              <motion.div style={{ y: heroTextY, opacity: heroTextOpacity }}>
                <Reveal>
                  <div className="max-w-2xl">
                    <p className="text-sm opacity-80">Carspixel</p>

                    <h1 className="mt-3 text-4xl font-bold leading-tight md:text-6xl drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
                      مجله و فروشگاه دنیای خودرو
                    </h1>

                    <p className="mt-5 text-sm opacity-80 md:text-base">
                      خودروهای منتخب، مقالات مجله‌ای، و به زودی فروشگاه کامل محصولات.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href="/products"
                        className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:scale-[1.03] active:scale-[0.98]"
                      >
                        ورود به فروشگاه
                      </Link>

                      <Link
                        href="/cars"
                        className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-medium hover:bg-white/10 transition hover:scale-[1.03] active:scale-[0.98]"
                      >
                        مشاهده خودروها
                      </Link>

                      <Link
                        href="/articles"
                        className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-medium hover:bg-white/10 transition hover:scale-[1.03] active:scale-[0.98]"
                      >
                        ورود به مجله
                      </Link>
                    </div>
                  </div>
                </Reveal>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* STRIP (Spacing بهتر) */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm opacity-60">انتخاب‌های منتخب</p>
                <p className="mt-2 font-semibold">
                  خودروهای خاص با عکس‌های سینمایی و مشخصات دقیق
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm opacity-60">راهنمای خرید و نگهداری</p>
                <p className="mt-2 font-semibold">
                  مقاله‌های کوتاه، کاربردی و قابل اعتماد برای بازار واقعی
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm opacity-60">فروشگاه</p>
                <p className="mt-2 font-semibold">
                  محصولات منتخب خودرو، به‌زودی با سبد خرید و ارسال
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CARS */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">خودروهای منتخب</h2>
                <p className="mt-2 text-sm opacity-70">منتشرشده‌ها از پنل</p>
              </div>
              <Link href="/cars" className="text-sm opacity-80 hover:opacity-100">
                مشاهده همه →
              </Link>
            </div>
          </Reveal>

          <div className="mt-8">
            <Stagger>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {featuredCars.map((c) => (
                  <StaggerItem key={c.id}>
                    <Link
                      href={`/cars/${c.slug}`}
                      className="group block rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:bg-white/10 hover:-translate-y-1"
                    >
                      <div className="mb-4 aspect-[16/9] overflow-hidden rounded-xl bg-black/20">
                        {c.coverImage ? (
                          <div className="h-full w-full transition duration-500 group-hover:scale-[1.04]">
                            <MediaImage src={c.coverImage} alt={c.title} />
                          </div>
                        ) : null}
                      </div>

                      <p className="font-medium">{c.title}</p>
                      <p className="mt-1 text-sm opacity-70">
                        {c.brand} • {c.year}
                      </p>
                    </Link>
                  </StaggerItem>
                ))}
              </div>
            </Stagger>

            {featuredCars.length === 0 ? (
              <p className="mt-8 opacity-70">فعلاً خودروی منتشرشده نداریم.</p>
            ) : null}
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">مقالات منتخب</h2>
                <p className="mt-2 text-sm opacity-70">آخرین مقاله‌های منتشرشده</p>
              </div>
              <Link href="/articles" className="text-sm opacity-80 hover:opacity-100">
                مشاهده همه →
              </Link>
            </div>
          </Reveal>

          <div className="mt-8">
            <Stagger>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {featuredArticles.map((a) => (
                  <StaggerItem key={a.id}>
                    <Link
                      href={`/articles/${a.slug}`}
                      className="group block rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:bg-white/10 hover:-translate-y-1"
                    >
                      <div className="mb-4 aspect-[16/9] overflow-hidden rounded-xl bg-black/20">
                        {a.coverImage ? (
                          <div className="h-full w-full transition duration-500 group-hover:scale-[1.04]">
                            <MediaImage src={a.coverImage} alt={a.title} />
                          </div>
                        ) : null}
                      </div>

                      <p className="font-medium">{a.title}</p>
                      {a.excerpt ? (
                        <p className="mt-2 text-sm opacity-70 line-clamp-2">
                          {a.excerpt}
                        </p>
                      ) : null}
                    </Link>
                  </StaggerItem>
                ))}
              </div>
            </Stagger>

            {featuredArticles.length === 0 ? (
              <p className="mt-8 opacity-70">فعلاً مقاله منتشرشده نداریم.</p>
            ) : null}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-16 pt-6">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold">برای خرید آماده‌ای؟</h3>
                  <p className="mt-2 text-sm opacity-70">
                    وارد فروشگاه شو و محصولات منتخب خودرو را ببین.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/products"
                    className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:scale-[1.03] active:scale-[0.98]"
                  >
                    ورود به فروشگاه
                  </Link>
                  <Link
                    href="/articles"
                    className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-medium hover:bg-white/10 transition hover:scale-[1.03] active:scale-[0.98]"
                  >
                    مطالعه مجله
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
