"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch, getToken } from "@/lib/adminApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type Car = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  year: number;
  coverImage: string | null;
  specs: any | null;
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

export default function AdminCarsPage() {
  const [items, setItems] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // create form
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState<string>("2024");
  const [published, setPublished] = useState(false);
  const [coverImage, setCoverImage] = useState<string>("");
  const [specsText, setSpecsText] = useState<string>("{}"); // JSON as text

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const canSubmit = useMemo(() => {
    const y = Number(year);
    return (
      title.trim().length >= 2 &&
      slug.trim().length >= 3 &&
      brand.trim().length >= 2 &&
      Number.isFinite(y) &&
      y >= 1950 &&
      y <= 2035
    );
  }, [title, slug, brand, year]);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const data = await adminFetch<Car[]>("/cars?all=1");
      setItems(data);
    } catch (e: any) {
      setErr(e?.message ?? "خطا در دریافت خودروها");
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
        headers: { Authorization: `Bearer ${token}` },
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

  async function createCar() {
    setErr(null);
    setSaving(true);

    try {
      let specs: any = null;
      const trimmed = specsText.trim();
      if (trimmed && trimmed !== "{}") {
        try {
          specs = JSON.parse(trimmed);
        } catch {
          setErr("فرمت specs باید JSON معتبر باشد. مثال: {\"engine\":\"V8\",\"hp\":450}");
          return;
        }
      }

      const created = await adminFetch<Car>("/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          brand: brand.trim(),
          year: Number(year),
          coverImage: coverImage || null,
          specs,
          published,
        }),
      });

      // reset
      setTitle("");
      setSlug("");
      setBrand("");
      setYear("2024");
      setPublished(false);
      setCoverImage("");
      setSpecsText("{}");

      setItems((prev) => [created, ...prev]);
    } catch (e: any) {
      setErr(e?.message ?? "خطا در ساخت خودرو");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(c: Car) {
    setErr(null);
    try {
      const updated = await adminFetch<Car>(`/cars/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !c.published }),
      });
      setItems((prev) => prev.map((x) => (x.id === c.id ? updated : x)));
    } catch (e: any) {
      setErr(e?.message ?? "خطا در تغییر وضعیت انتشار");
    }
  }

  async function removeCar(c: Car) {
    const ok = window.confirm(`حذف شود؟\n${c.title}`);
    if (!ok) return;

    setErr(null);
    try {
      await adminFetch(`/cars/${c.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((x) => x.id !== c.id));
    } catch (e: any) {
      setErr(e?.message ?? "خطا در حذف خودرو");
    }
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">مدیریت خودروها</h1>

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

        {/* create */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">خودرو جدید</h2>

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
                placeholder="bmw-m3-2022"
              />
            </div>

            <div>
              <label className="text-sm opacity-70">برند</label>
              <input
                className="mt-2 w-full rounded-xl bg-black/30 px-4 py-3 outline-none border border-white/10"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="BMW"
              />
            </div>

            <div>
              <label className="text-sm opacity-70">سال</label>
              <input
                className="mt-2 w-full rounded-xl bg-black/30 px-4 py-3 outline-none border border-white/10"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                dir="ltr"
                placeholder="2022"
              />
              <p className="mt-2 text-xs opacity-60">بین 1950 تا 2035</p>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm opacity-70">Specs (JSON)</label>
              <textarea
                className="mt-2 min-h-[120px] w-full rounded-xl bg-black/30 px-4 py-3 outline-none border border-white/10"
                value={specsText}
                onChange={(e) => setSpecsText(e.target.value)}
                dir="ltr"
                placeholder='{"engine":"V8","hp":450,"drivetrain":"RWD"}'
              />
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
                  <img src={coverImage} alt="cover" className="w-full object-cover" />
                </div>
              ) : null}
            </div>
          </div>

          <button
            disabled={!canSubmit || saving}
            onClick={createCar}
            className="mt-6 w-full rounded-xl bg-white py-3 font-medium text-black disabled:opacity-60"
          >
            {saving ? "در حال ذخیره..." : "ساخت خودرو"}
          </button>

          {!canSubmit ? (
            <p className="mt-3 text-xs opacity-60">
              عنوان، اسلاگ، برند و سال باید معتبر باشد.
            </p>
          ) : null}
        </div>

        <div className="my-10 h-px w-full bg-white/10" />

        {/* list */}
        <div>
          <h2 className="text-lg font-semibold">لیست خودروها</h2>

          {loading ? <p className="mt-4 opacity-70">در حال دریافت...</p> : null}

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {items.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                {c.coverImage ? (
                  <div className="mb-4 aspect-[16/9] overflow-hidden rounded-xl bg-black/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.coverImage}
                      alt={c.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{c.title}</p>
                    <p className="mt-1 text-xs opacity-60">
                      {c.brand} • {c.year}
                    </p>
                    <p className="mt-1 text-xs opacity-60" dir="ltr">
                      /cars/{c.slug}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => togglePublish(c)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                    >
                      {c.published ? "Unpublish" : "Publish"}
                    </button>

                    <button
                      onClick={() => removeCar(c)}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200 hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {c.specs ? (
                  <pre className="mt-4 overflow-auto rounded-xl bg-black/30 p-3 text-xs opacity-80" dir="ltr">
                    {JSON.stringify(c.specs, null, 2)}
                  </pre>
                ) : (
                  <p className="mt-4 text-sm opacity-50">بدون مشخصات</p>
                )}
              </div>
            ))}
          </div>

          {!loading && items.length === 0 ? (
            <p className="mt-6 opacity-70">هیچ خودرویی وجود ندارد.</p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
