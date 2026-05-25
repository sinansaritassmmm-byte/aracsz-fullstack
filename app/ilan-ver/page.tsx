"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const categoryMap: Record<string, string[]> = {
  "Vasıta": ["Otomobil", "SUV", "Motosiklet", "Kamyonet"],
  "Emlak": ["Daire", "Villa", "Arsa"],
  "Elektronik & Oyun": [
    "Telefon",
    "Bilgisayar",
    "Oyun",
    "Konsol",
  ],
  "Ev Yaşam": ["Mobilya", "Dekorasyon"],
  "Moda": ["Kadın Giyim", "Erkek Giyim"],
  "Hobi & Eğlence": ["Bisiklet", "Kitap"],
  "Tarım & Hayvancılık": ["Traktör", "Hayvan"],
  "Diğer": ["Diğer"],
};

const mainCategories = Object.keys(categoryMap);

function getTopLevelCategory(main: string) {
  if (main === "Vasıta") return "Araç";
  if (main === "Emlak") return "Emlak";
  if (main === "Tarım & Hayvancılık") return "Tarım";
  if (main === "Elektronik & Oyun") return "Elektronik";
  return "Diğer";
}

export default function IlanVerPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryMain, setCategoryMain] =
    useState("Elektronik & Oyun");
  const [categorySub, setCategorySub] = useState("Oyun");
  const [brand, setBrand] = useState("");
  const [modelName, setModelName] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const subCategories = useMemo(() => {
    return categoryMap[categoryMain] || [];
  }, [categoryMain]);

  async function handleImageChange(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    const uploadedUrls: string[] = [];
    const previews: string[] = [];

    try {
      setLoading(true);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        previews.push(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!data.ok) {
          alert("Fotoğraf yüklenemedi");
          return;
        }

        uploadedUrls.push(data.url);
      }

      setPreviewUrls(previews);
      setImageUrls(uploadedUrls);
    } catch (error) {
      console.error(error);
      alert("Upload hatası oluştu");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title,
          description,
          price: Number(price),
          category: getTopLevelCategory(categoryMain),
          categoryMain,
          categorySub,
          brand,
          modelName,
          city,
          district,
          imageUrls,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        alert(data.message || "Hata oluştu");
        return;
      }

      alert("İlan başarıyla yayınlandı");

      router.push("/ilanlarim");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("İlan oluşturulamadı");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#06131d] text-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-2 text-5xl font-extrabold">
          İlan Ver
        </h1>

        <p className="mb-10 text-slate-400">
          Yeni ilan oluştur.
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/5 p-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm">
                İlan Başlığı
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-2xl bg-[#0b2233] px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Ana Kategori
              </label>

              <select
                value={categoryMain}
                onChange={(e) => {
                  setCategoryMain(e.target.value);
                  setCategorySub(
                    categoryMap[e.target.value][0]
                  );
                }}
                className="w-full rounded-2xl bg-[#0b2233] px-4 py-3"
              >
                {mainCategories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Alt Kategori
              </label>

              <select
                value={categorySub}
                onChange={(e) =>
                  setCategorySub(e.target.value)
                }
                className="w-full rounded-2xl bg-[#0b2233] px-4 py-3"
              >
                {subCategories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Marka
              </label>

              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-2xl bg-[#0b2233] px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Model
              </label>

              <input
                value={modelName}
                onChange={(e) =>
                  setModelName(e.target.value)
                }
                className="w-full rounded-2xl bg-[#0b2233] px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Şehir
              </label>

              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-2xl bg-[#0b2233] px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                İlçe
              </label>

              <input
                value={district}
                onChange={(e) =>
                  setDistrict(e.target.value)
                }
                className="w-full rounded-2xl bg-[#0b2233] px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Fiyat
              </label>

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-2xl bg-[#0b2233] px-4 py-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm">
                Açıklama
              </label>

              <textarea
                rows={6}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                className="w-full rounded-2xl bg-[#0b2233] px-4 py-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm">
                Fotoğraflar
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-2xl bg-[#0b2233] px-4 py-3"
              />
            </div>

            {previewUrls.length > 0 && (
              <div className="md:col-span-2 grid grid-cols-2 gap-4 md:grid-cols-4">
                {previewUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt=""
                    className="h-40 w-full rounded-2xl object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 rounded-2xl bg-[#ff3b3b] px-8 py-4 font-bold"
          >
            {loading ? "Yükleniyor..." : "İlanı Yayınla"}
          </button>
        </form>
      </div>
    </div>
  );
}