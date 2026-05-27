import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const categoryLinks = [
  { label: "Tüm İlanlar", href: "/ilanlar" },
  { label: "Araç", href: "/kategori/arac" },
  { label: "Emlak", href: "/kategori/emlak" },
  { label: "Tarım", href: "/kategori/tarim" },
  { label: "Elektronik", href: "/kategori/elektronik" },
];

export default async function IlanlarPage() {
  const listings = await prisma.listing.findMany({
    where: { status: "PUBLISHED" },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  const categoryCounts = await prisma.listing.groupBy({
    by: ["category"],
    where: { status: "PUBLISHED" },
    _count: { category: true },
  });

  const totalCount = listings.length;

  function getCategoryCount(name: string) {
    if (name === "Tüm İlanlar") return totalCount;
    return (
      categoryCounts.find((item) => item.category === name)?._count.category || 0
    );
  }

  return (
    <main className="min-h-screen bg-[#06131d] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-4xl font-extrabold">İlanlar</h1>
          <p className="mt-2 text-slate-400">
            Yayındaki gerçek ilanları kategori, şehir ve fiyata göre inceleyin.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_220px_160px]">
            <input
              placeholder="Kelime, ilan başlığı veya marka ara"
              className="rounded-2xl border border-white/10 bg-[#0b2233] px-4 py-3 text-white outline-none placeholder:text-slate-500"
            />

            <select className="rounded-2xl border border-white/10 bg-[#0b2233] px-4 py-3 text-white outline-none">
              <option>Şehir seç</option>
              <option>İstanbul</option>
              <option>Ankara</option>
              <option>İzmir</option>
              <option>Bursa</option>
              <option>Konya</option>
            </select>

            <button className="rounded-2xl bg-[#ff3b3b] px-5 py-3 font-bold text-white">
              Ara
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="mb-4 text-lg font-bold">Kategoriler</div>

            <div className="space-y-2">
              {categoryLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  <span>{item.label}</span>
                  <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs text-cyan-300">
                    {getCategoryCount(item.label)}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-7 border-t border-white/10 pt-5">
              <div className="mb-3 text-lg font-bold">Fiyat Aralığı</div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Min"
                  className="rounded-xl border border-white/10 bg-[#0b2233] px-3 py-2 text-sm outline-none placeholder:text-slate-500"
                />
                <input
                  placeholder="Max"
                  className="rounded-xl border border-white/10 bg-[#0b2233] px-3 py-2 text-sm outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="mt-7 border-t border-white/10 pt-5">
              <div className="mb-3 text-lg font-bold">Hızlı Erişim</div>

              <Link
                href="/ilan-ver"
                className="block rounded-2xl bg-[#ff3b3b] px-4 py-3 text-center font-bold text-white"
              >
                Ücretsiz İlan Ver
              </Link>
            </div>
          </aside>

          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
              <div>
                <div className="text-sm text-slate-400">Sonuç</div>
                <div className="text-xl font-extrabold">
                  {totalCount} ilan bulundu
                </div>
              </div>

              <select className="rounded-2xl border border-white/10 bg-[#0b2233] px-4 py-3 text-sm text-white outline-none">
                <option>En yeni ilanlar</option>
                <option>Fiyata göre artan</option>
                <option>Fiyata göre azalan</option>
              </select>
            </div>

            {listings.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
                <h2 className="text-2xl font-bold">Henüz yayınlanmış ilan yok</h2>
                <p className="mt-3 text-slate-400">
                  İlk ilan yayınlandığında bu sayfada görünecek.
                </p>

                <Link
                  href="/ilan-ver"
                  className="mt-6 inline-flex rounded-2xl bg-[#ff3b3b] px-6 py-3 font-bold text-white"
                >
                  İlk İlanı Ver
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((listing) => {
                  const image = listing.images[0]?.url;

                  return (
                    <Link
                      key={listing.id}
                      href={`/ilan/${listing.id}`}
                      className="grid overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:border-cyan-400/40 hover:bg-white/[0.07] md:grid-cols-[220px_minmax(0,1fr)_180px]"
                    >
                      <div className="h-52 bg-[#0b2233] md:h-full">
                        {image ? (
                          <img
                            src={image}
                            alt={listing.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-500">
                            Fotoğraf yok
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="mb-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
                            {listing.categorySub || listing.category}
                          </span>

                          {listing.categoryMain ? (
                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300">
                              {listing.categoryMain}
                            </span>
                          ) : null}
                        </div>

                        <h2 className="line-clamp-2 text-xl font-extrabold">
                          {listing.title}
                        </h2>

                        <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                          {listing.description}
                        </p>

                        <div className="mt-4 text-sm text-slate-300">
                          {listing.city || "Şehir belirtilmedi"}
                          {listing.district ? ` / ${listing.district}` : ""}
                        </div>

                        {(listing.brand || listing.modelName) && (
                          <div className="mt-2 text-sm text-slate-400">
                            {listing.brand || ""}
                            {listing.brand && listing.modelName ? " / " : ""}
                            {listing.modelName || ""}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col justify-between border-t border-white/10 p-5 md:border-l md:border-t-0">
                        <div className="text-2xl font-extrabold text-cyan-400">
                          {listing.price
                            ? `${listing.price.toLocaleString("tr-TR")} TL`
                            : "Fiyat belirtilmedi"}
                        </div>

                        <div className="mt-5 rounded-2xl bg-white/10 px-4 py-3 text-center text-sm font-bold text-white">
                          Detayları Gör
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}