import Link from "next/link";
import ListingCard from "../../_components/ListingCard";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const similarListings = [
  {
    id: 2,
    title: "2021 Fiat Egea Cross Urban",
    price: "968.000 TL",
    location: "Ankara / Çankaya",
    meta: "52.000 km • Dizel • Manuel",
    featured: false,
  },
  {
    id: 3,
    title: "Satılık 2+1 Daire",
    price: "2.450.000 TL",
    location: "Bursa / Nilüfer",
    meta: "110 m² • 2+1 • 3. Kat",
    featured: true,
  },
  {
    id: 4,
    title: "Kiralık 3+1 Ofis",
    price: "38.000 TL",
    location: "İzmir / Bayraklı",
    meta: "140 m² • Plaza • Asansör",
    featured: false,
  },
];

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;

  const listing = {
    id,
    title: "2020 Renault Clio 1.0 TCe Icon",
    price: "875.000 TL",
    location: "İstanbul / Pendik",
    date: "Bugün",
    category: "Araç",
    meta: "78.000 km • Benzin • Otomatik",
    description:
      "Aracımız temiz ve bakımlıdır. Ağır hasar kaydı yoktur. İç kozmetik durumu iyi, motor yürüyen sorunsuzdur. Günlük kullanıma uygundur. İlan detayları örnek amaçlı hazırlanmıştır, devamında veritabanından gerçek kayıtlar bağlanacaktır.",
    specs: [
      { label: "Marka", value: "Renault" },
      { label: "Model", value: "Clio" },
      { label: "Yıl", value: "2020" },
      { label: "Yakıt", value: "Benzin" },
      { label: "Vites", value: "Otomatik" },
      { label: "Kilometre", value: "78.000 km" },
      { label: "Renk", value: "Beyaz" },
      { label: "Durum", value: "İkinci el" },
    ],
    seller: {
      name: "Aracsz Premium Satıcı",
      phone: "0 (555) 555 55 55",
      city: "İstanbul",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:pt-10">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-white/55">
        <Link href="/" className="hover:text-white">
          Anasayfa
        </Link>
        <span>/</span>
        <Link href="/ilanlar" className="hover:text-white">
          İlanlar
        </Link>
        <span>/</span>
        <span className="text-white/80">{listing.title}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
        <section>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
            <div className="relative h-[260px] bg-[linear-gradient(135deg,#173042_0%,#0f1f2c_55%,#09141d_100%)] md:h-[420px]">
              <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-[#00acc1]/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                Öne çıkan
              </div>

              <button
                type="button"
                className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm text-white/85 backdrop-blur hover:text-white"
              >
                ♥ Favori
              </button>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#08131c] to-transparent p-5 md:p-6">
                <h1 className="max-w-4xl text-2xl font-extrabold text-white md:text-4xl">
                  {listing.title}
                </h1>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/70">
                  <span>{listing.location}</span>
                  <span>•</span>
                  <span>{listing.date}</span>
                  <span>•</span>
                  <span>{listing.category}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 border-t border-white/10 p-4 sm:grid-cols-4">
              <div className="h-20 rounded-2xl bg-[linear-gradient(135deg,#173042_0%,#0f1f2c_55%,#09141d_100%)]" />
              <div className="h-20 rounded-2xl bg-[linear-gradient(135deg,#1a3548_0%,#122535_55%,#0b1620_100%)]" />
              <div className="h-20 rounded-2xl bg-[linear-gradient(135deg,#183244_0%,#10202f_55%,#09141d_100%)]" />
              <div className="h-20 rounded-2xl bg-[linear-gradient(135deg,#1c384d_0%,#102130_55%,#0b1620_100%)]" />
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">İlan açıklaması</h2>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">
                İlan no: #{listing.id}
              </span>
            </div>

            <p className="text-sm leading-7 text-white/70 md:text-base">
              {listing.description}
            </p>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white">Özellikler</h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {listing.specs.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="text-xs uppercase tracking-wide text-white/45">
                    {item.label}
                  </div>
                  <div className="mt-1 text-sm font-medium text-white/90">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
            <div className="text-3xl font-extrabold tracking-tight text-[#00c2da]">
              {listing.price}
            </div>
            <div className="mt-2 text-sm text-white/60">{listing.meta}</div>

            <div className="mt-5 grid gap-3">
              <button className="h-12 rounded-xl bg-[#e53935] px-4 text-sm font-semibold text-white hover:bg-[#d32f2f]">
                Satıcıya mesaj gönder
              </button>
              <button className="h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white hover:bg-white/10">
                Telefon numarasını göster
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white">Satıcı bilgisi</h3>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-base font-semibold text-white">
                {listing.seller.name}
              </div>
              <div className="mt-1 text-sm text-white/65">{listing.seller.city}</div>
              <div className="mt-3 text-sm text-white/85">{listing.seller.phone}</div>
            </div>

            <div className="mt-4 grid gap-3">
              <button className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white hover:bg-white/10">
                Satıcının diğer ilanları
              </button>
              <button className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white hover:bg-white/10">
                Satıcı profiline git
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white">Güvenli alışveriş</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/65">
              <li>• Ödeme yapmadan önce ilanı ve satıcıyı doğrulayın.</li>
              <li>• Şüpheli fiyatlara ve acele ettiren mesajlara dikkat edin.</li>
              <li>• Mümkünse yüz yüze kontrol sağlayın.</li>
            </ul>
          </div>
        </aside>
      </div>

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Benzer ilanlar</h2>
            <p className="mt-1 text-sm text-white/65">
              Bu ilana yakın diğer seçenekler
            </p>
          </div>

          <Link
            href="/ilanlar"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Tüm ilanlara dön
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {similarListings.map((item) => (
            <ListingCard
              key={item.id}
              id={item.id}
              title={item.title}
              price={item.price}
              location={item.location}
              meta={item.meta}
              featured={item.featured}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
