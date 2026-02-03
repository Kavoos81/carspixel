"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch, getToken } from "@/lib/adminApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
};

function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminArticlesPage() {
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // فرم ساخت
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [coverImage, setCoverImage] = useState<string>("");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      title.trim().length >= 3 &&
      slug.trim().length >= 3 &&
      content.trim().length >= 20
    );
  }, [title, slug, content]);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const data = await adminFetch<Article[]>("/articles?all=1");
      setItems(data);
    } catch (e: any) {
      setErr(e?.message ?? "خطا در دریافت مقالات");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }
    load();
  }, []);

  async function createArticle() {
    setErr(null);
    setSaving(true);
    try {
      const created = await adminFetch<Article>("/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt ? excerpt.trim() : null,
          content: content.trim(),
          coverImage: coverImage || null,
          published,
        }),
      });

      // ریست فرم
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setPublished(false);
      setCoverImage("");

      setItems((prev) => [created, ...prev]);
    } catch (e: any) {
      // اگر Conflict یا هر ارور JSON برگشت، همین message میاد
      setErr(e?.message ?? "خطا در ساخت مقاله");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(a: Article) {
    setErr(null);
    try {
      const updated = await adminFetch<Article>(`/articles/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !a.published }),
      });

      setItems((prev) => prev.map((x) => (x.id === a.id ? updated : x)));
    } catch (e: any) {
      setErr(e?.message ?? "خطا در تغییر وضعیت انتشار");
    }
  }

  async function uploadCover(file: File) {
    setErr(null);
    setUploading(true);
    try {
      const token = getToken();
      if (!token) throw new Error("توکن پیدا نشد، دوباره لاگین کن");

      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`${API_URL}/media/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const text = await res.text();
      if (!res.ok) throw new Error(`Upload ${res.status}: ${text}`);

      const data = JSON.parse(text) as { url: string };
      setCoverImage(data.url);
    } catch (e: any) {
      setErr(e?.message ?? "خطا در آپلود عکس");
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">مدیریت مقالات</h1>

          <div className="flex gap-2">
            <a
              href="/admin"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
            >
              برگشت
            </a>

            <button
              onClick={load}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
            >
              رفرش
            </button>
          </div>
        </div>

        {err ? (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {err}
          </p>
        ) : null}

        {/* فرم ساخت */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">مقاله جدید</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm opacity-70">عنوان</label>
              <input
                className="mt-2 w-full rounded-xl bg-black/30 px-4 py-3 outline-none border border-white/10"
                value={title}
                onChange={(e) => {
                  const v = e.target.value;
                  setTitle(v);
                  if (!slug) setSlug(toSlug(v));
                }}
              />
            </div>

            <div>
              <label className="text-sm opacity-70">Slug (انگلیسی)</label>
              <input
                className="mt-2 w-full rounded-xl bg-black/30 px-4 py-3 outline-none border border-white/10"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                dir="ltr"
                placeholder="my-first-article"
              />
              <p className="mt-2 text-xs opacity-60" dir="ltr">
                Example: my-first-article
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm opacity-70">خلاصه</label>
              <input
                className="mt-2 w-full rounded-xl bg-black/30 px-4 py-3 outline-none border border-white/10"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm opacity-70">محتوا</label>
              <textarea
                className="mt-2 min-h-[160px] w-full rounded-xl bg-black/30 px-4 py-3 outline-none border border-white/10"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <p className="mt-2 text-xs opacity-60">حداقل ۲۰ کاراکتر</p>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm opacity-70">کاور</label>

              <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadCover(f);
                  }}
                  className="block w-full text-sm"
                />

                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                  />
                  انتشار
                </label>
              </div>

              {uploading ? (
                <p className="mt-2 text-sm opacity-70">در حال آپلود...</p>
              ) : null}

              {coverImage ? (
                <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt="cover"
                    className="w-full object-cover"
                  />
                </div>
              ) : null}
            </div>
          </div>

          <button
            disabled={!canSubmit || saving}
            onClick={createArticle}
            className="mt-6 w-full rounded-xl bg-white py-3 font-medium text-black disabled:opacity-60"
          >
            {saving ? "در حال ذخیره..." : "ساخت مقاله"}
          </button>

          {!canSubmit ? (
            <p className="mt-3 text-xs opacity-60">
              برای فعال شدن دکمه، عنوان (۳+)، اسلاگ (۳+) و محتوا (۲۰+) لازم است.
            </p>
          ) : null}
        </div>

        <div className="my-10 h-px w-full bg-white/10" />

        {/* لیست */}
        <div>
          <h2 className="text-lg font-semibold">لیست مقالات</h2>

          {loading ? <p className="mt-4 opacity-70">در حال دریافت...</p> : null}

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {items.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                {a.coverImage ? (
                  <div className="mb-4 aspect-[16/9] overflow-hidden rounded-xl bg-black/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.coverImage}
                      alt={a.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{a.title}</p>
                    <p className="mt-1 text-xs opacity-60" dir="ltr">
                      /articles/{a.slug}
                    </p>
                  </div>

                  <button
                    onClick={() => togglePublish(a)}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                  >
                    {a.published ? "Unpublish" : "Publish"}
                  </button>
                </div>

                {a.excerpt ? (
                  <p className="mt-3 text-sm opacity-70 line-clamp-2">
                    {a.excerpt}
                  </p>
                ) : (
                  <p className="mt-3 text-sm opacity-50">بدون خلاصه</p>
                )}
              </div>
            ))}
          </div>

          {!loading && items.length === 0 ? (
            <p className="mt-6 opacity-70">هیچ مقاله‌ای وجود ندارد.</p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
