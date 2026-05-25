"use client";

import { useMemo, useState } from "react";

type Img = { id: string; url: string };

export default function ListingGallery({ images, title }: { images: Img[]; title?: string }) {
  const normalized = useMemo(() => {
    const arr = Array.isArray(images) ? images.filter((x) => x?.url) : [];
    return arr;
  }, [images]);

  const [active, setActive] = useState(0);

  const safeActive = Math.min(Math.max(active, 0), Math.max(normalized.length - 1, 0));
  const activeUrl = normalized[safeActive]?.url ?? null;

  return (
    <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
      <div
        style={{
          width: "100%",
          aspectRatio: "16/10",
          borderRadius: 10,
          overflow: "hidden",
          background: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {activeUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeUrl}
            alt={title ?? "İlan"}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{ color: "#999" }}>Görsel yok</div>
        )}
      </div>

      {normalized.length > 1 ? (
        <div style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto", paddingBottom: 4 }}>
          {normalized.map((img, idx) => {
            const isActive = idx === safeActive;
            return (
              <button
                key={img.id ?? img.url ?? idx}
                type="button"
                onClick={() => setActive(idx)}
                style={{
                  border: isActive ? "2px solid #d11" : "1px solid #eee",
                  borderRadius: 10,
                  padding: 0,
                  background: "#fff",
                  cursor: "pointer",
                  flex: "0 0 auto",
                  width: 92,
                  height: 68,
                  overflow: "hidden",
                }}
                aria-label={`Görsel ${idx + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={`thumb-${idx + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
