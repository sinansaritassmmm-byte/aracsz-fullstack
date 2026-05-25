"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Item = {
  id: string;
  title: string;
  description: string;
  price: number | null;

  categoryMain: string | null;
  categorySub: string | null;
  brand: string | null;
  modelName: string | null;
  city: string | null;
  district: string | null;

  vehicleYear: number | null;
  vehicleKm: number | null;
  vehicleFuel: string | null;
  vehicleGear: string | null;

  coverUrl: string | null;
  createdAt: string;
};

function spGet(sp: URLSearchParams, k: string) {
  const v = sp.get(k);
  return v && v.trim() ? v : "";
}

export default function IlanlarClient() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [q, setQ] = useState(spGet(sp, "q"));
  const [categoryMain, setCategoryMain] = useState(spGet(sp, "categoryMain"));
  const [categorySub, setCategorySub] = useState(spGet(sp, "categorySub"));
  const [brand, setBrand] = useState(spGet(sp, "brand"));
  const [modelName, setModelName] = useState(spGet(sp, "modelName"));
  const [city, setCity] = useState(spGet(sp, "city"));
  const [district, setDistrict] = useState(spGet(sp, "district"));

  // vasıta filtreler
  const [vehicleYearMin, setVehicleYearMin] = useState(spGet(sp, "vehicleYearMin"));
  const [vehicleYearMax, setVehicleYearMax] = useState(spGet(sp, "vehicleYearMax"));
  const [vehicleKmMin, setVehicleKmMin] = useState(spGet(sp, "vehicleKmMin"));
  const [vehicleKmMax, setVehicleKmMax] = useState(spGet(sp, "vehicleKmMax"));
  const [vehicleFuel, setVehicleFuel] = useState(spGet(sp, "vehicleFuel"));
  const [vehicleGear, setVehicleGear] = useState(spGet(sp, "vehicleGear"));

  const showVehicleFilters = categoryMain === "arac";

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (categoryMain) p.set("categoryMain", categoryMain);
    if (categorySub) p.set("categorySub", categorySub);
    if (brand) p.set("brand", brand);
    if (modelName) p.set("modelName", modelName);
    if (city) p.set("city", city);
    if (district) p.set("district", district);

    if (showVehicleFilters) {
      if (vehicleYearMin) p.set("vehicleYearMin", vehicleYearMin);
      if (vehicleYearMax) p.set("vehicleYearMax", vehicleYearMax);
      if (vehicleKmMin) p.set("vehicleKmMin", vehicleKmMin);
      if (vehicleKmMax) p.set("vehicleKmMax", vehicleKmMax);
      if (vehicleFuel) p.set("vehicleFuel", vehicleFuel);
      if (vehicleGear) p.set("vehicleGear", vehicleGear);
    }

    return p.toString();
  }, [
    q,
    categoryMain,
    categorySub,
    brand,
    modelName,
    city,
    district,
    showVehicleFilters,
    vehicleYearMin,
    vehicleYearMax,
    vehicleKmMin,
    vehicleKmMax,
    vehicleFuel,
    vehicleGear,
  ]);

  function applyFilters() {
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(url);
  }

  useEffect(() => {
    if (categoryMain !== "arac") {
      setVehicleYearMin("");
      setVehicleYearMax("");
      setVehicleKmMin("");
      setVehicleKmMax("");
      setVehicleFuel("");
      setVehicleGear("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryMain]);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`/api/listings/public?${queryString}`, { cache: "no-store" });
        const data = await res.json().catch(() => null);
        if (!alive) return;

        if (!res.ok || !data?.ok) {
          setErr("İlanlar getirilemedi.");
          setItems([]);
          return;
        }
        setItems(Array.isArray(data.items) ? data.items : []);
      } catch {
        if (!alive) return;
        setErr("İlanlar getirilemedi.");
        setItems([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [queryString]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
        <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
          <div style={{ fontWeight: 800, marginBottom: 10 }}>Filtre</div>

          <div style={{ display: "grid", gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Arama</div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Başlık / açıklama"
                style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
              />
            </div>

            <div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Kategori (Main)</div>
              <select
                value={categoryMain}
                onChange={(e) => setCategoryMain(e.target.value)}
                style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
              >
                <option value="">(Hepsi)</option>
                <option value="arac">Vasıta</option>
                <option value="tarim">Tarım & Hayvancılık</option>
                <option value="emlak">Emlak</option>
                <option value="elektronik">Elektronik & Diğer</option>
              </select>
            </div>

            <div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Kategori (Sub)</div>
              <input
                value={categorySub}
                onChange={(e) => setCategorySub(e.target.value)}
                placeholder="örn: Otomobil"
                style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Marka</div>
                <input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="örn: Renault"
                  style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Model</div>
                <input
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="örn: Clio"
                  style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Şehir</div>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="örn: İstanbul"
                  style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>İlçe</div>
                <input
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="örn: Kadıköy"
                  style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                />
              </div>
            </div>

            {showVehicleFilters ? (
              <div style={{ borderTop: "1px solid #eee", paddingTop: 10 }}>
                <div style={{ fontWeight: 800, marginBottom: 10 }}>Vasıta Filtreleri</div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Yıl (Min)</div>
                    <input
                      value={vehicleYearMin}
                      onChange={(e) => setVehicleYearMin(e.target.value)}
                      inputMode="numeric"
                      placeholder="örn: 2015"
                      style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Yıl (Max)</div>
                    <input
                      value={vehicleYearMax}
                      onChange={(e) => setVehicleYearMax(e.target.value)}
                      inputMode="numeric"
                      placeholder="örn: 2022"
                      style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                    />
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>KM (Min)</div>
                    <input
                      value={vehicleKmMin}
                      onChange={(e) => setVehicleKmMin(e.target.value)}
                      inputMode="numeric"
                      placeholder="örn: 50000"
                      style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>KM (Max)</div>
                    <input
                      value={vehicleKmMax}
                      onChange={(e) => setVehicleKmMax(e.target.value)}
                      inputMode="numeric"
                      placeholder="örn: 150000"
                      style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Yakıt</div>
                    <select
                      value={vehicleFuel}
                      onChange={(e) => setVehicleFuel(e.target.value)}
                      style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                    >
                      <option value="">(Hepsi)</option>
                      <option value="Benzin">Benzin</option>
                      <option value="Dizel">Dizel</option>
                      <option value="LPG">LPG</option>
                      <option value="Hibrit">Hibrit</option>
                      <option value="Elektrik">Elektrik</option>
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Vites</div>
                    <select
                      value={vehicleGear}
                      onChange={(e) => setVehicleGear(e.target.value)}
                      style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                    >
                      <option value="">(Hepsi)</option>
                      <option value="Manuel">Manuel</option>
                      <option value="Otomatik">Otomatik</option>
                      <option value="Yarı Otomatik">Yarı Otomatik</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : null}

            <button
              type="button"
              onClick={applyFilters}
              style={{
                marginTop: 6,
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "#111",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 800,
              }}
            >
              Filtrele
            </button>
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>İlanlar</div>
            <div style={{ fontSize: 13, color: "#666" }}>
              {loading ? "Yükleniyor..." : `${items.length} sonuç`}
            </div>
          </div>

          {err ? (
            <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 14, color: "#b00" }}>
              {err}
            </div>
          ) : null}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
            {items.map((it) => (
              <a
                key={it.id}
                href={`/ilanlar/${it.id}`}
                style={{
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                  background: "#fff",
                  border: "1px solid #eee",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <div style={{ width: "100%", aspectRatio: "16/10", background: "#f4f4f4" }}>
                  {it.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.coverUrl} alt={it.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : null}
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 800, marginBottom: 6, lineHeight: 1.2 }}>{it.title}</div>
                  <div style={{ color: "#d11", fontWeight: 900, marginBottom: 6 }}>
                    {it.price != null ? new Intl.NumberFormat("tr-TR").format(it.price) : "-"} TL
                  </div>

                  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>
                    {it.city ?? "-"}{it.district ? ` / ${it.district}` : ""}
                    {it.categoryMain === "arac" ? (
                      <>
                        <br />
                        {it.vehicleYear ?? "-"} •{" "}
                        {it.vehicleKm != null ? new Intl.NumberFormat("tr-TR").format(it.vehicleKm) + " km" : "-"} •{" "}
                        {it.vehicleFuel ?? "-"} • {it.vehicleGear ?? "-"}
                      </>
                    ) : null}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
