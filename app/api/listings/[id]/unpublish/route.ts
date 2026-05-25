import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const token = await getToken({ req });
    if (!token?.sub) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const { id } = await params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { id: true, userId: true, status: true },
    });

    if (!listing) return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    if (listing.userId !== token.sub) return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });

    const updated = await prisma.listing.update({
      where: { id },
      data: { status: "DRAFT" },
      select: { id: true, status: true },
    });

    return NextResponse.json({ ok: true, listing: updated });
  } catch (e: any) {
    console.error("PATCH /api/listings/[id]/unpublish error:", e);
    return NextResponse.json({ ok: false, error: "UNPUBLISH_FAILED" }, { status: 500 });
  }
}
