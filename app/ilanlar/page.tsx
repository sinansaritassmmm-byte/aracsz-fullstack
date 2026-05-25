import ListingCard from "../_components/ListingCard";

const listings = [
  {
    id: 1,
    title: "2020 Renault Clio 1.0 TCe Icon",
    price: "875.000 TL",
    location: "İstanbul / Pendik",
    meta: "78.000 km • Benzin • Otomatik",
    featured: true,
  },
  {
    id: 2,
    title: "2021 Fiat Egea Cross Urban",
    price: "968.000 TL",
    location: "Ankara / Çankaya",
    meta: "52.000 km • Dizel • Manuel",
    featured: false,
  },
  {
    id: 3,
    title: "Satılık 2+1 Daire",
    price: "2.450.000 TL",
    location: "Bursa / Nilüfer",
    meta: "110 m² • 2+1 • 3. Kat",
    featured: true,
  },
  {
    id: 4,
    title: "Kiralık 3+1 Ofis",
    price: "38.000 TL",
    location: "İzmir / Bayraklı",
    meta: "140 m² • Plaza • Asansör",
    featured: false,
  },
  {
    id: 5,
    title: "John Deere 5075E Traktör",
    price: "1.320.000 TL",
    location: "Konya / Selçuklu",
    meta: "2021 model • Düşük saat",
    featured: false,
  },
  {
    id: 6,
    title: "New Holland TD110",
    price: "1.480.000 TL",
    location: "Aksaray / Merkez",
    meta: "Kabinsiz • Temiz kullanım",
    featured: true,
  },
  {
    id: 7,
    title: "MacBook Pro 14 M2",
    price: "54.900 TL",
    location: "Ankara / Yenimahalle",
    meta: "Kutulu • Temiz • 16 GB RAM",
    featured: false,
  },
  {
    id: 8,
    title: "iPhone 15 128 GB",
    price: "41.500 TL",
    location: "İstanbul / Kadıköy",
    meta: "Yurt içi • Faturalı • Hatasız",
    featured: false,
  },
];

const categories = [
  "Tümü",
  "Araç",
  "Emlak",
  "Tarım & Hayvancılık",
  "Elektronik",
];

const cities = [
  "Tüm Şehirler",
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Konya",
  "Aksaray",
];

export default function ListingsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:pt-10">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-white md:text-4xl">İlanlar</h1>
        <p className="mt-2 text-sm text-white/65 md:text-base">
          Araç, emlak, tarım, elektronik ve daha fazlasını filtreleyerek inceleyin.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
        <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
          <div className="text-lg font-semibold text-white">Filtreler</div>

          <div className="mt-5 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Kelime / İlan ara
              </label>
              <input
                type="text"
                placeholder="Örn: Clio, 2+1, traktör..."
                className="h-11 w-full rounded-xl border border-white/10 bg-[#132432] px-4 text-sm text-white placeholder:text-white/40 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Kategori
              </label>
              <select
                defaultValue=""
                className="h-11 w-full rounded-xl border border-white/10 bg-[#132432] px-4 text-sm text-white outline-none"
              >
                <option value="" className="bg-white text-slate-900">
                  Kategori seçin
                </option>
                {categories.map((item) => (
                  <option key={item} value={item} className="bg-white text-slate-900">
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Şehir
              </label>
              <select
                defaultValue=""
                className="h-11 w-full rounded-xl border border-white/10 bg-[#132432] px-4 text-sm text-white outline-none"
              >
                <option value="" className="bg-white text-slate-900">
                  Şehir seçin
                </option>
                {cities.map((item) => (
                  <option key={item} value={item} className="bg-white text-slate-900">
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Fiyat aralığı
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Min"
                  className="h-11 rounded-xl border border-white/10 bg-[#132432] px-4 text-sm text-white placeholder:text-white/40 outline-none"
                />
                <input
                  type="text"
                  placeholder="Max"
                  className="h-11 rounded-xl border border-white/10 bg-[#132432] px-4 text-sm text-white placeholder:text-white/40 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-white/80">
                İlan tipi
              </label>
              <div className="space-y-2 text-sm text-white/75">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-[#00acc1]" />
                  <span>Öne çıkanlar</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-[#00acc1]" />
                  <span>Yeni eklenenler</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-[#00acc1]" />
                  <span>Kurumsal ilanlar</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button className="h-11 rounded-xl bg-[#e53935] px-4 text-sm font-semibold text-white hover:bg-[#d32f2f]">
                Filtrele
              </button>
              <button className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white hover:bg-white/10">
                Temizle
              </button>
            </div>
          </div>
        </aside>

        <section>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-white/70">
                <span className="font-semibold text-white">{listings.length}</span> ilan bulundu
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <select className="h-11 rounded-xl border border-white/10 bg-[#132432] px-4 text-sm text-white outline-none">
                  <option className="bg-white text-slate-900">Sıralama: Önerilen</option>
                  <option className="bg-white text-slate-900">Fiyat: Artan</option>
                  <option className="bg-white text-slate-900">Fiyat: Azalan</option>
                  <option className="bg-white text-slate-900">Tarih: En yeni</option>
                </select>

                <div className="flex overflow-hidden rounded-xl border border-white/10">
                  <button className="bg-white/10 px-4 py-2 text-sm font-medium text-white">
                    Grid
                  </button>
                  <button className="bg-transparent px-4 py-2 text-sm font-medium text-white/65 hover:bg-white/5 hover:text-white">
                    Liste
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((item) => (
              <ListingCard
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                location={item.location}
                meta={item.meta}
                featured={item.featured}
              />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <button className="h-10 min-w-10 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white hover:bg-white/10">
              Önceki
            </button>
            <button className="h-10 min-w-10 rounded-xl bg-[#00acc1] px-4 text-sm font-semibold text-white">
              1
            </button>
            <button className="h-10 min-w-10 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white hover:bg-white/10">
              2
            </button>
            <button className="h-10 min-w-10 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white hover:bg-white/10">
              3
            </button>
            <button className="h-10 min-w-10 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white hover:bg-white/10">
              Sonraki
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}