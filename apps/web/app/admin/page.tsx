"use client";

import { useEffect, useState } from "react";
import { adminFetch, clearToken, getToken } from "@/lib/adminApi";

type Me = { sub: string; email: string; role: "ADMIN" | "EDITOR" | "USER" };

export default function AdminPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    adminFetch<Me>("/auth/me")
      .then(setMe)
      .catch(() => setErr("دسترسی ندارید یا توکن نامعتبر است"));
  }, []);

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">پنل مدیریت</h1>

          <button
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
            onClick={() => {
              clearToken();
              window.location.href = "/admin/login";
            }}
          >
            خروج
          </button>
        </div>

        {err ? <p className="mt-6 text-red-400">{err}</p> : null}

        {me ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm opacity-70">وارد شدید به عنوان:</p>
            <p className="mt-2 font-medium">{me.email}</p>
            <p className="mt-1 text-sm opacity-70">Role: {me.role}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/admin/articles"
                className="inline-block rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
              >
                مدیریت مقالات →
              </a>

              <a
                href="/admin/cars"
                className="inline-block rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
              >
                مدیریت خودروها →
              </a>
            </div>
          </div>
        ) : (
          <p className="mt-6 opacity-70">در حال بررسی دسترسی...</p>
        )}
      </div>
    </main>
  );
}
