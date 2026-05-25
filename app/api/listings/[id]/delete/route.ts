import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const token = await getToken({ req });
    if (!token?.sub) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const { id } = await params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!listing) return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    if (listing.userId !== token.sub) return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });

    await prisma.listingImage.deleteMany({ where: { listingId: id } });
    await prisma.listing.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("DELETE /api/listings/[id]/delete error:", e);
    return NextResponse.json({ ok: false, error: "DELETE_FAILED" }, { status: 500 });
  }
}
