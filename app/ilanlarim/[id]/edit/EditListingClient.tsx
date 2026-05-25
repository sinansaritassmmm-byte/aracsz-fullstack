"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ListingImage = { id: string; url: string };

type OwnerListing = {
  id: string;
  title: string;
  description?: string | null;
  price?: number | null;
  category: string;

  status?: string | null;

  categoryMain?: string | null;
  categorySub?: string | null;

  brand?: string | null;
  modelName?: string | null;

  city?: string | null;
  district?: string | null;

  vehicleYear?: number | null;
  vehicleKm?: number | null;
  vehicleFuel?: string | null;
  vehicleGear?: string | null;

  images: ListingImage[];
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function numOrNull(v: string) {
  const t = v.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export default function EditListingClient({ listingId }: { listingId: string }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");

  const [category, setCategory] = useState("arac"); // zorunlu alan (senin schema)
  const [categoryMain, setCategoryMain] = useState<string>("arac");
  const [categorySub, setCategorySub] = useState<string>("");

  const [brand, setBrand] = useState("");
  const [modelName, setModelName] = useState("");

  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  const [vehicleYear, setVehicleYear] = useState("");
  const [vehicleKm, setVehicleKm] = useState("");
  const [vehicleFuel, setVehicleFuel] = useState("");
  const [vehicleGear, setVehicleGear] = useState("");

  const [existingImages, setExistingImages] = useState<ListingImage[]>([]);
  const [deleteImageIds, setDeleteImageIds] = useState<Set<string>>(new Set());
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [replaceImages, setReplaceImages] = useState(false);

  const isVehicle = useMemo(() => (categoryMain || category) === "arac", [categoryMain, category]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchJson<{ listing: OwnerListing }>(`/api/listings/${listingId}/owner`);
        if (!alive) return;

        const l = data.listing;

        setTitle(l.title ?? "");
        setDescription(l.description ?? "");
        setPrice(l.price != null ? String(l.price) : "");

        setCategory(l.category ?? "arac");
        setCategoryMain(l.categoryMain ?? (l.category ?? "arac"));
        setCategorySub(l.categorySub ?? "");

        setBrand(l.brand ?? "");
        setModelName(l.modelName ?? "");

        setCity(l.city ?? "");
        setDistrict(l.district ?? "");

        setVehicleYear(l.vehicleYear != null ? String(l.vehicleYear) : "");
        setVehicleKm(l.vehicleKm != null ? String(l.vehicleKm) : "");
        setVehicleFuel(l.vehicleFuel ?? "");
        setVehicleGear(l.vehicleGear ?? "");

        setExistingImages(l.images ?? []);
        setDeleteImageIds(new Set());
        setNewFiles([]);
        setReplaceImages(false);
      } catch (e: any) {
        setError(e?.message ?? "İlan yüklenemedi");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [listingId]);

  function toggleDelete(id: string) {
    setDeleteImageIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function onPickFiles(files: FileList | null) {
    if (!files) return;
    setNewFiles((prev) => [...prev, ...Array.from(files)]);
  }

  function removeNewFile(idx: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function onSave() {
    try {
      setSaving(true);
      setError(null);

      if (!title.trim()) throw new Error("Başlık zorunlu");
      if (!category?.trim()) throw new Error("category zorunlu");

      const fd = new FormData();
      fd.set("title", title.trim());
      fd.set("description", description.trim());
      fd.set("category", category.trim());

      const p = numOrNull(price);
      if (p != null) fd.set("price", String(p));
      else fd.set("price", "");

      fd.set("categoryMain", categoryMain?.trim() ?? "");
      fd.set("categorySub", categorySub?.trim() ?? "");
      fd.set("brand", brand?.trim() ?? "");
      fd.set("modelName", modelName?.trim() ?? "");
      fd.set("city", city?.trim() ?? "");
      fd.set("district", district?.trim() ?? "");

      fd.set("replaceImages", replaceImages ? "1" : "0");

      // silinecek mevcut görseller
      for (const id of deleteImageIds) fd.append("deleteImageIds", id);

      // yeni görseller
      newFiles.forEach((f) => fd.append("images", f));

      // vasıta
      if (isVehicle) {
        fd.set("vehicleYear", vehicleYear.trim());
        fd.set("vehicleKm", vehicleKm.trim());
        fd.set("vehicleFuel", vehicleFuel.trim());
        fd.set("vehicleGear", vehicleGear.trim());
      } else {
        fd.set("vehicleYear", "");
        fd.set("vehicleKm", "");
        fd.set("vehicleFuel", "");
        fd.set("vehicleGear", "");
      }

      const res = await fetch(`/api/listings/${listingId}/update`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error(await res.text());

      const out = await res.json();
      router.push(`/ilanlar/${out?.listing?.id ?? listingId}`);
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="rounded-xl border p-4">Yükleniyor…</div>;
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>
      ) : null}

      <div className="rounded-2xl border p-4 md:p-6 space-y-4">
        <div className="grid gap-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Başlık *</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border px-3 py-2"
              placeholder="Örn: 2016 Clio 1.5 dCi"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Açıklama</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-lg border px-3 py-2 min-h-[120px]"
              placeholder="Detayları yaz…"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium">Fiyat</span>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="rounded-lg border px-3 py-2"
                placeholder="Örn: 750000"
                inputMode="numeric"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium">category (zorunlu)</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border px-3 py-2"
              >
                <option value="arac">arac</option>
                <option value="emlak">emlak</option>
                <option value="elektronik">elektronik</option>
                <option value="diger">diger</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-4 md:p-6 space-y-4">
        <h2 className="font-semibold">Filtre Alanları</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium">categoryMain</span>
            <select
              value={categoryMain}
              onChange={(e) => setCategoryMain(e.target.value)}
              className="rounded-lg border px-3 py-2"
            >
              <option value="">—</option>
              <option value="arac">arac</option>
              <option value="emlak">emlak</option>
              <option value="elektronik">elektronik</option>
              <option value="diger">diger</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">categorySub</span>
            <input
              value={categorySub}
              onChange={(e) => setCategorySub(e.target.value)}
              className="rounded-lg border px-3 py-2"
              placeholder="Örn: otomobil / suv / daire"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Marka (brand)</span>
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="rounded-lg border px-3 py-2"
              placeholder="Örn: Renault"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Model (modelName)</span>
            <input
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="rounded-lg border px-3 py-2"
              placeholder="Örn: Clio"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Şehir (city)</span>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-lg border px-3 py-2"
              placeholder="Örn: İstanbul"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">İlçe (district)</span>
            <input
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="rounded-lg border px-3 py-2"
              placeholder="Örn: Kadıköy"
            />
          </label>
        </div>
      </div>

      {isVehicle ? (
        <div className="rounded-2xl border p-4 md:p-6 space-y-4">
          <h2 className="font-semibold">Vasıta Alanları</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium">Yıl (vehicleYear)</span>
              <input
                value={vehicleYear}
                onChange={(e) => setVehicleYear(e.target.value)}
                className="rounded-lg border px-3 py-2"
                inputMode="numeric"
                placeholder="2016"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium">KM (vehicleKm)</span>
              <input
                value={vehicleKm}
                onChange={(e) => setVehicleKm(e.target.value)}
                className="rounded-lg border px-3 py-2"
                inputMode="numeric"
                placeholder="125000"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium">Yakıt (vehicleFuel)</span>
              <select
                value={vehicleFuel}
                onChange={(e) => setVehicleFuel(e.target.value)}
                className="rounded-lg border px-3 py-2"
              >
                <option value="">—</option>
                <option value="benzin">benzin</option>
                <option value="dizel">dizel</option>
                <option value="hibrit">hibrit</option>
                <option value="elektrik">elektrik</option>
                <option value="lpg">lpg</option>
              </select>
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium">Vites (vehicleGear)</span>
              <select
                value={vehicleGear}
                onChange={(e) => setVehicleGear(e.target.value)}
                className="rounded-lg border px-3 py-2"
              >
                <option value="">—</option>
                <option value="manuel">manuel</option>
                <option value="otomatik">otomatik</option>
                <option value="yari-otomatik">yari-otomatik</option>
              </select>
            </label>
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">Görseller</h2>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={replaceImages}
              onChange={(e) => setReplaceImages(e.target.checked)}
            />
            replaceImages (işaretlersen tüm eski görselleri silip yenileri ekler)
          </label>
        </div>

        {existingImages?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {existingImages.map((img) => {
              const marked = deleteImageIds.has(img.id);
              return (
                <div
                  key={img.id}
                  className={`rounded-xl border overflow-hidden ${marked ? "opacity-60" : ""}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="w-full h-28 object-cover" />
                  <label className="flex items-center gap-2 p-2 text-sm">
                    <input
                      type="checkbox"
                      checked={marked}
                      onChange={() => toggleDelete(img.id)}
                    />
                    Sil
                  </label>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-neutral-600">Mevcut görsel yok.</div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium">Yeni görsel ekle</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => onPickFiles(e.target.files)}
          />

          {newFiles.length ? (
            <div className="space-y-2">
              {newFiles.map((f, idx) => (
                <div key={`${f.name}-${idx}`} className="flex items-center justify-between gap-3">
                  <div className="text-sm truncate">{f.name}</div>
                  <button
                    type="button"
                    onClick={() => removeNewFile(idx)}
                    className="text-sm rounded-lg border px-3 py-1 hover:bg-neutral-50"
                  >
                    Kaldır
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border px-4 py-2 hover:bg-neutral-50"
          disabled={saving}
        >
          Vazgeç
        </button>
        <button
          type="button"
          onClick={onSave}
          className="rounded-xl bg-black text-white px-4 py-2 hover:opacity-90 disabled:opacity-60"
          disabled={saving}
        >
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>
    </div>
  );
}
