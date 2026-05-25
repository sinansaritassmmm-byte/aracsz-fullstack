import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json(
        {
          ok: false,
          message: "Giriş yapmalısınız",
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          message: "Kullanıcı bulunamadı",
        },
        { status: 404 }
      );
    }

    const listing = await prisma.listing.create({
      data: {
        title: body.title,
        description: body.description,
        price: body.price || null,
        category: body.category,
        categoryMain: body.categoryMain,
        categorySub: body.categorySub,
        brand: body.brand || null,
        modelName: body.modelName || null,
        city: body.city || null,
        district: body.district || null,
        status: "PUBLISHED",

        user: {
          connect: {
            id: user.id,
          },
        },

        images: {
          create:
            body.imageUrls?.map((url: string) => ({
              url,
            })) || [],
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
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        message: "İlan kaydedilirken hata oluştu",
      },
      { status: 500 }
    );
  }
}