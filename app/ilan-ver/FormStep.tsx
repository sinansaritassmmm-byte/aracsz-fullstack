"use client";

import { useMemo, useState } from "react";
import type { CategoryKey } from "./CategoryStep";

export type DraftListing = {
  category: CategoryKey;
  title: string;
  price: string;
  location: string;
  description: string;
  images: string[];

  categoryMain: string;
  categorySub: string;
  brand: string;
  modelName: string;
  city: string;
  district: string;

  // ✅ Vasıta özel
  vehicleYear: string;
  vehicleKm: string;
  vehicleFuel: string;
  vehicleGear: string;
};

const SUBCATS: Record<CategoryKey, string[]> = {
  arac: ["Otomobil", "SUV / Cip", "Kamyon", "Minibüs", "Kamyonet", "Motosiklet"],
  tarim: ["Traktör", "Tarım Makinesi", "Hayvancılık", "Yem / Gübre", "Ekipman"],
  emlak: ["Daire", "Müstakil", "Arsa", "İşyeri", "Tarla"],
  elektronik: ["Telefon", "Bilgisayar", "TV / Ses", "Beyaz Eşya", "Diğer"],
};

const BRANDS: Record<string, string[]> = {
  "Otomobil": ["Renault","Fiat","Volkswagen","Ford","Toyota","Hyundai","Honda","Peugeot","Opel","BMW","Mercedes-Benz","Audi","Tesla","Togg"],
  "SUV / Cip": ["Jeep","Land Rover","Toyota","Hyundai","Kia","BMW","Mercedes-Benz","Audi","Tesla","Togg"],
  "Kamyon": ["Mercedes-Benz","MAN","Scania","Volvo","DAF","Iveco","Ford Trucks","Isuzu"],
  "Minibüs": ["Ford","Volkswagen","Mercedes-Benz","Fiat","Peugeot","Citroën"],
  "Kamyonet": ["Ford","Fiat","Volkswagen","Toyota","Nissan","Isuzu"],
  "Motosiklet": ["Yamaha","Honda","Kawasaki","Suzuki","BMW","KTM","Bajaj","TVS","Harley-Davidson","Vespa"],
  "Traktör": ["New Holland","John Deere","Massey Ferguson","Case IH","Deutz-Fahr","Tümosan","Erkunt","Valtra","Kubota"],
  "Telefon": ["Apple","Samsung","Xiaomi","Huawei","Oppo","Vivo","Realme","OnePlus","Honor","Nothing"],
  "Bilgisayar": ["Apple","Lenovo","HP","Dell","Asus","Acer","MSI","Samsung","Huawei"],
  "TV / Ses": ["Samsung","LG","Sony","Philips","Vestel","Arçelik","Beko"],
  "Beyaz Eşya": ["Arçelik","Beko","Bosch","Siemens","Vestel","Profilo","Samsung","LG"],
};

const CITIES = ["İstanbul","Ankara","İzmir","Bursa","Antalya","Adana","Konya","Kocaeli","Gaziantep","Mersin"];

const FUEL_OPTIONS = ["Benzin", "Dizel", "LPG", "Hibrit", "Elektrik"] as const;
const GEAR_OPTIONS = ["Manuel", "Otomatik", "Yarı Otomatik"] as const;

function mapCategoryMain(c: CategoryKey) {
  if (c === "arac") return "Vasıta";
  if (c === "tarim") return "Tarım & Hayvancılık";
  if (c === "emlak") return "Emlak";
  return "Elektronik & Diğer";
}

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, { ...init, cache: "no-store" });
  const text = await res.text();
  let data: any = {};
  try { data = text ? JSON.parse(text) : {}; } catch {}
  if (!res.ok) throw new Error(data?.error || `REQUEST_FAILED_${res.status}`);
  return data;
}

export default function FormStep(props: {
  draft: DraftListing;
  setDraft: (updater: (d: DraftListing) => DraftListing) => void;
  onBack: () => void;
}) {
  const { draft, setDraft, onBack } = props;

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const subOptions = useMemo(() => SUBCATS[draft.category] ?? [], [draft.category]);
  const brandOptions = useMemo(() => (draft.categorySub ? BRANDS[draft.categorySub] ?? [] : []), [draft.categorySub]);

  const categoryMain = mapCategoryMain(draft.category);
  const isVehicle = categoryMain === "Vasıta";

  const inputStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(2,6,23,0.6)",
    color: "white",
    padding: "10px 12px",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    opacity: 0.75,
    fontWeight: 800,
    marginBottom: 6,
  };

  async function submit() {
    setBusy(true);
    setErr(null);
    try {
      const body = {
        category: draft.category,
        title: draft.title,
        price: draft.price ? Number(draft.price) : null,
        location: draft.location,
        description: draft.description,
        images: draft.images,

        categoryMain,
        categorySub: draft.categorySub || null,
        brand: draft.brand || null,
        modelName: draft.modelName || null,
        city: draft.city || null,
        district: draft.district || null,

        // ✅ Vasıta özel
        vehicleYear: isVehicle && draft.vehicleYear ? Number(draft.vehicleYear) : null,
        vehicleKm: isVehicle && draft.vehicleKm ? Number(draft.vehicleKm) : null,
        vehicleFuel: isVehicle ? (draft.vehicleFuel || null) : null,
        vehicleGear: isVehicle ? (draft.vehicleGear || null) : null,
      };

      await fetchJson("/api/listings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      window.location.href = "/ilanlarim";
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onBack}
          style={{
            borderRadius: 12,
            padding: "10px 12px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "white",
            fontWeight: 900,
          }}
        >
          ← Kategoriye dön
        </button>
      </div>

      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div style={labelStyle}>Başlık</div>
          <input
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder="Örn: 2024 model Clio"
            style={inputStyle}
          />
        </div>

        <div>
          <div style={labelStyle}>Fiyat (TL)</div>
          <input
            value={draft.price}
            onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value.replace(/[^\d]/g, "") }))}
            placeholder="950000"
            style={inputStyle}
          />
        </div>

        <div>
          <div style={labelStyle}>Alt kategori</div>
          <select
            value={draft.categorySub}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                categorySub: e.target.value,
                brand: "",
                modelName: "",
              }))
            }
            style={inputStyle}
          >
            <option value="">Seçiniz</option>
            {subOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <div style={labelStyle}>Marka</div>
          <select
            value={draft.brand}
            onChange={(e) => setDraft((d) => ({ ...d, brand: e.target.value }))}
            disabled={!draft.categorySub}
            style={{ ...inputStyle, opacity: draft.categorySub ? 1 : 0.6 }}
          >
            <option value="">{draft.categorySub ? "Tümü" : "Önce alt kategori seç"}</option>
            {brandOptions.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div>
          <div style={labelStyle}>Model</div>
          <input
            value={draft.modelName}
            onChange={(e) => setDraft((d) => ({ ...d, modelName: e.target.value }))}
            placeholder="Örn: Clio"
            style={inputStyle}
          />
        </div>

        <div>
          <div style={labelStyle}>Şehir</div>
          <select value={draft.city} onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))} style={inputStyle}>
            <option value="">Seçiniz</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <div style={labelStyle}>İlçe</div>
          <input
            value={draft.district}
            onChange={(e) => setDraft((d) => ({ ...d, district: e.target.value }))}
            placeholder="Örn: Kadıköy"
            style={inputStyle}
          />
        </div>

        {/* ✅ Vasıta özel alanlar (sadece vasıta ise görünür) */}
        {isVehicle ? (
          <>
            <div>
              <div style={labelStyle}>Yıl</div>
              <input
                value={draft.vehicleYear}
                onChange={(e) => setDraft((d) => ({ ...d, vehicleYear: e.target.value.replace(/[^\d]/g, "") }))}
                placeholder="2024"
                style={inputStyle}
              />
            </div>

            <div>
              <div style={labelStyle}>KM</div>
              <input
                value={draft.vehicleKm}
                onChange={(e) => setDraft((d) => ({ ...d, vehicleKm: e.target.value.replace(/[^\d]/g, "") }))}
                placeholder="45000"
                style={inputStyle}
              />
            </div>

            <div>
              <div style={labelStyle}>Yakıt</div>
              <select
                value={draft.vehicleFuel}
                onChange={(e) => setDraft((d) => ({ ...d, vehicleFuel: e.target.value }))}
                style={inputStyle}
              >
                <option value="">Seçiniz</option>
                {FUEL_OPTIONS.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>

            <div>
              <div style={labelStyle}>Vites</div>
              <select
                value={draft.vehicleGear}
                onChange={(e) => setDraft((d) => ({ ...d, vehicleGear: e.target.value }))}
                style={inputStyle}
              >
                <option value="">Seçiniz</option>
                {GEAR_OPTIONS.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>
          </>
        ) : null}

        <div style={{ gridColumn: "1 / -1" }}>
          <div style={labelStyle}>Konum (serbest)</div>
          <input
            value={draft.location}
            onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
            placeholder="Örn: İstanbul / Kadıköy"
            style={inputStyle}
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <div style={labelStyle}>Açıklama</div>
          <textarea
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            rows={6}
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder="Detayları yaz…"
          />
        </div>
      </div>

      {err ? <div style={{ marginTop: 12, color: "rgba(254,202,202,1)", fontSize: 13 }}>Hata: {err}</div> : null}

      <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={submit}
          disabled={busy}
          style={{
            borderRadius: 14,
            padding: "12px 16px",
            background: "rgb(239,68,68)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "white",
            fontWeight: 900,
            cursor: busy ? "not-allowed" : "pointer",
            opacity: busy ? 0.75 : 1,
          }}
        >
          {busy ? "Kaydediliyor..." : "İlanı Kaydet"}
        </button>
      </div>
    </div>
  );
}
