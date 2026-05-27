"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type User = {
  id?: string;
  email?: string;
  name?: string | null;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadMe() {
    try {
      setLoading(true);

      const res = await fetch("/api/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (res.ok && (data?.user || data?.email)) {
        setUser(data.user || data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMe();
  }, [pathname]);

  async function logout() {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    router.refresh();
    router.push("/");
  }

  const displayName =
    user?.name || user?.email?.split("@")[0] || "Hesabım";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#04111d]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-200 to-cyan-300 text-lg font-extrabold text-[#04111d]">
            aZ
          </div>

          <div>
            <div className="font-extrabold text-white">
              aracsz<span className="text-cyan-400">.com</span>
            </div>
            <div className="text-xs text-slate-400">
              Araçtan emlağa, her şey tek yerde
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/ilanlar" className="font-semibold text-white">
            Tüm İlanlar
          </Link>
          <Link href="/kategori/arac" className="font-semibold text-white">
            Araç
          </Link>
          <Link href="/kategori/emlak" className="font-semibold text-white">
            Emlak
          </Link>
          <Link href="/kategori/tarim" className="font-semibold text-white">
            Tarım
          </Link>
          <Link
            href="/kategori/elektronik"
            className="font-semibold text-white"
          >
            Elektronik
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {loading ? null : user ? (
            <>
              <div className="hidden rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 md:block">
                <div className="text-xs font-bold text-emerald-300">
                  GİRİŞ YAPILDI
                </div>
                <div className="max-w-[160px] truncate text-sm font-semibold text-white">
                  {displayName}
                </div>
              </div>

              <Link
                href="/hesabim"
                className="rounded-xl px-4 py-2 font-semibold text-white hover:bg-white/10"
              >
                Hesabım
              </Link>

              <Link
                href="/ilanlarim"
                className="rounded-xl px-4 py-2 font-semibold text-white hover:bg-white/10"
              >
                İlanlarım
              </Link>

              <button
                onClick={logout}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 font-semibold text-white"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link
                href="/giris-yap"
                className="rounded-xl px-4 py-2 font-semibold text-white"
              >
                Giriş yap
              </Link>

              <Link
                href="/uye-ol"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 font-semibold text-white"
              >
                Üye ol
              </Link>
            </>
          )}

          <Link
            href="/ilan-ver"
            className="rounded-2xl bg-[#ff3b3b] px-6 py-3 font-bold text-white"
          >
            İlan Ver
          </Link>
        </div>
      </div>
    </header>
  );
}