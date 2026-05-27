import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function IlanlarPage() {
  const listings = await prisma.listing.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#06131d] px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-extrabold">İlanlar</h1>
        <p className="mt-2 text-slate-400">
          Yayındaki gerçek ilanlar burada listelenir.
        </p>

        {listings.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
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
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => {
              const image = listing.images[0]?.url;

              return (
                <Link
                  key={listing.id}
                  href={`/ilan/${listing.id}`}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:scale-[1.01]"
                >
                  <div className="h-56 bg-[#0b2233]">
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
                    <div className="mb-2 text-sm text-cyan-300">
                      {listing.categorySub || listing.category}
                    </div>

                    <h2 className="line-clamp-2 text-xl font-bold">
                      {listing.title}
                    </h2>

                    <div className="mt-3 text-sm text-slate-400">
                      {listing.city || "Şehir belirtilmedi"}
                      {listing.district ? ` / ${listing.district}` : ""}
                    </div>

                    <div className="mt-4 text-2xl font-extrabold text-cyan-400">
                      {listing.price
                        ? `${listing.price.toLocaleString("tr-TR")} TL`
                        : "Fiyat belirtilmedi"}
                    </div>

                    <div className="mt-4 text-sm font-semibold text-white">
                      Detay →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}