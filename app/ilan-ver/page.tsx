"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const categoryMap: Record<string, string[]> = {
  Vasıta: ["Otomobil", "SUV", "Motosiklet", "Kamyonet"],
  Emlak: ["Daire", "Villa", "Arsa", "İşyeri"],
  "Elektronik & Oyun": ["Telefon", "Bilgisayar", "Oyun", "Konsol"],
  "Ev Yaşam": ["Mobilya", "Dekorasyon", "Beyaz Eşya"],
  Moda: ["Kadın Giyim", "Erkek Giyim"],
  "Hobi & Eğlence": ["Bisiklet", "Kitap", "Spor"],
  "Tarım & Hayvancılık": ["Traktör", "Ekipman", "Hayvan"],
  Diğer: ["Diğer"],
};

const vehicleBrands: Record<string, string[]> = {
  Mercedes: ["E200", "C180", "E220", "S350"],
  Renault: ["Clio", "Megane", "Fluence", "Symbol"],
  Fiat: ["Egea", "Linea", "Doblo", "Fiorino"],
  BMW: ["320i", "520i", "X5", "X3"],
  Audi: ["A3", "A4", "A6", "Q5"],
  Ford: ["Focus", "Fiesta", "Transit", "Courier"],
  Toyota: ["Corolla", "Yaris", "C-HR"],
  Volkswagen: ["Golf", "Passat", "Polo", "Transporter"],
  Opel: ["Astra", "Corsa", "Insignia"],
};

const cities = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Konya",
  "Kocaeli",
  "Sakarya",
  "Tekirdağ",
  "Edirne",
];

const districtsByCity: Record<string, string[]> = {
  İstanbul: ["Kadıköy", "Üsküdar", "Kağıthane", "Pendik", "Bağcılar", "Beşiktaş"],
  Ankara: ["Çankaya", "Keçiören", "Mamak", "Yenimahalle"],
  İzmir: ["Bornova", "Karşıyaka", "Konak", "Bayraklı"],
  Bursa: ["Nilüfer", "Osmangazi", "Yıldırım"],
  Antalya: ["Muratpaşa", "Kepez", "Alanya"],
  Konya: ["Selçuklu", "Meram", "Karatay"],
  Kocaeli: ["İzmit", "Gebze", "Darıca"],
  Sakarya: ["Adapazarı", "Serdivan", "Erenler"],
  Tekirdağ: ["Çorlu", "Süleymanpaşa", "Kapaklı"],
  Edirne: ["Merkez", "Keşan", "Uzunköprü"],
};

function getTopLevelCategory(main: string) {
  if (main === "Vasıta") return "Araç";
  if (main === "Emlak") return "Emlak";
  if (main === "Tarım & Hayvancılık") return "Tarım";
  if (main === "Elektronik & Oyun") return "Elektronik";
  return "Diğer";
}

function parsePrice(value: string) {
  const cleaned = value.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}

export default function IlanVerPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [categoryMain, setCategoryMain] = useState("Vasıta");
  const [categorySub, setCategorySub] = useState("Otomobil");

  const [brand, setBrand] = useState("");
  const [modelName, setModelName] = useState("");

  const [city, setCity] = useState("İstanbul");
  const [district, setDistrict] = useState("Kağıthane");

  const [vehicleYear, setVehicleYear] = useState("");
  const [vehicleKm, setVehicleKm] = useState("");
  const [vehicleFuel, setVehicleFuel] = useState("");
  const [vehicleGear, setVehicleGear] = useState("");
  const [damageRecord, setDamageRecord] = useState("");

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const subCategories = useMemo(() => categoryMap[categoryMain] || [], [categoryMain]);
  const isVehicle = categoryMain === "Vasıta";

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
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

        if (!res.ok || !data.ok || !data.url) {
          alert("Fotoğraf yüklenemedi.");
          return;
        }

        uploadedUrls.push(data.url);
      }

      setPreviewUrls(uploadedUrls.length ? previews : []);
      setImageUrls(uploadedUrls);
    } catch (error) {
      console.error(error);
      alert("Fotoğraf yükleme sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (imageUrls.length === 0) {
      alert("En az 1 fotoğraf eklemelisin.");
      return;
    }

    const parsedPrice = parsePrice(price);

    if (!parsedPrice || parsedPrice <= 0) {
      alert("Lütfen geçerli bir fiyat gir.");
      return;
    }

    try {
      setLoading(true);

      const finalDescription = [
        description,
        isVehicle && damageRecord ? `Hasar Kaydı: ${damageRecord}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      const res = await fetch("/api/listings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          description: finalDescription,
          price: parsedPrice,
          category: getTopLevelCategory(categoryMain),
          categoryMain,
          categorySub,
          brand,
          modelName,
          city,
          district,
          vehicleYear: vehicleYear ? Number(vehicleYear) : null,
          vehicleKm: vehicleKm ? Number(vehicleKm.replace(/\./g, "")) : null,
          vehicleFuel,
          vehicleGear,
          imageUrls,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        alert(data.message || data.error || "İlan kaydedilirken hata oluştu.");
        return;
      }

      alert("İlan başarıyla yayınlandı.");
      router.push("/ilanlarim");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("İlan oluşturulamadı.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#06131d] text-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-2 text-5xl font-extrabold">İlan Ver</h1>
        <p className="mb-10 text-slate-400">Yeni ilan oluştur ve yayınla.</p>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm">İlan Başlığı</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-2xl bg-[#0b2233] px-4 py-3 outline-none"
                placeholder="Örn: Sahibinden temiz Mercedes E200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">Ana Kategori</label>
              <select
                value={categoryMain}
                onChange={(e) => {
                  const next = e.target.value;
                  setCategoryMain(next);
                  setCategorySub(categoryMap[next][0]);
                  setBrand("");
                  setModelName("");
                }}
                className="w-full rounded-2xl bg-[#0b2233] px-4 py-3 outline-none"
              >
                {Object.keys(categoryMap).map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm">Alt Kategori</label>
              <select
                value={categorySub}
                onChange={(e) => setCategorySub(e.target.value)}
                className="w-full rounded-2xl bg-[#0b2233] px-4 py-3 outline-none"
              >
                {subCategories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {isVehicle ? (
              <>
                <div>
                  <label className="mb-2 block text-sm">Marka</label>
                  <select
                    value={brand}
                    onChange={(e) => {
                      setBrand(e.target.value);
                      setModelName("");
                    }}
                    className="w-full rounded-2xl bg-[#0b2233] px-4 py-3 outline-none"
                    required
                  >
                    <option value="">Marka seç</option>
                    {Object.keys(vehicleBrands).map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm">Model</label>
                  <select
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full rounded-2xl bg-[#0b2233] px-4 py-3 outline-none"
                    required
                  >
                    <option value="">Model seç</option>
                    {(vehicleBrands[brand] || []).map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm">Model Yılı</label>
                  <input
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(e.target.value)}
                    className="w-full rounded-2xl bg-[#0b2233] px-4 py-3 outline-none"
                    placeholder="Örn: 2000"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">KM</label>
                  <input
                    value={vehicleKm}
                    onChange={(e) => setVehicleKm(e.target.value)}
                    className="w-full rounded-2xl bg-[#0b2233] px-4 py-3 outline-none"
                    placeholder="Örn: 225000"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">Yakıt</label>
                  <select
                    value={vehicleFuel}
                    onChange={(e) => setVehicleFuel(e.target.value)}
                    className="w-full rounded-2xl bg-[#0b2233] px-4 py-3 outline-none"
                  >
                    <option value="">Yakıt seç</option>
                    <option>Benzin</option>
                    <option>Dizel</option>
                    <option>LPG</option>
                    <option>Hibrit</option>
                    <option>Elektrik</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm">Vites</label>
                  <select
                    value={vehicleGear}
                    onChange={(e) => setVehicleGear(e.target.value)}
                    className="w-full rounded-2xl bg-[#0b2233] px-4 py-3 outline-none"
                  >
                    <option value="">Vites seç</option>
                    <option>Manuel</option>
                    <option>Otomatik</option>
                    <option>Yarı Otomatik</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm">Hasar Kaydı</label>
                  <input
                    value={damageRecord}
                    onChange={(e) => setDamageRecord(e.target.value)}
                    className="w-full rounded-2xl bg-[#0b2233] px-4 py-3 outline-none"
                    placeholder="Örn: Yok / 12.500 TL"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="mb-2 block text-sm">Marka</label>
                  <input
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full rounded-2xl bg-[#0b2233] px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">Model</label>
                  <input
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full rounded-2xl bg-[#0b2233] px-4 py-3 outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="mb-2 block text-sm">Şehir</label>
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setDistrict(districtsByCity[e.target.value]?.[0] || "");
                }}
                className="w-full rounded-2xl bg-[#0b2233] px-4 py-3 outline-none"
              >
                {cities.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm">İlçe</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-2xl bg-[#0b2233] px-4 py-3 outline-none"
              >
                {(districtsByCity[city] || []).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm">Fiyat</label>
              <input
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-2xl bg-[#0b2233] px-4 py-3 outline-none"
                placeholder="Örn: 888.000"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm">Açıklama</label>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-2xl bg-[#0b2233] px-4 py-3 outline-none"
                placeholder="İlan açıklaması..."
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm">Fotoğraflar</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-2xl bg-[#0b2233] px-4 py-3"
              />
              <p className="mt-2 text-sm text-slate-400">
                En az 1 fotoğraf zorunlu. Birden fazla fotoğraf seçebilirsin.
              </p>
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
            className="mt-8 rounded-2xl bg-[#ff3b3b] px-8 py-4 font-bold disabled:opacity-60"
          >
            {loading ? "Yükleniyor..." : "İlanı Yayınla"}
          </button>
        </form>
      </div>
    </div>
  );
}