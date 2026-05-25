import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

async function getUser(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const anyTok = token as any;

  const id =
    (token?.sub || anyTok?.id || anyTok?.userId || anyTok?.uid) as string | null;

  if (!id) return { id: null, me: null as any };

  const me = {
    id,
    name: (anyTok?.name || anyTok?.username || anyTok?.fullName || null) as string | null,
    email: (anyTok?.email || null) as string | null,
  };

  return { id, me };
}

export async function GET(req: NextRequest) {
  try {
    const { id: userId, me } = await getUser(req);
    if (!userId) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const listings = await prisma.listing.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        category: true,
        price: true,
        status: true,
        createdAt: true,
        images: {
          select: { url: true },
          take: 1,
        },
      },
    });

    const mapped = listings.map((l) => ({
      id: l.id,
      title: l.title,
      category: l.category,
      price: l.price,
      status: l.status,
      createdAt: l.createdAt,
      coverUrl: l.images?.[0]?.url ?? null,
    }));

    return NextResponse.json({ ok: true, me, listings: mapped });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
