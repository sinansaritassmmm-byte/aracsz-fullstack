import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

function cleanString(value: unknown) {
  const s = String(value || "").trim();
  return s || null;
}

function cleanNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const cleaned = String(value).replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json(
        { ok: false, message: "Giriş yapmadan ilan veremezsin." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Kullanıcı bulunamadı." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const title = cleanString(body.title);
    const description = cleanString(body.description) || "";
    const category = cleanString(body.category);
    const price = cleanNumber(body.price);

    const imageUrls = Array.isArray(body.imageUrls)
      ? body.imageUrls.map((x: unknown) => cleanString(x)).filter(Boolean)
      : [];

    if (!title) {
      return NextResponse.json({ ok: false, message: "İlan başlığı zorunludur." }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ ok: false, message: "Kategori zorunludur." }, { status: 400 });
    }

    if (!price || price <= 0) {
      return NextResponse.json({ ok: false, message: "Geçerli fiyat girilmelidir." }, { status: 400 });
    }

    if (imageUrls.length === 0) {
      return NextResponse.json({ ok: false, message: "En az 1 fotoğraf eklenmelidir." }, { status: 400 });
    }

    const listing = await prisma.listing.create({
      data: {
        userId: user.id,
        title,
        description,
        price,
        category,
        status: "PUBLISHED",

        categoryMain: cleanString(body.categoryMain),
        categorySub: cleanString(body.categorySub),
        brand: cleanString(body.brand),
        modelName: cleanString(body.modelName),
        city: cleanString(body.city),
        district: cleanString(body.district),

        vehicleYear: cleanNumber(body.vehicleYear),
        vehicleKm: cleanNumber(body.vehicleKm),
        vehicleFuel: cleanString(body.vehicleFuel),
        vehicleGear: cleanString(body.vehicleGear),

        images: {
          create: imageUrls.map((url: string) => ({ url })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({
      ok: true,
      listing,
    });
  } catch (error) {
    console.error("LISTING_CREATE_ERROR", error);

    return NextResponse.json(
      {
        ok: false,
        message: "İlan kaydedilirken bir hata oluştu.",
        detail: String(error),
      },
      { status: 500 }
    );
  }
}