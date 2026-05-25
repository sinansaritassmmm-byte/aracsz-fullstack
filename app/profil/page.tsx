import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ProfilPage() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value;

  if (!userEmail) {
    redirect("/giris-yap");
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: {
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      _count: {
        select: {
          listings: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/giris-yap");
  }

  return (
    <main className="min-h-screen bg-[#06131d] px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-extrabold">Profilim</h1>
        <p className="mt-2 text-slate-400">
          Hesap bilgilerin ve ilan özetin.
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <div className="text-sm text-slate-400">Ad Soyad</div>
              <div className="mt-1 text-lg font-semibold">
                {user.name || "Belirtilmedi"}
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-400">E-posta</div>
              <div className="mt-1 text-lg font-semibold">{user.email}</div>
            </div>

            <div>
              <div className="text-sm text-slate-400">Telefon</div>
              <div className="mt-1 text-lg font-semibold">
                {user.phone || "Belirtilmedi"}
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-400">İlan Sayısı</div>
              <div className="mt-1 text-lg font-semibold">
                {user._count.listings}
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-400">Kayıt Tarihi</div>
              <div className="mt-1 text-lg font-semibold">
                {user.createdAt.toLocaleDateString("tr-TR")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}