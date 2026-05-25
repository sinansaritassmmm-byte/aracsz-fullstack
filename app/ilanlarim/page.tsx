import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function IlanlarimPage() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value;

  if (!userEmail) {
    redirect("/giris-yap");
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      listings: {
        include: {
          images: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    redirect("/giris-yap");
  }

  return (
    <div className="min-h-screen bg-[#06131d] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">İlanlarım</h1>
          <p className="mt-2 text-slate-400">
            Yayınladığın ilanlar burada listelenir.
          </p>
        </div>

        <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm text-slate-400">Giriş yapan kullanıcı</div>
          <div className="mt-1 text-lg font-semibold text-white">
            {user.email}
          </div>
        </div>

        {user.listings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
            <h2 className="text-2xl font-semibold">Henüz ilanın yok</h2>
            <p className="mt-3 text-slate-400">
              İlk ilanını oluşturduğunda burada görünecek.
            </p>

            <div className="mt-6">
              <Link
                href="/ilan-ver"
                className="rounded-2xl bg-[#ff3b3b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#ff2a2a]"
              >
                Yeni İlan Ver
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {user.listings.map((listing) => {
              const firstImage = listing.images[0]?.url || null;

              return (
                <div
                  key={listing.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
                >
                  {firstImage ? (
                    <img
                      src={firstImage}
                      alt={listing.title}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-[#0b2233] text-slate-400">
                      Görsel yok
                    </div>
                  )}

                  <div className="p-5">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                        {listing.category}
                      </span>

                      <span className="text-sm text-slate-400">
                        {listing.city || "Şehir yok"}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-white">
                      {listing.title}
                    </h2>

                    <p className="mt-2 line-clamp-3 text-sm text-slate-400">
                      {listing.description}
                    </p>

                    <div className="mt-4 text-2xl font-extrabold text-white">
                      {listing.price !== null
                        ? `${listing.price.toLocaleString("tr-TR")} TL`
                        : "Fiyat belirtilmedi"}
                    </div>

                    <div className="mt-3 text-xs text-slate-500">
                      Durum:{" "}
                      {listing.status === "PUBLISHED" ? "Yayında" : "Taslak"}
                    </div>

                    {(listing.brand || listing.modelName) && (
                      <div className="mt-2 text-sm text-slate-400">
                        {listing.brand ? listing.brand : ""}
                        {listing.brand && listing.modelName ? " / " : ""}
                        {listing.modelName ? listing.modelName : ""}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}