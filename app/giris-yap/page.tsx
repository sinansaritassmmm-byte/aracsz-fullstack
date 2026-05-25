"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function GirisYapContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/hesabim";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Giriş yapılamadı.");
        return;
      }

      router.refresh();
      router.push(redirectTo);
    } catch (err) {
      console.error("LOGIN_PAGE_ERROR", err);
      setError("Giriş sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#06131d] px-4 py-12 text-white">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <h1 className="text-4xl font-extrabold">Giriş Yap</h1>

          <p className="mt-3 text-slate-400">
            Hesabına giriş yaparak ilan verebilir ve ilanlarını yönetebilirsin.
          </p>

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-2xl border border-white/10 bg-[#0b2233] px-4 py-3 text-white outline-none placeholder:text-slate-500"
                placeholder="ornek@mail.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-2xl border border-white/10 bg-[#0b2233] px-4 py-3 text-white outline-none placeholder:text-slate-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#ff3b3b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#ff2a2a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Hesabın yok mu?{" "}
            <Link
              href="/uye-ol"
              className="font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              Üye ol
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function GirisYapPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#06131d] px-4 py-12 text-white">
          <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
            Yükleniyor...
          </div>
        </main>
      }
    >
      <GirisYapContent />
    </Suspense>
  );
}