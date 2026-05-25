"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Detail = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
  status: "DRAFT" | "PUBLISHED";
  createdAt: string;
  images: string[];
};

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, { ...init, cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "REQUEST_FAILED");
  return data;
}

function formatTL(v: number | null) {
  if (v == null) return "-";
  try {
    return new Intl.NumberFormat("tr-TR").format(v) + " TL";
  } catch {
    return `${v} TL`;
  }
}

export default function ListingDetailClient({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [listing, setListing] = useState<Detail | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await fetchJson(`/api/listings/${id}`);
        setListing(data.listing as Detail);
        setIsOwner(!!data.isOwner);
      } catch (e: any) {
        setErr(String(e?.message ?? e));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div style={{ maxWidth: 980, margin: "0 auto", padding: 24, color: "rgba(255,255,255,0.75)" }}>Yükleniyor...</div>;

  if (err || !listing) {
    return (
      <div style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
        <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", padding: 18, color: "rgba(255,255,255,0.75)" }}>
          İlan bulunamadı.
        </div>
      </div>
    );
  }

  const cover = listing.images?.[0] ?? null;
  const isPub = listing.status === "PUBLISHED";

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 34, fontWeight: 900, color: "white", letterSpacing: -0.3 }}>{listing.title}</div>
          <div style={{ marginTop: 6, color: "rgba(255,255,255,0.65)" }}>{listing.category}</div>

          {isOwner ? (
            <div style={{ marginTop: 10, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
              Durum:{" "}
              <b style={{ color: isPub ? "rgb(52,211,153)" : "rgb(251,191,36)" }}>
                {isPub ? "Yayında" : "Taslak"}
              </b>
            </div>
          ) : null}
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: "white" }}>{formatTL(listing.price)}</div>
        </div>
      </div>

      <div style={{ marginTop: 18, overflow: "hidden", borderRadius: 18, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", boxShadow: "0 18px 45px rgba(0,0,0,0.35)" }}>
        <div style={{ height: 380, overflow: "hidden", background: "rgba(0,0,0,0.35)" }}>
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.45)" }}>
              Görsel yok
            </div>
          )}
        </div>

        <div style={{ padding: 18 }}>
          <div style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{listing.description}</div>

          {/* ✅ Owner'a özel aksiyonlar */}
          {isOwner ? (
            <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {!isPub ? (
                <button
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      await fetchJson(`/api/listings/${id}/publish`, { method: "POST" });
                      setListing({ ...listing, status: "PUBLISHED" });
                    } finally {
                      setBusy(false);
                    }
                  }}
                  style={{ borderRadius: 12, padding: "10px 12px", background: "rgb(16,185,129)", color: "white", fontWeight: 900, cursor: busy ? "not-allowed" : "pointer", opacity: busy ? 0.75 : 1 }}
                >
                  Yayınla
                </button>
              ) : null}

              <Link
                href={`/ilan/${id}/duzenle`}
                style={{ borderRadius: 12, padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.9)", fontWeight: 900 }}
              >
                Düzenle
              </Link>

              <button
                disabled={busy}
                onClick={async () => {
                  if (!confirm("İlan silinsin mi? Bu işlem geri alınamaz.")) return;
                  setBusy(true);
                  try {
                    await fetchJson(`/api/listings/${id}`, { method: "DELETE" });
                    window.location.href = "/ilanlarim";
                  } finally {
                    setBusy(false);
                  }
                }}
                style={{ borderRadius: 12, padding: "10px 12px", background: "rgb(220,38,38)", color: "white", fontWeight: 900, cursor: busy ? "not-allowed" : "pointer", opacity: busy ? 0.75 : 1 }}
              >
                Sil
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
