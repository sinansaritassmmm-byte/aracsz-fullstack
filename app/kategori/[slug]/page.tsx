import Link from "next/link";
import { prisma } from "@/lib/prisma";

const categoryTitles: Record<string, string> = {
  arac: "Araç",
  emlak: "Emlak",
  tarim: "Tarım",
  elektronik: "Elektronik",
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category =
    categoryTitles[slug] || "Kategori";

  const listings = await prisma.listing.findMany({
    where: {
      status: "PUBLISHED",
      category,
    },

    include: {
      images: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-[#06131d] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-2 text-5xl font-extrabold">
          {category}
        </h1>

        <p className="mb-10 text-slate-400">
          {category} kategorisindeki ilanlar
        </p>

        {listings.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-400">
            Bu kategoride henüz ilan yok.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/ilan/${listing.id}`}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:scale-[1.02]"
              >
                <div className="aspect-[4/3] bg-[#0b2233]">
                  {listing.images[0] ? (
                    <img
                      src={listing.images[0].url}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-500">
                      Fotoğraf yok
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="mb-2 line-clamp-2 text-lg font-bold">
                    {listing.title}
                  </div>

                  <div className="mb-3 text-sm text-slate-400">
                    {listing.city || "Şehir yok"}
                  </div>

                  <div className="text-2xl font-extrabold text-cyan-400">
                    {listing.price
                      ? `${listing.price.toLocaleString("tr-TR")} ₺`
                      : "Fiyat yok"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}