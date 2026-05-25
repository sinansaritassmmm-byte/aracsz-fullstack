"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function UyeOlPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        setError("Sunucudan geçersiz yanıt döndü.");
        return;
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Üyelik oluşturulamadı.");
        return;
      }

      setSuccess(data.message || "Üyelik oluşturuldu.");

      setTimeout(() => {
        router.push(
          redirectTo && redirectTo !== "/"
            ? `/giris-yap?redirect=${encodeURIComponent(redirectTo)}`
            : "/giris-yap"
        );
        router.refresh();
      }, 800);
    } catch {
      setError("Sunucuya ulaşılamıyor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#07111a] px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
        <div className="mb-6">
          <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium tracking-wide text-cyan-300">
            aracsz.com
          </span>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
            Üye Ol
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Yeni hesap oluşturun ve ilan vermeye başlayın.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              E-posta
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-[#0c1823] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
              placeholder="ornek@mail.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Şifre
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-[#0c1823] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
              placeholder="Şifrenizi oluşturun"
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
              {success}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-red-500 px-6 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Üyelik oluşturuluyor..." : "Üye Ol"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Zaten hesabın var mı?{" "}
          <Link
            href={
              redirectTo && redirectTo !== "/"
                ? `/giris-yap?redirect=${encodeURIComponent(redirectTo)}`
                : "/giris-yap"
            }
            className="font-medium text-cyan-300 hover:text-cyan-200"
          >
            Giriş yap
          </Link>
        </div>
      </div>
    </main>
  );
}