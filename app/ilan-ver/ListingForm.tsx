"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function ListingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const res = await fetch("/api/listings", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "İlan oluşturulamadı");
      }

      // Başarılı → anasayfaya ya da ilan listesine yönlendirebilirsin
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border rounded-lg p-4 bg-white"
    >
      {error && (
        <div className="text-sm text-red-600 border border-red-300 rounded p-2">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Başlık</label>
        <input
          name="title"
          type="text"
          required
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Örn: 2015 Model Dizel Araç"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Fiyat (TL)</label>
        <input
          name="price"
          type="number"
          min={0}
          required
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Örn: 450000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Kategori</label>
        <select
          name="category"
          required
          className="w-full border rounded px-3 py-2 text-sm"
        >
          <option value="">Seçiniz</option>
          <option value="arac">Araç</option>
          <option value="emlak">Emlak</option>
          <option value="elektronik">Elektronik</option>
          <option value="diger">Diğer</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Konum</label>
        <input
          name="location"
          type="text"
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Örn: İstanbul / Kadıköy"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Açıklama</label>
        <textarea
          name="description"
          required
          rows={4}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="İlan detaylarını yazınız..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          İlan Görseli (tek resim)
        </label>
        <input
          name="image"
          type="file"
          accept="image/*"
          className="w-full text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          Şimdilik tek görsel destekli, sonra çoklu yaparız.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded bg-emerald-600 text-white text-sm font-medium disabled:opacity-60"
      >
        {loading ? "Kaydediliyor..." : "İlanı Yayınla"}
      </button>
    </form>
  );
}
