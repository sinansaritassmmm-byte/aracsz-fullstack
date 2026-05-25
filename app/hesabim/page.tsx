import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function HesabimPage() {
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

  const ilanSayisi = user.listings.length;
  const favoriSayisi = 0;
  const aramaSayisi = 0;

  return (
    <div className="min-h-screen bg-[#06131d] text-white">
      <div className="mx-auto max-w-[1400px] px-4 py-10">
        <h1 className="mb-8 text-5xl font-extrabold tracking-tight">Hesabım</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-3xl bg-white/5 p-6 shadow-2xl ring-1 ring-white/10">
            <nav className="space-y-5 text-[18px]">
              <Link href="/hesabim" className="block text-white transition hover:text-cyan-300">
                Genel Bakış
              </Link>
              <Link href="/ilanlarim" className="block text-white transition hover:text-cyan-300">
                İlanlarım
              </Link>
              <button
                type="button"
                className="block text-left text-white transition hover:text-cyan-300"
              >
                Favorilerim
              </button>
              <button
                type="button"
                className="block text-left text-white transition hover:text-cyan-300"
              >
                Aramalarım
              </button>
            </nav>
          </aside>

          <section className="space-y-6">
            <div className="rounded-3xl bg-white/5 p-8 shadow-2xl ring-1 ring-white/10">
              <h2 className="text-4xl font-bold">Hoş geldin</h2>
              <p className="mt-4 text-3xl text-slate-200">{user.email}</p>
              {user.name ? (
                <p className="mt-2 text-lg text-slate-400">Ad Soyad: {user.name}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-white/5 p-6 shadow-2xl ring-1 ring-white/10">
                <div className="text-3xl text-slate-300">İlanlarım</div>
                <div className="mt-4 text-5xl font-extrabold">{ilanSayisi}</div>
              </div>

              <div className="rounded-3xl bg-white/5 p-6 shadow-2xl ring-1 ring-white/10">
                <div className="text-3xl text-slate-300">Favoriler</div>
                <div className="mt-4 text-5xl font-extrabold">{favoriSayisi}</div>
              </div>

              <div className="rounded-3xl bg-white/5 p-6 shadow-2xl ring-1 ring-white/10">
                <div className="text-3xl text-slate-300">Aramalar</div>
                <div className="mt-4 text-5xl font-extrabold">{aramaSayisi}</div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/5 p-8 shadow-2xl ring-1 ring-white/10">
              <h3 className="text-3xl font-bold">Hızlı İşlemler</h3>

              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/ilan-ver"
                  className="rounded-2xl bg-[#ff3b3b] px-8 py-4 text-lg font-bold text-white transition hover:bg-[#ff2a2a]"
                >
                  Yeni İlan Ver
                </Link>

                <Link
                  href="/ilanlarim"
                  className="rounded-2xl bg-slate-600/60 px-8 py-4 text-lg font-bold text-white transition hover:bg-slate-500/70"
                >
                  İlanlarımı Gör
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white/5 p-8 shadow-2xl ring-1 ring-white/10">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h3 className="text-3xl font-bold">Son İlanlarım</h3>
                <Link
                  href="/ilanlarim"
                  className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                >
                  Tümünü Gör
                </Link>
              </div>

              {user.listings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-[#0b2233] p-8 text-center text-slate-400">
                  Henüz ilanın yok.
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {user.listings.slice(0, 3).map((listing) => {
                    const firstImage = listing.images[0]?.url || null;

                    return (
                      <div
                        key={listing.id}
                        className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b2233]"
                      >
                        {firstImage ? (
                          <img
                            src={firstImage}
                            alt={listing.title}
                            className="h-44 w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-44 items-center justify-center bg-[#10283b] text-slate-400">
                            Görsel yok
                          </div>
                        )}

                        <div className="p-5">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                              {listing.categorySub || listing.category}
                            </span>
                            <span className="text-xs text-slate-400">
                              {listing.city || "Şehir yok"}
                            </span>
                          </div>

                          <h4 className="text-lg font-bold text-white">
                            {listing.title}
                          </h4>

                          <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                            {listing.description}
                          </p>

                          <div className="mt-4 text-xl font-extrabold text-white">
                            {listing.price !== null
                              ? `${listing.price.toLocaleString("tr-TR")} TL`
                              : "Fiyat belirtilmedi"}
                          </div>

                          <div className="mt-2 text-xs text-slate-500">
                            Durum: {listing.status === "PUBLISHED" ? "Yayında" : "Taslak"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}