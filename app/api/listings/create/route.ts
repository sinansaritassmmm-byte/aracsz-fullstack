import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

function getStr(fd: FormData, ...keys: string[]) {
  for (const k of keys) {
    const v = fd.get(k);
    if (v != null) {
      const s = String(v).trim();
      if (s) return s;
    }
  }
  return null;
}

function getInt(fd: FormData, ...keys: string[]) {
  const s = getStr(fd, ...keys);
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return Math.trunc(n);
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    const userId = token?.sub;
    if (!userId) return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });

    const fd = await req.formData();

    const title = getStr(fd, "title");
    const description = getStr(fd, "description") ?? "";
    const category = getStr(fd, "category"); // zorunlu

    if (!title) return NextResponse.json({ ok: false, error: "TITLE_REQUIRED" }, { status: 400 });
    if (!category) return NextResponse.json({ ok: false, error: "CATEGORY_REQUIRED" }, { status: 400 });

    const price = getInt(fd, "price");

    const categoryMain = getStr(fd, "categoryMain", "category_main");
    const categorySub = getStr(fd, "categorySub", "category_sub");
    const brand = getStr(fd, "brand", "make");
    const modelName = getStr(fd, "modelName", "model");
    const city = getStr(fd, "city");
    const district = getStr(fd, "district");

    const vehicleYear = getInt(fd, "vehicleYear", "vehicle_year");
    const vehicleKm = getInt(fd, "vehicleKm", "vehicle_km");
    const vehicleFuel = getStr(fd, "vehicleFuel", "vehicle_fuel");
    const vehicleGear = getStr(fd, "vehicleGear", "vehicle_gear");

    const data: any = {
      userId,
      title,
      description: description || "",
      category,
      price,

      categoryMain,
      categorySub,
      brand,
      modelName,
      city,
      district,

      vehicleYear,
      vehicleKm,
      vehicleFuel,
      vehicleGear,

      // ✅ status SET ETMİYORUZ: schema default(DRAFT) çalışsın
    };

    // Dosyalar (Cloudinary akışın varsa burada URL üretip ListingImage createMany yaparsın)
    const files = fd.getAll("images").filter((x) => x instanceof File) as File[];
    const listing = await prisma.listing.create({ data });

    // TODO: upload -> url (sende başka yerde olabilir)
    if (files.length) {
      // const urls = await uploadFiles(files);
      // await prisma.listingImage.createMany({ data: urls.map((url) => ({ listingId: listing.id, url })) });
    }

    const full = await prisma.listing.findUnique({
      where: { id: listing.id },
      include: { images: true, user: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json({ ok: true, listing: full });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "CREATE_FAILED", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
