import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function toInt(v: string | null) {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : undefined;
}

function toStr(v: string | null) {
  if (v == null) return undefined;
  const s = v.trim();
  return s ? s : undefined;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sp = url.searchParams;

    const q = toStr(sp.get("q"));
    const categoryMain = toStr(sp.get("categoryMain"));
    const categorySub = toStr(sp.get("categorySub"));
    const brand = toStr(sp.get("brand"));
    const modelName = toStr(sp.get("modelName"));
    const city = toStr(sp.get("city"));
    const district = toStr(sp.get("district"));

    // ✅ Vasıta filtreleri
    const vehicleYearMin = toInt(sp.get("vehicleYearMin"));
    const vehicleYearMax = toInt(sp.get("vehicleYearMax"));
    const vehicleKmMin = toInt(sp.get("vehicleKmMin"));
    const vehicleKmMax = toInt(sp.get("vehicleKmMax"));
    const vehicleFuel = toStr(sp.get("vehicleFuel"));
    const vehicleGear = toStr(sp.get("vehicleGear"));

    const where: any = {
      status: "PUBLISHED",
    };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (categoryMain) where.categoryMain = categoryMain;
    if (categorySub) where.categorySub = categorySub;
    if (brand) where.brand = brand;
    if (modelName) where.modelName = modelName;
    if (city) where.city = city;
    if (district) where.district = district;

    if (vehicleYearMin != null || vehicleYearMax != null) {
      where.vehicleYear = {};
      if (vehicleYearMin != null) where.vehicleYear.gte = vehicleYearMin;
      if (vehicleYearMax != null) where.vehicleYear.lte = vehicleYearMax;
    }

    if (vehicleKmMin != null || vehicleKmMax != null) {
      where.vehicleKm = {};
      if (vehicleKmMin != null) where.vehicleKm.gte = vehicleKmMin;
      if (vehicleKmMax != null) where.vehicleKm.lte = vehicleKmMax;
    }

    if (vehicleFuel) where.vehicleFuel = vehicleFuel;
    if (vehicleGear) where.vehicleGear = vehicleGear;

    const items = await prisma.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 60,
      include: {
        images: {
          select: { id: true, url: true },
        },
      },
    });

    const mapped = items.map((x: any) => {
      const cover = x.images?.[0] ?? null; // cover = ilk resim (şimdilik)
      return {
        id: x.id,
        title: x.title,
        description: x.description ?? "",
        price: x.price ?? null,

        categoryMain: x.categoryMain ?? null,
        categorySub: x.categorySub ?? null,
        brand: x.brand ?? null,
        modelName: x.modelName ?? null,
        city: x.city ?? null,
        district: x.district ?? null,

        vehicleYear: x.vehicleYear ?? null,
        vehicleKm: x.vehicleKm ?? null,
        vehicleFuel: x.vehicleFuel ?? null,
        vehicleGear: x.vehicleGear ?? null,

        coverUrl: cover?.url ?? null,
        createdAt: x.createdAt,
      };
    });

    return NextResponse.json({ ok: true, items: mapped });
  } catch (e: any) {
    console.error("GET /api/listings/public error:", e);
    return NextResponse.json(
      { ok: false, error: "LISTINGS_PUBLIC_LIST_FAILED" },
      { status: 500 }
    );
  }
}
