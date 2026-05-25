import Link from "next/link";

const cats = [
  {
    title: "Araç",
    desc: "Otomobil, ticari, motosiklet…",
    href: "/ilanlar?categoryMain=arac",
    badge: "Vasıta",
    icon: "🚗",
  },
  {
    title: "Tarım & Hayvancılık",
    desc: "Traktör, ekipman, yem, canlı hayvan",
    href: "/ilanlar?categoryMain=tarim",
    badge: "Tarım",
    icon: "🚜",
  },
  {
    title: "Emlak",
    desc: "Konut, işyeri, arsa, tarla",
    href: "/ilanlar?categoryMain=emlak",
    badge: "Emlak",
    icon: "🏠",
  },
  {
    title: "Elektronik & Diğer",
    desc: "Telefon, bilgisayar, iş makineleri",
    href: "/ilanlar?categoryMain=elektronik",
    badge: "Elektronik",
    icon: "💻",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Navbar sticky olduğu için nefes */}
      <div className="pt-16 md:pt-20 pb-16">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
          {/* arka glow */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#00acc1]/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-[#e53935]/20 blur-3xl" />

          <div className="relative p-7 md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/80">
              <span className="h-2 w-2 rounded-full bg-[#00acc1]" />
              Tek platform • Kurumsal & bireysel • Ücretsiz ilan
            </div>

            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">
              Türkiye&apos;nin <span className="text-[#00acc1]">esnek</span> ilan pazarı
            </h1>

            <p className="mt-4 max-w-2xl text-white/80">
              Araç, emlak, tarım ürünleri, elektronik ve daha fazlası…
              <br />
              <span className="font-semibold text-white">aracsz.com</span> ile ilan değil, çözüm bul.
            </p>

            {/* CTA + Search */}
            <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-[auto,auto,1fr] md:items-center">
              <Link
                href="/ilan-ver"
                className="inline-flex items-center justify-center rounded-xl bg-[#e53935] px-6 py-3 text-sm font-semibold shadow-md hover:bg-[#d32f2f]"
              >
                Ücretsiz ilan ver
              </Link>

              <Link
                href="/ilanlar"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold hover:bg-white/10"
              >
                İlanları incele
              </Link>

              <form
                action="/ilanlar"
                method="GET"
                className="flex items-stretch overflow-hidden rounded-xl border border-white/15 bg-black/20"
              >
                <input
                  name="q"
                  placeholder="Ne arıyorsun? (örn: Corolla, 2+1, traktör...)"
                  className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 px-5 text-sm font-semibold text-white/90 hover:text-white border-l border-white/10"
                >
                  Ara
                </button>
              </form>
            </div>

            <div className="mt-5 flex flex-wrap gap-4 text-xs text-white/70">
              <span>✓ Ücretsiz ilan</span>
              <span>✓ Hızlı yayın</span>
              <span>✓ Sade kullanım</span>
              <span>✓ Güvenli altyapı</span>
            </div>
          </div>
        </section>

        {/* KATEGORİLER */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white/95">Öne çıkan kategoriler</h2>
              <p className="mt-1 text-sm text-white/70">
                İlanlarını doğru kategoride yayınla, aradığını hızlı bul.
              </p>
            </div>

            <Link
              href="/ilanlar"
              className="hidden sm:inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
            >
              Tüm ilanlar →
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cats.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/10 blur-2xl opacity-0 group-hover:opacity-100 transition" />

                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/25 text-lg">
                    {c.icon}
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] text-white/75">
                    {c.badge}
                  </span>
                </div>

                <div className="mt-3 font-semibold text-white/95">{c.title}</div>
                <div className="mt-1 text-sm text-white/70">{c.desc}</div>

                <div className="mt-3 text-sm font-semibold text-white/80 group-hover:text-white">
                  İncele →
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-5 sm:hidden">
            <Link
              href="/ilanlar"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
            >
              Tüm ilanlar →
            </Link>
          </div>
        </section>

        {/* ALT BANT */}
        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <div className="text-sm font-semibold text-white/90">Hızlı yayın</div>
              <div className="mt-1 text-sm text-white/70">
                Dakikalar içinde ilanını oluştur, yayınla.
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-white/90">Esnek kategori</div>
              <div className="mt-1 text-sm text-white/70">
                Araçtan tarıma, emlaktan elektroniğe tüm ihtiyaçlar tek yerde.
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-white/90">Sade kullanım</div>
              <div className="mt-1 text-sm text-white/70">
                Karmaşa yok. Basit formlar, temiz ekranlar.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
