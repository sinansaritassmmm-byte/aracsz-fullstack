"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ListingDetailActions({
  listingId,
  isOwner,
  owner,
}: {
  listingId: string;
  isOwner: boolean;
  owner: { id: string; name: string | null; email: string | null };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function unpublish() {
    if (!confirm("İlan yayından kaldırılsın mı? (Taslağa alınacak)")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/listings/${listingId}/unpublish`, { method: "PATCH" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        alert("Yayından kaldırma başarısız.");
        return;
      }
      alert("İlan taslağa alındı.");
      router.push("/ilanlarim");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function del() {
    if (!confirm("İlan silinsin mi? Bu işlem geri alınamaz.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/listings/${listingId}/delete`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        alert("Silme başarısız.");
        return;
      }
      alert("İlan silindi.");
      router.push("/ilanlarim");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (isOwner) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Link
          href={`/ilanlarim/${listingId}/edit`}
          style={{
            display: "block",
            textAlign: "center",
            padding: "10px 12px",
            borderRadius: 10,
            background: "#111",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 800,
          }}
        >
          Düzenle
        </Link>

        <button
          type="button"
          onClick={unpublish}
          disabled={busy}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "#fff",
            cursor: busy ? "not-allowed" : "pointer",
            fontWeight: 800,
          }}
        >
          Yayından Kaldır
        </button>

        <button
          type="button"
          onClick={del}
          disabled={busy}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #f2caca",
            background: "#fff",
            cursor: busy ? "not-allowed" : "pointer",
            fontWeight: 800,
            color: "#b00",
          }}
        >
          Sil
        </button>
      </div>
    );
  }

  // visitor: şimdilik mailto
  const mailto = owner?.email ? `mailto:${owner.email}?subject=İlan%20Hakkında&body=Merhaba,%20ilan%20ID:%20${listingId}` : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>
        <div style={{ fontWeight: 800, color: "#111", marginBottom: 6 }}>İlan Sahibi</div>
        <div>{owner?.name ?? "Kullanıcı"}</div>
        <div>{owner?.email ?? "E-posta yok"}</div>
      </div>

      {mailto ? (
        <a
          href={mailto}
          style={{
            display: "block",
            textAlign: "center",
            padding: "10px 12px",
            borderRadius: 10,
            background: "#d11",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 900,
          }}
        >
          İletişime Geç
        </a>
      ) : (
        <button
          type="button"
          disabled
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #eee",
            background: "#f7f7f7",
            fontWeight: 900,
            color: "#999",
          }}
        >
          İletişim Bilgisi Yok
        </button>
      )}
    </div>
  );
}
