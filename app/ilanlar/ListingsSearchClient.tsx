"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Row = {
  id: string;
  title: string;
  category: string;
  categoryMain?: string | null;
  categorySub?: string | null;
  brand?: string | null;
  modelName?: string | null;
  city?: string | null;
  district?: string | null;
  price: number | null;
  vehicleYear?: number | null;
  vehicleKm?: number | null;
  vehicleFuel?: string | null;
  vehicleGear?: string | null;
  coverUrl: string | null;
  createdAt: string;
};

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  let data: any = {};
  try { data = text ? JSON.parse(text) : {}; } catch {}
  if (!res.ok) throw new Error(data?.error || `REQUEST_FAILED_${res.status}`);
  return data;
}

function formatTL(v: number | null) {
  if (v == null) return "-";
  try { return new Intl.NumberFormat("tr-TR").format(v) + " TL"; } catch { return `${v} TL`; }
}

const SUBCATS: Record<string, string[]> = {
  "Vasıta": ["Otomobil", "SUV / Cip", "Kamyon", "Minibüs", "Kamyonet", "Motosiklet"],
  "Tarım & Hayvancılık": ["Traktör", "Tarım Makinesi", "Hayvancılık", "Yem / Gübre", "Ekipman"],
  "Emlak": ["Daire", "Müstakil", "Arsa", "İşyeri", "Tarla"],
  "Elektronik & Diğer": ["Telefon", "Bilgisayar", "TV / Ses", "Beyaz Eşya", "Diğer"],
};

const BRANDS: Record<string, string[]> = {
  "Otomobil": ["Renault","Fiat","Volkswagen","Ford","Toyota","Hyundai","Honda","Peugeot","Opel","BMW","Mercedes-Benz","Audi","Tesla","Togg"],
  "SUV / Cip": ["Jeep","Land Rover","Toyota","Hyundai","Kia","BMW","Mercedes-Benz","Audi","Tesla","Togg"],
  "Kamyon": ["Mercedes-Benz","MAN","Scania","Volvo","DAF","Iveco","Ford Trucks","Isuzu"],
  "Minibüs": ["Ford","Volkswagen","Mercedes-Benz","Fiat","Peugeot","Citroën"],
  "Kamyonet": ["Ford","Fiat","Volkswagen","Toyota","Nissan","Isuzu"],
  "Motosiklet": ["Yamaha","Honda","Kawasaki","Suzuki","BMW","KTM","Bajaj","TVS","Harley-Davidson","Vespa"],
};

const CITIES = ["İstanbul","Ankara","İzmir","Bursa","Antalya","Adana","Konya","Kocaeli","Gaziantep","Mersin"];

type SortKey = "new" | "old" | "price_asc" | "price_desc";

const FUEL_OPTIONS = ["", "Benzin", "Dizel", "LPG", "Hibrit", "Elektrik"];
const GEAR_OPTIONS = ["", "Manuel", "Otomatik", "Yarı Otomatik"];

export default function ListingsSearchClient() {
  const [q, setQ] = useState("");
  const [categoryMain, setCategoryMain] = useState("");
  const [categorySub, setCategorySub] = useState("");
  const [brand, setBrand] = useState("");
  const [modelName, setModelName] = useState("");

  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortKey>("new");

  // ✅ Vasıta özel filtre state
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [minKm, setMinKm] = useState("");
  const [maxKm, setMaxKm] = useState("");
  const [fuel, setFuel] = useState("");
  const [gear, setGear] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [items, setItems] = useState<Row[]>([]);

  const subOptions = useMemo(() => (categoryMain ? (SUBCATS[categoryMain] ?? []) : []), [categoryMain]);
  const brandOptions = useMemo(() => (categorySub ? (BRANDS[categorySub] ?? []) : []), [categorySub]);

  const isVehicle = categoryMain === "Vasıta";

  function buildUrl() {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (categoryMain) p.set("categoryMain", categoryMain);
    if (categorySub) p.set("categorySub", categorySub);
    if (brand) p.set("brand", brand);
    if (modelName.trim()) p.set("modelName", modelName.trim());
    if (city) p.set("city", city);
    if (district.trim()) p.set("district", district.trim());
    if (minPrice.trim()) p.set("minPrice", minPrice.trim());
    if (maxPrice.trim()) p.set("maxPrice", maxPrice.trim());
    p.set("sort", sort);

    // ✅ sadece Vasıta ise vasıta paramlarını ekle
    if (isVehicle) {
      if (minYear.trim()) p.set("minYear", minYear.trim());
      if (maxYear.trim()) p.set("maxYear", maxYear.trim());
      if (minKm.trim()) p.set("minKm", minKm.trim());
      if (maxKm.trim()) p.set("maxKm", maxKm.trim());
      if (fuel.trim()) p.set("fuel", fuel.trim());
      if (gear.trim()) p.set("gear", gear.trim());
    }

    return `/api/listings?${p.toString()}`;
  }

  async function runSearch() {
    setLoading(true);
    setErr(null);
    try {
      const data = await fetchJson(buildUrl());
      setItems((data.listings ?? []) as Row[]);
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { runSearch(); /* eslint-disable-next-line */ }, []);

  const panel: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.20)",
  };

  const input: React.CSSProperties = {
    width: "100%",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(2,6,23,0.6)",
    color: "white",
    padding: "10px 12px",
    outline: "none",
  };

  const label: React.CSSProperties = { fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 6, fontWeight: 700 };

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: -0.5, color: "white" }}>
            aracsz.com <span style={{ color: "rgb(45,212,191)" }}>ilanlar</span>
          </div>
          <div style={{ marginTop: 10, color: "rgba(255,255,255,0.7)" }}>Yayındaki ilanlarda ara.</div>
        </div>

        <Link
          href="/ilan-ver"
          style={{
            borderRadius: 16,
            background: "rgb(239,68,68)",
            color: "white",
            padding: "12px 16px",
            fontWeight: 900,
            boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
            whiteSpace: "nowrap",
          }}
        >
          İlan ver
        </Link>
      </div>

      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
        {/* SOL */}
        <aside style={{ ...panel, padding: 14, position: "sticky", top: 18, height: "fit-content" }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: "white" }}>Filtreler</div>

          <div style={{ marginTop: 12 }}>
            <div style={label}>Arama</div>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Kelime, marka, model..." style={input} />
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={label}>Kategori</div>
            <select
              value={categoryMain}
              onChange={(e) => {
                const v = e.target.value;
                setCategoryMain(v);
                setCategorySub("");
                setBrand("");
                setModelName("");

                // kategori değişince vasıta özel alanları da sıfırla
                setMinYear(""); setMaxYear(""); setMinKm(""); setMaxKm(""); setFuel(""); setGear("");
              }}
              style={input}
            >
              <option value="">Tümü</option>
              <option value="Vasıta">Vasıta</option>
              <option value="Tarım & Hayvancılık">Tarım & Hayvancılık</option>
              <option value="Emlak">Emlak</option>
              <option value="Elektronik & Diğer">Elektronik & Diğer</option>
            </select>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={label}>Alt kategori</div>
            <select
              value={categorySub}
              onChange={(e) => { setCategorySub(e.target.value); setBrand(""); setModelName(""); }}
              disabled={!categoryMain}
              style={{ ...input, opacity: categoryMain ? 1 : 0.6 }}
            >
              <option value="">{categoryMain ? "Seçiniz" : "Önce kategori seç"}</option>
              {subOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={label}>Marka</div>
            <select value={brand} onChange={(e) => setBrand(e.target.value)} disabled={!categorySub} style={{ ...input, opacity: categorySub ? 1 : 0.6 }}>
              <option value="">{categorySub ? "Tümü" : "Önce alt kategori seç"}</option>
              {brandOptions.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={label}>Model</div>
            <input value={modelName} onChange={(e) => setModelName(e.target.value)} placeholder="Örn: Clio" style={input} />
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={label}>Şehir</div>
            <select value={city} onChange={(e) => setCity(e.target.value)} style={input}>
              <option value="">Tümü</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={label}>İlçe</div>
            <input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Örn: Kadıköy" style={input} />
          </div>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={label}>Min fiyat</div>
              <input value={minPrice} onChange={(e) => setMinPrice(e.target.value.replace(/[^\d]/g, ""))} style={input} />
            </div>
            <div>
              <div style={label}>Max fiyat</div>
              <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value.replace(/[^\d]/g, ""))} style={input} />
            </div>
          </div>

          {/* ✅ Vasıta özel filtre alanları */}
          {isVehicle ? (
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.10)" }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "white" }}>Vasıta Filtreleri</div>

              <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div style={label}>Min yıl</div>
                  <input value={minYear} onChange={(e) => setMinYear(e.target.value.replace(/[^\d]/g, ""))} placeholder="2000" style={input} />
                </div>
                <div>
                  <div style={label}>Max yıl</div>
                  <input value={maxYear} onChange={(e) => setMaxYear(e.target.value.replace(/[^\d]/g, ""))} placeholder="2025" style={input} />
                </div>

                <div>
                  <div style={label}>Min km</div>
                  <input value={minKm} onChange={(e) => setMinKm(e.target.value.replace(/[^\d]/g, ""))} placeholder="0" style={input} />
                </div>
                <div>
                  <div style={label}>Max km</div>
                  <input value={maxKm} onChange={(e) => setMaxKm(e.target.value.replace(/[^\d]/g, ""))} placeholder="200000" style={input} />
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={label}>Yakıt</div>
                <select value={fuel} onChange={(e) => setFuel(e.target.value)} style={input}>
                  {FUEL_OPTIONS.map((x) => <option key={x} value={x}>{x || "Tümü"}</option>)}
                </select>
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={label}>Vites</div>
                <select value={gear} onChange={(e) => setGear(e.target.value)} style={input}>
                  {GEAR_OPTIONS.map((x) => <option key={x} value={x}>{x || "Tümü"}</option>)}
                </select>
              </div>
            </div>
          ) : null}

          <div style={{ marginTop: 12 }}>
            <div style={label}>Sıralama</div>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} style={input}>
              <option value="new">En yeni</option>
              <option value="old">En eski</option>
              <option value="price_asc">Fiyat (artan)</option>
              <option value="price_desc">Fiyat (azalan)</option>
            </select>
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
            <button
              onClick={runSearch}
              disabled={loading}
              style={{
                flex: 1,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgb(20,184,166)",
                color: "white",
                fontWeight: 900,
                padding: "10px 12px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.75 : 1,
              }}
            >
              {loading ? "Aranıyor..." : "Ara"}
            </button>

            <button
              onClick={() => {
                setQ(""); setCategoryMain(""); setCategorySub(""); setBrand(""); setModelName("");
                setCity(""); setDistrict(""); setMinPrice(""); setMaxPrice(""); setSort("new");
                setMinYear(""); setMaxYear(""); setMinKm(""); setMaxKm(""); setFuel(""); setGear("");
                setTimeout(runSearch, 0);
              }}
              style={{
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.85)",
                fontWeight: 900,
                padding: "10px 12px",
              }}
            >
              Sıfırla
            </button>
          </div>

          {err ? <div style={{ marginTop: 12, color: "rgba(254,202,202,1)", fontSize: 13 }}>Hata: {err}</div> : null}
        </aside>

        {/* SAĞ */}
        <section>
          <div style={{ ...panel, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: "white" }}>Sonuçlar</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{loading ? "Yükleniyor..." : `${items.length} ilan`}</div>
            </div>
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
            {items.map((x) => (
              <Link
                key={x.id}
                href={`/ilan/${x.id}`}
                style={{
                  display: "block",
                  overflow: "hidden",
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  boxShadow: "0 18px 45px rgba(0,0,0,0.25)",
                }}
              >
                <div style={{ height: 200, overflow: "hidden", background: "rgba(0,0,0,0.35)" }}>
                  {x.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={x.coverUrl} alt={x.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.45)" }}>
                      Görsel yok
                    </div>
                  )}
                </div>

                <div style={{ padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: "white" }}>{x.title}</div>
                      <div style={{ marginTop: 4, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                        {[x.categoryMain, x.categorySub, x.brand].filter(Boolean).join(" • ")}
                      </div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: "white", whiteSpace: "nowrap" }}>{formatTL(x.price)}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
