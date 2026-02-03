"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = useMemo(
    () => [
      { href: "/cars", label: "خودروها" },
      { href: "/articles", label: "مجله" },
      { href: "/products", label: "فروشگاه" },
    ],
    []
  );

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const value = q.trim();
    if (!value) return;
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="mx-auto max-w-6xl px-6">
        <div
          className={cx(
            "mt-4 rounded-2xl border border-white/10 backdrop-blur-xl transition",
            scrolled ? "bg-black/70" : "bg-black/40"
          )}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="font-bold tracking-tight">
              Carspixel
            </Link>

            <nav className="hidden items-center gap-4 text-sm md:flex">
              {nav.map((n) => {
                const active = pathname?.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    className={cx(
                      "opacity-80 hover:opacity-100 transition",
                      active && "opacity-100"
                    )}
                    href={n.href}
                  >
                    {n.label}
                  </Link>
                );
              })}
              <Link
                href="/admin"
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 opacity-90 hover:bg-white/10 transition"
              >
                پنل
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              {/* Search */}
              <form onSubmit={onSearch} className="hidden md:block">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="جستجو…"
                  className="w-56 rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm outline-none focus:border-white/20"
                />
              </form>

              {/* Cart (placeholder) */}
              <Link
                href="/cart"
                className="relative rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
              >
                سبد
                <span className="absolute -top-2 -left-2 rounded-full bg-white text-black text-xs px-2 py-0.5">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
