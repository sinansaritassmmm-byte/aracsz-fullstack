"use client";

import { useMemo, useState } from "react";

export type ListingFormValues = {
  title: string;
  description: string;
  price: string; // input string
  categoryMain: string;
  categorySub: string;
  brand: string;
  modelName: string;
  city: string;
  district: string;

  vehicleYear: string;
  vehicleKm: string;
  vehicleFuel: string;
  vehicleGear: string;
};

export type ExistingImage = { id: string; url: string };

const CATEGORY_MAIN = [
  { value: "", label: "(Seçiniz)" },
  { value: "arac", label: "Vasıta" },
  { value: "tarim", label: "Tarım & Hayvancılık" },
  { value: "emlak", label: "Emlak" },
  { value: "elektronik", label: "Elektronik & Diğer" },
];

const VEHICLE_FUEL = ["", "Benzin", "Dizel", "LPG", "Hibrit", "Elektrik"];
const VEHICLE_GEAR = ["", "Manuel", "Otomatik", "Yarı Otomatik"];

export default function ListingForm({
  mode,
  initialValues,
  existingImages,
  onSubmit,
  submitLabel,
  busy,
}: {
  mode: "create" | "edit";
  initialValues?: Partial<ListingFormValues>;
  existingImages?: ExistingImage[];
  onSubmit: (payload: { values: ListingFormValues; newFiles: File[] }) => Promise<void>;
  submitLabel: string;
  busy?: boolean;
}) {
  const [values, setValues] = useState<ListingFormValues>({
    title: initialValues?.title ?? "",
    description: initialValues?.description ?? "",
    price: initialValues?.price ?? "",

    categoryMain: initialValues?.categoryMain ?? "",
    categorySub: initialValues?.categorySub ?? "",
    brand: initialValues?.brand ?? "",
    modelName: initialValues?.modelName ?? "",
    city: initialValues?.city ?? "",
    district: initialValues?.district ?? "",

    vehicleYear: initialValues?.vehicleYear ?? "",
    vehicleKm: initialValues?.vehicleKm ?? "",
    vehicleFuel: initialValues?.vehicleFuel ?? "",
    vehicleGear: initialValues?.vehicleGear ?? "",
  });

  const [newFiles, setNewFiles] = useState<File[]>([]);

  const showVehicleFields = values.categoryMain === "arac";

  const canSubmit = useMemo(() => {
    if (!values.title.trim()) return false;
    if (!values.description.trim()) return false;
    return true;
  }, [values.title, values.description]);

  function set<K extends keyof ListingFormValues>(k: K, v: string) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  async function handleSubmit() {
    if (!canSubmit || busy) return;
    await onSubmit({ values, newFiles });
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
      <div style={{ display: "grid", gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Başlık *</div>
          <input
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="örn: 2024 Renault Clio"
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
          />
        </div>

        <div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Açıklama *</div>
          <textarea
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Detayları yaz..."
            rows={6}
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd", resize: "vertical" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Fiyat (TL)</div>
            <input
              value={values.price}
              onChange={(e) => set("price", e.target.value.replace(/[^\d]/g, ""))}
              inputMode="numeric"
              placeholder="örn: 950000"
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            />
          </div>

          <div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Kategori (Main)</div>
            <select
              value={values.categoryMain}
              onChange={(e) => set("categoryMain", e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            >
              {CATEGORY_MAIN.map((x) => (
                <option key={x.value} value={x.value}>
                  {x.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Alt Kategori (Sub)</div>
            <input
              value={values.categorySub}
              onChange={(e) => set("categorySub", e.target.value)}
              placeholder="örn: Otomobil"
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            />
          </div>
          <div />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Marka</div>
            <input
              value={values.brand}
              onChange={(e) => set("brand", e.target.value)}
              placeholder="örn: Renault"
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Model</div>
            <input
              value={values.modelName}
              onChange={(e) => set("modelName", e.target.value)}
              placeholder="örn: Clio"
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Şehir</div>
            <input
              value={values.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="örn: İstanbul"
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>İlçe</div>
            <input
              value={values.district}
              onChange={(e) => set("district", e.target.value)}
              placeholder="örn: Kadıköy"
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            />
          </div>
        </div>

        {/* ✅ Vasıta alanları */}
        {showVehicleFields ? (
          <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 10 }}>Vasıta Bilgileri</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Yıl</div>
                <input
                  value={values.vehicleYear}
                  onChange={(e) => set("vehicleYear", e.target.value.replace(/[^\d]/g, ""))}
                  inputMode="numeric"
                  placeholder="örn: 2024"
                  style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>KM</div>
                <input
                  value={values.vehicleKm}
                  onChange={(e) => set("vehicleKm", e.target.value.replace(/[^\d]/g, ""))}
                  inputMode="numeric"
                  placeholder="örn: 12000"
                  style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                />
              </div>

              <div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Yakıt</div>
                <select
                  value={values.vehicleFuel}
                  onChange={(e) => set("vehicleFuel", e.target.value)}
                  style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                >
                  {VEHICLE_FUEL.map((x) => (
                    <option key={x} value={x}>
                      {x === "" ? "(Seçiniz)" : x}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Vites</div>
                <select
                  value={values.vehicleGear}
                  onChange={(e) => set("vehicleGear", e.target.value)}
                  style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                >
                  {VEHICLE_GEAR.map((x) => (
                    <option key={x} value={x}>
                      {x === "" ? "(Seçiniz)" : x}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : null}

        {/* ✅ Görseller */}
        <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
          <div style={{ fontWeight: 800, marginBottom: 10 }}>Görseller</div>

          {existingImages?.length ? (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
              {existingImages.map((img) => (
                <div key={img.id} style={{ width: 120, height: 90, borderRadius: 10, overflow: "hidden", border: "1px solid #eee" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="existing" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          ) : null}

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setNewFiles(files);
            }}
          />

          {newFiles.length ? (
            <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
              Yeni seçilen dosya: <b>{newFiles.length}</b>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          disabled={!canSubmit || !!busy}
          onClick={handleSubmit}
          style={{
            marginTop: 6,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "#111",
            color: "#fff",
            cursor: !canSubmit || busy ? "not-allowed" : "pointer",
            fontWeight: 900,
          }}
        >
          {busy ? "İşleniyor..." : submitLabel}
        </button>

        {mode === "edit" ? (
          <div style={{ fontSize: 12, color: "#666" }}>
            Not: Şimdilik mevcut görseller silinmez; yeni seçtiklerin eklenir.
          </div>
        ) : null}
      </div>
    </div>
  );
}
