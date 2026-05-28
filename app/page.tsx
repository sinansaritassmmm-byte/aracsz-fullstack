import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const categories = [
  {
    title: "Araç",
    desc: "Otomobil, ticari, motosiklet ve daha fazlası",
    href: "/kategori/arac",
    icon: "🚗",
    key: "Araç",
  },
  {
    title: "Emlak",
    desc: "Satılık, kiralık, arsa ve işyeri ilanları",
    href: "/kategori/emlak",
    icon: "🏠",
    key: "Emlak",
  },
  {
    title: "Tarım",
    desc: "Traktör, ekipman, yem ve canlı hayvan",
    href: "/kategori/tarim",
    icon: "🚜",
    key: "Tarım",
  },
  {
    title: "Elektronik",
    desc: "Telefon, bilgisayar, ekipman ve aksesuar",
    href: "/kategori/elektronik",
    icon: "💻",
    key: "Elektronik",
  },
];

function formatPrice(price: number | null) {
  if (price === null) return "Fiyat belirtilmedi";
  return `${price.toLocaleString("tr-TR")} TL`;
}

export default async function HomePage() {
  const [totalListings, latestListings, categoryCounts] = await Promise.all([
    prisma.listing.count({
      where: { status: "PUBLISHED" },
    }),

    prisma.listing.findMany({
      where: { status: "PUBLISHED" },
      include: { images: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),

    prisma.listing.groupBy({
      by: ["category"],
      where: { status: "PUBLISHED" },
      _count: { category: true },
    }),
  ]);

  function getCategoryCount(category: string) {
    return (
      categoryCounts.find((item) => item.category === category)?._count
        .category || 0
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:pt-10">
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,172,193,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(229,57,53,0.12),transparent_26%)]" />

        <div className="relative grid gap-8 px-6 py-8 md:grid-cols-[1.15fr,0.85fr] md:px-10 md:py-10">
          <div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              Türkiye genelinde ilan platformu
            </div>

            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Türkiye&apos;nin yeni nesil{" "}
              <span className="text-[#00acc1]">ilan pazarı</span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
              Araç, emlak, tarım, elektronik ve daha fazlası için hızlı, sade
              ve güven veren bir ilan deneyimi.
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
                  <option value="">Kategori seçin</option>
                  <option value="arac">Araç</option>
                  <option value="emlak">Emlak</option>
                  <option value="tarim">Tarım</option>
                  <option value="elektronik">Elektronik</option>
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

          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-white/60">Bugün yayında</div>
              <div className="mt-2 text-3xl font-bold text-white">
                {totalListings}
              </div>
              <div className="mt-1 text-sm text-white/60">Aktif ilan</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-white/60">Popüler aramalar</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Otomobil", "Daire", "Traktör", "Telefon", "Bilgisayar"].map(
                  (item) => (
                    <Link
                      key={item}
                      href={`/ilanlar?q=${encodeURIComponent(item)}`}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 hover:bg-white/20"
                    >
                      {item}
                    </Link>
                  )
                )}
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
            <h2 className="text-2xl font-bold text-white">
              Popüler kategoriler
            </h2>
            <p className="mt-1 text-sm text-white/65">
              En çok ziyaret edilen ilan alanları
            </p>
          </div>

          <Link
            href="/ilanlar"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Tüm ilanlar
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
                <div className="text-xs text-white/45">
                  {getCategoryCount(item.key)} ilan
                </div>
              </div>

              <div className="mt-4 text-lg font-semibold text-white">
                {item.title}
              </div>
              <div className="mt-1 text-sm leading-6 text-white/65">
                {item.desc}
              </div>
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
            <h2 className="text-2xl font-bold text-white">
              Son eklenen ilanlar
            </h2>
            <p className="mt-1 text-sm text-white/65">
              Yayına alınan en yeni ilanlar
            </p>
          </div>

          <Link
            href="/ilanlar"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Tüm ilanları gör
          </Link>
        </div>

        {latestListings.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <div className="text-xl font-bold text-white">
              Henüz yayınlanmış ilan yok
            </div>
            <p className="mt-2 text-sm text-white/60">
              İlk ilan yayınlandığında burada görünecek.
            </p>
            <Link
              href="/ilan-ver"
              className="mt-5 inline-flex rounded-xl bg-[#e53935] px-5 py-3 text-sm font-bold text-white"
            >
              İlk ilanı ver
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {latestListings.map((listing) => {
              const image = listing.images[0]?.url;

              return (
                <Link
                  key={listing.id}
                  href={`/ilan/${listing.id}`}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <div className="h-44 bg-[#0b2233]">
                    {image ? (
                      <img
                        src={image}
                        alt={listing.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-white/35">
                        Fotoğraf yok
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="mb-2 text-xs font-semibold text-[#00acc1]">
                      {listing.categorySub || listing.category}
                    </div>

                    <h3 className="line-clamp-2 min-h-[48px] text-base font-bold text-white">
                      {listing.title}
                    </h3>

                    <div className="mt-3 text-xl font-extrabold text-[#00acc1]">
                      {formatPrice(listing.price)}
                    </div>

                    <div className="mt-2 text-sm text-white/55">
                      {listing.city || "Şehir belirtilmedi"}
                      {listing.district ? ` / ${listing.district}` : ""}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-lg font-semibold text-white">
            Kolay ilan yönetimi
          </div>
          <div className="mt-2 text-sm leading-6 text-white/65">
            İlan oluşturma, düzenleme ve yayınlama süreçlerini sade bir yapıda
            yönetin.
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-lg font-semibold text-white">
            Gerçek zamanlı vitrin
          </div>
          <div className="mt-2 text-sm leading-6 text-white/65">
            Yayındaki ilanlar otomatik olarak ana sayfada ve kategori
            sayfalarında görünür.
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-lg font-semibold text-white">
            Kurumsal görünüm
          </div>
          <div className="mt-2 text-sm leading-6 text-white/65">
            Güven veren modern tasarım ile bireysel ve kurumsal kullanıcıları
            aynı yapıda toplayın.
          </div>
        </div>
      </section>
    </div>
  );
}