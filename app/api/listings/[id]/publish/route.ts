import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

type Ctx = { params: { id: string } | Promise<{ id: string }> };

async function getUserId(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const t: any = token;

  // mümkün olan her şemayı deniyoruz (senin projede hangisi varsa)
  return (
    token?.sub ||
    t?.id ||
    t?.userId ||
    t?.uid ||
    t?.user?.id ||
    t?.user?.userId
  ) as string | null;
}

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const p = await ctx.params;
    const id = (p as any).id as string;
    if (!id) {
      return NextResponse.json({ ok: false, error: "MISSING_ID" }, { status: 400 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { id: true, userId: true, status: true },
    });

    if (!listing) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }

    if (listing.userId !== userId) {
      return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
    }

    if (listing.status === "PUBLISHED") {
      return NextResponse.json({ ok: true, published: true, listingId: id, already: true });
    }

    await prisma.listing.update({
      where: { id },
      data: { status: "PUBLISHED" },
    });

    return NextResponse.json({ ok: true, published: true, listingId: id });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
