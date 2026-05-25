"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);

      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        alert("Çıkış yapılırken bir hata oluştu.");
        return;
      }

      router.refresh();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout hatası:", error);
      alert("Çıkış yapılırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Çıkış yapılıyor..." : "Çıkış Yap"}
    </button>
  );
}