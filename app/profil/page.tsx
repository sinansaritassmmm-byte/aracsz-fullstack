import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-degistir";

export default async function ProfilPage() {
  // Next 16: cookies() -> Promise, o yüzden await!
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/giris");
  }

  let userId: number | null = null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: number };
    userId = decoded.userId ?? null;
  } catch {
    redirect("/giris");
  }

  if (!userId) {
    redirect("/giris");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      type: true, // 🔹 burada userType değil, type
    },
  });

  if (!user) {
    redirect("/giris");
  }

  const typeLabel = user.type === "kurumsal" ? "Kurumsal" : "Bireysel";

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-xl">
        <h1 className="text-xl font-bold text-slate-50 mb-4">
          Profil <span className="text-[#00acc1]">bilgileriniz</span>
        </h1>

        <dl className="space-y-3 text-sm text-slate-200">
          <div>
            <dt className="text-xs text-slate-400">Ad Soyad</dt>
            <dd className="font-semibold">{user.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">E-posta</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">Tip</dt>
            <dd>{typeLabel}</dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
