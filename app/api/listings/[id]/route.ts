import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

type Ctx = { params: { id: string } | Promise<{ id: string }> };

async function getUserId(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const t: any = token;
  return (token?.sub || t?.id || t?.userId || t?.uid || t?.user?.id) as string | null;
}

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    const p = await ctx.params;
    const id = (p as any).id as string;
    if (!id) return NextResponse.json({ ok: false, error: "MISSING_ID" }, { status: 400 });

    const userId = await getUserId(req);

    const listing = await prisma.listing.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        status: true,
        title: true,
        description: true,
        price: true,

        category: true,
        categoryMain: true,
        categorySub: true,
        brand: true,
        modelName: true,

        city: true,
        district: true,
        
        vehicleYear: true,
        vehicleKm: true,
        vehicleFuel: true,
        vehicleGear: true,

        createdAt: true,

        images: { select: { url: true } },
      },
    });

    if (!listing) return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });

    const isOwner = !!userId && listing.userId === userId;

    if (listing.status === "DRAFT" && !isOwner) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      isOwner,
      listing: {
        id: listing.id,
        status: listing.status,
        title: listing.title,
        description: listing.description ?? "",
        price: listing.price,

        category: listing.category,
        categoryMain: listing.categoryMain,
        categorySub: listing.categorySub,
        brand: listing.brand,
        modelName: listing.modelName,

        city: listing.city,
        district: listing.district,
        
        vehicleYear: listing.vehicleYear,
        vehicleKm: listing.vehicleKm,
        vehicleFuel: listing.vehicleFuel,
        vehicleGear: listing.vehicleGear,

        createdAt: listing.createdAt,
        images: (listing.images ?? []).map((x) => x.url),
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });

    const p = await ctx.params;
    const id = (p as any).id as string;
    if (!id) return NextResponse.json({ ok: false, error: "MISSING_ID" }, { status: 400 });

    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!listing) return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    if (listing.userId !== userId) return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });

    await prisma.$transaction(async (tx) => {
      if ((tx as any).listingImage) {
        await (tx as any).listingImage.deleteMany({ where: { listingId: id } });
      }
      await tx.listing.delete({ where: { id } });
    });

    return NextResponse.json({ ok: true, deleted: true, listingId: id });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
