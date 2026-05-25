"use client";

import Link from "next/link";

type ListingRow = {
  id: string;
  title: string;
  category: string;
  price: number | null;
  status: string | null;
  createdAt: string | Date;
  coverUrl: string | null;
};

export default function MyListingsClient({ listings }: { listings: ListingRow[] }) {
  if (!listings?.length) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
        <div className="font-semibold">Henüz ilan yok.</div>
        <div className="text-sm text-white/70 mt-1">
          İlk ilanını oluşturmak için “İlan ver”e tıkla.
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {listings.map((l) => (
        <div
          key={l.id}
          className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur p-4 flex items-center gap-4"
        >
          <div
            className="shrink-0 overflow-hidden rounded-xl border border-white/15 bg-black/20"
            style={{ width: 96, height: 80 }}
          >
            {l.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={l.coverUrl}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-white/50">
                Görsel yok
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="font-semibold truncate">{l.title}</div>
            <div className="text-sm text-white/70">
              {l.category} •{" "}
              {typeof l.price === "number" ? `${l.price.toLocaleString("tr-TR")} ₺` : "Fiyat yok"} •{" "}
              {l.status ?? "—"}
            </div>

            <div className="mt-3 flex gap-2">
              <Link
                href={`/ilanlar/${l.id}`}
                className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/10"
              >
                Gör
              </Link>

              <Link
                href={`/ilanlarim/${l.id}/edit`}
                className="rounded-lg bg-black/70 text-white px-3 py-2 text-sm hover:bg-black/80"
              >
                Düzenle
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
