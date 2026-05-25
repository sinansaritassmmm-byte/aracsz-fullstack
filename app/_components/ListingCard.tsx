import Link from "next/link";

type ListingCardProps = {
  id?: string | number;
  title: string;
  price: string;
  location: string;
  meta?: string;
  image?: string;
  href?: string;
  featured?: boolean;
};

export default function ListingCard({
  id,
  title,
  price,
  location,
  meta,
  image,
  href,
  featured = false,
}: ListingCardProps) {
  const target = href || (id ? `/ilanlar/${id}` : "/ilanlar");

  return (
    <Link
      href={target}
      className="group block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-cyan-950/20"
    >
      <div className="relative">
        <div
          className="h-52 w-full bg-cover bg-center"
          style={{
            backgroundImage: image
              ? `url("${image}")`
              : "linear-gradient(135deg, #173042 0%, #0f1f2c 55%, #09141d 100%)",
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08131c]/90 via-[#08131c]/15 to-transparent" />

        {featured ? (
          <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-[#00acc1]/20 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
            Öne çıkan
          </div>
        ) : null}

        <button
          type="button"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/80 backdrop-blur transition hover:scale-105 hover:text-white"
          aria-label="Favorilere ekle"
        >
          ♥
        </button>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="line-clamp-2 text-lg font-semibold leading-6 text-white drop-shadow">
            {title}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="text-2xl font-extrabold tracking-tight text-[#00c2da]">
          {price}
        </div>

        <div className="mt-2 text-sm font-medium text-white/85">{location}</div>

        {meta ? (
          <div className="mt-1 text-sm leading-6 text-white/55">{meta}</div>
        ) : null}

        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">
            Hemen incele
          </span>

          <span className="text-sm font-medium text-white/70 transition group-hover:text-white">
            Detay →
          </span>
        </div>
      </div>
    </Link>
  );
}