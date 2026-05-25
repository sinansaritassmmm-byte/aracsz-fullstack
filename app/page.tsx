import Link from "next/link";
import ListingCard from "./_components/ListingCard";

const categories = [
  {
    title: "Araç",
    desc: "Otomobil, ticari, motosiklet ve daha fazlası",
    href: "/ilanlar?categoryMain=arac",
    icon: "🚗",
    count: "12.450+ ilan",
  },
  {
    title: "Emlak",
    desc: "Satılık, kiralık, arsa ve işyeri ilanları",
    href: "/ilanlar?categoryMain=emlak",
    icon: "🏠",
    count: "8.320+ ilan",
  },
  {
    title: "Tarım & Hayvancılık",
    desc: "Traktör, ekipman, yem ve canlı hayvan",
    href: "/ilanlar?categoryMain=tarim",
    icon: "🚜",
    count: "3.180+ ilan",
  },
  {
    title: "Elektronik",
    desc: "Telefon, bilgisayar, ekipman ve aksesuar",
    href: "/ilanlar?categoryMain=elektronik",
    icon: "💻",
    count: "5.940+ ilan",
  },
];

const featuredListings = [
  {
    id: 1,
    title: "2020 Renault Clio 1.0 TCe Icon",
    price: "875.000 TL",
    location: "İstanbul",
    meta: "78.000 km • Benzin • Otomatik",
    featured: true,
  },
  {
    id: 2,
    title: "Satılık 2+1 Daire",
    price: "2.450.000 TL",
    location: "Bursa / Nilüfer",
    meta: "110 m² • 2+1 • 3. Kat",
    featured: true,
  },
  {
    id: 3,
    title: "John Deere 5075E Traktör",
    price: "1.320.000 TL",
    location: "Konya",
    meta: "2021 model • Düşük saat",
    featured: false,
  },
  {
    id: 4,
    title: "MacBook Pro 14 M2",
    price: "54.900 TL",
    location: "Ankara",
    meta: "Kutulu • Temiz • 16 GB RAM",
    featured: false,
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:pt-10">
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,172,193,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(229,57,53,0.12),transparent_26%)]" />

        <div className="relative grid gap-8 px-6 py-8 md:grid-cols-[1.2fr,0.8fr] md:px-10 md:py-12">
          <div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              Türkiye genelinde ilan platformu
            </div>

            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Türkiye&apos;nin yeni nesil <span className="text-[#00acc1]">ilan pazarı</span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
              Araç, emlak, tarım, elektronik ve daha fazlası için hızlı, sade ve güven veren
              bir ilan deneyimi.
            </p>

            <form
              action="/ilanlar"
              method="GET"
              className="mt-7 rounded-2xl border border-white/10 bg-[#0c1b26]/90 p-3 shadow-xl"
            >
              <div className="grid gap-3 md:grid-cols-[1.4fr,0.8fr,0.8fr,auto]">
                <input
                  type="text"
                  name="q"
                  placeholder="Ne arıyorsunuz?"
                  className="h-12 rounded-xl border border-white/10 bg-[#132432] px-4 text-sm text-white placeholder:text-white/40 outline-none"
                />

                <select
                  name="categoryMain"
                  className="h-12 rounded-xl border border-white/10 bg-[#132432] px-4 text-sm text-white outline-none"
                  defaultValue=""
                >
                  <option value="" className="bg-white text-black">
                    Kategori seçin
                  </option>
                  <option value="arac" className="bg-white text-black">
                    Araç
                  </option>
                  <option value="emlak" className="bg-white text-black">
                    Emlak
                  </option>
                  <option value="tarim" className="bg-white text-black">
                    Tarım
                  </option>
                  <option value="elektronik" className="bg-white text-black">
                    Elektronik
                  </option>
                </select>

                <input
                  type="text"
                  name="city"
                  placeholder="Şehir"
                  className="h-12 rounded-xl border border-white/10 bg-[#132432] px-4 text-sm text-white placeholder:text-white/40 outline-none"
                />

                <button
                  type="submit"
                  className="h-12 rounded-xl bg-[#e53935] px-6 text-sm font-semibold text-white hover:bg-[#d32f2f]"
                >
                  Ara
                </button>
              </div>
            </form>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/65">
              <span>✓ Ücretsiz ilan</span>
              <span>✓ Kolay yayınlama</span>
              <span>✓ Kurumsal & bireysel kullanım</span>
              <span>✓ Mobil uyumlu yapı</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-white/60">Bugün yayında</div>
              <div className="mt-2 text-3xl font-bold text-white">29.890+</div>
              <div className="mt-1 text-sm text-white/60">Aktif ilan</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-white/60">En çok aranan</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/80">
                  Otomobil
                </span>
                <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/80">
                  2+1 Daire
                </span>
                <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/80">
                  Traktör
                </span>
                <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/80">
                  iPhone
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#00acc1]/15 to-[#e53935]/10 p-5">
              <div className="text-sm text-white/70">Hızlı başlangıç</div>
              <div className="mt-2 text-lg font-semibold text-white">
                Dakikalar içinde ilan ver, alıcılarla buluş.
              </div>
              <Link
                href="/ilan-ver"
                className="mt-4 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900"
              >
                Hemen ilan oluştur
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Popüler kategoriler</h2>
            <p className="mt-1 text-sm text-white/65">En çok ziyaret edilen ilan alanları</p>
          </div>

          <Link
            href="/ilanlar"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Tüm kategoriler
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                  {item.icon}
                </div>
                <div className="text-xs text-white/45">{item.count}</div>
              </div>

              <div className="mt-4 text-lg font-semibold text-white">{item.title}</div>
              <div className="mt-1 text-sm leading-6 text-white/65">{item.desc}</div>
              <div className="mt-4 text-sm font-medium text-[#00acc1] group-hover:text-white">
                Kategoriye git →
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Öne çıkan ilanlar</h2>
            <p className="mt-1 text-sm text-white/65">Vitrindeki ilanlardan bazıları</p>
          </div>

          <Link
            href="/ilanlar"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Tüm ilanları gör
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredListings.map((item) => (
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
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-lg font-semibold text-white">Kolay ilan yönetimi</div>
          <div className="mt-2 text-sm leading-6 text-white/65">
            İlan oluşturma, düzenleme ve yayınlama süreçlerini sade bir yapıda yönetin.
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-lg font-semibold text-white">Güçlü vitrin yapısı</div>
          <div className="mt-2 text-sm leading-6 text-white/65">
            Kategoriler, öne çıkan ilanlar ve filtreleme ile kullanıcıyı sonuca daha hızlı götürün.
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-lg font-semibold text-white">Kurumsal görünüm</div>
          <div className="mt-2 text-sm leading-6 text-white/65">
            Güven veren modern tasarım ile bireysel ve kurumsal kullanıcıları aynı yapıda toplayın.
          </div>
        </div>
      </section>
    </div>
  );
}