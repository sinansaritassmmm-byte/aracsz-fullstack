import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton";

function getUserDisplayName(email: string | null) {
  if (!email) return null;

  const namePart = email.split("@")[0]?.trim();
  if (!namePart) return email;

  if (namePart.length <= 18) return namePart;
  return `${namePart.slice(0, 18)}...`;
}

export default async function Navbar() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value || null;
  const userDisplayName = getUserDisplayName(userEmail);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#04111d]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff8ea1] via-white to-[#67e8f9] text-lg font-extrabold text-[#04111d] shadow-lg">
              aZ
            </div>

            <div className="leading-tight">
              <div className="text-[16px] font-extrabold text-white">
                aracsz<span className="text-cyan-400">.com</span>
              </div>
              <div className="text-xs text-slate-400">
                Araçtan emlağa, her şey tek yerde
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/ilanlar"
              className="text-sm font-semibold text-white transition hover:text-cyan-300"
            >
              Tüm İlanlar
            </Link>

            <Link
              href="/kategori/arac"
              className="text-sm font-semibold text-white transition hover:text-cyan-300"
            >
              Araç
            </Link>

            <Link
              href="/kategori/emlak"
              className="text-sm font-semibold text-white transition hover:text-cyan-300"
            >
              Emlak
            </Link>

            <Link
              href="/kategori/tarim"
              className="text-sm font-semibold text-white transition hover:text-cyan-300"
            >
              Tarım
            </Link>

            <Link
              href="/kategori/elektronik"
              className="text-sm font-semibold text-white transition hover:text-cyan-300"
            >
              Elektronik
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {userEmail ? (
            <>
              <div className="hidden items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 md:flex">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <div className="leading-tight">
                  <div className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                    Giriş yapıldı
                  </div>
                  <div
                    className="max-w-[180px] truncate text-sm font-medium text-white"
                    title={userEmail}
                  >
                    {userDisplayName}
                  </div>
                </div>
              </div>

              <Link
                href="/hesabim"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                title={userEmail}
              >
                Hesabım
              </Link>

              <Link
                href="/ilanlarim"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                İlanlarım
              </Link>

              <LogoutButton />

              <Link
                href="/ilan-ver"
                className="rounded-2xl bg-[#ff3b3b] px-6 py-3 text-sm font-bold text-white transition hover:scale-[1.02] hover:bg-[#ff2a2a]"
              >
                İlan Ver
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/giris-yap"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Giriş yap
              </Link>

              <Link
                href="/uye-ol"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Üye ol
              </Link>

              <Link
                href="/ilan-ver"
                className="rounded-2xl bg-[#ff3b3b] px-6 py-3 text-sm font-bold text-white transition hover:scale-[1.02] hover:bg-[#ff2a2a]"
              >
                İlan Ver
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}