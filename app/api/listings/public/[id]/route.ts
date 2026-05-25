import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;

    const listing = await prisma.listing.findFirst({
      where: { id, status: "PUBLISHED" },
      include: {
        images: { select: { id: true, url: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!listing) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      listing: {
        id: listing.id,
        title: listing.title,
        description: listing.description ?? "",
        price: listing.price ?? null,

        categoryMain: listing.categoryMain ?? null,
        categorySub: listing.categorySub ?? null,
        brand: listing.brand ?? null,
        modelName: listing.modelName ?? null,
        city: listing.city ?? null,
        district: listing.district ?? null,

        vehicleYear: listing.vehicleYear ?? null,
        vehicleKm: listing.vehicleKm ?? null,
        vehicleFuel: listing.vehicleFuel ?? null,
        vehicleGear: listing.vehicleGear ?? null,

        images: listing.images ?? [],
        owner: {
          id: listing.user.id,
          name: listing.user.name ?? null,
          email: listing.user.email ?? null,
        },
        createdAt: listing.createdAt,
      },
    });
  } catch (e: any) {
    console.error("GET /api/listings/public/[id] error:", e);
    return NextResponse.json(
      { ok: false, error: "LISTING_PUBLIC_DETAIL_FAILED" },
      { status: 500 }
    );
  }
}
