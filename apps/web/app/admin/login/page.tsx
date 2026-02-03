"use client";

import { useState } from "react";
import { setToken } from "@/lib/adminApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@carspixel.com");
  const [password, setPassword] = useState("12345678");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text(); // 👈 خروجی واقعی API

      if (!res.ok) {
        setError(`خطا ${res.status}: ${text}`);
        return;
      }

      const data = JSON.parse(text) as { accessToken: string };

      setToken(data.accessToken);
      window.location.href = "/admin";
    } catch (err: any) {
      setError(`خطای ارتباط با سرور: ${err?.message ?? "unknown error"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-bold text-center">ورود ادمین</h1>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm opacity-70">ایمیل</label>
            <input
              className="mt-2 w-full rounded-xl bg-black/30 px-4 py-3 outline-none border border-white/10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              required
            />
          </div>

          <div>
            <label className="text-sm opacity-70">رمز عبور</label>
            <input
              className="mt-2 w-full rounded-xl bg-black/30 px-4 py-3 outline-none border border-white/10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              dir="ltr"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-white text-black py-3 font-medium transition disabled:opacity-60"
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </div>
    </main>
  );
}
